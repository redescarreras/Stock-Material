# 🎯 INSTRUCCIONES DE PRUEBA - CORRECCIONES APLICADAS

## 📋 **PASO 1: Verificar Correcciones con Test**
1. Abre `test-correcciones-especificas.html` en el navegador
2. Ejecuta "🚀 Ejecutar Todos los Tests" 
3. Verifica que todos los tests aparezcan en ✅ verde

## 🔑 **PASO 2: Probar Aplicación Principal**
1. Abre `index.html`
2. Inicia sesión con: **BORJA CARRERAS MARTIN** / **admin123**

## ✅ **PASO 3: Verificaciones Específicas**

### A) **Test de Duplicación de Modales**
- Crea un **material nuevo** → Debe aparecer 1 vez (no duplicado)
- Registra un **movimiento** → Debe aparecer 1 vez (no duplicado)
- Edita un **material existente** → Modal debe aparecer 1 vez (no triplicado)

### B) **Test de Función de Limpiar**
- Haz clic en **"Limpiar Movimientos"** (botón amarillo)
- ✅ **DEBE**: Solo eliminar movimientos, mantener materiales intactos
- ❌ **NO DEBE**: Borrar materiales (eso fue el error anterior)

### C) **Test de Dropdown de Materiales**
- En "Nuevo Movimiento" → El desplegable debe mostrar **TODOS** los materiales
- Si no aparecen materiales, hay un problema con Firebase

### D) **Test de Stock Mínimo**
- En "Nuevo Material" → NO debe aparecer campo "Stock Mínimo"
- En "Editar Material" → NO debe aparecer campo "Stock Mínimo"
- En la tabla de materiales → NO debe aparecer columna "Mínimo"

## 🚨 **SEÑALES DE ALERTA**

### ❌ **PROBLEMAS CRÍTICOS**
- Modales que aparecen 2-3 veces
- "Limpiar Movimientos" que borra materiales
- Dropdown de materiales vacío en "Nuevo Movimiento"

### ⚠️ **PROBLEMAS MENORES**
- Carga lenta de la aplicación
- Algunos elementos de UI desalineados

## 🔧 **SI HAY PROBLEMAS**

### **Problema: Modales duplicados**
- Verificar que se aplicó correctamente la prevención de duplicados
- Revisar consola del navegador para errores JavaScript

### **Problema: No cargan materiales en dropdown**
- Verificar conexión a Firebase
- Revisar función `loadDropdowns()` en consola

### **Problema: "Limpiar" borra materiales**
- Verificar que estás usando el botón **amarillo** "Limpiar Movimientos"
- NO usar el botón rojo "Limpiar TODOS los Datos"

## 📞 **RESULTADO ESPERADO FINAL**
✅ Todos los modales aparecen **solo una vez**
✅ "Limpiar Movimientos" solo borra **movimientos**
✅ Dropdown de materiales **siempre poblado**
✅ **Sin campos de Stock Mínimo** en ningún lugar
✅ Carga de aplicación **rápida**

## 🎉 **CONFIRMACIÓN DE ÉXITO**
Si todas las verificaciones pasan, significa que:
- Las correcciones se aplicaron correctamente
- Los problemas críticos han sido resueltos
- La aplicación está lista para uso normal