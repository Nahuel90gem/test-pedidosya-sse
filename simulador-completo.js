/**
 * 🧪 Simulador Completo PedidosYa ↔ Railway ↔ SSE
 * 
 * Simula el flujo completo:
 * 1. Enviar orden a Railway (como PedidosYa)
 * 2. Conectarse por SSE para recibir la orden procesada
 */

const axios = require('axios');
const EventSource = require('eventsource'); // npm install eventsource

// Configuración
const RAILWAY_URL = 'https://test-pedidosya-sse-production.up.railway.app';
const REMOTE_ID = 'PYTEST007';

console.log('🚀 SIMULADOR PEDIDOSYA ↔ RAILWAY ↔ SSE');
console.log('=====================================');
console.log(`🌐 Railway URL: ${RAILWAY_URL}`);
console.log(`🏪 Remote ID: ${REMOTE_ID}`);
console.log('');

/**
 * 1. Conectarse por SSE para escuchar eventos
 */
function conectarSSE() {
    return new Promise((resolve, reject) => {
        console.log('📡 1. CONECTANDO POR SSE...');
        
        const sseUrl = `${RAILWAY_URL}/sse`;
        console.log(`   🔗 URL SSE: ${sseUrl}`);
        
        const eventSource = new EventSource(sseUrl);
        
        eventSource.onopen = function() {
            console.log('   ✅ Conexión SSE establecida');
            resolve(eventSource);
        };
        
        eventSource.onmessage = function(event) {
            console.log('   📨 Evento SSE recibido:');
            try {
                const data = JSON.parse(event.data);
                console.log('   📦 Datos:', JSON.stringify(data, null, 4));
            } catch (e) {
                console.log('   📄 Texto:', event.data);
            }
        };
        
        eventSource.addEventListener('nueva-orden', function(event) {
            console.log('   🍕 NUEVA ORDEN RECIBIDA POR SSE:');
            try {
                const orden = JSON.parse(event.data);
                console.log('   📦 Orden:', JSON.stringify(orden, null, 4));
            } catch (e) {
                console.log('   📄 Datos:', event.data);
            }
        });
        
        eventSource.addEventListener('estado-actualizado', function(event) {
            console.log('   🔄 ESTADO ACTUALIZADO POR SSE:');
            try {
                const estado = JSON.parse(event.data);
                console.log('   📦 Estado:', JSON.stringify(estado, null, 4));
            } catch (e) {
                console.log('   📄 Datos:', event.data);
            }
        });
        
        eventSource.onerror = function(error) {
            console.log('   ❌ Error SSE:', error);
            // No rechazar aquí, seguir intentando
        };
        
        // Resolver después de 3 segundos aunque haya errores
        setTimeout(() => {
            if (eventSource.readyState !== EventSource.OPEN) {
                console.log('   ⚠️  SSE no se conectó en 3s, pero continuamos...');
            }
            resolve(eventSource);
        }, 3000);
    });
}

/**
 * 2. Enviar orden simulada a Railway
 */
async function enviarOrdenSimulada() {
    console.log('\n🍕 2. ENVIANDO ORDEN SIMULADA A RAILWAY...');
    
    const orden = {
        orderId: `ORDER_${Date.now()}`,
        remoteOrderId: `REMOTE_${Date.now()}`,
        restaurant: {
            id: REMOTE_ID,
            name: "Restaurante Test Simulado"
        },
        customer: {
            name: "Cliente de Prueba",
            phone: "+598 99 123 456",
            email: "test@example.com",
            address: {
                street: "18 de Julio 1234",
                neighborhood: "Centro",
                city: "Montevideo",
                state: "Montevideo",
                country: "UY",
                zipCode: "11000",
                coordinates: {
                    lat: -34.9011,
                    lng: -56.1645
                }
            }
        },
        items: [
            {
                id: "pizza_napolitana_001",
                name: "Pizza Napolitana",
                description: "Pizza con tomate, mozzarella y albahaca",
                quantity: 1,
                unitPrice: 450,
                totalPrice: 450,
                category: "Pizzas",
                options: [
                    {
                        name: "Tamaño",
                        value: "Mediana",
                        price: 0
                    },
                    {
                        name: "Masa",
                        value: "Tradicional",
                        price: 0
                    }
                ]
            },
            {
                id: "bebida_coca_001",
                name: "Coca Cola 500ml",
                description: "Bebida gaseosa",
                quantity: 2,
                unitPrice: 80,
                totalPrice: 160,
                category: "Bebidas"
            }
        ],
        totals: {
            subtotal: 610,
            delivery: 50,
            tax: 0,
            discount: 0,
            total: 660
        },
        delivery: {
            estimatedTime: 45,
            type: "DELIVERY",
            scheduledTime: null,
            instructions: "Tocar timbre 2 veces"
        },
        payment: {
            method: "ONLINE",
            status: "PAID",
            transactionId: `TXN_${Date.now()}`
        },
        createdAt: new Date().toISOString(),
        metadata: {
            platform: "PedidosYa",
            source: "mobile_app",
            simulacion: true
        }
    };
    
    try {
        const url = `${RAILWAY_URL}/order/${REMOTE_ID}`;
        console.log(`   📤 POST: ${url}`);
        console.log(`   📦 Enviando orden:`);
        console.log(`      🆔 Order ID: ${orden.orderId}`);
        console.log(`      👤 Cliente: ${orden.customer.name}`);
        console.log(`      📍 Dirección: ${orden.customer.address.street}`);
        console.log(`      🍕 Items: ${orden.items.length} productos`);
        console.log(`      💰 Total: $${orden.totals.total}`);
        
        const response = await axios.post(url, orden, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PedidosYa-Webhook/1.0'
            },
            timeout: 10000
        });
        
        console.log(`   ✅ Orden enviada exitosamente!`);
        console.log(`   📨 Respuesta: ${response.status} ${response.statusText}`);
        console.log(`   📦 Datos recibidos:`, JSON.stringify(response.data, null, 4));
        
        return response.data;
        
    } catch (error) {
        console.log(`   ❌ Error enviando orden:`);
        if (error.response) {
            console.log(`      📊 Status: ${error.response.status}`);
            console.log(`      📄 Data:`, error.response.data);
        } else {
            console.log(`      🔌 Error de conexión:`, error.message);
        }
        return null;
    }
}

/**
 * 3. Simular actualización de estado (opcional)
 */
async function actualizarEstado(remoteOrderId) {
    console.log('\n🔄 3. ACTUALIZANDO ESTADO DE LA ORDEN...');
    
    const estado = {
        status: 'CONFIRMED',
        message: 'Pedido confirmado y en preparación',
        estimatedTime: 30,
        timestamp: new Date().toISOString()
    };
    
    try {
        const url = `${RAILWAY_URL}/remoteId/${REMOTE_ID}/remoteOrder/${remoteOrderId}/posOrderStatus`;
        console.log(`   📤 PUT: ${url}`);
        console.log(`   📦 Estado: ${estado.status} - ${estado.message}`);
        
        const response = await axios.put(url, estado, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log(`   ✅ Estado actualizado exitosamente!`);
        console.log(`   📨 Respuesta:`, JSON.stringify(response.data, null, 4));
        
    } catch (error) {
        console.log(`   ❌ Error actualizando estado:`);
        if (error.response) {
            console.log(`      📊 Status: ${error.response.status}`);
            console.log(`      📄 Data:`, error.response.data);
        } else {
            console.log(`      🔌 Error de conexión:`, error.message);
        }
    }
}

/**
 * Ejecutar simulación completa
 */
async function ejecutarSimulacion() {
    let eventSource = null;
    
    try {
        // 1. Conectar SSE primero
        eventSource = await conectarSSE();
        
        // 2. Esperar un poco para que SSE esté completamente conectado
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 3. Enviar orden simulada
        const resultado = await enviarOrdenSimulada();
        
        // 4. Si la orden fue procesada, esperar un poco y actualizar estado
        if (resultado && resultado.remoteOrderId) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await actualizarEstado(resultado.remoteOrderId);
        }
        
        // 5. Mantener SSE abierto un poco más para ver los eventos
        console.log('\n⏳ Manteniendo conexión SSE por 10 segundos más...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
    } catch (error) {
        console.error('\n❌ Error en la simulación:', error.message);
    } finally {
        // Cerrar conexión SSE
        if (eventSource) {
            eventSource.close();
            console.log('\n🔚 Conexión SSE cerrada');
        }
        
        console.log('\n🎉 SIMULACIÓN COMPLETADA');
        console.log('========================');
    }
}

// Ejecutar la simulación
ejecutarSimulacion().catch(console.error);
