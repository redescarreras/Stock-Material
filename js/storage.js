/**
 * Storage Manager - Maneja toda la persistencia de datos en localStorage
 */

class StorageManager {
    constructor() {
        this.initializeData();
    }

    /**
     * Inicializa los datos por defecto si no existen
     */
    initializeData() {
        // Siempre cargar los trabajadores por defecto para asegurar que están actualizados
        const defaultWorkers = this.getDefaultWorkers();
        this.setItem('workers', defaultWorkers);

        // Inicializar materiales si no existen
        if (!this.getItem('materials')) {
            this.setItem('materials', this.getDefaultMaterials());
        }

        // Inicializar movimientos si no existen
        if (!this.getItem('movements')) {
            this.setItem('movements', []);
        }

        // Inicializar configuración si no existe
        if (!this.getItem('settings')) {
            this.setItem('settings', this.getDefaultSettings());
        }

        // Inicializar sesión actual
        if (!this.getItem('currentSession')) {
            this.setItem('currentSession', null);
        }
        
        // Log para debug (solo en desarrollo)
        console.log('Datos inicializados:', {
            workers: defaultWorkers.length,
            materials: this.getItem('materials').length
        });
    }

    /**
     * Obtiene un item del localStorage
     */
    getItem(key) {
        try {
            const item = localStorage.getItem(`fibra_optica_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage for key: ${key}`, error);
            return null;
        }
    }

    /**
     * Guarda un item en localStorage
     */
    setItem(key, value) {
        try {
            localStorage.setItem(`fibra_optica_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error saving to localStorage for key: ${key}`, error);
            return false;
        }
    }

    /**
     * Elimina un item del localStorage
     */
    removeItem(key) {
        try {
            localStorage.removeItem(`fibra_optica_${key}`);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage for key: ${key}`, error);
            return false;
        }
    }

    /**
     * Limpia todos los datos de la aplicación
     */
    clearAll() {
        const keys = ['workers', 'materials', 'movements', 'settings', 'currentSession'];
        keys.forEach(key => this.removeItem(key));
        this.initializeData();
    }

    /**
     * Exporta todos los datos como JSON
     */
    exportData() {
        const data = {
            workers: this.getItem('workers'),
            materials: this.getItem('materials'),
            movements: this.getItem('movements'),
            settings: this.getItem('settings'),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    /**
     * Importa datos desde JSON
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.workers) this.setItem('workers', data.workers);
            if (data.materials) this.setItem('materials', data.materials);
            if (data.movements) this.setItem('movements', data.movements);
            if (data.settings) this.setItem('settings', data.settings);
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    /**
     * Materiales por defecto - 171 materiales del Excel
     */
    getDefaultMaterials() {
        return [
            { code: '101001J', name: 'Cable de f.o. de exterior PKP holgado de 8 fo.', description: 'Cable de f.o. de exterior PKP holgado de 8 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101003J', name: 'Cable de f.o. de exterior PKP holgado de 16 fo.', description: 'Cable de f.o. de exterior PKP holgado de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101004J', name: 'Cable de f.o. de exterior PKP holgado de 24 fo.', description: 'Cable de f.o. de exterior PKP holgado de 24 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101005J', name: 'Cable de f.o. de exterior PKP holgado de 32 fo.', description: 'Cable de f.o. de exterior PKP holgado de 32 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101006J', name: 'Cable de f.o. de exterior PKP holgado de 48 fo.', description: 'Cable de f.o. de exterior PKP holgado de 48 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101007J', name: 'Cable de f.o. de exterior PKP holgado de 64 fo.', description: 'Cable de f.o. de exterior PKP holgado de 64 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101008J', name: 'Cable de f.o. de exterior PKP holgado de 128 fo.', description: 'Cable de f.o. de exterior PKP holgado de 128 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101009J', name: 'Cable de f.o. de exterior PKP holgado de 256 fo.', description: 'Cable de f.o. de exterior PKP holgado de 256 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101010J', name: 'Cable de f.o. de exterior PKP holgado de 512 fo.', description: 'Cable de f.o. de exterior PKP holgado de 512 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101011J', name: 'Cable de f.o. de exterior KP holgado de 768 fo.', description: 'Cable de f.o. de exterior KP holgado de 768 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101012J', name: 'Cable de f.o. de exterior KP compacto de 864 fo.', description: 'Cable de f.o. de exterior KP compacto de 864 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101013J', name: 'Cable de f.o. de exterior KP compacto de 912 fo.', description: 'Cable de f.o. de exterior KP compacto de 912 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101014J', name: 'Cable de f.o. de interior KT de 8 fo.', description: 'Cable de f.o. de interior KT de 8 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101016J', name: 'Cable de f.o. de interior TKT de 16 fo.', description: 'Cable de f.o. de interior TKT de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101017J', name: 'Cable de f.o. de interior TKT de 24 fo.', description: 'Cable de f.o. de interior TKT de 24 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101018J', name: 'Cable de f.o. de interior TKT de 32 fo.', description: 'Cable de f.o. de interior TKT de 32 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101019J', name: 'Cable de f.o. de interior TKT de 48 fo.', description: 'Cable de f.o. de interior TKT de 48 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101020J', name: 'Cable de f.o. de interior TKT de 64 fo.', description: 'Cable de f.o. de interior TKT de 64 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101021J', name: 'Cable de f.o. de interior TKT de 128 fo.', description: 'Cable de f.o. de interior TKT de 128 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101022J', name: 'Cable de f.o. de interior TKT de 256 fo.', description: 'Cable de f.o. de interior TKT de 256 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101023J', name: 'Cable de f.o. de interior KT de 512 fo.', description: 'Cable de f.o. de interior KT de 512 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101074J', name: 'Cable de f.o. 16 VT.', description: 'Cable de f.o. 16 VT.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101075J', name: 'Cable de f.o. 32 VT.', description: 'Cable de f.o. 32 VT.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101076J', name: 'Cable de f.o. 64 VT.', description: 'Cable de f.o. 64 VT.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101085J', name: 'Cable KT 8 fo G.652.D monotubo BLANCO', description: 'Cable KT 8 fo G.652.D monotubo BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101082J', name: 'Cable KP 16 fo G.652.D (4x4f+2e) BLANCO', description: 'Cable KP 16 fo G.652.D (4x4f+2e) BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101086J', name: 'Cable FVT micromódulos 16 fo G.657 A2 (4x4f) BLANCO', description: 'Cable FVT micromódulos 16 fo G.657 A2 (4x4f) BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101083J', name: 'Cable KP 32 fo G.652.D (8x4f) BLANCO', description: 'Cable KP 32 fo G.652.D (8x4f) BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101087J', name: 'Cable FVT micromódulos 32 fo G.657 A2 (8x4f) BLANCO', description: 'Cable FVT micromódulos 32 fo G.657 A2 (8x4f) BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101084J', name: 'Cable KP 64 fo G.652.D (8x8f) BLANCO', description: 'Cable KP 64 fo G.652.D (8x8f) BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101088J', name: 'Cable FVT micromódulos 64 fo G.657 A2 (8x8f) BLANCO', description: 'Cable FVT micromódulos 64 fo G.657 A2 (8x8f) BLANCO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101024J', name: 'Cable de f.o. de interior riser de 16 fo.', description: 'Cable de f.o. de interior riser de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101025J', name: 'Cable de f.o. de interior riser de 24 fo.', description: 'Cable de f.o. de interior riser de 24 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101026J', name: 'Cable de f.o. de interior riser de 32 fo.', description: 'Cable de f.o. de interior riser de 32 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101027J', name: 'Cable de f.o. de interior riser de 48 fo.', description: 'Cable de f.o. de interior riser de 48 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101046J', name: 'Cable de f.o. de exterior KP holgado de 16 fo.', description: 'Cable de f.o. de exterior KP holgado de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101047J', name: 'Cable de f.o. de exterior KP holgado de 32 fo.', description: 'Cable de f.o. de exterior KP holgado de 32 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101048J', name: 'Cable de f.o. de exterior KP holgado de 64 fo.', description: 'Cable de f.o. de exterior KP holgado de 64 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101049J', name: 'Cable de f.o. de exterior KP holgado de 128 fo.', description: 'Cable de f.o. de exterior KP holgado de 128 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101051J', name: 'Cable de f.o. de exterior riser de 16 fo.', description: 'Cable de f.o. de exterior riser de 16 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '101052J', name: 'Cable de f.o. de exterior riser de 32 fo.', description: 'Cable de f.o. de exterior riser de 32 fo.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },

            { code: '102001JT', name: 'Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 64 fusiones  Tyco', description: 'Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 64 fusiones  Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102002JT', name: 'Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 128 fusiones Tyco', description: 'Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 128 fusiones Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102003JT', name: 'Caja de empalme TE FIST-GCO2-BD8, con bandejas de empalme 5SE para 128 (160) fusiones Tyco', description: 'Caja de empalme TE FIST-GCO2-BD8, con bandejas de empalme 5SE para 128 (160) fusiones Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102003JM', name: 'Caja de empalme RA BPEO-2/128 3M', description: 'Caja de empalme RA BPEO-2/128 3M', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102004JT', name: 'Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 256 fusiones Tyco', description: 'Caja de empalme TE FIST-GCO2-BC8, o similar, con bandejas de empalme 5SE para 256 fusiones Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102005JT', name: 'Caja de empalme TE FIST-GCO2-BD8, con bandejas de empalme 5SE para 256 (320) fusiones Tyco', description: 'Caja de empalme TE FIST-GCO2-BD8, con bandejas de empalme 5SE para 256 (320) fusiones Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102005JM', name: 'Caja de empalme RA BPEO-2/256 3M', description: 'Caja de empalme RA BPEO-2/256 3M', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102006JT', name: 'Caja de empalme TE FIST-GCO2-BD8, o similar, con bandejas de empalme 5SE para 512 fusiones Tyco', description: 'Caja de empalme TE FIST-GCO2-BD8, o similar, con bandejas de empalme 5SE para 512 fusiones Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102007JT', name: 'Caja de empalme TE FIST-GCO2-BE8, con bandejas de empalme 5SE para 512 (560) fusiones Tyco', description: 'Caja de empalme TE FIST-GCO2-BE8, con bandejas de empalme 5SE para 512 (560) fusiones Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102007JM', name: 'Caja de empalme RA BPEO-2/512 3M', description: 'Caja de empalme RA BPEO-2/512 3M', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102011JT', name: 'Kit de sellado termorretráctil para puerto circular en caja de empalme tipo FIST o similar Tyco', description: 'Kit de sellado termorretráctil para puerto circular en caja de empalme tipo FIST o similar Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102011JM', name: 'Kit de Sellado Circular 3M hasta 18 mm', description: 'Kit de Sellado Circular 3M hasta 18 mm', category: 'accesorios', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102012JT', name: 'Kit de sellado termorretráctil para puerto oval en caja de empalme tipo FIST o similar Tyco', description: 'Kit de sellado termorretráctil para puerto oval en caja de empalme tipo FIST o similar Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102012JM', name: 'Kit de sellado puerto oval 3M 27 mm', description: 'Kit de sellado puerto oval 3M 27 mm', category: 'accesorios', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102013JT', name: 'Splitter 1:4 FSASA2 premontado en bloque de 4UMS con 2 bandejas SC con las fibras preinstaladas para caja FIST Tyco', description: 'Splitter 1:4 FSASA2 premontado en bloque de 4UMS con 2 bandejas SC con las fibras preinstaladas para caja FIST Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102018JC', name: 'Caja de empalme Corning UCAO MFT7, con bandejas de empalme para hasta 168 fusiones.', description: 'Caja de empalme Corning UCAO MFT7, con bandejas de empalme para hasta 168 fusiones.', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102018JT', name: 'Caja de empalme FOSC350C. Con bandejas de empalme para capacidad de hasta 168 fusiones. Incluye etiquetas de Orange.', description: 'Caja de empalme FOSC350C. Con bandejas de empalme para capacidad de hasta 168 fusiones. Incluye etiquetas de Orange.', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102022JT', name: 'Caja terminal Corning UCA8, o similar, con 1 splitter 1:16 y 8 puertos de salida conectorizados y premontados marcado ORANGE Tyco', description: 'Caja terminal Corning UCA8, o similar, con 1 splitter 1:16 y 8 puertos de salida conectorizados y premontados marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102023JT', name: 'Caja terminal Corning UCA16, o similar, con 1 splitter 1:16 y 16 puertos de salida conectorizados y premontados marcado ORANGE Tyco', description: 'Caja terminal Corning UCA16, o similar, con 1 splitter 1:16 y 16 puertos de salida conectorizados y premontados marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102026JC', name: 'Splitter 1:16 premontado en bandeja de empalme para caja UCAx o similar Corning', description: 'Splitter 1:16 premontado en bandeja de empalme para caja UCAx o similar Corning', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102026JT', name: 'Splitter 1:16 premontado en bandeja de empalme para caja UCAx o similar Tyco', description: 'Splitter 1:16 premontado en bandeja de empalme para caja UCAx o similar Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102028JT', name: 'Módulo de operador TE MOBI, o similar, marcado ORANGE Tyco', description: 'Módulo de operador TE MOBI, o similar, marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102029JT', name: 'Módulo de cliente TE MOBI, o similar, con 16 adaptadores SC/APC y 16 pig-tails G.657A2 SC/APC "low loss" Tyco', description: 'Módulo de cliente TE MOBI, o similar, con 16 adaptadores SC/APC y 16 pig-tails G.657A2 SC/APC "low loss" Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102030JT', name: 'Kit de ampliación de 4 adaptadores SC/APC y 4 pig-tails G.657A2 SC/APC "low loss"  Tyco', description: 'Kit de ampliación de 4 adaptadores SC/APC y 4 pig-tails G.657A2 SC/APC "low loss"  Tyco', category: 'conectores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102032JT', name: 'Suministro de 16 adaptadores SC/APC y 1 splitter 1:16 para caja MOBI, o similar, con salidas G.657A2 conectorizadas en conectores SC/APC "low loss"  Tyco', description: 'Suministro de 16 adaptadores SC/APC y 1 splitter 1:16 para caja MOBI, o similar, con salidas G.657A2 conectorizadas en conectores SC/APC "low loss"  Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102034J', name: 'Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 50 m marcado ORANGE Tyco', description: 'Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 50 m marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102035J', name: 'Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 100 m marcado ORANGE Tyco', description: 'Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 100 m marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102036J', name: 'Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 150 m marcado ORANGE Tyco', description: 'Caja terminal multipuerto con 4 puertos Optitap®  y rabillo de 150 m marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102037J', name: 'Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 50 m marcado ORANGE Tyco', description: 'Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 50 m marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102038J', name: 'Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 100 m marcado ORANGE Tyco', description: 'Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 100 m marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102039J', name: 'Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 150 m marcado ORANGE Corning', description: 'Caja terminal multipuerto con 8 puertos Optitap®  y rabillo de 150 m marcado ORANGE Corning', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102040J', name: 'Caja de derivación óptica TE IFDB-M, o similar Tyco', description: 'Caja de derivación óptica TE IFDB-M, o similar Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102045JT', name: 'Suministro de splitter 1:4 fuera de bandeja', description: 'Suministro de splitter 1:4 fuera de bandeja', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102047J', name: 'SPLITTER 1:16 FUERA DE BANDEJA (GENERICO)(SUSTITUYE A 102060J)', description: 'SPLITTER 1:16 FUERA DE BANDEJA (GENERICO)(SUSTITUYE A 102060J)', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102050JT', name: 'Caja de empalme DiviCAU o similar marcado ORANGE Tyco', description: 'Caja de empalme DiviCAU o similar marcado ORANGE Tyco', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102053JE', name: 'CAJA DE EMPALME CAU HASTA 128 FUSIONES ORANGE', description: 'CAJA DE EMPALME CAU HASTA 128 FUSIONES ORANGE', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102057J', name: 'EMBELLECEDOR PARA CAJA DE DERIVACION', description: 'EMBELLECEDOR PARA CAJA DE DERIVACION', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102058J', name: 'RETENEDOR PARA ACOMETIDA DIRECTA EN CTO MULTIOPRERADOR DE INTERIOR', description: 'RETENEDOR PARA ACOMETIDA DIRECTA EN CTO MULTIOPRERADOR DE INTERIOR', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102060J', name: '(BANDEJA CON SPLITTER PARA CAJA FOSC) FOSC-TRAY-SPLT-116-1-ES07', description: '(BANDEJA CON SPLITTER PARA CAJA FOSC) FOSC-TRAY-SPLT-116-1-ES07', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102061J', name: 'CAJA MB2 FUNCIONALIDAD "OPERADOR+CLIENTE" MARCADO ORANGE', description: 'CAJA MB2 FUNCIONALIDAD "OPERADOR+CLIENTE" MARCADO ORANGE', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102062J', name: 'CAJA MB2 FUNCIONALIDAD "OPERADOR"MARCADO ORANGE', description: 'CAJA MB2 FUNCIONALIDAD "OPERADOR"MARCADO ORANGE', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102067J', name: 'KIT DE SELLADO DE GEL PARA 4 CABLES DE HASTA 7MM', description: 'KIT DE SELLADO DE GEL PARA 4 CABLES DE HASTA 7MM', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102068J', name: 'KIT DE SELLADO DE GEL PARA 1 CABLE DE HASTA 20MM', description: 'KIT DE SELLADO DE GEL PARA 1 CABLE DE HASTA 20MM', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102069J', name: 'CAJA TERMINAL OTE16 O SIMILAR IP65C(SUSTITUYE A 102023J UCA16)', description: 'CAJA TERMINAL OTE16 O SIMILAR IP65C(SUSTITUYE A 102023J UCA16)', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102073J', name: 'CAJA TERMINAL OTE16 O SIMILAR IP65C(SUSTITUYE A 102023J UCA16)', description: 'CAJA TERMINAL OTE16 O SIMILAR IP65C(SUSTITUYE A 102023J UCA16)', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102075J', name: 'CAJA DE DERIVACION ESTANCA TIPO TBE-I4 O SIMILAR', description: 'CAJA DE DERIVACION ESTANCA TIPO TBE-I4 O SIMILAR', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102076J', name: 'Kit de extensión FIST de BC a BD', description: 'Kit de extensión FIST de BC a BD', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102077J', name: 'KIT DE EXTENSION FIST DE BD A BE', description: 'KIT DE EXTENSION FIST DE BD A BE', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102084J', name: 'Bandeja de FO 19 ETSI F200', description: 'Bandeja de FO 19 ETSI F200', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102085J', name: 'CTO mini Interior módulo de operador', description: 'CTO mini Interior módulo de operador', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102086J', name: 'CTO mini Interior módulo de edificio', description: 'CTO mini Interior módulo de edificio', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102087J', name: 'RETENEDOR PARA ACOMETIDA DIRECTA EN MINI CTO MULTI', description: 'RETENEDOR PARA ACOMETIDA DIRECTA EN MINI CTO MULTI', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102089J', name: 'Caja terminal MiniCTO16 FastConnect con 16 puertos de salida', description: 'Caja terminal MiniCTO16 FastConnect con 16 puertos de salida', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102091J', name: 'Caja Terminal miniOTE2-8 con 1 splitter 1:16 y 8 puertos de salida conectorizados Optitap  CTO MINI', description: 'Caja Terminal miniOTE2-8 con 1 splitter 1:16 y 8 puertos de salida conectorizados Optitap  CTO MINI', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102092J', name: 'SUMINISTRO DE CAJA TERMINAL OTE8 O SIMILAR IP65C', description: 'SUMINISTRO DE CAJA TERMINAL OTE8 O SIMILAR IP65C', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102093J', name: 'Caja de empalme BPEO-1,5 hasta 128 fusiones, con marcado Orange', description: 'Caja de empalme BPEO-1,5 hasta 128 fusiones, con marcado Orange', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102096J', name: 'Suministro de Kit de sellado de Gel para 2 cables Ø8-12 mm (para uso en FOSC350C Tyco)', description: 'Suministro de Kit de sellado de Gel para 2 cables Ø8-12 mm (para uso en FOSC350C Tyco)', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102113J', name: 'SPLITTER 1X4 PLC EN PUNTA', description: 'SPLITTER 1X4 PLC EN PUNTA', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102114J', name: 'Armario Intemperie CTO 48 NO DV', description: 'Armario Intemperie CTO 48 NO DV', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102115J', name: 'Armario Intemperie CTO 48 1DV16', description: 'Armario Intemperie CTO 48 1DV16', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102117J', name: 'SPLITTER 1X4 PLC PRECONECTADO', description: 'SPLITTER 1X4 PLC PRECONECTADO', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102118J', name: 'Band.F.O.19/ETSI F200 (Spli 1:4) (COLEGIOS)', description: 'Band.F.O.19/ETSI F200 (Spli 1:4) (COLEGIOS)', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102119J', name: 'Suministro de caja de empalme TENIO B6 64 fusiones', description: 'Suministro de caja de empalme TENIO B6 64 fusiones', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102120J', name: 'Suministro de caja de empalme TENIO C6 128 fusiones', description: 'Suministro de caja de empalme TENIO C6 128 fusiones', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102122J', name: 'Bandeja de F.O 19"/ETSI F200 (Splitter 1:16)', description: 'Bandeja de F.O 19"/ETSI F200 (Splitter 1:16)', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: '102124J', name: 'Kit Sellado salida cable para TENIO-SKG2-13/16mm', description: 'Kit Sellado salida cable para TENIO-SKG2-13/16mm', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: '102141J', name: 'Bandeja de 32 F.O 19\' equipado con 2 Splitter 1:16', description: 'Bandeja de 32 F.O 19\' equipado con 2 Splitter 1:16', category: 'repartidores', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D12915060170016', name: 'ANCLA TIPO A PARA PASOS AEREOS', description: 'ANCLA TIPO A PARA PASOS AEREOS', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140040015', name: 'ANILLA TIPO 1 PARA GRAPA (BOLSA DE 100 UNIDADES) (CAJA DE 1000 UNIDADES)', description: 'ANILLA TIPO 1 PARA GRAPA (BOLSA DE 100 UNIDADES) (CAJA DE 1000 UNIDADES)', category: 'repartidores', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15120060001', name: 'ARANDELA CUADRADA', description: 'ARANDELA CUADRADA', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15160010022', name: 'BRIDA 300X4,8(BOLSA DE 100 UNIDADES)', description: 'BRIDA 300X4,8(BOLSA DE 100 UNIDADES)', category: 'menudo', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15160010023', name: 'BRIDA 370X7,6(BOLSA DE 100 UNIDADES)', description: 'BRIDA 370X7,6(BOLSA DE 100 UNIDADES)', category: 'menudo', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15160010025', name: 'BRIDA/CINTILLO REUTILIZABLE KIT(INCLUYE 75 CABEZAS)', description: 'BRIDA/CINTILLO REUTILIZABLE KIT(INCLUYE 75 CABEZAS)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D06020040001', name: 'CABLE DE ACERO 1,6(CON CUBIERTA PLASTIFICADA)', description: 'CABLE DE ACERO 1,6(CON CUBIERTA PLASTIFICADA)', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D02180260004', name: 'CINTA AISLANTE NARANJA', description: 'CINTA AISLANTE NARANJA', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D02180260019', name: 'CINTA AISLANTE NEGRA', description: 'CINTA AISLANTE NEGRA', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15020160005', name: 'CINTA PERFORADA PARA TUBO DE SALIDA(SOLO PARA AVERIAS)', description: 'CINTA PERFORADA PARA TUBO DE SALIDA(SOLO PARA AVERIAS)', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08140430234', name: 'CONJUNTO RETENCION ANCLAJE KP ᴓ 11 MM AMARILLO 500316', description: 'CONJUNTO RETENCION ANCLAJE KP ᴓ 11 MM AMARILLO 500316', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140430238', name: 'CONJUNTO RETENCION SUSPENSION KP ᴓ 11 MM AMARILLO 500317', description: 'CONJUNTO RETENCION SUSPENSION KP ᴓ 11 MM AMARILLO 500317', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140430235', name: 'CONJUNTO RETENCION ANCLAJE KP ᴓ 12 MM ROJO 500318', description: 'CONJUNTO RETENCION ANCLAJE KP ᴓ 12 MM ROJO 500318', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140430240', name: 'CONJUNTO RETENCION SUSPENSION KP ᴓ 12 MM ROJO 500319', description: 'CONJUNTO RETENCION SUSPENSION KP ᴓ 12 MM ROJO 500319', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140430233', name: 'CONJUNTO RETENCION ANCLAJE F.O. MULTIUSOS MARRON 500321', description: 'CONJUNTO RETENCION ANCLAJE F.O. MULTIUSOS MARRON 500321', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08140430239', name: 'CONJUNTO RETENCION SUSPENSION F.O. MULTIUSOS MARRON 500330', description: 'CONJUNTO RETENCION SUSPENSION F.O. MULTIUSOS MARRON 500330', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08140430361', name: 'CONJUNTO RETENCION ANCLAJE F.O. ᴓ 18 MM ROJO 500283', description: 'CONJUNTO RETENCION ANCLAJE F.O. ᴓ 18 MM ROJO 500283', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08140430362', name: 'CONJUNTO RETENCION SUSPENSION F.O. ᴓ 18 MM ROJO 500291', description: 'CONJUNTO RETENCION SUSPENSION F.O. ᴓ 18 MM ROJO 500291', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D15020020012', name: 'CUERDA NEGRA (200 METROS POR ROLLO)', description: 'CUERDA NEGRA (200 METROS POR ROLLO)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D19040050017', name: 'DIGITO 0-9 Y GUION 20MM', description: 'DIGITO 0-9 Y GUION 20MM', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D19040050014', name: 'DIGITO "E" DE ORANGE', description: 'DIGITO "E" DE ORANGE', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'U61060110003', name: 'ESCUADRA ANCLAJE PARA RETENCION CABLES DE ACOMETIDA', description: 'ESCUADRA ANCLAJE PARA RETENCION CABLES DE ACOMETIDA', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08140410009', name: 'GANCHO ACERO P.AISLADOR - RETENEDOR', description: 'GANCHO ACERO P.AISLADOR - RETENEDOR', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140120023', name: 'GRAPA DE PARED 00 (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)', description: 'GRAPA DE PARED 00 (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)', category: 'repartidores', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140120020', name: 'GRAPA DE PARED 0 DE 12MM (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)', description: 'GRAPA DE PARED 0 DE 12MM (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)', category: 'repartidores', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140120021', name: 'GRAPA DE PARED 1 DE 16MM (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)', description: 'GRAPA DE PARED 1 DE 16MM (BOLSA DE 100 UNIDADES) (CAJA DE 1200 UNIDADES)', category: 'repartidores', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140320011', name: 'GUARDACABO Nº9', description: 'GUARDACABO Nº9', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D19040090004', name: 'HILO DE COSER', description: 'HILO DE COSER', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D09260020001', name: 'MARCO CON PUERTA348X356 (PARA REGISTROS)', description: 'MARCO CON PUERTA348X356 (PARA REGISTROS)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04060060001', name: 'MONOTUBO 25 X 2 NEGRO', description: 'MONOTUBO 25 X 2 NEGRO', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04060060002', name: 'MONOTUBO 32 X 2,4 NEGRO', description: 'MONOTUBO 32 X 2,4 NEGRO', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04060060009', name: 'MONOTUBO 40 X 2,4 NEGRO', description: 'MONOTUBO 40 X 2,4 NEGRO', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04100030005', name: 'OBTURADOR  INFLABLE DE 25 (OKT25)', description: 'OBTURADOR  INFLABLE DE 25 (OKT25)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04100030002', name: 'OBTURADOR INFLABLE DE 32 (OKT32)', description: 'OBTURADOR INFLABLE DE 32 (OKT32)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04100030001', name: 'OBTURADOR INFLABLE DE 40 (OKT40)', description: 'OBTURADOR INFLABLE DE 40 (OKT40)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04100030003', name: 'OBTURADOR INFLABLE DE 63 (OKT63)', description: 'OBTURADOR INFLABLE DE 63 (OKT63)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04100030004', name: 'OBTURADOR INFLABLE DE 110 (OKT110)', description: 'OBTURADOR INFLABLE DE 110 (OKT110)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15120120072', name: 'PASANTE ESPARRAGO ROSCADO M16 (2 TUERCAS + 2 ARANDELAS)', description: 'PASANTE ESPARRAGO ROSCADO M16 (2 TUERCAS + 2 ARANDELAS)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08140240129', name: 'PREFORMADO DE AMARRE 1,6MM', description: 'PREFORMADO DE AMARRE 1,6MM', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08140430363', name: 'RETENEDOR F.O. ACOMETIDAS CON GANCHO', description: 'RETENEDOR F.O. ACOMETIDAS CON GANCHO', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D15060170014', name: 'TACO 10X25 PARA TORNILLO 6MM (BOLSA 50UNI)', description: 'TACO 10X25 PARA TORNILLO 6MM (BOLSA 50UNI)', category: 'menudo', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15060170015', name: 'TACO M10 CON ARGOLLA', description: 'TACO M10 CON ARGOLLA', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D09300040026', name: 'TAPA FUNDICIÓN JC', description: 'TAPA FUNDICIÓN JC', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D09300040027', name: 'TAPA FUNDICIÓN HSK', description: 'TAPA FUNDICIÓN HSK', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D09300040024', name: 'TAPA ORANGE FUNDICION JM(2 HOJAS)', description: 'TAPA ORANGE FUNDICION JM(2 HOJAS)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D09300040025', name: 'TAPA ORANGE FUNDICION JG(4 HOJAS)', description: 'TAPA ORANGE FUNDICION JG(4 HOJAS)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07080080147', name: 'TAPON CUATRIPOLAR METAL 32MM(4-32)', description: 'TAPON CUATRIPOLAR METAL 32MM(4-32)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07080080142', name: 'TAPON LEVA PARA 25MM', description: 'TAPON LEVA PARA 25MM', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07080080143', name: 'TAPON LEVA PARA 32MM', description: 'TAPON LEVA PARA 32MM', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07080080144', name: 'TAPON LEVA PARA 40MM', description: 'TAPON LEVA PARA 40MM', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07080080145', name: 'TAPON TRIPOLAR METAL 32MM(3-32)', description: 'TAPON TRIPOLAR METAL 32MM(3-32)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07080080146', name: 'TAPON TRIPOLAR METAL 40MM(3-40)', description: 'TAPON TRIPOLAR METAL 40MM(3-40)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15120120039', name: 'TORNILLO ROSCA MADERA 6*30(CAJA 100UNI)', description: 'TORNILLO ROSCA MADERA 6*30(CAJA 100UNI)', category: 'repartidores', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15120120100', name: 'TORNILLO ROSCA MADERA 6*60(CAJA 100UNI)', description: 'TORNILLO ROSCA MADERA 6*60(CAJA 100UNI)', category: 'repartidores', stock: 50, minStock: 5, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07060030039', name: 'TUBO CORRUGADO VERDE 63 mm', description: 'TUBO CORRUGADO VERDE 63 mm', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07060030040', name: 'TUBO CORRUGADO VERDE 110 mm', description: 'TUBO CORRUGADO VERDE 110 mm', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D04060170013', name: 'TUBO FO 45MM PARA FUSIONES(PROTECTOR EMPALME)(BOLSA DE 100 UNIDADES)', description: 'TUBO FO 45MM PARA FUSIONES(PROTECTOR EMPALME)(BOLSA DE 100 UNIDADES)', category: 'cables', stock: 1000, minStock: 100, unit: 'metros', notes: 'Material de inventario' },
            { code: 'D08160050005', name: 'TUBO PG16 de ACEROFLEX', description: 'TUBO PG16 de ACEROFLEX', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08160050006', name: 'TUBO PG21 de ACEROFLEX', description: 'TUBO PG21 de ACEROFLEX', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08160050007', name: 'TUBO PG16 de SIN ACERO', description: 'TUBO PG16 de SIN ACERO', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D08160050008', name: 'TUBO PG21 de SIN ACERO', description: 'TUBO PG21 de SIN ACERO', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D07060040024', name: 'TUBO PLASTICO 40MM PARA SALIDA LATERAL(KIT CON PIE Y CONO)', description: 'TUBO PLASTICO 40MM PARA SALIDA LATERAL(KIT CON PIE Y CONO)', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' },
            { code: 'D15180010001', name: 'ABRAZADERA PARA TUBO DE SALIDA LATERAL', description: 'ABRAZADERA PARA TUBO DE SALIDA LATERAL', category: 'menudo', stock: 100, minStock: 10, unit: 'unidades', notes: 'Material de inventario' }
        ];
    }

    /**
     * Configuración por defecto
     */
    getDefaultSettings() {
        return {
            companyName: 'Empresa de Fibra Óptica',
            lowStockThreshold: 20, // Porcentaje
            dateFormat: 'DD/MM/YYYY',
            language: 'es',
            notifications: {
                lowStock: true,
                newMovements: false,
                systemUpdates: true
            },
            backup: {
                autoBackup: true,
                backupInterval: 24, // horas
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
    getWorkers() {
        return this.getItem('workers') || [];
    }

    getWorkerByCode(code) {
        const workers = this.getWorkers();
        return workers.find(worker => worker.code === code);
    }

    getWorkerByName(name) {
        const workers = this.getWorkers();
        return workers.find(worker => worker.name === name);
    }

    addWorker(worker) {
        const workers = this.getWorkers();
        worker.registrationDate = worker.registrationDate || new Date().toISOString().split('T')[0];
        worker.status = worker.status || 'activo';
        workers.push(worker);
        return this.setItem('workers', workers);
    }

    updateWorker(code, updatedWorker) {
        const workers = this.getWorkers();
        const index = workers.findIndex(worker => worker.code === code);
        if (index !== -1) {
            workers[index] = { ...workers[index], ...updatedWorker };
            return this.setItem('workers', workers);
        }
        return false;
    }

    deleteWorker(code) {
        const workers = this.getWorkers();
        const index = workers.findIndex(worker => worker.code === code);
        if (index !== -1) {
            workers.splice(index, 1);
            return this.setItem('workers', workers);
        }
        return false;
    }

    // Métodos específicos para materiales
    getMaterials() {
        return this.getItem('materials') || [];
    }

    getMaterialByCode(code) {
        const materials = this.getMaterials();
        return materials.find(material => material.code === code);
    }

    addMaterial(material) {
        const materials = this.getMaterials();
        materials.push(material);
        return this.setItem('materials', materials);
    }

    updateMaterial(code, updatedMaterial) {
        const materials = this.getMaterials();
        const index = materials.findIndex(material => material.code === code);
        if (index !== -1) {
            materials[index] = { ...materials[index], ...updatedMaterial };
            return this.setItem('materials', materials);
        }
        return false;
    }

    deleteMaterial(code) {
        const materials = this.getMaterials();
        const index = materials.findIndex(material => material.code === code);
        if (index !== -1) {
            materials.splice(index, 1);
            return this.setItem('materials', materials);
        }
        return false;
    }

    // Métodos específicos para movimientos
    getMovements() {
        return this.getItem('movements') || [];
    }

    addMovement(movement) {
        const movements = this.getMovements();
        movement.timestamp = movement.timestamp || new Date().toISOString();
        movements.push(movement);
        return this.setItem('movements', movements);
    }

    updateMovement(id, updatedMovement) {
        const movements = this.getMovements();
        const index = movements.findIndex(movement => movement.id === id);
        if (index !== -1) {
            movements[index] = { ...movements[index], ...updatedMovement };
            return this.setItem('movements', movements);
        }
        return false;
    }

    deleteMovement(id) {
        const movements = this.getMovements();
        const index = movements.findIndex(movement => movement.id === id);
        if (index !== -1) {
            movements.splice(index, 1);
            return this.setItem('movements', movements);
        }
        return false;
    }

    // Métodos específicos para configuración
    getSettings() {
        return this.getItem('settings') || this.getDefaultSettings();
    }

    updateSettings(updatedSettings) {
        const settings = this.getSettings();
        const newSettings = { ...settings, ...updatedSettings };
        return this.setItem('settings', newSettings);
    }

    // Métodos de búsqueda y filtrado
    searchWorkers(query) {
        const workers = this.getWorkers();
        if (!query) return workers;
        
        const searchTerm = query.toLowerCase();
        return workers.filter(worker => 
            worker.name.toLowerCase().includes(searchTerm) ||
            worker.code.toLowerCase().includes(searchTerm) ||
            worker.email.toLowerCase().includes(searchTerm)
        );
    }

    searchMaterials(query) {
        const materials = this.getMaterials();
        if (!query) return materials;
        
        const searchTerm = query.toLowerCase();
        return materials.filter(material => 
            material.code.toLowerCase().includes(searchTerm) ||
            material.name.toLowerCase().includes(searchTerm) ||
            material.description.toLowerCase().includes(searchTerm)
        );
    }

    // Métodos de estadísticas
    getLowStockMaterials() {
        const materials = this.getMaterials();
        return materials.filter(material => material.stock <= material.minStock);
    }

    getMaterialsByCategory(category) {
        const materials = this.getMaterials();
        return materials.filter(material => material.category === category);
    }

    getMovementsByDateRange(startDate, endDate) {
        const movements = this.getMovements();
        return movements.filter(movement => {
            const movementDate = new Date(movement.date).toISOString().split('T')[0];
            return movementDate >= startDate && movementDate <= endDate;
        });
    }

    getMovementsByWorker(workerName) {
        const movements = this.getMovements();
        return movements.filter(movement => movement.userName === workerName);
    }

    getMovementsByMaterial(materialCode) {
        const movements = this.getMovements();
        return movements.filter(movement => movement.materialCode === materialCode);
    }

    // Métodos de validación
    validateWorker(worker) {
        const errors = [];
        
        if (!worker.code || worker.code.trim() === '') {
            errors.push('El código es obligatorio');
        }
        
        if (!worker.name || worker.name.trim() === '') {
            errors.push('El nombre es obligatorio');
        }
        
        // Verificar si el código ya existe
        const existingWorker = this.getWorkerByCode(worker.code);
        if (existingWorker) {
            errors.push('Ya existe un trabajador con ese código');
        }
        
        return errors;
    }

    validateMaterial(material) {
        const errors = [];
        
        if (!material.code || material.code.trim() === '') {
            errors.push('El código es obligatorio');
        }
        
        if (!material.name || material.name.trim() === '') {
            errors.push('El nombre es obligatorio');
        }
        
        if (material.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }
        
        if (material.minStock < 0) {
            errors.push('El stock mínimo no puede ser negativo');
        }
        
        // Verificar si el código ya existe
        const existingMaterial = this.getMaterialByCode(material.code);
        if (existingMaterial) {
            errors.push('Ya existe un material con ese código');
        }
        
        return errors;
    }

    // Método para generar ID único
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
}

// Instancia global del gestor de almacenamiento
window.storageManager = new StorageManager();