# Tachyon PedidosYa Integration Server

Servidor Node.js para integración con PedidosYa usando Server-Sent Events (SSE) para comunicación en tiempo real con el sistema PHP de Tachyon.

## 🏗️ Arquitectura

```
PedidosYa → Railway (Node.js) → SSE → PHP Tachyon
```

1. **PedidosYa** envía webhooks al servidor
2. **Servidor Node.js** recibe y procesa los webhooks
3. **SSE** envía eventos en tiempo real al cliente PHP
4. **PHP Tachyon** procesa los pedidos en tiempo real

## 🚀 Endpoints Implementados

### SSE (Server-Sent Events)
- `GET /webhook/sse-events` - Conexión SSE para el cliente PHP

### PedidosYa Webhooks
- `POST /api/webhooks/pedidosya/{remoteId}/orders` - Recibir nuevos pedidos
- `POST /api/webhooks/pedidosya/{remoteId}/orders/{orderToken}/status` - Actualizaciones de estado

### Información y Testing
- `GET /` - Información del servidor y endpoints disponibles
- `GET /status` - Estado detallado del servidor
- `POST /test/webhook` - Endpoint para pruebas manuales

## 📋 Configuración PedidosYa

### Credenciales Actuales:
- **Integration**: Orgiuto SA (AR-ORGIUTO-SA-1)
- **Chain ID**: ARORGIUTOSATEST0001 (test)
- **Vendor Remote ID**: PYTEST007
- **Plugin URL**: `https://test-pedidosya-sse-production.up.railway.app/api/webhooks/pedidosya`

### URLs Específicas:
- **Nuevos pedidos**: `POST /api/webhooks/pedidosya/PYTEST007/orders`
- **Estados**: `POST /api/webhooks/pedidosya/PYTEST007/orders/{orderToken}/status`

### 🔧 Parámetros de Integración POS (Según documentación oficial):

| Field Name | Known as in Docs | Required for |
|------------|------------------|--------------|
| **POS Credentials** | Auth - Login | • API - POS Auth login |
| **Base URL** | Plugin URL | • External client Plugins URL where orders and statuses are going to be notified |
| | remoteId | • Plugin - Dispatch Order - Path Parameter<br>• Plugin - Update Order Status - Path Parameter |
| **Vendor Remote ID** | posVendorId | • API - POS Vendor Availability Status - Path Parameter<br>• API - Vendor Information - Path Parameter |
| | vendorId | • API - POS Order Report Service - Query Parameter |
| **Chain ID** | chainCode | • API - POS Vendor Availability Status - Path Parameter<br>• API - POS Order Report Service<br>• API - Vendor Information - Path Parameter |

### 📝 Mapeo de nuestros valores:
- **remoteId**: `PYTEST007` (usado en URLs de webhook)
- **posVendorId**: `PYTEST007` (mismo valor)
- **chainCode**: `ARORGIUTOSATEST0001` (para APIs de PedidosYa)
- **Plugin URL**: `https://test-pedidosya-sse-production.up.railway.app/api/webhooks/pedidosya`

## 🧪 Testing Local

### 1. Iniciar servidor:
```bash
npm install
npm start
```

### 2. Conectar cliente PHP:
```bash
cd ../Tachyon/integration/WebHook
php run.php
```

### 3. Probar webhook manualmente:
```bash
curl -X POST http://localhost:3000/test/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true, "message": "Hello from curl"}'
```

### 4. Simular pedido de PedidosYa:
```bash
curl -X POST http://localhost:3000/api/webhooks/pedidosya/PYTEST007/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "order_12345",
    "orderToken": "token_abc123",
    "customer": {
      "name": "Juan Pérez",
      "phone": "123456789"
    },
    "items": [
      {
        "name": "Pizza Margarita",
        "quantity": 1,
        "price": 850
      }
    ],
    "total": 850,
    "deliveryType": "own_delivery"
  }'
```

## 📡 Eventos SSE

### Tipos de eventos enviados al PHP:

#### Conexión
```json
{
  "type": "connection",
  "message": "Conectado al servidor de PedidosYa",
  "timestamp": "2025-08-18T21:30:00.000Z"
}
```

#### Nuevo Pedido
```json
{
  "type": "pedidosya_new_order",
  "remoteId": "PYTEST007",
  "order": {
    "id": "order_12345",
    "orderToken": "token_abc123",
    "customer": {...},
    "items": [...],
    "total": 850
  },
  "source": "pedidosya",
  "timestamp": "2025-08-18T21:30:00.000Z"
}
```

#### Actualización de Estado
```json
{
  "type": "pedidosya_status_update",
  "remoteId": "PYTEST007",
  "orderToken": "token_abc123",
  "status": {
    "newStatus": "cancelled",
    "reason": "Customer cancelled"
  },
  "source": "pedidosya",
  "timestamp": "2025-08-18T21:30:00.000Z"
}
```

#### Test Manual
```json
{
  "type": "test_webhook",
  "data": {
    "test": true,
    "message": "Test desde curl"
  },
  "source": "manual_test",
  "timestamp": "2025-08-18T21:30:00.000Z"
}
```

## 🔧 Desarrollo

### Estructura del proyecto:
```
test-pedidosya-sse/
├── package.json
├── server.js          # Servidor principal
├── README.md          # Esta documentación
└── .gitignore
```

### Logs del servidor:
```
🚀 Tachyon PedidosYa Server iniciado en puerto 3000
📡 SSE endpoint: http://localhost:3000/webhook/sse-events
🍔 PedidosYa NEW ORDER: POST /api/webhooks/pedidosya/PYTEST007/orders
🔄 PedidosYa STATUS: POST /api/webhooks/pedidosya/PYTEST007/orders/{token}/status
📊 Status: http://localhost:3000/status
🧪 Test: POST http://localhost:3000/test/webhook

🔗 Nueva conexión SSE desde PHP
🍔 NUEVO PEDIDO recibido de PedidosYa
📡 Enviando evento SSE [pedidosya_new_order] a 1 clientes
✅ Pedido procesado y enviado por SSE
```

## 🚀 Deploy en Railway

### 1. Push a GitHub:
```bash
git add .
git commit -m "Add PedidosYa webhooks with SSE integration"
git push
```

### 2. Railway detecta cambios automáticamente y re-deploya

### 3. URL en producción:
- **Base**: `https://test-pedidosya-sse-production.up.railway.app`
- **SSE**: `https://test-pedidosya-sse-production.up.railway.app/webhook/sse-events`
- **PedidosYa**: `https://test-pedidosya-sse-production.up.railway.app/api/webhooks/pedidosya/PYTEST007/orders`

## 📝 TODO

### Próximos pasos:
- [ ] Testing local completo
- [ ] Deploy a Railway
- [ ] Configurar URL en PedidosYa (temporal)
- [ ] Pruebas con webhooks reales
- [ ] Migrar código a repositorio definitivo
- [ ] Configuración final en PedidosYa

### Mejoras futuras:
- [ ] Autenticación para webhooks
- [ ] Base de datos para logs
- [ ] Retry logic para fallos de SSE
- [ ] Métricas y monitoring
- [ ] Rate limiting
- [ ] Validación de esquemas JSON

## 🔗 Enlaces útiles

- **Documentación PedidosYa**: https://integration-middleware.stg.restaurant-partners.com/apidocs/pos-plugin-api
- **Repositorio actual**: https://github.com/Nahuel90gem/test-pedidosya-sse
- **Repositorio final**: https://github.com/Nahuel90gem/TestPEdidosYa
- **Railway Dashboard**: https://railway.app
