# 🚀 Instrucciones Rápidas - Control de Stock Online

## ⚠️ CONFIGURACIÓN INICIAL OBLIGATORIA

### 🔥 IMPORTANTE: Configurar usuarios primero
**La aplicación NO funcionará sin configurar los usuarios originales de Firebase.**

### Paso 1: Configuración Inicial
1. **Abrir** `setup-users.html` en tu navegador
2. **Probar conexión** con Firebase (botón 🧪)
3. **Configurar Firebase** (botón 🚀) - Solo ejecutar UNA VEZ
4. **Verificar** que se crearon 12 usuarios (3 admins + 9 trabajadores)

### Paso 2: Verificación
1. **Abrir** `quick-test.html` para pruebas automáticas
2. **Verificar** que todas las pruebas pasen ✅
3. Si hay errores, repetir configuración

### 📁 Archivos creados:
- ✅ `index.html` - Aplicación principal online
- ✅ `firebase-config.js` - Configuración Firebase
- ✅ `firebase-storage.js` - Gestión de datos en tiempo real
- ✅ `firebase-app.js` - Lógica principal de la aplicación
- ✅ `styles.css` - Estilos modernos y responsive
- ✅ `setup-users.html` - **Configuración inicial obligatoria**
- ✅ `quick-test.html` - **Pruebas rápidas automáticas**
- ✅ `test-online.html` - Página de pruebas antigua
- ✅ `README.md` - Documentación completa

## 🔥 Nuevas funcionalidades agregadas:

### 1. 🗑️ Vaciar Stock (Solo Admin)
- Botón rojo en Configuración
- Pone todo el stock en 0
- Confirmación de seguridad

### 2. 💾 Crear Backup (Solo Admin)
- Descarga archivo JSON
- Incluye todos los datos

### 3. 📂 Restaurar Backup (Solo Admin)
- Importa archivo JSON
- Valida formato
- Confirmación antes de restaurar

### 4. 🔐 Control de Acceso
- **Trabajadores**: Solo Dashboard/Movimientos/Materiales
- **Administradores**: Acceso completo

### 5. 🧹 Limpiar Datos (Solo Admin)
- Resetea a valores por defecto
- Mantiene usuarios iniciales

### 6. ➕ Nuevo Material (Funcional)
- Botón "+nuevo material" ahora funciona
- Formulario completo
- Validación de códigos únicos

## 🚀 Cómo usar (orden correcto):

### ❌ NO hagas esto primero:
❌ `index.html` → No funcionará sin configurar usuarios

### ✅ SÍ haz esto:
1. **`setup-users.html`** → Configurar Firebase (obligatorio)
2. **`quick-test.html`** → Verificar que funciona
3. **`index.html`** → Usar la aplicación

### 👥 Inicia sesión con:

**Administradores:**
- BORJA CARRERAS MARTIN / admin123
- JUAN SIMON DE LA FUENTE / admin123
- ALEXANDER ARROYAVE / admin123

**Trabajadores:**
- JOSE ANTONIO CARRERAS MARTIN / 1234
- LUIS MIGUEL HIDALGO EGEA / 1234
- DAVID MORENO GÓMEZ / 1234
- AARON LOPEZ MUÑOZ / 1234
- EDGAR ALONSO SANCHEZ SUAREZ / 1234
- JAVIER CARRERAS MARTIN / 1234
- JUAN PEDRO SUAREZ DELGADO / 1234
- JOSE FERNANDO SANCHEZ MARULANDA / 1234
- ANTONIO MANUEL LOPEZ GARCÍA / 1234

## 📱 Características online:

### ✅ Tiempo real
- Los cambios se ven instantáneamente en todos los dispositivos
- Estado online/offline con indicador
- Sincronización automática

### ✅ Multi-dispositivo
- Funciona en móvil, tablet y desktop
- Responsive design
- Mismos datos desde cualquier lugar

### ✅ Firebase configurado
- Database URL: `https://stock-material-28674-default-rtdb.europe-west1.firebasedatabase.app`
- Proyecto ID: `stock-material-28674`
- Todo configurado y listo

## 🎯 Diferencias con la versión local:

| Característica | Local | Online |
|---|---|---|
| **Almacenamiento** | localStorage | Firebase Realtime DB |
| **Sincronización** | No | ✅ Tiempo real |
| **Multi-dispositivo** | No | ✅ Sí |
| **Estado online** | No aplica | ✅ Indicador |
| **Backup** | Manual | ✅ Automático |
| **Funciones admin** | Sí | ✅ Mismo + nuevas |

## ⚠️ Notas importantes:

1. **Requiere internet**: Para sincronización en tiempo real
2. **Offline funciona**: Con fallback a localStorage
3. **Datos seguros**: En Firebase con HTTPS
4. **Mismos usuarios**: Contraseñas y roles iguales
5. **Mismos materiales**: Mantenidos intactos

## 🛠️ Resolución de problemas:

### "Error al cargar Firebase"
- Verifica conexión a internet
- Recarga la página (F5)
- Abre consola (F12) para ver errores

### "Datos no se sincronizan"
- Verifica estado online (indicador en sidebar)
- Los cambios offline se sync al reconectar

### "No puedo acceder a una sección"
- Verifica tu rol (trabajador vs admin)
- Los workers solo ven Dashboard/Movimientos/Materiales

## 🎉 ¡Listo para usar!

Tu aplicación está **100% funcional** y online con Firebase. Los cambios se sincronizan en tiempo real entre todos los dispositivos.

### Para empezar:
1. `test-online.html` → Verificar tests
2. `index.html` → ¡Usar la aplicación!

**¡Disfruta de tu nueva aplicación online!** 🚀