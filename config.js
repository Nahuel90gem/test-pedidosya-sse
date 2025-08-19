// ===== CONFIGURACIÓN CENTRAL DEL SERVIDOR PEDIDOSYA =====
// Este archivo contiene toda la configuración del proyecto para facilitar los cambios

module.exports = {
  // ===== CONFIGURACIÓN DEL SERVIDOR =====
  servidor: {
    // Puerto donde correrá el servidor (Railway usa process.env.PORT automáticamente)
    puerto: process.env.PORT || 3000,
    
    // Configuración CORS (Cross-Origin Resource Sharing) - Permite conexiones desde otros dominios
    cors: {
      origen: '*',                    // Permitir todos los dominios (cambiar en producción)
      metodos: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Métodos HTTP permitidos
      headers: ['Content-Type', 'Authorization']              // Headers permitidos
    }
  },

  // ===== CONFIGURACIÓN PEDIDOSYA =====
  pedidosya: {
    // IDs de integración con PedidosYa (NO MODIFICAR - vienen de la documentación oficial)
    identificadores: {
      remoteId: 'PYTEST007',                    // ID único del restaurante en nuestro sistema
      codigoCadena: 'ARORGIUTOSATEST0001',      // Código de la cadena (para APIs de PedidosYa)
      vendorId: 'PYTEST007',                   // ID del vendor (mismo que remoteId)
      integracion: 'Orgiuto SA (AR-ORGIUTO-SA-1)'  // Nombre de la integración
    },
    
    // URLs oficiales según Plugin API de PedidosYa (NO MODIFICAR - son estándar)
    rutasOficiales: {
      // POST /order/{remoteId} - Para recibir nuevos pedidos de PedidosYa
      pedidoNuevo: '/order/:remoteId',
      
      // PUT /remoteId/{remoteId}/remoteOrder/{remoteOrderId}/posOrderStatus - Para recibir cambios de estado
      actualizacionEstado: '/remoteId/:remoteId/remoteOrder/:remoteOrderId/posOrderStatus',
      
      // GET /menuimport/{remoteId} - Para cuando PedidosYa solicite nuestro menú
      importacionMenu: '/menuimport/:remoteId'
    },

    // URLs específicas para nuestro caso (se generan automáticamente para documentación)
    rutasEspecificas: {
      pedidoNuevo: '/order/PYTEST007',
      actualizacionEstado: '/remoteId/PYTEST007/remoteOrder/{remoteOrderId}/posOrderStatus',
      importacionMenu: '/menuimport/PYTEST007'
    }
  },

  // ===== CONFIGURACIÓN SSE (SERVER-SENT EVENTS) =====
  sse: {
    // Ruta para que PHP se conecte y reciba eventos en tiempo real
    ruta: '/webhook/sse-events',
    
    // Intervalo para mantener la conexión viva (30 segundos)
    intervaloKeepAlive: 30000,
    
    // Máximo número de clientes PHP conectados simultáneamente
    maxClientes: 100
  },

  // ===== RUTAS DE TESTING Y INFORMACIÓN =====
  testing: {
    rutas: {
      inicio: '/',                    // Página principal con información del servidor
      estado: '/status',              // Estado detallado del servidor
      pruebaWebhook: '/test/webhook'  // Para probar webhooks manualmente
    }
  },

  // ===== CONFIGURACIÓN DE LOGS Y DEBUG =====
  logging: {
    // Nivel de logging (info, debug, error)
    nivel: process.env.LOG_LEVEL || 'info',
    
    // Activar logs de requests HTTP
    logRequests: true,
    
    // Activar logs de eventos SSE
    logSSE: true
  },

  // ===== CONFIGURACIÓN DE AUTENTICACIÓN JWT (FUTURO) =====
  autenticacion: {
    // Secret para verificar tokens JWT de PedidosYa (cambiar en producción)
    secretJWT: process.env.JWT_SECRET || 'temp-secret-for-development',
    
    // Requerir autenticación (false para desarrollo, true para producción)
    requerirAuth: process.env.REQUIRE_AUTH === 'true' || false
  },

  // ===== CONFIGURACIÓN DE ENTORNO =====
  entorno: {
    // URL base completa del servidor (Railway la detecta automáticamente)
    urlBase: process.env.BASE_URL || 'https://test-pedidosya-sse-production.up.railway.app',
    
    // Detectar si estamos en desarrollo o producción
    esDesarrollo: process.env.NODE_ENV !== 'production',
    
    // URL para desarrollo local
    urlLocal: 'http://localhost:3000'
  }
};
