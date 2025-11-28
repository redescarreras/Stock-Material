// VERSIÓN SIMPLIFICADA PARA RESOLVER PANTALLA BLANCA
// Aplica solo las correcciones mínimas necesarias

class FibraOpticaApp {
    constructor() {
        this.storage = new FirebaseStorage();
        this.currentUser = null;
        this.isAdmin = false;
        this.loginEventListenerAdded = false;
        this.adminLoginEventListenerAdded = false;
    }

    async start() {
        console.log('Iniciando aplicación...');
        await this.initializeFirebase();
        this.setupEventListeners();
        this.loadInitialData();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        this.hideLoadingScreen();
    }

    async initializeFirebase() {
        // Inicializar Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyDN-D2ppaXbjT_rT74d2dXaOtWqib3zBQ0",
            authDomain: "stock-material-28674.firebaseapp.com",
            databaseURL: "https://stock-material-28674-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "stock-material-28674",
            storageBucket: "stock-material-28674.firebasestorage.app",
            messagingSenderId: "994809951058",
            appId: "1:994809951058:web:31d0cd19f4dcf49b84408b"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase inicializado correctamente');
        }
        
        this.storage = new FirebaseStorage();
        await this.storage.initialize();
    }

    setupEventListeners() {
        // Solo añadir event listeners una vez
        if (this.eventListenersAdded) return;
        this.eventListenersAdded = true;

        // Login - Solo añadir event listeners una vez
        const loginForm = document.getElementById('login-form');
        const adminLoginForm = document.getElementById('admin-login-form');
        
        if (loginForm && !this.loginEventListenerAdded) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.loginEventListenerAdded = true;
        }
        
        if (adminLoginForm && !this.adminLoginEventListenerAdded) {
            adminLoginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
            this.adminLoginEventListenerAdded = true;
        }

        // Botones de limpiar datos
        document.getElementById('clear-data-btn')?.addEventListener('click', () => this.clearData());
        
        // Botón de restaurar materiales
        document.getElementById('restore-materials-btn')?.addEventListener('click', () => this.restoreBasicMaterials());
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const workerName = document.getElementById('worker-select').value;
        const password = document.getElementById('login-password').value;
        
        if (!workerName || !password) {
            alert('Por favor selecciona tu nombre e ingresa la contraseña');
            return;
        }
        
        try {
            const worker = await this.storage.getWorkerByName(workerName);
            if (!worker) {
                alert('Trabajador no encontrado');
                return;
            }
            
            if (worker.password !== password) {
                alert('Contraseña incorrecta');
                return;
            }
            
            // Login exitoso
            this.currentUser = worker;
            this.isAdmin = false;
            this.storage.setCurrentUser(worker, false);
            this.closeModal('login-modal');
            this.enterApplication();
            
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error al iniciar sesión. Inténtalo de nuevo.');
        }
    }

    async handleAdminLogin(e) {
        e.preventDefault();
        
        const adminName = document.getElementById('admin-select').value;
        const password = document.getElementById('admin-password').value;
        
        if (!adminName || !password) {
            alert('Por favor selecciona tu nombre e ingresa la contraseña');
            return;
        }
        
        try {
            const admin = await this.storage.getWorkerByName(adminName);
            if (!admin) {
                alert('Administrador no encontrado');
                return;
            }
            
            if (admin.password !== password) {
                alert('Contraseña incorrecta');
                return;
            }
            
            // Login exitoso
            this.currentUser = admin;
            this.isAdmin = true;
            this.storage.setCurrentUser(admin, true);
            this.closeModal('admin-login-modal');
            this.enterApplication();
            
        } catch (error) {
            console.error('Error en login admin:', error);
            alert('Error al iniciar sesión como administrador. Inténtalo de nuevo.');
        }
    }

    async clearData() {
        if (!this.isAdmin) {
            alert('Solo los administradores pueden limpiar los datos');
            return;
        }
        
        if (!confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los movimientos?')) {
            return;
        }
        
        try {
            const movements = await this.storage.getMovements();
            for (const movement of movements) {
                await this.storage.deleteMovement(movement.id);
            }
            
            alert('✅ Movimientos eliminados correctamente');
        } catch (error) {
            console.error('Error limpiando movimientos:', error);
            alert('❌ Error al limpiar movimientos: ' + error.message);
        }
    }

    async restoreBasicMaterials() {
        if (!this.isAdmin) {
            alert('Solo los administradores pueden restaurar materiales');
            return;
        }

        if (!confirm('¿Restaurar materiales básicos de fibra óptica? (Esto añadirá materiales si no existen)')) {
            return;
        }

        try {
            const materials = await this.storage.getMaterials();
            const existingCodes = materials.map(m => m.code);

            const basicMaterials = [
                { code: '301001J', name: 'Cable FO 48F OS2', category: 'cables', stock: 1500 },
                { code: '301002J', name: 'Cable FO 24F OS2', category: 'cables', stock: 2000 },
                { code: '301003J', name: 'Cable FO 12F OS2', category: 'cables', stock: 2500 },
                { code: '301003J', name: 'Cable FO 6F OS2', category: 'cables', stock: 1800 },
                { code: '301004J', name: 'Cable FO 4F OS2', category: 'cables', stock: 1200 },
                { code: '301005J', name: 'Cable FO 2F OS2', category: 'cables', stock: 800 },
                { code: '302001R', name: 'Repartidor 12 Fibras', category: 'repartidores', stock: 45 },
                { code: '302002R', name: 'Repartidor 24 Fibras', category: 'repartidores', stock: 35 },
                { code: '302003R', name: 'Repartidor 48 Fibras', category: 'repartidores', stock: 25 },
                { code: '303001C', name: 'Conector SC/APC', category: 'conectores', stock: 500 },
                { code: '303002C', name: 'Conector LC/APC', category: 'conectores', stock: 300 },
                { code: '303003C', name: 'Conector ST/APC', category: 'conectores', stock: 200 }
            ];

            let restored = 0;
            for (const basicMaterial of basicMaterials) {
                if (!existingCodes.includes(basicMaterial.code)) {
                    await this.storage.addMaterial(basicMaterial);
                    restored++;
                }
            }

            alert(`Se han restaurado ${restored} materiales básicos. Total actual: ${(await this.storage.getMaterials()).length} materiales.`);
        } catch (error) {
            console.error('Error restaurando materiales:', error);
            alert('Error al restaurar materiales: ' + error.message);
        }
    }

    closeModal(modalId) {
        if (typeof modalId === 'string') {
            document.getElementById(modalId).style.display = 'none';
        } else {
            modalId.style.display = 'none';
        }
    }

    enterApplication() {
        document.getElementById('app').style.display = 'flex';
    }

    updateDateTime() {
        const now = new Date();
        document.getElementById('current-datetime').textContent = now.toLocaleString('es-ES');
    }

    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
    }

    async loadInitialData() {
        // Cargar datos iniciales
        try {
            await this.loadDashboard();
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
        }
    }

    async loadDashboard() {
        const materials = await this.storage.getMaterials();
        const movements = await this.storage.getMovements();
        
        // Actualizar elementos del dashboard
        document.getElementById('total-materials').textContent = materials.length;
        document.getElementById('total-movements').textContent = movements.length;
        document.getElementById('low-stock').textContent = materials.filter(m => m.stock <= 10).length;
    }
}

// Clase FirebaseStorage (versión simplificada)
class FirebaseStorage {
    constructor() {
        this.db = null;
    }

    async initialize() {
        this.db = firebase.database();
    }

    async getWorkers() {
        return new Promise((resolve) => {
            this.db.ref('workers').once('value', (snapshot) => {
                const workers = [];
                snapshot.forEach((child) => {
                    workers.push({ id: child.key, ...child.val() });
                });
                resolve(workers);
            });
        });
    }

    async getWorkerByName(name) {
        const workers = await this.getWorkers();
        return workers.find(w => w.name === name);
    }

    setCurrentUser(user, isAdmin) {
        // Función simplificada
    }

    async getMaterials() {
        return new Promise((resolve) => {
            this.db.ref('materials').once('value', (snapshot) => {
                const materials = [];
                snapshot.forEach((child) => {
                    materials.push({ id: child.key, ...child.val() });
                });
                resolve(materials);
            });
        });
    }

    async getMovements() {
        return new Promise((resolve) => {
            this.db.ref('movements').once('value', (snapshot) => {
                const movements = [];
                snapshot.forEach((child) => {
                    movements.push({ id: child.key, ...child.val() });
                });
                resolve(movements);
            });
        });
    }

    async deleteMovement(movementId) {
        return this.db.ref(`movements/${movementId}`).remove();
    }

    async addMaterial(material) {
        return this.db.ref('materials').push(material);
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando aplicación...');
    
    // Crear instancia global de la aplicación
    window.app = new FibraOpticaApp();
    
    // Inicializar cuando el DOM esté listo
    await window.app.start();
    
    console.log('Aplicación lista para usar');
});
