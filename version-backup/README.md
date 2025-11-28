# Control de Material - Fibra Óptica Online

Sistema de gestión de stock de materiales de fibra óptica con sincronización en tiempo real usando Firebase Realtime Database.

## 🚀 Características Principales

### ✅ Funcionalidades Existentes Mantenidas
- **Sistema de Login**: Trabajadores y administradores con diferentes niveles de acceso
- **Control de Stock**: Gestión completa de materiales predefinidos
- **Registro de Movimientos**: Entrada, salida y ajuste de materiales
- **Dashboard**: Estadísticas en tiempo real
- **Reportes**: Generación de reportes de movimientos, materiales y trabajadores
- **Gestión de Usuarios**: Solo para administradores
- **Sistema de Backup**: Exportar/importar datos

### 🆕 Nuevas Funcionalidades Agregadas

#### 1. 🗑️ Vaciar Stock (Solo Administrador)
- Botón rojo que pone todo el stock en 0
- Confirmación antes de ejecutar
- Registro automático del movimiento

#### 2. 💾 Crear Backup (Solo Administrador)
- Descarga archivo JSON con todos los datos
- Incluye metadatos de fecha y versión
- Funcionalidad de exportación mejorada

#### 3. 📂 Restaurar Backup (Solo Administrador)
- Importa archivo JSON de backup
- Validación de formato
- Confirmación antes de sobrescribir datos

#### 4. 🔐 Control de Acceso Mejorado
- **Trabajadores**: Solo pueden ver Dashboard, Movimientos y Materiales
- **Administradores**: Acceso completo a todas las secciones
- Navegación dinámica según el rol

#### 5. 🧹 Limpiar Datos (Solo Administrador)
- Resetea a datos por defecto
- Mantiene usuarios y configuración inicial
- Confirmación de seguridad

#### 6. ➕ Nuevo Material (Funcionalidad Reparada)
- Botón "+nuevo material" ahora funcional
- Formulario completo para crear materiales
- Validación de código único
- Categorización mejorada

## 🔧 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **Autenticación**: Firebase Auth
- **Sincronización**: Tiempo real entre dispositivos
- **Responsive**: Mobile-first design

## 📱 Compatibilidad

- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Tablet**: iPad, Android tablets
- ✅ **Mobile**: iOS Safari, Android Chrome
- ✅ **Responsive**: Se adapta a cualquier tamaño de pantalla

## 🔥 Funcionalidades Online

### Sincronización en Tiempo Real
- Los cambios se reflejan instantáneamente en todos los dispositivos
- Estado online/offline con fallback a localStorage
- Notificaciones de estado de conexión

### Acceso Multi-dispositivo
- Misma aplicación accesible desde cualquier dispositivo
- Datos centralizados en Firebase
- Sesiones persistentes

## 👥 Usuarios Predefinidos

### Administradores
- **BORJA CARRERAS MARTIN** - Contraseña: `admin123`
- **JUAN SIMON DE LA FUENTE** - Contraseña: `admin123`
- **ALEXANDER ARROYAVE** - Contraseña: `admin123`

### Trabajadores
- **JOSE ANTONIO CARRERAS MARTIN** - Contraseña: `1234`
- **LUIS MIGUEL HIDALGO EGEA** - Contraseña: `1234`
- **DAVID MORENO GÓMEZ** - Contraseña: `1234`
- **AARON LOPEZ MUÑOZ** - Contraseña: `1234`
- **EDGAR ALONSO SANCHEZ SUAREZ** - Contraseña: `1234`
- **JAVIER CARRERAS MARTIN** - Contraseña: `1234`
- **JUAN PEDRO SUAREZ DELGADO** - Contraseña: `1234`
- **JOSE FERNANDO SANCHEZ MARULANDA** - Contraseña: `1234`
- **ANTONIO MANUEL LOPEZ GARCÍA** - Contraseña: `1234`

## 📦 Materiales Incluidos

El sistema incluye materiales predefinidos en las siguientes categorías:

- **Cables**: Cables de fibra óptica de diferentes especificaciones
- **Repartidores**: Cajas de empalme y equipos de distribución
- **Conectores**: Conectores SC/APC, LC/APC, adaptadores
- **Material Menudo**: Accesorios, bridas, grapas, selladores
- **Herramientas**: Herramientas especializadas para fibra
- **Equipos**: Equipos de medición y diagnóstico

## 🚀 Instalación y Configuración

### 1. Clonar o Descargar Archivos
Descarga todos los archivos del proyecto:
```
index.html
firebase-config.js
firebase-storage.js
firebase-app.js
styles.css
assets/logo.png
```

### 2. Firebase Configurado
La aplicación ya está configurada con Firebase. La configuración incluye:
- **Database URL**: `https://stock-material-28674-default-rtdb.europe-west1.firebasedatabase.app`
- **Project ID**: `stock-material-28674`
- **API Key**: Configurada en `firebase-config.js`

### 3. Servir la Aplicación
Puedes servir la aplicación de varias maneras:

#### Opción A: Servidor HTTP Simple
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js
npx serve .

# Con PHP
php -S localhost:8000
```

#### Opción B: Hosting Firebase
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Inicializar proyecto
firebase init hosting

# Desplegar
firebase deploy
```

#### Opción C: Cualquier Hosting Web
Sube los archivos a cualquier servidor web (Apache, Nginx, GitHub Pages, etc.)

### 4. Acceso
1. Abre tu navegador
2. Navega a la URL del servidor
3. Inicia sesión con cualquier usuario predefinido

## 📖 Guía de Uso

### Para Trabajadores
1. **Login**: Selecciona tu nombre y contraseña
2. **Dashboard**: Ve estadísticas generales
3. **Movimientos**: Registra entradas/salidas de materiales
4. **Materiales**: Consulta stock y estados

### Para Administradores
1. **Todas las funciones de trabajador**
2. **Reportes**: Genera reportes detallados
3. **Usuarios**: Gestiona usuarios del sistema
4. **Configuración**: Ajustes del sistema
5. **Backup/Restore**: Respaldar y restaurar datos
6. **Vaciar Stock**: Resetear todo el inventario
7. **Nuevo Material**: Agregar materiales al catálogo

## 🔄 Sincronización en Tiempo Real

### Características
- **Instantáneo**: Los cambios se reflejan inmediatamente
- **Multi-usuario**: Múltiples usuarios pueden trabajar simultáneamente
- **Offline-first**: Funciona sin conexión con sincronización posterior
- **Conflict resolution**: Manejo automático de conflictos

### Estados de Conexión
- 🟢 **Online**: Sincronizado con Firebase
- 🔴 **Offline**: Trabajando localmente, sincronizará al reconectar

## 🛡️ Seguridad

### Control de Acceso
- **Autenticación**: Login obligatorio
- **Roles**: Separación clara entre trabajadores y administradores
- **Permisos**: Cada función verifica el nivel de acceso

### Datos
- **Encriptación**: Datos传输 encriptados con HTTPS
- **Backup**: Respaldos automáticos disponibles
- **Validación**: Validación de datos en cliente y servidor

## 📱 Responsive Design

La aplicación se adapta automáticamente a:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsible
- **Mobile**: Navegación tipo hamburger

## 🐛 Solución de Problemas

### Problemas Comunes

#### "Error al cargar la aplicación"
- Verifica la conexión a internet
- Comprueba la consola del navegador (F12)
- Recarga la página

#### "Datos no se sincronizan"
- Verifica estado de conexión (indicador en sidebar)
- Los cambios offline se sincronizan al reconectar
- Contacta al administrador si persiste

#### "No puedo acceder a una sección"
- Verifica tu rol de usuario
- Los trabajadores no pueden acceder a Reportes, Configuración ni Usuarios
- Contacta a un administrador para cambiar tu rol

### Logs del Navegador
Abre las herramientas de desarrollador (F12) y revisa la consola para ver mensajes de error detallados.

## 📈 Futuras Mejoras

- [ ] Notificaciones push
- [ ] Aplicación móvil nativa
- [ ] Integración con códigos de barras
- [ ] Reportes en Excel/PDF más avanzados
- [ ] Dashboard personalizable
- [ ] Historial de cambios detallado

## 📞 Soporte

Para soporte técnico o reportar problemas:
1. Revisa esta documentación
2. Verifica los logs del navegador
3. Contacta al administrador del sistema

## 📄 Licencia

Este sistema es propietario. Todos los derechos reservados.

---

**Versión**: 2.0 Online  
**Fecha**: Noviembre 2025  
**Tecnología**: Firebase Realtime Database + Vanilla JavaScript