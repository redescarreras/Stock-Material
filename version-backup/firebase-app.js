/**
 * Control de Material - Fibra Óptica Online
 * Versión con Firebase Realtime Database
 */

class FibraOpticaApp {
    constructor() {
        console.log('Iniciando aplicación online...');
        
        // Inicializar managers
        this.storage = window.storageManager;
        this.isOnline = navigator.onLine;
        
        // Estado de la aplicación
        this.currentUser = null;
        this.isAdmin = false;
        this.selectedMaterials = [];
        
        // Configurar eventos online/offline
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineStatus();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineStatus();
        });
        
        // Inicializar aplicación
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        console.log('Inicializando aplicación online...');
        
        try {
            // Configurar eventos
            this.setupEventListeners();
            
            // Cargar dropdowns inmediatamente
            await this.loadDropdowns();
            
            // Configurar listeners en tiempo real
            this.setupRealtimeListeners();
            
            // Mostrar modal de login
            this.showLoginModal();
            
            // Ocultar pantalla de carga
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 100);
            
            console.log('Aplicación online inicializada correctamente');
            
        } catch (error) {
            console.error('Error inicializando aplicación:', error);
            alert('Error al cargar la aplicación. Recarga la página.');
        }
    }

    /**
     * Método de debug para verificar el estado de Firebase
     */
    async debugFirebaseData() {
        console.log('=== DEBUG FIREBASE DATA ===');
        console.log('Online status:', this.storage.isOnline);
        
        try {
            // Verificar materiales
            const materials = await this.storage.getMaterials();
            console.log('Materials count:', materials.length);
            
            // Verificar trabajadores
            const workers = await this.storage.getWorkers();
            console.log('Workers count:', workers.length);
            console.log('Workers type:', typeof workers);
            console.log('Workers isArray:', Array.isArray(workers));
            
            // Verificar movimientos
            const movements = await this.storage.getMovements();
            console.log('Movements count:', movements.length);
            
            console.log('=== END DEBUG ===');
            
            return { materials: materials.length, workers: workers.length, movements: movements.length };
        } catch (error) {
            console.error('Error en debug:', error);
            return null;
        }
    }

    /**
     * Configura listeners para cambios en tiempo real
     */
    setupRealtimeListeners() {
        // Listener para materiales
        this.storage.addListener('materials', () => {
            if (this.currentUser) {
                this.loadDashboard();
                if (this.isSectionActive('materiales')) {
                    this.loadMaterialsTable();
                }
            }
        });

        // Listener para movimientos
        this.storage.addListener('movements', () => {
            if (this.currentUser) {
                this.loadDashboard();
                if (this.isSectionActive('movimientos')) {
                    this.loadMovementsTable();
                }
            }
        });

        // Listener para trabajadores
        this.storage.addListener('workers', () => {
            if (this.currentUser) {
                this.loadDropdowns();
                if (this.isAdmin && this.isSectionActive('usuarios')) {
                    this.loadUsersTable();
                }
            }
        });
    }

    /**
     * Verifica si una sección está activa
     */
    isSectionActive(sectionId) {
        const section = document.getElementById(sectionId);
        return section && section.classList.contains('active');
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Login
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('admin-login-form').addEventListener('submit', (e) => this.handleAdminLogin(e));
        document.getElementById('admin-login-btn').addEventListener('click', () => this.showAdminModal());
        
        // Modal buttons
        document.querySelectorAll('.modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal('admin-login-modal'));
        });
        
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });
        
        // Navigation
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('sidebar-logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        // Movement form
        document.getElementById('new-movement-btn').addEventListener('click', () => this.showMovementModal());
        document.getElementById('movement-form').addEventListener('submit', (e) => this.handleMovementSubmit(e));
        document.getElementById('cancel-movement-btn').addEventListener('click', () => this.cancelMovement());
        
        // Search and filters
        document.getElementById('movement-search').addEventListener('input', () => this.filterMovements());
        document.getElementById('movement-filter').addEventListener('change', () => this.filterMovements());
        
        document.getElementById('material-search').addEventListener('input', () => this.filterMaterials());
        document.getElementById('category-filter').addEventListener('change', () => this.filterMaterials());
        
        // Report controls
        document.getElementById('generate-report-btn').addEventListener('click', () => this.generateReport());
        
        // Settings form
        document.getElementById('settings-form').addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        
        // Data actions - NUEVAS FUNCIONALIDADES
        document.getElementById('empty-stock-btn').addEventListener('click', () => this.emptyStock());
        document.getElementById('create-backup-btn').addEventListener('click', () => this.createBackup());
        document.getElementById('restore-backup-btn').addEventListener('click', () => this.restoreBackup());
        document.getElementById('clear-data-btn').addEventListener('click', () => this.clearData());
        
        // Export/Import existentes
        document.getElementById('export-data-btn').addEventListener('click', () => this.exportData());
        document.getElementById('import-data-btn').addEventListener('click', () => this.importData());
        
        // Users management (admin only)
        document.getElementById('add-user-btn').addEventListener('click', () => this.addNewUser());
        
        // Download options
        document.getElementById('export-excel-btn').addEventListener('click', () => this.exportToExcel());
        document.getElementById('export-pdf-btn').addEventListener('click', () => this.exportToPDF());
        
        // Materiales
        document.getElementById('export-materials-pdf-btn').addEventListener('click', () => this.exportMaterialsPDF());
        document.getElementById('new-material-btn').addEventListener('click', () => this.showNewMaterialModal()); // NUEVA FUNCIONALIDAD
        
        // Reportes
        document.getElementById('print-report-btn').addEventListener('click', () => this.printReport());
        document.getElementById('download-pdf-btn').addEventListener('click', () => this.downloadReportPDF());
        document.getElementById('report-type').addEventListener('change', () => this.hideReportActions());
        document.getElementById('report-start-date').addEventListener('change', () => this.hideReportActions());
        document.getElementById('report-end-date').addEventListener('change', () => this.hideReportActions());
        
        // Modal clicks to close - excluding login modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                // Only close modal on outside click for movement modal, not for login modals
                if (e.target === modal && !modal.id.includes('login-modal')) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    /**
     * Muestra estado online
     */
    showOnlineStatus() {
        console.log('🟢 Conexión restaurada - Modo online');
        this.showNotification('Conexión restaurada', 'success');
    }

    /**
     * Muestra estado offline
     */
    showOfflineStatus() {
        console.log('🔴 Sin conexión - Modo offline');
        this.showNotification('Sin conexión - Trabajando offline', 'warning');
    }

    /**
     * Muestra notificación temporal
     */
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Colores según tipo
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'warning') {
            notification.style.backgroundColor = '#f59e0b';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Carga los dropdowns de trabajadores y administradores
     */
    async loadDropdowns() {
        try {
            // Cargar dropdown de trabajadores
            await this.loadWorkerDropdown();
            
            // Cargar dropdown de administradores
            await this.loadAdminDropdown();
            
            console.log('Dropdowns cargados correctamente');
        } catch (error) {
            console.error('Error cargando dropdowns:', error);
        }
    }

    /**
     * Carga el dropdown de trabajadores
     */
    async loadWorkerDropdown() {
        const workerSelect = document.getElementById('worker-select');
        if (!workerSelect) {
            console.error('No se encontró el elemento worker-select');
            return;
        }
        
        try {
            const workers = await this.storage.getWorkers();
            console.log('Debug - loadWorkerDropdown workers:', workers);
            console.log('Debug - loadWorkerDropdown type:', typeof workers);
            console.log('Debug - loadWorkerDropdown is array:', Array.isArray(workers));
            
            // Asegurar que tenemos un array
            if (!Array.isArray(workers)) {
                console.error('Los trabajadores no son un array:', workers);
                return;
            }
            
            console.log('Trabajadores cargados:', workers.length);
            
            // Limpiar opciones existentes
            workerSelect.innerHTML = '<option value="">-- Selecciona tu nombre --</option>';
            
            // Agregar trabajadores activos (no administradores)
            workers
                .filter(worker => worker.status === 'activo' && worker.role === 'trabajador')
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(worker => {
                    const option = document.createElement('option');
                    option.value = worker.name;
                    option.textContent = worker.name;
                    workerSelect.appendChild(option);
                });
            
            console.log('Dropdown de trabajadores cargado con', workerSelect.options.length - 1, 'trabajadores');
            
        } catch (error) {
            console.error('Error cargando dropdown de trabajadores:', error);
        }
    }

    /**
     * Carga el dropdown de administradores
     */
    async loadAdminDropdown() {
        const adminSelect = document.getElementById('admin-select');
        if (!adminSelect) {
            console.error('No se encontró el elemento admin-select');
            return;
        }
        
        try {
            const workers = await this.storage.getWorkers();
            
            // Asegurar que tenemos un array
            if (!Array.isArray(workers)) {
                console.error('Los trabajadores no son un array en loadAdminDropdown:', workers);
                return;
            }
            
            // Limpiar opciones existentes
            adminSelect.innerHTML = '<option value="">-- Selecciona tu nombre --</option>';
            
            // Agregar administradores activos
            workers
                .filter(worker => worker.status === 'activo' && worker.role === 'administrador')
                .sort((a, b) => a.name.localeCompare(b.name))
                .forEach(worker => {
                    const option = document.createElement('option');
                    option.value = worker.name;
                    option.textContent = worker.name;
                    adminSelect.appendChild(option);
                });
                
            console.log('Dropdown de administradores cargado con', adminSelect.options.length - 1, 'administradores');
            
        } catch (error) {
            console.error('Error cargando dropdown de administradores:', error);
        }
    }

    /**
     * Muestra el modal de login
     */
    showLoginModal() {
        document.getElementById('login-modal').style.display = 'flex';
        console.log('Modal de login mostrado');
    }

    /**
     * Muestra el modal de administrador
     */
    showAdminModal() {
        this.closeModal('login-modal');
        document.getElementById('admin-login-modal').style.display = 'flex';
    }

    /**
     * Maneja el login de trabajador
     */
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
            
            // Establecer usuario en storage para validaciones
            this.storage.setCurrentUser(worker, false);
            
            this.closeModal('login-modal');
            this.enterApplication();
            
            console.log('Login de trabajador exitoso:', worker.name);
            
        } catch (error) {
            console.error('Error en login:', error);
            alert('Error al iniciar sesión. Inténtalo de nuevo.');
        }
    }

    /**
     * Maneja el login de administrador
     */
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
            
            // Establecer usuario en storage para validaciones
            this.storage.setCurrentUser(admin, true);
            
            this.closeModal('admin-login-modal');
            this.enterApplication();
            
            console.log('Login de administrador exitoso:', admin.name);
            
        } catch (error) {
            console.error('Error en login admin:', error);
            alert('Error al iniciar sesión como administrador. Inténtalo de nuevo.');
        }
    }

    /**
     * Entra a la aplicación después del login exitoso
     */
    enterApplication() {
        // Ocultar modal de login y mostrar aplicación
        document.getElementById('app').style.display = 'flex';
        
        // Actualizar información del usuario
        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = this.currentUser.role === 'administrador' ? 'Administrador' : 'Trabajador';
        
        // Control de acceso - Workers solo ven Dashboard/Movimientos/Materiales
        this.applyAccessControl();
        
        // Mostrar elementos de admin si es admin
        if (this.isAdmin) {
            document.querySelectorAll('.admin-only').forEach(el => {
                el.style.display = 'block';
            });
        }
        
        // Cargar datos iniciales
        this.loadDashboard();
        this.loadMovementsTable();
        this.loadMaterialsTable();
        
        // Actualizar fecha y hora
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
        
        console.log('Usuario entró a la aplicación:', this.currentUser.name);
    }

    /**
     * Aplica control de acceso basado en rol
     */
    applyAccessControl() {
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const menuItems = sidebarMenu.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const section = item.getAttribute('data-section');
            
            // Si es trabajador, ocultar secciones de admin
            if (!this.isAdmin) {
                if (['reportes', 'configuracion', 'usuarios'].includes(section)) {
                    item.style.display = 'none';
                }
            }
        });
        
        // Ocultar botón de nuevo material si no es admin
        const newMaterialBtn = document.getElementById('new-material-btn');
        if (newMaterialBtn) {
            newMaterialBtn.style.display = this.isAdmin ? 'block' : 'none';
        }
    }

    /**
     * Cierra un modal
     */
    closeModal(modalId) {
        if (typeof modalId === 'string') {
            document.getElementById(modalId).style.display = 'none';
        } else {
            modalId.style.display = 'none';
        }
    }

    /**
     * Actualiza fecha y hora
     */
    updateDateTime() {
        const now = new Date();
        document.getElementById('current-datetime').textContent = now.toLocaleString('es-ES');
    }

    /**
     * Oculta la pantalla de carga
     */
    hideLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'none';
    }

    /**
     * Navega a una sección
     */
    async navigateToSection(sectionId) {
        // Verificar permisos antes de permitir navegación
        if (!this.isAdmin && ['reportes', 'configuracion', 'usuarios'].includes(sectionId)) {
            alert('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
            return;
        }
        
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        document.getElementById(sectionId).classList.add('active');
        
        // Actualizar menú activo
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        // Cargar datos específicos de la sección
        switch (sectionId) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'movimientos':
                await this.loadMovementsTable();
                break;
            case 'materiales':
                await this.loadMaterialsTable();
                break;
            case 'usuarios':
                if (this.isAdmin) {
                    await this.loadUsersTable();
                }
                break;
        }
    }

    /**
     * Carga los datos del dashboard
     */
    async loadDashboard() {
        const materials = await this.storage.getMaterials();
        const movements = await this.storage.getMovements();
        const workers = await this.storage.getWorkers();
        
        // Calcular estadísticas
        const today = new Date().toDateString();
        const todayMovements = movements.filter(m => new Date(m.date).toDateString() === today);
        const lowStock = materials.filter(m => m.stock <= m.minStock);
        
        // Actualizar elementos del dashboard
        document.getElementById('total-materials').textContent = materials.length;
        document.getElementById('total-movements').textContent = todayMovements.length;
        document.getElementById('low-stock').textContent = lowStock.length;
        
        // Solo mostrar trabajadores activos para administradores
        const activeWorkersElement = document.getElementById('active-workers');
        if (this.isAdmin) {
            activeWorkersElement.textContent = workers.filter(w => w.status === 'activo').length;
            activeWorkersElement.parentElement.parentElement.style.display = 'block';
        } else {
            // Ocultar el bloque de trabajadores activos para trabajadores
            activeWorkersElement.parentElement.parentElement.style.display = 'none';
        }
        
        // Hacer bloques clickeables para mostrar detalles
        this.setupDashboardClickHandlers();
    }

    /**
     * Configura los manejadores de clic para los bloques del dashboard
     */
    setupDashboardClickHandlers() {
        const dashboardCards = document.querySelectorAll('.dashboard-card');
        
        dashboardCards.forEach((card, index) => {
            if (index === 0 && this.isAdmin) {
                // Total materiales - va a materiales
                card.style.cursor = 'pointer';
                card.onclick = () => this.navigateToSection('materiales');
            } else if (index === 1) {
                // Total movimientos - va a movimientos
                card.style.cursor = 'pointer';
                card.onclick = () => this.navigateToSection('movimientos');
            } else if (index === 2) {
                // Stock bajo - muestra detalles
                card.style.cursor = 'pointer';
                card.onclick = () => this.showLowStockDetails();
            } else if (index === 3 && this.isAdmin) {
                // Trabajadores activos - muestra detalles
                card.style.cursor = 'pointer';
                card.onclick = () => this.showWorkersDetails();
            }
        });
    }

    /**
     * Muestra detalles de stock bajo
     */
    async showLowStockDetails() {
        const materials = await this.storage.getMaterials();
        const lowStock = materials.filter(m => m.stock <= m.minStock);
        
        if (lowStock.length === 0) {
            alert('No hay materiales con stock bajo');
            return;
        }
        
        let message = 'Materiales con stock bajo:\n\n';
        lowStock.forEach(material => {
            message += `${material.code} - ${material.name}\n`;
            message += `Stock actual: ${material.stock} ${material.unit}\n`;
            message += `Stock mínimo: ${material.minStock} ${material.unit}\n\n`;
        });
        
        alert(message);
    }

    /**
     * Muestra detalles de trabajadores
     */
    async showWorkersDetails() {
        if (!this.isAdmin) return;
        
        const workers = await this.storage.getWorkers();
        const activeWorkers = workers.filter(w => w.status === 'activo');
        
        let message = `Trabajadores activos (${activeWorkers.length}):\n\n`;
        activeWorkers.forEach(worker => {
            message += `${worker.name} (${worker.role})\n`;
        });
        
        alert(message);
    }

    /**
     * Carga la tabla de movimientos
     */
    async loadMovementsTable() {
        const movements = await this.storage.getMovements();
        const tbody = document.getElementById('movements-tbody');
        
        tbody.innerHTML = '';
        
        movements.slice().reverse().forEach(movement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(movement.date).toLocaleDateString('es-ES')}</td>
                <td>${movement.materialName}</td>
                <td><span class="badge badge-${movement.type}">${movement.type}</span></td>
                <td>${movement.quantity}</td>
                <td>${movement.userName}</td>
                <td>${movement.observations || '-'}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Carga la tabla de materiales
     */
    async loadMaterialsTable() {
        const materials = await this.storage.getMaterials();
        const tbody = document.getElementById('materials-tbody');
        
        tbody.innerHTML = '';
        
        materials.forEach(material => {
            const status = material.stock <= material.minStock ? 'bajo' : 'normal';
            const canEdit = this.isAdmin;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${material.code}</td>
                <td>${material.name}</td>
                <td>${material.category}</td>
                <td>${material.stock} ${material.unit}</td>
                <td>${material.minStock} ${material.unit}</td>
                <td><span class="badge badge-${status}">${status}</span></td>
                <td>
                    ${canEdit ? `<button class="btn-small btn-edit" data-code="${material.code}">✏️ Editar</button>` : ''}
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Agregar event listeners para botones de editar
        if (this.isAdmin) {
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const materialCode = e.target.getAttribute('data-code');
                    this.editMaterial(materialCode);
                });
            });
        }
    }

    /**
     * NUEVA FUNCIONALIDAD: Muestra modal para agregar nuevo material
     */
    showNewMaterialModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>➕ Nuevo Material</h2>
                    <span class="close">&times;</span>
                </div>
                <form id="new-material-form">
                    <div class="form-group">
                        <label for="material-code">Código:</label>
                        <input type="text" id="material-code" required placeholder="Ej: 301001J">
                    </div>
                    <div class="form-group">
                        <label for="material-name">Nombre:</label>
                        <input type="text" id="material-name" required placeholder="Nombre del material">
                    </div>
                    <div class="form-group">
                        <label for="material-description">Descripción:</label>
                        <textarea id="material-description" rows="3" placeholder="Descripción del material"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="material-category">Categoría:</label>
                        <select id="material-category" required>
                            <option value="">-- Selecciona categoría --</option>
                            <option value="cables">Cables</option>
                            <option value="repartidores">Repartidores</option>
                            <option value="conectores">Conectores</option>
                            <option value="menudo">Material Menudo</option>
                            <option value="herramientas">Herramientas</option>
                            <option value="equipos">Equipos</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="material-stock">Stock Inicial:</label>
                        <input type="number" id="material-stock" min="0" required value="0">
                    </div>
                    <div class="form-group">
                        <label for="material-min-stock">Stock Mínimo:</label>
                        <input type="number" id="material-min-stock" min="0" required value="10">
                    </div>
                    <div class="form-group">
                        <label for="material-unit">Unidad:</label>
                        <input type="text" id="material-unit" required placeholder="metros, unidades, paquetes...">
                    </div>
                    <div class="form-group">
                        <label for="material-notes">Notas:</label>
                        <textarea id="material-notes" rows="2" placeholder="Notas adicionales (opcional)"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancelar</button>
                        <button type="submit" class="btn btn-primary">💾 Crear Material</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Event listeners para el modal
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#new-material-form');
        
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const code = document.getElementById('material-code').value;
            const name = document.getElementById('material-name').value;
            const description = document.getElementById('material-description').value;
            const category = document.getElementById('material-category').value;
            const stock = parseInt(document.getElementById('material-stock').value);
            const minStock = parseInt(document.getElementById('material-min-stock').value);
            const unit = document.getElementById('material-unit').value;
            const notes = document.getElementById('material-notes').value;
            
            if (stock < 0 || minStock < 0) {
                alert('El stock no puede ser negativo');
                return;
            }
            
            if (minStock > stock) {
                alert('El stock mínimo no puede ser mayor que el stock inicial');
                return;
            }
            
            // Verificar que el código no exista
            const existingMaterial = await this.storage.getMaterialByCode(code);
            if (existingMaterial) {
                alert('Ya existe un material con ese código');
                return;
            }
            
            const newMaterial = {
                code: code.trim(),
                name: name.trim(),
                description: description.trim(),
                category: category,
                stock: stock,
                minStock: minStock,
                unit: unit.trim(),
                notes: notes.trim()
            };
            
            try {
                await this.storage.addMaterial(newMaterial);
                
                // Recargar tabla
                await this.loadMaterialsTable();
                await this.loadDashboard();
                
                alert('Material creado correctamente');
                closeModal();
            } catch (error) {
                console.error('Error creando material:', error);
                alert('Error al crear el material: ' + error.message);
            }
        });
    }

    /**
     * Filtra movimientos
     */
    filterMovements() {
        const search = document.getElementById('movement-search').value.toLowerCase();
        const typeFilter = document.getElementById('movement-filter').value;
        
        const rows = document.querySelectorAll('#movements-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const type = row.querySelector('td:nth-child(3)').textContent;
            
            const matchesSearch = text.includes(search);
            const matchesType = !typeFilter || type.includes(typeFilter);
            
            row.style.display = (matchesSearch && matchesType) ? '' : 'none';
        });
    }

    /**
     * Filtra materiales
     */
    filterMaterials() {
        const search = document.getElementById('material-search').value.toLowerCase();
        const categoryFilter = document.getElementById('category-filter').value;
        
        const rows = document.querySelectorAll('#materials-tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const category = row.querySelector('td:nth-child(3)').textContent;
            
            const matchesSearch = text.includes(search);
            const matchesCategory = !categoryFilter || category === categoryFilter;
            
            row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
        });
    }

    /**
     * Muestra el modal de nuevo movimiento
     */
    async showMovementModal() {
        // Cargar materiales en el select
        const materialSelect = document.getElementById('movement-material');
        materialSelect.innerHTML = '<option value="">-- Selecciona un material --</option>';
        
        const materials = await this.storage.getMaterials();
        materials.forEach(material => {
            const option = document.createElement('option');
            option.value = material.code;
            option.textContent = `${material.code} - ${material.name}`;
            materialSelect.appendChild(option);
        });
        
        document.getElementById('movement-modal').style.display = 'flex';
    }

    /**
     * Maneja el envío del formulario de movimiento
     */
    async handleMovementSubmit(e) {
        e.preventDefault();
        
        const materialCode = document.getElementById('movement-material').value;
        const type = document.getElementById('movement-type').value;
        const quantity = parseInt(document.getElementById('movement-quantity').value);
        const observations = document.getElementById('movement-observations').value;
        
        if (!materialCode || !type || !quantity) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        try {
            const material = await this.storage.getMaterialByCode(materialCode);
            if (!material) {
                alert('Material no encontrado');
                return;
            }
            
            // Crear movimiento
            const movement = {
                id: Date.now(),
                date: new Date().toISOString(),
                materialCode: materialCode,
                materialName: material.name,
                type: type,
                quantity: quantity,
                userId: this.currentUser.id,
                userName: this.currentUser.name,
                observations: observations
            };
            
            // Guardar movimiento
            await this.storage.addMovement(movement);
            
            // Actualizar stock del material
            let newStock = material.stock;
            if (type === 'entrada') {
                newStock += quantity;
            } else if (type === 'salida') {
                newStock -= quantity;
            } else if (type === 'ajuste') {
                newStock = quantity;
            }
            
            if (newStock < 0) {
                alert('El stock no puede ser negativo');
                return;
            }
            
            const updatedMaterial = {
                ...material,
                stock: newStock
            };
            
            await this.storage.updateMaterial(materialCode, updatedMaterial);
            
            // Cerrar modal y recargar datos
            this.closeModal('movement-modal');
            await this.loadMovementsTable();
            await this.loadDashboard();
            await this.loadMaterialsTable();
            
            alert('Movimiento registrado correctamente');
            
            // Limpiar formulario
            document.getElementById('movement-form').reset();
            
        } catch (error) {
            console.error('Error registrando movimiento:', error);
            alert('Error al registrar el movimiento: ' + error.message);
        }
    }

    /**
     * Cancelar movimiento y cerrar modal
     */
    cancelMovement() {
        this.closeModal('movement-modal');
        document.getElementById('movement-form').reset();
    }

    /**
     * Editar material
     */
    async editMaterial(materialCode) {
        const material = await this.storage.getMaterialByCode(materialCode);
        if (!material) {
            alert('Material no encontrado');
            return;
        }
        
        // Crear modal dinámico
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Editar Material: ${material.name}</h2>
                    <span class="close">&times;</span>
                </div>
                <form id="edit-material-form">
                    <div class="form-group">
                        <label for="edit-stock">Stock Actual:</label>
                        <input type="number" id="edit-stock" value="${material.stock}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-min-stock">Stock Mínimo:</label>
                        <input type="number" id="edit-min-stock" value="${material.minStock}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-notes">Notas:</label>
                        <textarea id="edit-notes" rows="3">${material.notes || ''}</textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancelar</button>
                        <button type="submit" class="btn btn-primary">💾 Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Event listeners para el modal
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#edit-material-form');
        
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const stock = parseInt(document.getElementById('edit-stock').value);
            const minStock = parseInt(document.getElementById('edit-min-stock').value);
            const notes = document.getElementById('edit-notes').value;
            
            if (stock < 0 || minStock < 0) {
                alert('El stock no puede ser negativo');
                return;
            }
            
            try {
                // Actualizar material
                const updatedMaterial = {
                    ...material,
                    stock: stock,
                    minStock: minStock,
                    notes: notes
                };
                
                await this.storage.updateMaterial(materialCode, updatedMaterial);
                
                // Recargar tabla
                await this.loadMaterialsTable();
                await this.loadDashboard();
                
                alert('Material actualizado correctamente');
                closeModal();
            } catch (error) {
                console.error('Error actualizando material:', error);
                alert('Error al actualizar el material: ' + error.message);
            }
        });
    }

    /**
     * NUEVA FUNCIONALIDAD: Vaciar todo el stock
     */
    async emptyStock() {
        if (!this.isAdmin) {
            alert('Solo los administradores pueden vaciar el stock');
            return;
        }
        
        if (!confirm('⚠️ ¿Estás seguro de que quieres vaciar TODO el stock? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            await this.storage.emptyStock();
            await this.loadMaterialsTable();
            await this.loadDashboard();
            
            alert('✅ Todo el stock ha sido vaciado correctamente');
        } catch (error) {
            console.error('Error vaciando stock:', error);
            alert('❌ Error al vaciar el stock: ' + error.message);
        }
    }

    /**
     * NUEVA FUNCIONALIDAD: Crear backup
     */
    async createBackup() {
        if (!this.isAdmin) {
            alert('Solo los administradores pueden crear backups');
            return;
        }
        
        try {
            const backupData = await this.storage.createBackup();
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fibra_optica_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert('✅ Backup creado y descargado correctamente');
        } catch (error) {
            console.error('Error creando backup:', error);
            alert('❌ Error al crear el backup: ' + error.message);
        }
    }

    /**
     * NUEVA FUNCIONALIDAD: Restaurar backup
     */
    async restoreBackup() {
        if (!this.isAdmin) {
            alert('Solo los administradores pueden restaurar backups');
            return;
        }
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!confirm('⚠️ ¿Estás seguro de que quieres restaurar este backup? Se perderán todos los datos actuales.')) {
                return;
            }
            
            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const data = e.target.result;
                    await this.storage.restoreBackup(data);
                    
                    // Recargar toda la aplicación
                    await this.loadAllData();
                    
                    alert('✅ Backup restaurado correctamente. La página se recargará.');
                    location.reload();
                };
                reader.readAsText(file);
            } catch (error) {
                console.error('Error restaurando backup:', error);
                alert('❌ Error al restaurar el backup: ' + error.message);
            }
        };
        
        input.click();
    }

    /**
     * NUEVA FUNCIONALIDAD: Limpiar datos
     */
    async clearData() {
        if (!this.isAdmin) {
            alert('Solo los administradores pueden limpiar los datos');
            return;
        }
        
        if (!confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            await this.storage.clearAll();
            alert('✅ Todos los datos han sido limpiados correctamente. La página se recargará.');
            location.reload();
        } catch (error) {
            console.error('Error limpiando datos:', error);
            alert('❌ Error al limpiar los datos: ' + error.message);
        }
    }

    /**
     * Carga todos los datos (para usar después de restaurar backup)
     */
    async loadAllData() {
        await Promise.all([
            this.loadDashboard(),
            this.loadMovementsTable(),
            this.loadMaterialsTable(),
            this.loadDropdowns()
        ]);
    }

    /**
     * Módulo de usuarios - Gestión completa
     */
    async loadUsersTable() {
        if (!this.isAdmin) return;
        
        const workers = await this.storage.getWorkers();
        const tbody = document.getElementById('users-tbody');
        
        tbody.innerHTML = '';
        
        workers.forEach(worker => {
            const isActive = worker.status === 'activo';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${worker.name}</td>
                <td>${worker.role}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox" ${isActive ? 'checked' : ''} data-user-id="${worker.id}">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <button class="btn-small btn-change-password" data-user-id="${worker.id}">🔑 Cambiar Contraseña</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Event listeners para switches de activar/desactivar
        document.querySelectorAll('.switch input').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const userId = e.target.getAttribute('data-user-id');
                const isActive = e.target.checked;
                await this.toggleUserStatus(userId, isActive);
            });
        });
        
        // Event listeners para botones de cambiar contraseña
        document.querySelectorAll('.btn-change-password').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const userId = e.target.getAttribute('data-user-id');
                await this.changeUserPassword(userId);
            });
        });
    }

    /**
     * Activar/desactivar usuario
     */
    async toggleUserStatus(userId, isActive) {
        const workers = await this.storage.getWorkers();
        const workerIndex = workers.findIndex(w => w.id === userId);
        
        if (workerIndex !== -1) {
            workers[workerIndex].status = isActive ? 'activo' : 'inactivo';
            await this.storage.setItem('workers', workers);
            
            // Si se desactivó al usuario actual, hacer logout
            if (this.currentUser.id === userId && !isActive) {
                alert('Tu cuenta ha sido desactivada. Serás desconectado.');
                this.logout();
                return;
            }
            
            // Recargar dropdowns si es necesario
            await this.loadDropdowns();
            
            alert(`Usuario ${isActive ? 'activado' : 'desactivado'} correctamente`);
        }
    }

    /**
     * Cambiar contraseña de usuario
     */
    async changeUserPassword(userId) {
        const workers = await this.storage.getWorkers();
        const worker = workers.find(w => w.id === userId);
        
        if (!worker) {
            alert('Usuario no encontrado');
            return;
        }
        
        const newPassword = prompt(`Nueva contraseña para ${worker.name}:`);
        if (newPassword && newPassword.trim()) {
            worker.password = newPassword.trim();
            await this.storage.setItem('workers', workers);
            alert('Contraseña actualizada correctamente');
        }
    }

    /**
     * Agregar nuevo usuario
     */
    async addNewUser() {
        const name = prompt('Nombre del nuevo usuario:');
        if (!name || !name.trim()) return;
        
        const role = prompt('Rol (trabajador/administrador):', 'trabajador');
        if (!role || !['trabajador', 'administrador'].includes(role.toLowerCase())) {
            alert('Rol inválido. Debe ser "trabajador" o "administrador"');
            return;
        }
        
        const password = prompt('Contraseña inicial:', '1234');
        if (!password || !password.trim()) return;
        
        const workers = await this.storage.getWorkers();
        const userId = `${role.toUpperCase()}${String(workers.length + 1).padStart(3, '0')}`;
        
        const newWorker = {
            id: userId,
            code: userId,
            name: name.trim(),
            email: `${name.toLowerCase().replace(' ', '.')}@empresa.com`,
            phone: '',
            role: role.toLowerCase(),
            status: 'activo',
            registrationDate: new Date().toISOString().split('T')[0],
            notes: `Usuario creado el ${new Date().toLocaleDateString('es-ES')}`,
            password: password.trim()
        };
        
        await this.storage.addWorker(newWorker);
        
        await this.loadUsersTable();
        await this.loadDropdowns();
        
        alert(`Usuario ${name} creado correctamente con ID: ${userId}`);
    }

    /**
     * Generar reporte
     */
    async generateReport() {
        const reportType = document.getElementById('report-type').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (!startDate || !endDate) {
            alert('Por favor selecciona las fechas de inicio y fin');
            return;
        }
        
        const reportContent = document.getElementById('report-content');
        let html = '';
        
        switch (reportType) {
            case 'movements':
                html = await this.generateMovementsReport(startDate, endDate);
                break;
            case 'materials':
                html = await this.generateMaterialsReport();
                break;
            case 'workers':
                html = await this.generateWorkersReport(startDate, endDate);
                break;
        }
        
        reportContent.innerHTML = html;
        
        // Mostrar botones de acciones del reporte
        document.getElementById('report-actions').style.display = 'flex';
    }

    /**
     * Generar reporte de movimientos
     */
    async generateMovementsReport(startDate, endDate) {
        const movements = await this.storage.getMovementsByDateRange(startDate, endDate);
        
        let html = `
            <h3>📋 Reporte de Movimientos</h3>
            <p><strong>Período:</strong> ${startDate} al ${endDate}</p>
            <p><strong>Total de movimientos:</strong> ${movements.length}</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Material</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        movements.forEach(movement => {
            html += `
                <tr>
                    <td>${new Date(movement.date).toLocaleDateString('es-ES')}</td>
                    <td>${movement.materialName}</td>
                    <td><span class="badge badge-${movement.type}">${movement.type}</span></td>
                    <td>${movement.quantity}</td>
                    <td>${movement.userName}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }

    /**
     * Generar reporte de materiales
     */
    async generateMaterialsReport() {
        const materials = await this.storage.getMaterials();
        const lowStock = await this.storage.getLowStockMaterials();
        
        let html = `
            <h3>📦 Estado de Materiales</h3>
            <p><strong>Total de materiales:</strong> ${materials.length}</p>
            <p><strong>Materiales con stock bajo:</strong> ${lowStock.length}</p>
            
            <h4>📦 Materiales con Stock Bajo</h4>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Material</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        lowStock.forEach(material => {
            html += `
                <tr>
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td>${material.stock} ${material.unit}</td>
                    <td>${material.minStock} ${material.unit}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }

    /**
     * Generar reporte de trabajadores
     */
    async generateWorkersReport(startDate, endDate) {
        const movements = await this.storage.getMovementsByDateRange(startDate, endDate);
        const workerStats = {};
        
        movements.forEach(movement => {
            if (!workerStats[movement.userName]) {
                workerStats[movement.userName] = {
                    name: movement.userName,
                    movements: 0,
                    totalQuantity: 0
                };
            }
            workerStats[movement.userName].movements++;
            workerStats[movement.userName].totalQuantity += movement.quantity;
        });
        
        let html = `
            <h3>👥 Rendimiento de Trabajadores</h3>
            <p><strong>Período:</strong> ${startDate} al ${endDate}</p>
            <p><strong>Trabajadores activos:</strong> ${Object.keys(workerStats).length}</p>
            
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Trabajador</th>
                        <th>Total Movimientos</th>
                        <th>Cantidad Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.values(workerStats).forEach(stat => {
            html += `
                <tr>
                    <td>${stat.name}</td>
                    <td>${stat.movements}</td>
                    <td>${stat.totalQuantity}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }

    /**
     * Exportar listado de materiales a PDF
     */
    async exportMaterialsPDF() {
        const materials = await this.storage.getMaterials();
        const materialsTable = document.getElementById('materials-table').cloneNode(true);
        
        // Crear contenido HTML para el PDF
        const htmlContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1>Listado de Materiales - Fibra Óptica</h1>
                <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            ${materialsTable.outerHTML}
        `;
        
        // Usar window.print para PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Listado de Materiales</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        h1 { color: #2196F3; border-bottom: 2px solid #2196F3; }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Imprimir reporte actual
     */
    printReport() {
        const reportContent = document.getElementById('report-content');
        if (reportContent.children.length === 0 || reportContent.children[0].classList.contains('report-placeholder')) {
            alert('Primero genera un reporte');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reporte Fibra Óptica</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    .report-header { text-align: center; margin-bottom: 20px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>Reporte Fibra Óptica</h1>
                    <p>Fecha: ${new Date().toLocaleDateString('es-ES')}</p>
                </div>
                ${reportContent.innerHTML}
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Descargar reporte actual como PDF
     */
    downloadReportPDF() {
        const reportContent = document.getElementById('report-content');
        if (reportContent.children.length === 0 || reportContent.children[0].classList.contains('report-placeholder')) {
            alert('Primero genera un reporte');
            return;
        }
        
        const reportType = document.getElementById('report-type').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        const dateRange = startDate && endDate ? `${startDate} al ${endDate}` : 'Todas las fechas';
        const reportName = `reporte_${reportType}_${dateRange}.pdf`.replace(/\//g, '_');
        
        const htmlContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1>Reporte de ${this.getReportTypeName(reportType)}</h1>
                <p>Período: ${dateRange}</p>
                <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            ${reportContent.innerHTML}
        `;
        
        // Usar window.print para generar PDF
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${reportName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        h1 { color: #2196F3; border-bottom: 2px solid #2196F3; }
                    </style>
                </head>
                <body>
                    ${htmlContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Obtener nombre legible del tipo de reporte
     */
    getReportTypeName(reportType) {
        const names = {
            'movements': 'Movimientos',
            'materials': 'Estado de Materiales',
            'workers': 'Rendimiento de Trabajadores'
        };
        return names[reportType] || reportType;
    }

    /**
     * Ocultar botones de acciones del reporte
     */
    hideReportActions() {
        document.getElementById('report-actions').style.display = 'none';
    }

    /**
     * Manejar envío de configuración
     */
    async handleSettingsSubmit(e) {
        e.preventDefault();
        
        const settings = {
            companyName: document.getElementById('company-name').value,
            lowStockThreshold: parseInt(document.getElementById('notification-threshold').value),
            autoBackup: document.getElementById('auto-backup').value === 'true'
        };
        
        try {
            await this.storage.updateSettings(settings);
            alert('✅ Configuración guardada correctamente');
        } catch (error) {
            console.error('Error guardando configuración:', error);
            alert('❌ Error al guardar la configuración');
        }
    }

    /**
     * Exportar datos
     */
    async exportData() {
        try {
            const data = await this.storage.createBackup();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fibra_optica_backup_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert('✅ Datos exportados correctamente');
        } catch (error) {
            alert('❌ Error al exportar datos: ' + error.message);
        }
    }

    /**
     * Importar datos
     */
    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = e.target.result;
                    await this.storage.restoreBackup(data);
                    alert('✅ Datos importados correctamente. Recarga la página para ver los cambios.');
                    location.reload();
                } catch (error) {
                    alert('❌ Error al procesar el archivo: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    /**
     * Exportar datos a Excel
     */
    async exportToExcel() {
        const materials = await this.storage.getMaterials();
        const movements = await this.storage.getMovements();
        
        let csv = '=== REPORTE DE MATERIALES ===\n';
        csv += 'Código,Nombre,Categoría,Stock Actual,Stock Mínimo,Unidad,Estado\n';
        
        materials.forEach(material => {
            const status = material.stock <= material.minStock ? 'Stock Bajo' : 'Normal';
            csv += `"${material.code}","${material.name}","${material.category}",${material.stock},${material.minStock},"${material.unit}","${status}"\n`;
        });
        
        csv += '\n=== REPORTE DE MOVIMIENTOS ===\n';
        csv += 'Fecha,Material,Código,Trabajador,Tipo,Cantidad,Observaciones\n';
        
        movements.forEach(movement => {
            const date = new Date(movement.date).toLocaleDateString('es-ES');
            csv += `"${date}","${movement.materialName}","${movement.materialCode}","${movement.userName}","${movement.type}",${movement.quantity},"${movement.observations || ''}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_completo_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    /**
     * Exportar datos a PDF
     */
    async exportToPDF() {
        const materials = await this.storage.getMaterials();
        const movements = await this.storage.getMovements();
        
        let reportContent = `
            <h1>Reporte Completo - Control de Materiales Fibra Óptica</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>Generado por:</strong> ${this.currentUser.name}</p>
            
            <h2>Resumen de Materiales (${materials.length})</h2>
            <table border="1" style="width:100%; border-collapse:collapse;">
                <tr style="background-color:#f2f2f2;">
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Stock Mín</th>
                    <th>Estado</th>
                </tr>
        `;
        
        materials.forEach(material => {
            const status = material.stock <= material.minStock ? 'BAJO' : 'OK';
            const bgColor = material.stock <= material.minStock ? '#ffebee' : '#f1f8e9';
            reportContent += `
                <tr style="background-color:${bgColor};">
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td>${material.category}</td>
                    <td>${material.stock} ${material.unit}</td>
                    <td>${material.minStock} ${material.unit}</td>
                    <td><strong>${status}</strong></td>
                </tr>
            `;
        });
        
        reportContent += `
            </table>
            
            <h2>Movimientos Recientes (${movements.length})</h2>
            <table border="1" style="width:100%; border-collapse:collapse;">
                <tr style="background-color:#f2f2f2;">
                    <th>Fecha</th>
                    <th>Material</th>
                    <th>Trabajador</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                </tr>
        `;
        
        movements.slice(-50).forEach(movement => {
            const date = new Date(movement.date).toLocaleDateString('es-ES');
            const bgColor = movement.type === 'salida' ? '#ffebee' : '#e8f5e8';
            reportContent += `
                <tr style="background-color:${bgColor};">
                    <td>${date}</td>
                    <td>${movement.materialName}</td>
                    <td>${movement.userName}</td>
                    <td>${movement.type.toUpperCase()}</td>
                    <td>${movement.quantity}</td>
                </tr>
            `;
        });
        
        reportContent += '</table>';
        
        // Crear ventana de impresión
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Reporte Completo - Fibra Óptica</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #2196F3; border-bottom: 2px solid #2196F3; }
                        h2 { color: #4CAF50; margin-top: 30px; }
                        table { margin: 10px 0; }
                        th { padding: 8px; text-align: left; }
                        td { padding: 8px; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${reportContent}
                    <div class="no-print" style="margin-top: 30px;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            🖨️ Imprimir / Guardar como PDF
                        </button>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 400px;">
                <div class="modal-header">
                    <h2>🚪 Cerrar Sesión</h2>
                </div>
                <div style="padding: 20px;">
                    <p>¿Estás seguro de que quieres cerrar sesión?</p>
                    <p style="color: #666; font-size: 14px;">Sesión actual: <strong>${this.currentUser.name}</strong></p>
                    <div style="margin-top: 20px;">
                        <button id="confirm-logout" class="btn-primary" style="background: #f44336; margin-right: 10px;">Sí, Cerrar Sesión</button>
                        <button id="cancel-logout" class="btn-secondary">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        document.getElementById('confirm-logout').onclick = () => {
            // Limpiar usuario actual
            this.currentUser = null;
            this.isAdmin = false;
            
            // Limpiar storage
            this.storage.setCurrentUser(null, false);
            
            // Mostrar modal de login
            document.getElementById('app').style.display = 'none';
            this.showLoginModal();
            
            // Remover modal
            document.body.removeChild(modal);
            
            console.log('Usuario cerró sesión');
        };
        
        document.getElementById('cancel-logout').onclick = () => {
            document.body.removeChild(modal);
        };
        
        // Cerrar modal al hacer clic fuera
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando aplicación online...');
    
    // Crear instancia global de la aplicación
    window.app = new FibraOpticaApp();
    
    console.log('Aplicación online lista para usar');
});