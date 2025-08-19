/**
 * 🧪 Simulador PedidosYa → Railway (Versión Simplificada)
 * 
 * Paso 1: Enviar orden a Railway (como PedidosYa)
 * Paso 2: Usar otra ventana para conectar SSE manualmente
 */

const axios = require('axios');

// Configuración
const RAILWAY_URL = 'https://webhookpedidosyaorgiuto-production.up.railway.app';
const REMOTE_ID = 'PYTEST007';

console.log('🚀 SIMULADOR PEDIDOSYA → RAILWAY');
console.log('===============================');
console.log(`🌐 Railway URL: ${RAILWAY_URL}`);
console.log(`🏪 Remote ID: ${REMOTE_ID}`);
console.log('');

/**
 * Verificar que Railway esté funcionando
 */
async function verificarRailway() {
    console.log('🔍 1. VERIFICANDO QUE RAILWAY ESTÉ ACTIVO...');
    
    try {
        // Probar con el endpoint SSE que sabemos que existe
        const response = await axios.get(`${RAILWAY_URL}/sse`, { 
            timeout: 5000,
            validateStatus: function (status) {
                return status < 500; // Aceptar cualquier respuesta que no sea error del servidor
            }
        });
        console.log('   ✅ Railway responde correctamente');
        console.log('   📊 Status:', response.status);
        console.log('   � Headers:', response.headers['content-type']);
        return true;
    } catch (error) {
        console.log('   ❌ Railway no responde:');
        if (error.response) {
            console.log(`      📊 Status: ${error.response.status}`);
        } else if (error.code === 'ECONNABORTED') {
            console.log('   ⚠️  Timeout, pero Railway puede estar funcionando');
            return true; // SSE puede tomar tiempo, asumimos que funciona
        } else {
            console.log(`      🔌 Error: ${error.message}`);
        }
        return false;
    }
}

/**
 * Enviar orden simulada a Railway
 */
async function enviarOrdenSimulada() {
    console.log('\n🍕 2. ENVIANDO ORDEN SIMULADA A RAILWAY...');
    
    const timestamp = Date.now();
    const orden = {
        orderId: `ORDER_${timestamp}`,
        remoteOrderId: `REMOTE_${timestamp}`,
        restaurant: {
            id: REMOTE_ID,
            name: "Restaurante Test"
        },
        customer: {
            name: "Juan Pérez",
            phone: "+598 99 123 456",
            email: "juan@test.com",
            address: {
                street: "18 de Julio 1234",
                city: "Montevideo",
                country: "UY"
            }
        },
        items: [
            {
                id: "pizza_001",
                name: "Pizza Napolitana",
                quantity: 1,
                unitPrice: 450,
                totalPrice: 450
            },
            {
                id: "bebida_001",
                name: "Coca Cola 500ml",
                quantity: 1,
                unitPrice: 80,
                totalPrice: 80
            }
        ],
        totals: {
            subtotal: 530,
            delivery: 50,
            total: 580
        },
        delivery: {
            estimatedTime: 45,
            type: "DELIVERY"
        },
        payment: {
            method: "ONLINE",
            status: "PAID"
        },
        createdAt: new Date().toISOString(),
        metadata: {
            simulacion: true,
            timestamp: timestamp
        }
    };
    
    try {
        const url = `${RAILWAY_URL}/api/webhooks/pedidosya/order/${REMOTE_ID}`;
        console.log(`   📤 POST: ${url}`);
        console.log(`   📦 Orden:`);
        console.log(`      🆔 ID: ${orden.orderId}`);
        console.log(`      👤 Cliente: ${orden.customer.name}`);
        console.log(`      🍕 Items: ${orden.items.length} productos`);
        console.log(`      💰 Total: $${orden.totals.total}`);
        
        const response = await axios.post(url, orden, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'PedidosYa-Webhook/1.0'
            },
            timeout: 15000
        });
        
        console.log(`   ✅ ¡ORDEN ENVIADA EXITOSAMENTE!`);
        console.log(`   📨 Response Status: ${response.status} ${response.statusText}`);
        console.log(`   📦 Response Data:`);
        console.log(JSON.stringify(response.data, null, 4));
        
        return response.data;
        
    } catch (error) {
        console.log(`   ❌ Error enviando orden:`);
        if (error.response) {
            console.log(`      📊 Status: ${error.response.status}`);
            console.log(`      📄 Response:`, error.response.data);
            console.log(`      📋 Headers:`, error.response.headers);
        } else if (error.request) {
            console.log(`      🔌 No se pudo conectar a Railway`);
            console.log(`      🌐 URL intentada:`, error.config?.url);
        } else {
            console.log(`      ⚠️  Error:`, error.message);
        }
        return null;
    }
}

/**
 * Mostrar instrucciones para conectar SSE
 */
function mostrarInstruccionesSSE() {
    console.log('\n📡 3. INSTRUCCIONES PARA CONECTAR SSE:');
    console.log('=====================================');
    console.log('Para recibir las órdenes por SSE, ejecuta en otra terminal:');
    console.log('');
    console.log(`curl -N "${RAILWAY_URL}/sse"`);
    console.log('');
    console.log('O abre en el navegador:');
    console.log(`${RAILWAY_URL}/sse`);
    console.log('');
    console.log('Deberías ver los eventos SSE en tiempo real cuando lleguen órdenes.');
}

/**
 * Actualizar estado de la orden (opcional)
 */
async function actualizarEstado(remoteOrderId) {
    console.log(`\n🔄 4. ACTUALIZANDO ESTADO DE LA ORDEN ${remoteOrderId}...`);
    
    const estado = {
        status: 'CONFIRMED',
        message: 'Pedido confirmado y en preparación',
        estimatedTime: 30,
        timestamp: new Date().toISOString()
    };
    
    try {
        const url = `${RAILWAY_URL}/api/webhooks/pedidosya/remoteId/${REMOTE_ID}/remoteOrder/${remoteOrderId}/posOrderStatus`;
        console.log(`   📤 PUT: ${url}`);
        console.log(`   📦 Nuevo estado: ${estado.status}`);
        
        const response = await axios.put(url, estado, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        console.log(`   ✅ Estado actualizado exitosamente!`);
        console.log(`   📦 Response:`, JSON.stringify(response.data, null, 4));
        
    } catch (error) {
        console.log(`   ❌ Error actualizando estado:`);
        if (error.response) {
            console.log(`      📊 Status: ${error.response.status}`);
            console.log(`      📄 Data:`, error.response.data);
        } else {
            console.log(`      🔌 Error:`, error.message);
        }
    }
}

/**
 * Ejecutar simulación
 */
async function ejecutarSimulacion() {
    try {
        // 1. Verificar Railway
        const railwayActivo = await verificarRailway();
        if (!railwayActivo) {
            console.log('\n❌ Railway no está disponible. Verifica el despliegue.');
            return;
        }
        
        // 2. Mostrar instrucciones SSE
        mostrarInstruccionesSSE();
        
        // 3. Esperar confirmación del usuario
        console.log('\n⏳ Presiona ENTER cuando tengas la conexión SSE lista...');
        console.log('   (O presiona ENTER para continuar sin SSE)');
        
        // Simular espera (en un entorno real podrías usar readline)
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('   🚀 Continuando con el envío de la orden...\n');
        
        // 4. Enviar orden
        const resultado = await enviarOrdenSimulada();
        
        // 5. Si todo salió bien, actualizar estado después de un momento
        if (resultado && resultado.remoteOrderId) {
            console.log('\n⏳ Esperando 5 segundos antes de actualizar estado...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            await actualizarEstado(resultado.remoteOrderId);
        }
        
        console.log('\n🎉 SIMULACIÓN COMPLETADA');
        console.log('========================');
        console.log('🔍 Verifica:');
        console.log('  1. Los logs de Railway (si tienes acceso)');
        console.log('  2. La conexión SSE para ver si llegaron los eventos');
        console.log('  3. Que el estado se haya actualizado correctamente');
        
    } catch (error) {
        console.error('\n❌ Error en la simulación:', error.message);
    }
}

// Ejecutar
ejecutarSimulacion().catch(console.error);
