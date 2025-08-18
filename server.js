const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Test súper simple - Solo responder "Hola"
app.get('/webhook/sse-events', (req, res) => {
    console.log('🔗 PHP se conectó!');
    
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // Enviar mensaje de bienvenida
    res.write('data: {"message": "Hola desde Railway!", "timestamp": "' + new Date().toISOString() + '"}\n\n');

    // Enviar un mensaje cada 5 segundos
    const interval = setInterval(() => {
        res.write('data: {"message": "Ping desde Railway", "timestamp": "' + new Date().toISOString() + '"}\n\n');
    }, 5000);

    // Limpiar cuando se cierre
    req.on('close', () => {
        console.log('❌ PHP se desconectó');
        clearInterval(interval);
    });
});

// Página de estado simple
app.get('/', (req, res) => {
    res.json({
        message: 'Servidor de test funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📡 SSE endpoint: http://localhost:${PORT}/webhook/sse-events`);
    console.log(`📊 Status: http://localhost:${PORT}/status`);
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
