# 📚 Documentación PedidosYa

Esta carpeta contiene toda la documentación oficial y recursos de referencia para la integración con PedidosYa.

## 📁 Estructura

### `api/` - Especificaciones API
- **`middlewareExternalApi.yaml`**: Especificación OpenAPI de la External Middleware API
- **`pluginApi.yaml`**: Especificación OpenAPI de la Plugin API oficial

### `html/` - Documentación HTML Guardada
- **`Delivery Hero - POS Middleware API.html`**: Documentación completa de Middleware API
- **`Delivery Hero - POS Plugin API.html`**: Documentación completa de Plugin API
- **`*_files/`**: Archivos de soporte (CSS, JS, imágenes) para las páginas HTML

### `images/` - Recursos Visuales
- Capturas de pantalla de la configuración
- Diagramas de flujo de la integración
- Screenshots de ejemplos de webhooks

## 🔗 APIs Principales

### 1. Plugin API (Webhooks)
**URL Base**: `https://test-pedidosya-sse-production.up.railway.app/api/webhooks/pedidosya`

**Endpoints que implementamos:**
- `POST /{remoteId}/orders` - Recibir nuevos pedidos
- `POST /{remoteId}/orders/{orderToken}/status` - Actualizaciones de estado

### 2. External Middleware API (Opcional)
**URL Base**: `https://external-middleware-api.deliveryhero.io`

**Endpoints disponibles para consultar:**
- `GET /pos/vendors/{posVendorId}/availability` - Estado del vendor
- `GET /pos/vendors/{posVendorId}` - Información del vendor
- `POST /pos/auth/login` - Autenticación POS

## 📋 Credenciales Actuales

```
Integration: Orgiuto SA (AR-ORGIUTO-SA-1)
Chain ID: ARORGIUTOSATEST0001 (test)
Vendor Remote ID: PYTEST007
Plugin URL: https://test-pedidosya-sse-production.up.railway.app/api/webhooks/pedidosya
```

## 🔄 Flujo de Integración

1. **PedidosYa** envía webhook → **Plugin API** (nuestro servidor)
2. **Nuestro servidor** procesa y envía → **SSE** → **Cliente PHP**
3. **Cliente PHP** procesa pedido en **Tachyon**
4. **Tachyon** puede consultar datos via **External Middleware API**

## 📖 Cómo Leer la Documentación

1. **Empieza por**: `Delivery Hero - POS Plugin API.html` (lo que implementamos)
2. **Complementa con**: `Delivery Hero - POS Middleware API.html` (servicios adicionales)
3. **Usa las especificaciones YAML** para detalles técnicos específicos

## ⚡ Enlaces Rápidos

- [Plugin API Docs](./html/Delivery%20Hero%20-%20POS%20Plugin%20API.html)
- [Middleware API Docs](./html/Delivery%20Hero%20-%20POS%20Middleware%20API.html)
- [Plugin API YAML](./api/pluginApi.yaml)
- [Middleware API YAML](./api/middlewareExternalApi.yaml)
