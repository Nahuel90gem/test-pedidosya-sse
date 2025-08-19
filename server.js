const express = require('express');
const config = require('./config');

const app = express();
const PORT = config.servidor.puerto;

// Middleware
app.use(express.json()); // Para parsear JSON bodies
app.use(express.urlencoded({ extended: true })); // Para forms

// CORS usando configuración
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.servidor.cors.origen);
    res.header('Access-Control-Allow-Methods', config.servidor.cors.metodos.join(', '));
    res.header('Access-Control-Allow-Headers', config.servidor.cors.headers.join(', '));
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Almacenar conexiones SSE activas
const sseConnections = new Set();

// Función para enviar eventos por SSE
function sendSSEEvent(eventType, data) {
    const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
        ...data
    };
    
    const message = `data: ${JSON.stringify(event)}\n\n`;
    
    console.log(`📡 Enviando evento SSE [${eventType}] a ${sseConnections.size} clientes`);
    
    sseConnections.forEach(res => {
        try {
            res.write(message);
        } catch (error) {
            console.error('Error enviando SSE:', error);
            sseConnections.delete(res);
        }
    });
}

// ===== ENDPOINTS SSE =====

// Endpoint SSE para PHP
app.get(config.sse.ruta, (req, res) => {
    console.log('🔗 Nueva conexión SSE desde PHP');
    
    // Configurar headers SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Enviar evento de conexión inicial
    const welcomeEvent = {
        type: 'connection',
        message: 'Conectado al servidor de PedidosYa',
        timestamp: new Date().toISOString()
    };
    
    res.write(`data: ${JSON.stringify(welcomeEvent)}\n\n`);
    
    // Agregar conexión a la lista
    sseConnections.add(res);

    // Manejar cierre de conexión
    req.on('close', () => {
        console.log('❌ Conexión SSE cerrada');
        sseConnections.delete(res);
    });

    // Manejar errores
    req.on('error', (error) => {
        console.error('Error en conexión SSE:', error);
        sseConnections.delete(res);
    });
});

// ===== ENDPOINTS PEDIDOSYA (Plugin API oficial) =====

// POST /order/{remoteId} - Recibir nuevos pedidos (según Plugin API oficial)
app.post(config.pedidosya.rutasOficiales.pedidoNuevo, (req, res) => {
    const { remoteId } = req.params;
    const orderData = req.body;
    
    console.log(`🍔 NUEVO PEDIDO recibido de PedidosYa`);
    console.log(`📍 Remote ID: ${remoteId}`);
    console.log(`📦 Datos del pedido:`, JSON.stringify(orderData, null, 2));
    
    try {
        // Validación básica
        if (!orderData) {
            return res.status(400).json({
                reason: 'VALIDATION_ERROR',
                message: 'Order data is required'
            });
        }
        
        // Enviar evento por SSE a PHP
        sendSSEEvent('pedidosya_new_order', {
            remoteId: remoteId,
            order: orderData,
            source: 'pedidosya'
        });
        
        // Respuesta según Plugin API (debe incluir remoteOrderId)
        const remoteOrderId = `${remoteId}_ORDER_${Date.now()}`;
        res.status(200).json({
            remoteResponse: {
                remoteOrderId: remoteOrderId
            }
        });
        
        console.log(`✅ Pedido procesado y enviado por SSE`);
        
    } catch (error) {
        console.error('❌ Error procesando pedido:', error);
        
        res.status(500).json({
            reason: 'INTERNAL_ERROR',
            message: 'Failed to process order'
        });
    }
});

// PUT /remoteId/{remoteId}/remoteOrder/{remoteOrderId}/posOrderStatus - Actualizaciones de estado (según Plugin API oficial)
app.put(config.pedidosya.rutasOficiales.actualizacionEstado, (req, res) => {
    const { remoteId, remoteOrderId } = req.params;
    const statusData = req.body;
    
    console.log(`🔄 ACTUALIZACIÓN DE ESTADO recibida de PedidosYa`);
    console.log(`📍 Remote ID: ${remoteId}`);
    console.log(`🆔 Remote Order ID: ${remoteOrderId}`);
    console.log(`📊 Estado:`, JSON.stringify(statusData, null, 2));
    
    try {
        // Validación básica
        if (!statusData || !statusData.status) {
            return res.status(400).json({
                error: 'Status data is required'
            });
        }
        
        // Enviar evento por SSE a PHP
        sendSSEEvent('pedidosya_status_update', {
            remoteId: remoteId,
            remoteOrderId: remoteOrderId,
            status: statusData,
            source: 'pedidosya'
        });
        
        // Respuesta según Plugin API
        res.status(200).json({
            success: true,
            message: 'Status update received and processed'
        });
        
        console.log(`✅ Actualización de estado procesada y enviada por SSE`);
        
    } catch (error) {
        console.error('❌ Error procesando actualización:', error);
        
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// GET /menuimport/{remoteId} - Solicitud de importación de menú (según Plugin API oficial)
app.get(config.pedidosya.rutasOficiales.importacionMenu, (req, res) => {
    const { remoteId } = req.params;
    const { vendorCode, menuImportId } = req.query;
    
    console.log(`📋 SOLICITUD DE MENÚ recibida de PedidosYa`);
    console.log(`📍 Remote ID: ${remoteId}`);
    console.log(`🏪 Vendor Code: ${vendorCode}`);
    console.log(`📄 Menu Import ID: ${menuImportId}`);
    
    try {
        // Enviar evento por SSE a PHP
        sendSSEEvent('pedidosya_menu_request', {
            remoteId: remoteId,
            vendorCode: vendorCode,
            menuImportId: menuImportId,
            source: 'pedidosya'
        });
        
        // Respuesta asíncrona según Plugin API (202 Accepted)
        res.status(202).json({
            message: 'Menu import request accepted and queued'
        });
        
        console.log(`✅ Solicitud de menú procesada y enviada por SSE`);
        
    } catch (error) {
        console.error('❌ Error procesando solicitud de menú:', error);
        
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// ===== ENDPOINTS DE ESTADO Y TESTING =====

// Página principal con información del servidor
app.get(config.testing.rutas.inicio, (req, res) => {
    res.json({
        service: 'Tachyon PedidosYa Integration Server',
        version: '1.0.0',
        status: 'running',
        environment: config.entorno.esDesarrollo ? 'development' : 'production',
        baseUrl: config.entorno.urlBase,
        endpoints: {
            sse: config.sse.ruta,
            pedidosya: {
                new_order: `POST ${config.pedidosya.rutasEspecificas.pedidoNuevo}`,
                status_update: `PUT ${config.pedidosya.rutasEspecificas.actualizacionEstado}`,
                menu_import: `GET ${config.pedidosya.rutasEspecificas.importacionMenu}`
            },
            test: `POST ${config.testing.rutas.pruebaWebhook}`
        },
        config: {
            remoteId: config.pedidosya.identificadores.remoteId,
            chainCode: config.pedidosya.identificadores.codigoCadena,
            sse_clients: sseConnections.size
        },
        timestamp: new Date().toISOString()
    });
});

// Endpoint de estado detallado
app.get(config.testing.rutas.estado, (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        connections: sseConnections.size,
        pid: process.pid,
        timestamp: new Date().toISOString()
    });
});

// Endpoint de testing para simular webhooks
app.post(config.testing.rutas.pruebaWebhook, (req, res) => {
    const testData = req.body;
    
    console.log('🧪 TEST WEBHOOK recibido:', JSON.stringify(testData, null, 2));
    
    // Enviar evento de test por SSE
    sendSSEEvent('test_webhook', {
        data: testData,
        source: 'manual_test'
    });
    
    res.json({
        message: 'Test webhook received and sent via SSE',
        data: testData,
        timestamp: new Date().toISOString()
    });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Tachyon PedidosYa Server iniciado en puerto ${PORT}`);
    console.log(`📡 SSE endpoint: ${config.entorno.urlBase}${config.sse.ruta}`);
    console.log(`🍔 PedidosYa NEW ORDER: POST ${config.pedidosya.rutasEspecificas.pedidoNuevo}`);
    console.log(`🔄 PedidosYa STATUS: PUT ${config.pedidosya.rutasEspecificas.actualizacionEstado}`);
    console.log(`📋 PedidosYa MENU: GET ${config.pedidosya.rutasEspecificas.importacionMenu}`);
    console.log(`📊 Status: ${config.entorno.urlBase}${config.testing.rutas.estado}`);
    console.log(`🧪 Test: POST ${config.entorno.urlBase}${config.testing.rutas.pruebaWebhook}`);
    console.log(`===================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Cerrando servidor...');
    process.exit(0);
});
