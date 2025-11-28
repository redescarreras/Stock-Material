/**
 * Firebase Storage Manager - Maneja toda la persistencia de datos en Firebase Realtime Database
 */

class FirebaseStorageManager {
    constructor(database) {
        this.database = database;
        this.isOnline = navigator.onLine;
        this.dataCache = new Map();
        this.listeners = new Map();
        
        // Configurar eventos online/offline
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Inicializar datos
        this.initializeData();
        this.setupRealtimeListeners();
    }

    /**
     * Configura listeners en tiempo real para sincronización
     */
    setupRealtimeListeners() {
        // Listener para materiales
        this.database.ref('materials').on('value', (snapshot) => {
            this.dataCache.set('materials', snapshot.val() || []);
            this.notifyListeners('materials', this.dataCache.get('materials'));
        });

        // Listener para movimientos
        this.database.ref('movements').on('value', (snapshot) => {
            this.dataCache.set('movements', snapshot.val() || []);
            this.notifyListeners('movements', this.dataCache.get('movements'));
        });

        // Listener para trabajadores
        this.database.ref('workers').on('value', (snapshot) => {
            this.dataCache.set('workers', snapshot.val() || []);
            this.notifyListeners('workers', this.dataCache.get('workers'));
        });

        // Listener para configuración
        this.database.ref('settings').on('value', (snapshot) => {
            this.dataCache.set('settings', snapshot.val() || this.getDefaultSettings());
            this.notifyListeners('settings', this.dataCache.get('settings'));
        });
    }

    /**
     * Registra un listener para cambios en tiempo real
     */
    addListener(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);
        
        // Devolver función para remover listener
        return () => {
            const listeners = this.listeners.get(key);
            if (listeners) {
                listeners.delete(callback);
            }
        };
    }

    /**
     * Notifica a todos los listeners registrados
     */
    notifyListeners(key, data) {
        const listeners = this.listeners.get(key);
        if (listeners) {
            listeners.forEach(callback => callback(data));
        }
    }

    /**
     * Inicializa los datos por defecto si no existen
     */
    async initializeData() {
        try {
            const snapshot = await this.database.ref('materials').once('value');
            
            // Si no existen datos, inicializar con datos por defecto
            if (!snapshot.exists()) {
                await this.database.ref('materials').set(this.getDefaultMaterials());
                await this.database.ref('movements').set([]);
                await this.database.ref('workers').set(this.getDefaultWorkers());
                await this.database.ref('settings').set(this.getDefaultSettings());
                
                console.log('Datos inicializados en Firebase');
            }
            
            // Cargar datos en cache
            await this.loadAllData();
            
        } catch (error) {
            console.error('Error inicializando datos:', error);
            // Si falla, usar localStorage como fallback
            this.initializeLocalData();
        }
    }

    /**
     * Carga todos los datos desde Firebase
     */
    async loadAllData() {
        try {
            const [materials, movements, workers, settings] = await Promise.all([
                this.database.ref('materials').once('value'),
                this.database.ref('movements').once('value'),
                this.database.ref('workers').once('value'),
                this.database.ref('settings').once('value')
            ]);

            this.dataCache.set('materials', materials.val() || []);
            this.dataCache.set('movements', movements.val() || []);
            this.dataCache.set('workers', workers.val() || []);
            this.dataCache.set('settings', settings.val() || this.getDefaultSettings());

        } catch (error) {
            console.error('Error cargando datos:', error);
            this.initializeLocalData();
        }
    }

    /**
     * Inicializa datos localmente como fallback
     */
    initializeLocalData() {
        this.dataCache.set('materials', this.getDefaultMaterials());
        this.dataCache.set('movements', []);
        this.dataCache.set('workers', this.getDefaultWorkers());
        this.dataCache.set('settings', this.getDefaultSettings());
        console.log('Usando datos locales como fallback');
    }

    /**
     * Sincroniza datos offline cuando vuelve la conexión
     */
    async syncOfflineData() {
        console.log('Reconectando a Firebase...');
        await this.loadAllData();
        this.notifyAllListeners();
    }

    /**
     * Notifica a todos los listeners
     */
    notifyAllListeners() {
        ['materials', 'movements', 'workers', 'settings'].forEach(key => {
            this.notifyListeners(key, this.dataCache.get(key) || []);
        });
    }

    /**
     * Guarda un item en Firebase (con fallback offline)
     */
    async setItem(key, value) {
        try {
            if (this.isOnline) {
                await this.database.ref(key).set(value);
                this.dataCache.set(key, value);
                this.notifyListeners(key, value);
                return true;
            } else {
                // Guardar en localStorage como backup
                localStorage.setItem(`offline_${key}`, JSON.stringify(value));
                this.dataCache.set(key, value);
                this.notifyListeners(key, value);
                return true;
            }
        } catch (error) {
            console.error(`Error guardando ${key}:`, error);
            // Fallback a localStorage
            localStorage.setItem(`offline_${key}`, JSON.stringify(value));
            this.dataCache.set(key, value);
            this.notifyListeners(key, value);
            return false;
        }
    }

    /**
     * Obtiene un item (con fallback offline)
     */
    async getItem(key) {
        try {
            if (this.dataCache.has(key)) {
                return this.dataCache.get(key);
            }

            if (this.isOnline) {
                const snapshot = await this.database.ref(key).once('value');
                const value = snapshot.val() || [];
                this.dataCache.set(key, value);
                return value;
            } else {
                // Intentar localStorage primero
                const offlineData = localStorage.getItem(`offline_${key}`);
                if (offlineData) {
                    const value = JSON.parse(offlineData);
                    this.dataCache.set(key, value);
                    return value;
                }
                return [];
            }
        } catch (error) {
            console.error(`Error obteniendo ${key}:`, error);
            return this.dataCache.get(key) || [];
        }
    }

    /**
     * Vacía todo el stock de materiales
     */
    async emptyStock() {
        if (!this.isAdmin) {
            throw new Error('Solo administradores pueden vaciar el stock');
        }

        const materials = await this.getItem('materials');
        const emptyMaterials = materials.map(material => ({
            ...material,
            stock: 0
        }));

        await this.setItem('materials', emptyMaterials);
        
        // Registrar movimiento de ajuste masivo
        const emptyMovement = {
            id: Date.now(),
            date: new Date().toISOString(),
            materialCode: 'SISTEMA',
            materialName: 'Vaciado Masivo de Stock',
            type: 'ajuste',
            quantity: 0,
            userId: this.currentUser?.id || 'SISTEMA',
            userName: this.currentUser?.name || 'Sistema',
            observations: 'Vaciado masivo de stock realizado por administrador'
        };

        const movements = await this.getItem('movements');
        movements.push(emptyMovement);
        await this.setItem('movements', movements);

        return true;
    }

    /**
     * Crea backup de todos los datos
     */
    async createBackup() {
        const data = {
            workers: await this.getItem('workers'),
            materials: await this.getItem('materials'),
            movements: await this.getItem('movements'),
            settings: await this.getItem('settings'),
            backupDate: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(data, null, 2);
    }

    /**
     * Restaura datos desde backup
     */
    async restoreBackup(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validar estructura del backup
            if (!data.materials || !data.workers || !data.settings) {
                throw new Error('Formato de backup inválido');
            }

            // Restaurar todos los datos
            await this.setItem('workers', data.workers);
            await this.setItem('materials', data.materials);
            await this.setItem('movements', data.movements || []);
            await this.setItem('settings', data.settings);

            return true;
        } catch (error) {
            console.error('Error restaurando backup:', error);
            throw new Error('Error al restaurar el backup: ' + error.message);
        }
    }

    /**
     * Limpia todos los datos y restaura valores por defecto
     */
    async clearAll() {
        if (!this.isAdmin) {
            throw new Error('Solo administradores pueden limpiar los datos');
        }

        await this.setItem('materials', this.getDefaultMaterials());
        await this.setItem('movements', []);
        await this.setItem('workers', this.getDefaultWorkers());
        await this.setItem('settings', this.getDefaultSettings());

        return true;
    }

    /**
     * Materiales por defecto
     */
    getDefaultMaterials() {
        return [
            // Cables de Fibra Óptica
            { code: '101001J', name: 'Cable de f.o. de exterior PKP holgado de 8 fo.', description: 'Cable de f.o. de exterior PKP holgado de 8 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101003J', name: 'Cable de f.o. de exterior PKP holgado de 16 fo.', description: 'Cable de f.o. de exterior PKP holgado de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101004J', name: 'Cable de f.o. de exterior PKP holgado de 24 fo.', description: 'Cable de f.o. de exterior PKP holgado de 24 fo.', category: 'cables', stock: 800, minStock: 50, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101005J', name: 'Cable de f.o. de exterior PKP holgado de 32 fo.', description: 'Cable de f.o. de exterior PKP holgado de 32 fo.', category: 'cables', stock: 600, minStock: 50, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101006J', name: 'Cable de f.o. de exterior PKP holgado de 48 fo.', description: 'Cable de f.o. de exterior PKP holgado de 48 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101007J', name: 'Cable de f.o. de exterior PKP holgado de 64 fo.', description: 'Cable de f.o. de exterior PKP holgado de 64 fo.', category: 'cables', stock: 300, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101008J', name: 'Cable de f.o. de exterior PKP holgado de 128 fo.', description: 'Cable de f.o. de exterior PKP holgado de 128 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101009J', name: 'Cable de f.o. de exterior PKP holgado de 256 fo.', description: 'Cable de f.o. de exterior PKP holgado de 256 fo.', category: 'cables', stock: 200, minStock: 20, unit: 'metros', notes: 'Material de fibraótica' },
            { code: '101010J', name: 'Cable de f.o. de interior KT de 8 fo.', description: 'Cable de f.o. de interior KT de 8 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101016J', name: 'Cable de f.o. de interior TKT de 16 fo.', description: 'Cable de f.o. de interior TKT de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101017J', name: 'Cable de f.o. de interior TKT de 24 fo.', description: 'Cable de f.o. de interior TKT de 24 fo.', category: 'cables', stock: 800, minStock: 50, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101018J', name: 'Cable de f.o. de interior TKT de 32 fo.', description: 'Cable de f.o. de interior TKT de 32 fo.', category: 'cables', stock: 600, minStock: 50, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101019J', name: 'Cable de f.o. de interior TKT de 48 fo.', description: 'Cable de f.o. de interior TKT de 48 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101020J', name: 'Cable de f.o. de interior TKT de 64 fo.', description: 'Cable de f.o. de interior TKT de 64 fo.', category: 'cables', stock: 300, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101021J', name: 'Cable de f.o. de interior TKT de 128 fo.', description: 'Cable de f.o. de interior TKT de 128 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101022J', name: 'Cable de f.o. de interior TKT de 256 fo.', description: 'Cable de f.o. de interior TKT de 256 fo.', category: 'cables', stock: 200, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101023J', name: 'Cable de f.o. de interior KT de 512 fo.', description: 'Cable de f.o. de interior KT de 512 fo.', category: 'cables', stock: 200, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101074J', name: 'Cable de f.o. 16 VT.', description: 'Cable de f.o. 16 VT.', category: 'cables', stock: 200, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101075J', name: 'Cable de f.o. 32 VT.', description: 'Cable de f.o. 32 VT.', category: 'cables', stock: 200, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '101076J', name: 'Cable de f.o. 64 VT.', description: 'Cable de f.o. 64 VT.', category: 'cables', stock: 200, minStock: 20, unit: 'metros', notes: 'Material de fibra óptica' },
            
            // Repartidores Ópticos
            { code: '102001JT', name: 'Caja de empalme TE FIST-GCO2-BC8', description: 'Caja de empalme TE FIST-GCO2-BC8', category: 'repartidores', stock: 25, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102002JT', name: 'Caja de empalme TE FIST-GCO2-BC8 128 fusiones', description: 'Caja de empalme TE FIST-GCO2-BC8 128 fusiones', category: 'repartidores', stock: 20, minStock: 3, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102003JM', name: 'Caja de empalme RA BPEO-2/128 3M', description: 'Caja de empalme RA BPEO-2/128 3M', category: 'repartidores', stock: 20, minStock: 3, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102004JT', name: 'Caja de empalme TE FIST-GCO2-BC8 256 fusiones', description: 'Caja de empalme TE FIST-GCO2-BC8 256 fusiones', category: 'repartidores', stock: 15, minStock: 2, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102005JM', name: 'Caja de empalme RA BPEO-2/256 3M', description: 'Caja de empalme RA BPEO-2/256 3M', category: 'repartidores', stock: 15, minStock: 2, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102011JT', name: 'Kit de sellado termorretráctil puerto circular', description: 'Kit de sellado termorretráctil para puerto circular', category: 'repartidores', stock: 35, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102011JM', name: 'Kit de Sellado Circular 3M hasta 18 mm', description: 'Kit de Sellado Circular 3M hasta 18 mm', category: 'repartidores', stock: 30, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102012JT', name: 'Kit de sellado puerto oval FIST', description: 'Kit de sellado termorretráctil para puerto oval', category: 'repartidores', stock: 35, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '102012JM', name: 'Kit de sellado puerto oval 3M 27 mm', description: 'Kit de sellado puerto oval 3M 27 mm', category: 'repartidores', stock: 35, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            
            // Conectores y Accesorios
            { code: '201001J', name: 'Conector SC/APC', description: 'Conector SC/APC para fibra óptica', category: 'conectores', stock: 500, minStock: 50, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '201002J', name: 'Conector LC/APC', description: 'Conector LC/APC para fibra óptica', category: 'conectores', stock: 500, minStock: 50, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '201003J', name: 'Pigtail SC/APC 2m', description: 'Pigtail SC/APC de 2 metros', category: 'conectores', stock: 200, minStock: 20, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '201004J', name: 'Pigtail LC/APC 2m', description: 'Pigtail LC/APC de 2 metros', category: 'conectores', stock: 200, minStock: 20, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '201005J', name: 'Adaptador SC/APC Duplex', description: 'Adaptador SC/APC Duplex', category: 'conectores', stock: 300, minStock: 30, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '201006J', name: 'Adaptador LC/APC Duplex', description: 'Adaptador LC/APC Duplex', category: 'conectores', stock: 300, minStock: 30, unit: 'unidades', notes: 'Material de fibra óptica' },
            
            // Material Menudo
            { code: '301001J', name: 'Manguito termorretráctil 40mm', description: 'Manguito termorretráctil de 40mm', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '301002J', name: 'Manguito termorretráctil 60mm', description: 'Manguito termorretráctil de 60mm', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '301003J', name: 'Brida plástica 200x4.8mm', description: 'Brida plástica 200x4.8mm (bolsa 100 uds)', category: 'menudo', stock: 50, minStock: 5, unit: 'bolsas', notes: 'Material de fibra óptica' },
            { code: '301004J', name: 'Grapa de pared 12mm', description: 'Grapa de pared 12mm (bolsa 100 uds)', category: 'menudo', stock: 50, minStock: 5, unit: 'bolsas', notes: 'Material de fibra óptica' },
            { code: '301005J', name: 'Grapa de pared 16mm', description: 'Grapa de pared 16mm (bolsa 100 uds)', category: 'menudo', stock: 50, minStock: 5, unit: 'bolsas', notes: 'Material de fibra óptica' },
            { code: '301006J', name: 'Tubo protector 32mm', description: 'Tubo protector de fibra 32mm', category: 'menudo', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '301007J', name: 'Tubo protector 40mm', description: 'Tubo protector de fibra 40mm', category: 'menudo', stock: 800, minStock: 80, unit: 'metros', notes: 'Material de fibra óptica' },
            { code: '301008J', name: 'Cinta aislante naranja', description: 'Cinta aislante naranja', category: 'menudo', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            { code: '301009J', name: 'Cinta aislante negra', description: 'Cinta aislante negra', category: 'menudo', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de fibra óptica' },
            
            // Herramientas
            { code: '401001J', name: 'Cortadora de fibra óptica', description: 'Cortadora de fibra óptica de precisión', category: 'herramientas', stock: 5, minStock: 1, unit: 'unidades', notes: 'Herramienta especializada' },
            { code: '401002J', name: 'Empalmadora de fibra', description: 'Empalmadora de fibra óptica', category: 'herramientas', stock: 3, minStock: 1, unit: 'unidades', notes: 'Herramienta especializada' },
            { code: '401003J', name: 'Detector de potencia óptica', description: 'Detector de potencia óptica', category: 'herramientas', stock: 10, minStock: 2, unit: 'unidades', notes: 'Herramienta de medición' },
            { code: '401004J', name: 'Pelacables de fibra', description: 'Pelacables especializado para fibra', category: 'herramientas', stock: 15, minStock: 3, unit: 'unidades', notes: 'Herramienta especializada' },
            { code: '401005J', name: 'Linterna UV para inspección', description: 'Linterna UV para inspección de fibra', category: 'herramientas', stock: 8, minStock: 2, unit: 'unidades', notes: 'Herramienta de inspección' },
            
            // Equipos
            { code: '501001J', name: 'OTDR Portátil', description: 'OTDR Portátil para análisis de fibra', category: 'equipos', stock: 2, minStock: 1, unit: 'unidades', notes: 'Equipo de medición profesional' },
            { code: '501002J', name: 'Fuente de luz láser', description: 'Fuente de luz láser para fibra óptica', category: 'equipos', stock: 3, minStock: 1, unit: 'unidades', notes: 'Equipo de medición' },
            { code: '501003J', name: 'Medidor de potencia', description: 'Medidor de potencia óptica', category: 'equipos', stock: 4, minStock: 1, unit: 'unidades', notes: 'Equipo de medición' },
            { code: '501004J', name: 'Localizador visual de fallos', description: 'Localizador visual de fallos en fibra', category: 'equipos', stock: 5, minStock: 1, unit: 'unidades', notes: 'Equipo de diagnóstico' },
            { code: '501005J', name: 'Cortadora de precisión', description: 'Cortadora de precisión para fibra', category: 'equipos', stock: 3, minStock: 1, unit: 'unidades', notes: 'Equipo de preparación' }
        ];
    }

    /**
     * Configuración por defecto
     */
    getDefaultSettings() {
        return {
            companyName: 'Empresa de Fibra Óptica',
            lowStockThreshold: 20,
            dateFormat: 'DD/MM/YYYY',
            language: 'es',
            notifications: {
                lowStock: true,
                newMovements: false,
                systemUpdates: true
            },
            backup: {
                autoBackup: true,
                backupInterval: 24,
                lastBackup: null
            }
        };
    }

    /**
     * Trabajadores por defecto
     */
    getDefaultWorkers() {
        return [
            {
                id: 'ADMIN001',
                code: 'ADMIN001',
                name: 'BORJA CARRERAS MARTIN',
                email: 'borja@empresa.com',
                phone: '123456789',
                role: 'administrador',
                status: 'activo',
                registrationDate: '2024-01-01',
                notes: 'Administrador del sistema',
                password: 'admin123'
            },
            {
                id: 'ADMIN002',
                code: 'ADMIN002',
                name: 'JUAN SIMON DE LA FUENTE',
                email: 'juansimon@empresa.com',
                phone: '987654321',
                role: 'administrador',
                status: 'activo',
                registrationDate: '2024-01-01',
                notes: 'Administrador del sistema',
                password: 'admin123'
            },
            {
                id: 'ADMIN003',
                code: 'ADMIN003',
                name: 'ALEXANDER ARROYAVE',
                email: 'alexander@empresa.com',
                phone: '987654322',
                role: 'administrador',
                status: 'activo',
                registrationDate: '2024-01-01',
                notes: 'Administrador del sistema',
                password: 'admin123'
            },
            {
                id: 'TRAB001',
                code: 'TRAB001',
                name: 'JOSE ANTONIO CARRERAS MARTIN',
                email: 'jantonio@empresa.com',
                phone: '555123456',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-01-15',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB002',
                code: 'TRAB002',
                name: 'LUIS MIGUEL HIDALGO EGEA',
                email: 'lmiguel@empresa.com',
                phone: '555789012',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-01-15',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB003',
                code: 'TRAB003',
                name: 'DAVID MORENO GÓMEZ',
                email: 'dmoreno@empresa.com',
                phone: '555345678',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-01-20',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB004',
                code: 'TRAB004',
                name: 'AARON LOPEZ MUÑOZ',
                email: 'alopez@empresa.com',
                phone: '555456789',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-01-22',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB005',
                code: 'TRAB005',
                name: 'EDGAR ALONSO SANCHEZ SUAREZ',
                email: 'ealonso@empresa.com',
                phone: '555567890',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-01-25',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB006',
                code: 'TRAB006',
                name: 'JAVIER CARRERAS MARTIN',
                email: 'jcarreras@empresa.com',
                phone: '555678901',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-01-28',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB007',
                code: 'TRAB007',
                name: 'JUAN PEDRO SUAREZ DELGADO',
                email: 'jpsuarez@empresa.com',
                phone: '555789012',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-02-01',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB008',
                code: 'TRAB008',
                name: 'JOSE FERNANDO SANCHEZ MARULANDA',
                email: 'jfsanchez@empresa.com',
                phone: '555890123',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-02-05',
                notes: 'Trabajador de campo',
                password: '1234'
            },
            {
                id: 'TRAB009',
                code: 'TRAB009',
                name: 'ANTONIO MANUEL LOPEZ GARCÍA',
                email: 'amlopez@empresa.com',
                phone: '555901234',
                role: 'trabajador',
                status: 'activo',
                registrationDate: '2024-02-08',
                notes: 'Trabajador de campo',
                password: '1234'
            }
        ];
    }

    // Métodos específicos para trabajadores
    async getWorkers() {
        try {
            const workers = await this.getItem('workers');
            console.log('Debug - getWorkers raw result:', workers);
            console.log('Debug - getWorkers type:', typeof workers);
            console.log('Debug - getWorkers is array:', Array.isArray(workers));
            
            // Asegurar que siempre devolvemos un array
            if (Array.isArray(workers)) {
                return workers;
            } else if (workers && workers.length !== undefined) {
                // Si es un objeto con longitud, convertir a array
                return Array.from(workers);
            } else {
                console.log('Debug - workers is not array, returning empty array');
                return [];
            }
        } catch (error) {
            console.error('Error en getWorkers:', error);
            return [];
        }
    }

    async getWorkerByCode(code) {
        const workers = await this.getWorkers();
        return workers.find(worker => worker.code === code);
    }

    async getWorkerByName(name) {
        const workers = await this.getWorkers();
        return workers.find(worker => worker.name === name);
    }

    async addWorker(worker) {
        const workers = await this.getWorkers();
        worker.registrationDate = worker.registrationDate || new Date().toISOString().split('T')[0];
        worker.status = worker.status || 'activo';
        workers.push(worker);
        await this.setItem('workers', workers);
        return true;
    }

    async updateWorker(code, updatedWorker) {
        const workers = await this.getWorkers();
        const index = workers.findIndex(worker => worker.code === code);
        if (index !== -1) {
            workers[index] = { ...workers[index], ...updatedWorker };
            await this.setItem('workers', workers);
            return true;
        }
        return false;
    }

    async deleteWorker(code) {
        const workers = await this.getWorkers();
        const index = workers.findIndex(worker => worker.code === code);
        if (index !== -1) {
            workers.splice(index, 1);
            await this.setItem('workers', workers);
            return true;
        }
        return false;
    }

    // Métodos específicos para materiales
    async getMaterials() {
        return await this.getItem('materials') || [];
    }

    async getMaterialByCode(code) {
        const materials = await this.getMaterials();
        return materials.find(material => material.code === code);
    }

    async addMaterial(material) {
        const materials = await this.getMaterials();
        materials.push(material);
        await this.setItem('materials', materials);
        return true;
    }

    async updateMaterial(code, updatedMaterial) {
        const materials = await this.getMaterials();
        const index = materials.findIndex(material => material.code === code);
        if (index !== -1) {
            materials[index] = { ...materials[index], ...updatedMaterial };
            await this.setItem('materials', materials);
            return true;
        }
        return false;
    }

    async deleteMaterial(code) {
        const materials = await this.getMaterials();
        const index = materials.findIndex(material => material.code === code);
        if (index !== -1) {
            materials.splice(index, 1);
            await this.setItem('materials', materials);
            return true;
        }
        return false;
    }

    // Métodos específicos para movimientos
    async getMovements() {
        return await this.getItem('movements') || [];
    }

    async addMovement(movement) {
        const movements = await this.getMovements();
        movement.timestamp = movement.timestamp || new Date().toISOString();
        movements.push(movement);
        await this.setItem('movements', movements);
        return true;
    }

    async updateMovement(id, updatedMovement) {
        const movements = await this.getMovements();
        const index = movements.findIndex(movement => movement.id === id);
        if (index !== -1) {
            movements[index] = { ...movements[index], ...updatedMovement };
            await this.setItem('movements', movements);
            return true;
        }
        return false;
    }

    async deleteMovement(id) {
        const movements = await this.getMovements();
        const index = movements.findIndex(movement => movement.id === id);
        if (index !== -1) {
            movements.splice(index, 1);
            await this.setItem('movements', movements);
            return true;
        }
        return false;
    }

    // Métodos específicos para configuración
    async getSettings() {
        return await this.getItem('settings') || this.getDefaultSettings();
    }

    async updateSettings(updatedSettings) {
        const settings = await this.getSettings();
        const newSettings = { ...settings, ...updatedSettings };
        await this.setItem('settings', newSettings);
        return true;
    }

    // Métodos de búsqueda y filtrado
    async searchWorkers(query) {
        const workers = await this.getWorkers();
        if (!query) return workers;
        
        const searchTerm = query.toLowerCase();
        return workers.filter(worker => 
            worker.name.toLowerCase().includes(searchTerm) ||
            worker.code.toLowerCase().includes(searchTerm) ||
            worker.email.toLowerCase().includes(searchTerm)
        );
    }

    async searchMaterials(query) {
        const materials = await this.getMaterials();
        if (!query) return materials;
        
        const searchTerm = query.toLowerCase();
        return materials.filter(material => 
            material.code.toLowerCase().includes(searchTerm) ||
            material.name.toLowerCase().includes(searchTerm) ||
            material.description.toLowerCase().includes(searchTerm)
        );
    }

    // Métodos de estadísticas
    async getLowStockMaterials() {
        const materials = await this.getMaterials();
        return materials.filter(material => material.stock <= material.minStock);
    }

    async getMaterialsByCategory(category) {
        const materials = await this.getMaterials();
        return materials.filter(material => material.category === category);
    }

    async getMovementsByDateRange(startDate, endDate) {
        const movements = await this.getMovements();
        return movements.filter(movement => {
            const movementDate = new Date(movement.date).toISOString().split('T')[0];
            return movementDate >= startDate && movementDate <= endDate;
        });
    }

    async getMovementsByWorker(workerName) {
        const movements = await this.getMovements();
        return movements.filter(movement => movement.userName === workerName);
    }

    async getMovementsByMaterial(materialCode) {
        const movements = await this.getMovements();
        return movements.filter(movement => movement.materialCode === materialCode);
    }

    // Método para generar ID único
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // Establecer usuario actual para validaciones
    setCurrentUser(user, isAdmin = false) {
        this.currentUser = user;
        this.isAdmin = isAdmin;
    }
}

// Instancia global del gestor de almacenamiento
window.storageManager = new FirebaseStorageManager(database);