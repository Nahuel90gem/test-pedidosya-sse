# 📝 ANOTACIONES TÉCNICAS - Webhooks PedidosYa

> **Fecha**: 19 de Agosto 2025  
> **Estado**: Documentación técnica para retomar desarrollo

## 🎯 **WEBHOOKS - Información Crítica**

### 📡 **Endpoint de Recepción**
```
URL Base: https://test-pedidosya-sse-production.up.railway.app
Webhook Path: /api/webhooks/pedidosya/{remoteId}/orders
Estado Path: /api/webhooks/pedidosya/{remoteId}/orders/{orderToken}/status
```

### 🔑 **Parámetros Importantes**
- **remoteId**: `PYTEST007` (nuestro identificador en PedidosYa)
- **orderToken**: Identificador único del pedido generado por PedidosYa
- **Content-Type**: `application/json`
- **Method**: `POST` para ambos endpoints

## 📋 **FORMATO DE WEBHOOKS**

### 🆕 **Nuevo Pedido**
```javascript
// POST /api/webhooks/pedidosya/PYTEST007/orders
{
  "orderToken": "py_order_ABC123DEF456",
  "order": {
    "id": "12345",
    "externalId": "PY-2025-001234",
    "client": {
      "name": "Juan Pérez",
      "phone": "+541234567890",
      "email": "juan@email.com" // opcional
    },
    "items": [
      {
        "id": "item_123",
        "name": "Pizza Margarita",
        "quantity": 1,
        "price": 1200.00,
        "notes": "Sin aceitunas", // opcional
        "modifiers": [ // opcional
          {
            "name": "Extra queso",
            "price": 150.00
          }
        ]
      }
    ],
    "subtotal": 1200.00,
    "taxes": 220.80,
    "deliveryFee": 200.00,
    "total": 1620.80,
    "deliveryAddress": {
      "street": "Av. Corrientes 1234",
      "city": "Buenos Aires",
      "state": "CABA",
      "zipCode": "C1043AAZ",
      "country": "AR",
      "coordinates": { // opcional
        "lat": -34.6037,
        "lng": -58.3816
      },
      "notes": "Portero eléctrico, piso 3A"
    },
    "paymentMethod": "CASH", // CASH, CARD, ONLINE
    "orderType": "DELIVERY", // DELIVERY, PICKUP
    "scheduledDate": null, // para pedidos programados
    "estimatedDeliveryTime": "2025-08-19T15:30:00.000Z",
    "notes": "Llamar al llegar"
  },
  "restaurant": {
    "id": "rest_123",
    "name": "Pizza Express",
    "address": "Av. Santa Fe 2000"
  },
  "timestamp": "2025-08-19T14:25:00.000Z"
}
```

### 🔄 **Cambio de Estado**
```javascript
// POST /api/webhooks/pedidosya/PYTEST007/orders/py_order_ABC123DEF456/status
{
  "orderToken": "py_order_ABC123DEF456",
  "status": "CONFIRMED", // Ver estados posibles abajo
  "previousStatus": "PENDING",
  "estimatedDeliveryTime": "2025-08-19T15:30:00.000Z",
  "actualDeliveryTime": null, // solo cuando status = DELIVERED
  "notes": "Pedido confirmado, preparando",
  "timestamp": "2025-08-19T14:26:00.000Z"
}
```

## 🔄 **ESTADOS DE PEDIDOS**

### 📊 **Flujo Normal**
```
PENDING → CONFIRMED → PREPARING → READY → DISPATCHED → DELIVERED
```

### 📋 **Estados Detallados**
| Estado | Descripción | Acción Requerida |
|--------|-------------|------------------|
| `PENDING` | Pedido recibido, esperando confirmación | Confirmar o rechazar |
| `CONFIRMED` | Pedido confirmado por restaurante | Empezar preparación |
| `PREPARING` | Pedido en preparación | Notificar cuando esté listo |
| `READY` | Pedido listo para recoger/enviar | Asignar delivery |
| `DISPATCHED` | Pedido en camino | Tracking activo |
| `DELIVERED` | Pedido entregado | Proceso completado |
| `CANCELLED` | Pedido cancelado | Notificar razón |
| `REJECTED` | Pedido rechazado por restaurante | Notificar razón |

### ⚠️ **Estados de Error**
| Estado | Descripción | Acción |
|--------|-------------|--------|
| `CANCELLED` | Cliente canceló | No procesar |
| `REJECTED` | Restaurante rechazó | Notificar razón |
| `FAILED` | Error en delivery | Investigar |

## 🚀 **RESPUESTAS ESPERADAS**

### ✅ **Respuesta Exitosa**
```javascript
// HTTP 200 OK
{
  "success": true,
  "message": "Webhook procesado correctamente",
  "orderToken": "py_order_ABC123DEF456",
  "timestamp": "2025-08-19T14:25:00.000Z"
}
```

### ❌ **Respuesta de Error**
```javascript
// HTTP 400/500
{
  "success": false,
  "error": "Error específico",
  "code": "INVALID_ORDER_FORMAT",
  "message": "Descripción del error",
  "orderToken": "py_order_ABC123DEF456",
  "timestamp": "2025-08-19T14:25:00.000Z"
}
```

## 📡 **EVENTOS SSE GENERADOS**

### 🎯 **Formato de Evento SSE**
```javascript
// Lo que recibe el cliente PHP via SSE
{
  "type": "nuevo_pedido", // o "cambio_estado"
  "timestamp": "2025-08-19T14:25:00.000Z",
  "orderToken": "py_order_ABC123DEF456",
  "remoteId": "PYTEST007",
  "data": { 
    // payload completo del webhook original
  },
  "metadata": {
    "source": "pedidosya_webhook",
    "processed": "2025-08-19T14:25:01.123Z",
    "server": "railway"
  }
}
```

### 📻 **Tipos de Eventos**
- `nuevo_pedido`: Webhook de nuevo pedido recibido
- `cambio_estado`: Webhook de cambio de estado recibido  
- `heartbeat`: Ping cada 30 segundos para mantener conexión
- `error`: Error procesando webhook
- `conexion`: Cliente SSE conectado/desconectado

## ⚠️ **CONSIDERACIONES IMPORTANTES**

### 🔒 **Seguridad**
- ❗ **Sin autenticación**: PedidosYa no envía headers de auth (verificar)
- ❗ **Sin firma**: No hay validación de firma del webhook
- ❗ **IP pública**: Cualquiera puede enviar POST a nuestro endpoint
- ⚠️ **Solución pendiente**: Implementar whitelist de IPs de PedidosYa

### 🕐 **Timing**
- **Timeout webhooks**: PedidosYa espera respuesta en <5 segundos
- **Retry logic**: PedidosYa reintenta 3 veces si no responde  
- **SSE timeout**: Conexiones se cortan después de ~30 minutos inactivas
- **Heartbeat**: Enviamos ping cada 30 segundos

### 📊 **Volumen**
- **Pico estimado**: ~50 pedidos/hora en rush (viernes/sábado noche)
- **Promedio**: ~10-15 pedidos/hora
- **SSE concurrentes**: Máximo 5-10 conexiones PHP simultáneas

### 🔄 **Retry y Fallos**
- **Railway downtime**: ¿Qué pasa con webhooks perdidos?
- **SSE desconectado**: ¿Cómo recuperar eventos perdidos?
- **PHP offline**: ¿Buffer de eventos? ¿Por cuánto tiempo?

## 🧪 **TESTING**

### 🎯 **Casos de Prueba Críticos**
1. **Pedido normal completo**: PENDING → DELIVERED
2. **Pedido cancelado**: PENDING → CANCELLED  
3. **Pedido rechazado**: PENDING → REJECTED
4. **Múltiples items**: Pedido con 5+ productos
5. **Modificadores**: Items con extras/modificaciones
6. **Delivery programado**: Pedido para más tarde
7. **Pago online**: PaymentMethod = ONLINE
8. **SSE reconexión**: Cliente se desconecta y reconecta

### 🔧 **URLs de Testing**
```bash
# Local
http://localhost:3000/webhook/sse-events
http://localhost:3000/api/webhooks/pedidosya/PYTEST007/orders

# Railway  
https://test-pedidosya-sse-production.up.railway.app/webhook/sse-events
https://test-pedidosya-sse-production.up.railway.app/api/webhooks/pedidosya/PYTEST007/orders
```

## 📞 **CONTACTOS Y RECURSOS**

### 🔗 **Enlaces Útiles**
- **Railway Dashboard**: [URL del proyecto]
- **PedidosYa Developer Portal**: [URL si tenemos]
- **Plugin API Docs**: Saved in `docs/html/`
- **Postman Collection**: [Crear una colección para testing]

### 📧 **Contactos**
- **PedidosYa Technical Support**: [email/phone]
- **Account Manager**: [nombre y contacto]
- **Integration Team**: [si tenemos contacto directo]

---

**📅 Fecha de creación**: 19 de Agosto 2025  
**🔄 Última actualización**: 19 de Agosto 2025  
**👤 Autor**: GitHub Copilot + Team  
**⚠️ Estado**: CONGELADO - Actualizar al retomar
