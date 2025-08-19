/**
 * 📡 Cliente SSE - Simulador de PHP/Tachyon
 * 
 * PROPÓSITO:
 * Este archivo simula cómo PHP/Tachyon se conectaría por SSE al servidor
 * de TestPEdidosYa en Railway para recibir órdenes en tiempo real.
 * 
 * FUNCIONAMIENTO:
 * - Se conecta por SSE a TestPEdidosYa en Railway
 * - Escucha eventos de nuevas órdenes
 * - Escucha actualizaciones de estado
 * - Muestra los datos como los recibiría PHP
 * 
 * USO:
 * 1. Asegúrate de que TestPEdidosYa esté desplegado en Railway
 * 2. Ejecuta: node cliente-sse.js
 * 3. En otra terminal ejecuta: node simulador-railway.js
 * 4. Verás los eventos SSE llegando en tiempo real
 * 
 * NOTA:
 * Este archivo NO va a producción, solo para pruebas locales
 */

const { EventSource } = require('eventsource');

// Configuración - URL de TestPEdidosYa en Railway
const RAILWAY_URL = 'https://webhookpedidosyaorgiuto-production.up.railway.app';
const SSE_ENDPOINT = `${RAILWAY_URL}/sse`;

console.log('📡 CLIENTE SSE - SIMULADOR PHP/TACHYON');
console.log('=====================================');
console.log(`🌐 Conectando a: ${SSE_ENDPOINT}`);
console.log('⏳ Esperando eventos SSE...');
console.log('💡 Ejecuta "node simulador-railway.js" en otra terminal para generar eventos');
console.log('');

/**
 * Inicializar conexión SSE
 */
function iniciarConexionSSE() {
    const eventSource = new EventSource(SSE_ENDPOINT);
    
    // Evento: Conexión establecida
    eventSource.onopen = function(event) {
        console.log('✅ Conexión SSE establecida correctamente');
        console.log('👂 Escuchando eventos...\n');
    };
    
    // Evento: Mensaje genérico
    eventSource.onmessage = function(event) {
        console.log('📨 MENSAJE SSE RECIBIDO:');
        console.log('   📄 Datos:', event.data);
        console.log('   🆔 ID:', event.lastEventId || 'N/A');
        console.log('   🕐 Timestamp:', new Date().toLocaleString());
        console.log('');
    };
    
    // Evento: Nueva orden (específico)
    eventSource.addEventListener('nueva-orden', function(event) {
        console.log('🍕 NUEVA ORDEN RECIBIDA POR SSE:');
        console.log('================================');
        
        try {
            const orden = JSON.parse(event.data);
            console.log('📦 Datos de la orden:');
            console.log(`   🆔 Order ID: ${orden.orderId}`);
            console.log(`   🏪 Restaurante: ${orden.restaurant?.name || 'N/A'}`);
            console.log(`   👤 Cliente: ${orden.customer?.name || 'N/A'}`);
            console.log(`   📍 Dirección: ${orden.customer?.address?.street || 'N/A'}`);
            console.log(`   🍕 Items: ${orden.items?.length || 0} productos`);
            console.log(`   💰 Total: $${orden.totals?.total || 0}`);
            console.log(`   🕐 Creada: ${orden.createdAt || 'N/A'}`);
            console.log('');
            console.log('📋 JSON completo:');
            console.log(JSON.stringify(orden, null, 2));
            console.log('');
            console.log('🔄 En PHP esto se procesaría y guardaría en la base de datos');
        } catch (error) {
            console.log('   ❌ Error parseando JSON:', error.message);
            console.log('   📄 Datos raw:', event.data);
        }
        console.log('========================================\n');
    });
    
    // Evento: Estado actualizado
    eventSource.addEventListener('estado-actualizado', function(event) {
        console.log('🔄 ESTADO ACTUALIZADO POR SSE:');
        console.log('==============================');
        
        try {
            const estado = JSON.parse(event.data);
            console.log('📦 Actualización de estado:');
            console.log(`   🆔 Order ID: ${estado.remoteOrderId || 'N/A'}`);
            console.log(`   📊 Estado: ${estado.status || 'N/A'}`);
            console.log(`   💬 Mensaje: ${estado.message || 'N/A'}`);
            console.log(`   ⏱️  Tiempo estimado: ${estado.estimatedTime || 'N/A'} min`);
            console.log(`   🕐 Timestamp: ${estado.timestamp || 'N/A'}`);
            console.log('');
            console.log('📋 JSON completo:');
            console.log(JSON.stringify(estado, null, 2));
            console.log('');
            console.log('🔄 En PHP esto actualizaría el estado en la base de datos');
        } catch (error) {
            console.log('   ❌ Error parseando JSON:', error.message);
            console.log('   📄 Datos raw:', event.data);
        }
        console.log('==============================\n');
    });
    
    // Evento: Error en la conexión
    eventSource.onerror = function(event) {
        console.log('❌ ERROR EN CONEXIÓN SSE:');
        console.log('   🔌 Estado:', eventSource.readyState);
        console.log('   📊 Ready states: 0=CONNECTING, 1=OPEN, 2=CLOSED');
        
        if (eventSource.readyState === EventSource.CLOSED) {
            console.log('   🔚 Conexión cerrada. Intentando reconectar...');
            // EventSource reconecta automáticamente
        } else if (eventSource.readyState === EventSource.CONNECTING) {
            console.log('   🔄 Reconectando...');
        }
        console.log('');
    };
    
    // Manejar cierre del programa
    process.on('SIGINT', function() {
        console.log('\n🛑 Cerrando conexión SSE...');
        eventSource.close();
        console.log('✅ Conexión cerrada correctamente');
        process.exit(0);
    });
    
    return eventSource;
}

/**
 * Mostrar información de uso
 */
function mostrarAyuda() {
    console.log('💡 CÓMO USAR ESTE CLIENTE SSE:');
    console.log('=============================');
    console.log('1. Deja este programa corriendo');
    console.log('2. En otra terminal ejecuta: node simulador-railway.js');
    console.log('3. Verás aquí los eventos SSE que llegan en tiempo real');
    console.log('4. Presiona Ctrl+C para cerrar');
    console.log('');
}

// Iniciar programa
mostrarAyuda();
const conexionSSE = iniciarConexionSSE();

// Mantener el programa corriendo
console.log('🔄 Programa en ejecución... (Ctrl+C para salir)');
