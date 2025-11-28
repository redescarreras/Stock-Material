/**
 * PDF Generator - Maneja la generación de reportes en PDF
 */

class PDFGenerator {
    constructor() {
        this.storage = window.storageManager;
    }

    /**
     * Genera PDF desde contenido HTML (método principal)
     */
    generateFromHTML(htmlContent, filename = 'reporte.pdf') {
        try {
            const printWindow = window.open('', '_blank');
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Reporte Fibra Óptica</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Arial, sans-serif; 
                            margin: 20px; 
                            color: #333;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            padding: 20px;
                            background: linear-gradient(135deg, #2563eb, #3b82f6);
                            color: white;
                            border-radius: 10px;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .header p {
                            margin: 5px 0 0 0;
                            opacity: 0.9;
                        }
                        table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin: 20px 0; 
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        }
                        th, td { 
                            border: 1px solid #e5e7eb; 
                            padding: 12px; 
                            text-align: left; 
                        }
                        th { 
                            background: linear-gradient(135deg, #f8fafc, #f1f5f9);
                            font-weight: 600;
                            color: #374151;
                        }
                        .badge { 
                            padding: 4px 8px; 
                            border-radius: 6px; 
                            font-size: 12px; 
                            font-weight: 500;
                        }
                        .badge-entrada { 
                            background-color: #dcfce7; 
                            color: #166534; 
                        }
                        .badge-salida { 
                            background-color: #fee2e2; 
                            color: #991b1b; 
                        }
                        .badge-ajuste { 
                            background-color: #fef3c7; 
                            color: #92400e; 
                        }
                        .badge-bajo { 
                            background-color: #fee2e2; 
                            color: #991b1b; 
                        }
                        .badge-normal { 
                            background-color: #dcfce7; 
                            color: #166534; 
                        }
                        .stats-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                            gap: 15px;
                            margin: 20px 0;
                        }
                        .stat-card {
                            background: white;
                            padding: 15px;
                            border-radius: 8px;
                            border: 1px solid #e5e7eb;
                            text-align: center;
                        }
                        .stat-number {
                            font-size: 24px;
                            font-weight: bold;
                            color: #2563eb;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 12px;
                            border-top: 1px solid #e5e7eb;
                            padding-top: 15px;
                        }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📊 Reporte de Control de Material</h1>
                        <p>Fibra Óptica</p>
                    </div>
                    ${htmlContent}
                    <div class="footer">
                        <p><strong>Sistema de Control de Material - Fibra Óptica</strong></p>
                        <p>Generado el: ${new Date().toLocaleString('es-ES')}</p>
                    </div>
                    <div class="no-print" style="text-align: center; margin-top: 20px;">
                        <button onclick="window.print()" style="
                            background: #2563eb; 
                            color: white; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 6px; 
                            cursor: pointer;
                            font-size: 16px;
                        ">🖨️ Imprimir / Guardar como PDF</button>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            // Configurar para que se abra automáticamente para imprimir
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.focus();
                }, 500);
            };
            
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Error al generar el PDF. Se abrirá una ventana para imprimir.');
            window.print();
        }
    }

    /**
     * Genera un reporte de stock de materiales
     */
    generateStockReport() {
        const materials = this.storage.getMaterials();
        const lowStockMaterials = this.storage.getLowStockMaterials();
        
        let html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${materials.length}</div>
                    <div>Total Materiales</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${lowStockMaterials.length}</div>
                    <div>Stock Bajo</div>
                </div>
            </div>
            
            <h3>📦 Materiales con Stock Bajo</h3>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Material</th>
                        <th>Categoría</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        lowStockMaterials.forEach(material => {
            html += `
                <tr>
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td>${material.category}</td>
                    <td>${material.stock} ${material.unit}</td>
                    <td>${material.minStock} ${material.unit}</td>
                    <td><span class="badge badge-bajo">Bajo Stock</span></td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            
            <h3>📋 Todos los Materiales</h3>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Material</th>
                        <th>Categoría</th>
                        <th>Stock Actual</th>
                        <th>Stock Mínimo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        materials.forEach(material => {
            const status = material.stock <= material.minStock ? 'bajo' : 'normal';
            const statusText = status === 'bajo' ? 'Bajo Stock' : 'Normal';
            
            html += `
                <tr>
                    <td>${material.code}</td>
                    <td>${material.name}</td>
                    <td>${material.category}</td>
                    <td>${material.stock} ${material.unit}</td>
                    <td>${material.minStock} ${material.unit}</td>
                    <td><span class="badge badge-${status}">${statusText}</span></td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        this.generateFromHTML(html, 'reporte_stock_completo.pdf');
    }

    /**
     * Genera un reporte de movimientos
     */
    generateMovementsReport(startDate, endDate) {
        const movements = this.storage.getMovementsByDateRange(startDate, endDate);
        
        const entryMovements = movements.filter(m => m.type === 'entrada');
        const exitMovements = movements.filter(m => m.type === 'salida');
        const adjustmentMovements = movements.filter(m => m.type === 'ajuste');
        
        let html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${movements.length}</div>
                    <div>Total Movimientos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${entryMovements.length}</div>
                    <div>Entradas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${exitMovements.length}</div>
                    <div>Salidas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${adjustmentMovements.length}</div>
                    <div>Ajustes</div>
                </div>
            </div>
            
            <p><strong>Período:</strong> ${startDate} al ${endDate}</p>
            
            <h3>📋 Registro de Movimientos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Material</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                        <th>Observaciones</th>
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
                    <td>${movement.observations || '-'}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        this.generateFromHTML(html, `reporte_movimientos_${startDate}_${endDate}.pdf`);
    }

    /**
     * Genera un reporte de trabajadores
     */
    generateWorkersReport(startDate, endDate) {
        const movements = this.storage.getMovementsByDateRange(startDate, endDate);
        const workerStats = {};
        
        movements.forEach(movement => {
            if (!workerStats[movement.userName]) {
                workerStats[movement.userName] = {
                    name: movement.userName,
                    movements: 0,
                    totalQuantity: 0,
                    entryMovements: 0,
                    exitMovements: 0
                };
            }
            workerStats[movement.userName].movements++;
            workerStats[movement.userName].totalQuantity += movement.quantity;
            
            if (movement.type === 'entrada') {
                workerStats[movement.userName].entryMovements++;
            } else if (movement.type === 'salida') {
                workerStats[movement.userName].exitMovements++;
            }
        });
        
        let html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${Object.keys(workerStats).length}</div>
                    <div>Trabajadores Activos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${movements.length}</div>
                    <div>Total Movimientos</div>
                </div>
            </div>
            
            <p><strong>Período:</strong> ${startDate} al ${endDate}</p>
            
            <h3>👥 Rendimiento de Trabajadores</h3>
            <table>
                <thead>
                    <tr>
                        <th>Trabajador</th>
                        <th>Total Movimientos</th>
                        <th>Entradas</th>
                        <th>Salidas</th>
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
                    <td>${stat.entryMovements}</td>
                    <td>${stat.exitMovements}</td>
                    <td>${stat.totalQuantity}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        this.generateFromHTML(html, `reporte_trabajadores_${startDate}_${endDate}.pdf`);
    }

    /**
     * Genera reporte de configuración (para administradores)
     */
    generateSettingsReport() {
        const settings = this.storage.getSettings();
        const workers = this.storage.getWorkers();
        const materials = this.storage.getMaterials();
        
        let html = `
            <h3>⚙️ Configuración del Sistema</h3>
            <table>
                <tr><td><strong>Nombre de la Empresa</strong></td><td>${settings.companyName}</td></tr>
                <tr><td><strong>Umbral de Alertas</strong></td><td>${settings.notificationThreshold}%</td></tr>
                <tr><td><strong>Formato de Fecha</strong></td><td>${settings.dateFormat}</td></tr>
                <tr><td><strong>Idioma</strong></td><td>${settings.language}</td></tr>
                <tr><td><strong>Backup Automático</strong></td><td>${settings.backup.autoBackup ? 'Activado' : 'Desactivado'}</td></tr>
            </table>
            
            <h3>👥 Resumen de Usuarios</h3>
            <table>
                <tr><td><strong>Total de Usuarios</strong></td><td>${workers.length}</td></tr>
                <tr><td><strong>Trabajadores</strong></td><td>${workers.filter(w => w.role === 'trabajador').length}</td></tr>
                <tr><td><strong>Administradores</strong></td><td>${workers.filter(w => w.role === 'administrador').length}</td></tr>
                <tr><td><strong>Usuarios Activos</strong></td><td>${workers.filter(w => w.status === 'activo').length}</td></tr>
            </table>
            
            <h3>📦 Resumen de Materiales</h3>
            <table>
                <tr><td><strong>Total de Materiales</strong></td><td>${materials.length}</td></tr>
                <tr><td><strong>Cables</strong></td><td>${materials.filter(m => m.category === 'cables').length}</td></tr>
                <tr><td><strong>Repartidores</strong></td><td>${materials.filter(m => m.category === 'repartidores').length}</td></tr>
                <tr><td><strong>Material Menudo</strong></td><td>${materials.filter(m => m.category === 'menudo').length}</td></tr>
            </table>
        `;
        
        this.generateFromHTML(html, 'reporte_configuracion.pdf');
    }
}

// Instancia global del generador de PDF
window.pdfGenerator = new PDFGenerator();