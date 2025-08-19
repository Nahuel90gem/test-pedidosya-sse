/**
 * Simulador de PedidosYa - Script de Prueba
 * 
 * Este script simula cómo PedidosYa enviaría webhooks a nuestro servidor
 * Permite probar los endpoints oficiales del Plugin API
 */

const axios = require('axios');

// Configuración del simulador
const config = {
    // URL del servidor (cambiar por la URL de Railway cuando esté desplegado)
    serverUrl: 'http://localhost:3000', // o la URL de Railway
    
    // Datos de prueba
    remoteId: 'TEST_RESTAURANT_001',
    remoteOrderId: 'PEDIDO_' + Date.now(),
    posOrderId: 'POS_' + Date.now()
};

/**
 * Simular una nueva orden desde PedidosYa
 */
async function simularNuevaOrden() {
    console.log('\n🍕 === SIMULANDO NUEVA ORDEN DE PEDIDOSYA ===');
    
    const nuevaOrden = {
        orderId: config.remoteOrderId,
        remoteOrderId: config.remoteOrderId,
        restaurant: {
            id: config.remoteId,
            name: "Restaurante de Prueba"
        },
        customer: {
            name: "Juan Pérez",
            phone: "+598 99 123 456",
            address: {
                street: "18 de Julio 1234",
                city: "Montevideo",
                coordinates: {
                    lat: -34.9011,
                    lng: -56.1645
                }
            }
        },
        items: [
            {
                id: "item_001",
                name: "Pizza Napolitana",
                quantity: 1,
                price: 450,
                options: [
                    {
                        name: "Tamaño",
                        value: "Mediana"
                    }
                ]
            },
            {
                id: "item_002", 
                name: "Coca Cola 500ml",
                quantity: 2,
                price: 80
            }
        ],
        totals: {
            subtotal: 610,
            delivery: 50,
            total: 660
        },
        delivery: {
            estimatedTime: 45,
            type: "DELIVERY",
            scheduledTime: null
        },
        payment: {
            method: "ONLINE",
            status: "PAID"
        },
        createdAt: new Date().toISOString()
    };
    
    try {
        console.log(`📤 Enviando orden a: POST ${config.serverUrl}/order/${config.remoteId}`);
        console.log('📦 Datos de la orden:', JSON.stringify(nuevaOrden, null, 2));
        
        const response = await axios.post(`${config.serverUrl}/order/${config.remoteId}`, nuevaOrden, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PedidosYa-Webhook/1.0'
            }
        });
        
        console.log('✅ Respuesta del servidor:', response.status, response.statusText);
        console.log('📨 Datos recibidos:', response.data);
        
        return response.data;
        
    } catch (error) {
        console.error('❌ Error enviando orden:', error.response?.data || error.message);
        return null;
    }
}

/**
 * Simular actualización de estado desde nuestro POS
 */
async function simularActualizacionEstado(posOrderId) {
    console.log('\n🔄 === SIMULANDO ACTUALIZACIÓN DE ESTADO ===');
    
    const estados = ['CONFIRMED', 'PREPARING', 'READY', 'DISPATCHED', 'DELIVERED'];
    const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
    
    const actualizacion = {
        status: estadoAleatorio,
        estimatedTime: estadoAleatorio === 'PREPARING' ? 30 : null,
        message: `Pedido ${estadoAleatorio.toLowerCase()} correctamente`,
        timestamp: new Date().toISOString()
    };
    
    try {
        const url = `${config.serverUrl}/remoteId/${config.remoteId}/remoteOrder/${config.remoteOrderId}/posOrderStatus`;
        console.log(`📤 Enviando actualización a: PUT ${url}`);
        console.log('📦 Estado nuevo:', JSON.stringify(actualizacion, null, 2));
        
        const response = await axios.put(url, actualizacion, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Respuesta del servidor:', response.status, response.statusText);
        console.log('📨 Confirmación:', response.data);
        
    } catch (error) {
        console.error('❌ Error actualizando estado:', error.response?.data || error.message);
    }
}

/**
 * Simular solicitud de importación de menú
 */
async function simularImportacionMenu() {
    console.log('\n📋 === SIMULANDO SOLICITUD DE IMPORTACIÓN DE MENÚ ===');
    
    try {
        const url = `${config.serverUrl}/menuimport/${config.remoteId}`;
        console.log(`📤 Solicitando menú de: GET ${url}`);
        
        const response = await axios.get(url);
        
        console.log('✅ Respuesta del servidor:', response.status, response.statusText);
        console.log('📨 Menú recibido:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('❌ Error obteniendo menú:', error.response?.data || error.message);
    }
}

/**
 * Probar conexión SSE
 */
async function probarConexionSSE() {
    console.log('\n📡 === PROBANDO CONEXIÓN SSE ===');
    
    try {
        const response = await axios.get(`${config.serverUrl}/sse`, {
            responseType: 'stream',
            timeout: 5000
        });
        
        console.log('✅ Conexión SSE establecida correctamente');
        console.log('📨 Headers:', response.headers);
        
        // Leer algunos eventos SSE
        let eventCount = 0;
        response.data.on('data', (chunk) => {
            const data = chunk.toString();
            if (data.trim()) {
                console.log('📺 Evento SSE recibido:', data.trim());
                eventCount++;
                if (eventCount >= 3) {
                    response.data.destroy();
                    console.log('🔚 Cerrando conexión SSE de prueba');
                }
            }
        });
        
    } catch (error) {
        if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
            console.log('✅ Conexión SSE funciona correctamente (conexión cerrada intencionalmente)');
        } else {
            console.error('❌ Error con SSE:', error.message);
        }
    }
}

/**
 * Ejecutar todas las pruebas
 */
async function ejecutarPruebas() {
    console.log('🚀 === INICIANDO SIMULADOR DE PEDIDOSYA ===');
    console.log(`🎯 Servidor objetivo: ${config.serverUrl}`);
    console.log(`🏪 ID Restaurante: ${config.remoteId}`);
    console.log(`📝 ID Orden: ${config.remoteOrderId}`);
    
    // Esperar un poco para que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 1. Probar conexión SSE
    await probarConexionSSE();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Simular nueva orden
    const resultadoOrden = await simularNuevaOrden();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Simular actualización de estado (solo si la orden fue procesada)
    if (resultadoOrden) {
        await simularActualizacionEstado(resultadoOrden.posOrderId);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 4. Simular importación de menú
    await simularImportacionMenu();
    
    console.log('\n🎉 === SIMULACIÓN COMPLETADA ===');
    console.log('💡 Tip: Revisa los logs del servidor para ver cómo procesa cada webhook');
}

// Permitir configurar la URL del servidor desde línea de comandos
if (process.argv[2]) {
    config.serverUrl = process.argv[2];
    console.log(`🔧 URL del servidor configurada: ${config.serverUrl}`);
}

// Ejecutar las pruebas
ejecutarPruebas().catch(console.error);
