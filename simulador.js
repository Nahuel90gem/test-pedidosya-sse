/**
 * 🧪 Simulador Simple de PedidosYa
 * Envía webhooks de prueba al servidor local
 */

const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const REMOTE_ID = 'PYTEST007'; // Coincide con el config del servidor

// Simular nueva orden
async function simularOrden() {
    const orden = {
        orderId: `ORDER_${Date.now()}`,
        remoteOrderId: `REMOTE_${Date.now()}`,
        restaurant: {
            id: REMOTE_ID,
            name: "Restaurante Test"
        },
        customer: {
            name: "Cliente Prueba",
            phone: "+598 99 123 456",
            address: {
                street: "18 de Julio 1234",
                city: "Montevideo"
            }
        },
        items: [
            {
                id: "pizza_001",
                name: "Pizza Napolitana",
                quantity: 1,
                price: 450
            }
        ],
        totals: {
            subtotal: 450,
            delivery: 50,
            total: 500
        },
        createdAt: new Date().toISOString()
    };

    try {
        console.log('🍕 Enviando orden simulada...');
        const response = await axios.post(`${SERVER_URL}/order/${REMOTE_ID}`, orden);
        console.log('✅ Orden enviada exitosamente:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Simular actualización de estado
async function simularEstado(remoteOrderId) {
    const estado = {
        status: 'CONFIRMED',
        message: 'Pedido confirmado',
        timestamp: new Date().toISOString()
    };

    try {
        console.log('🔄 Actualizando estado...');
        const url = `${SERVER_URL}/remoteId/${REMOTE_ID}/remoteOrder/${remoteOrderId}/posOrderStatus`;
        const response = await axios.put(url, estado);
        console.log('✅ Estado actualizado:', response.data);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Ejecutar pruebas
async function ejecutarPruebas() {
    console.log('🚀 Iniciando simulación de PedidosYa...\n');
    
    // 1. Simular nueva orden
    const resultado = await simularOrden();
    
    if (resultado && resultado.remoteOrderId) {
        console.log('\n');
        // 2. Simular actualización de estado
        await simularEstado(resultado.remoteOrderId);
    }
    
    console.log('\n🎉 Simulación completada!');
}

ejecutarPruebas().catch(console.error);
