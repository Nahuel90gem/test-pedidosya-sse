# 🧪 test-pedidosya-sse - Estado del Proyecto (CONGELADO)

> **Fecha de congelación**: 19 de Agosto 2025  
> **Estado**: Repositorio de testing reorganizado y funcional  
> **Propósito**: Desarrollo, testing y documentación de la integración PedidosYa  

## 📊 **¿Qué ES este repositorio?**

**Repositorio de desarrollo y testing** para la integración con PedidosYa. Contiene simuladores, documentación oficial, herramientas de prueba y código de desarrollo local.

## 🗂️ **REORGANIZACIÓN REALIZADA (Agosto 2025)**

### 📁 **Estructura ANTES (caótica)**
```
test-pedidosya-sse/
├── cliente-sse.js (simulador)
├── simulador*.js (varios simuladores mezclados)
├── server.js (código)
├── config.js (configuración)
├── *.yaml (documentación API)
├── *.html (páginas guardadas)
├── *.jpg (imágenes sueltas)
└── README.md
```

### 📁 **Estructura DESPUÉS (organizada)**
```
test-pedidosya-sse/
├── docs/                    # 📚 DOCUMENTACIÓN
│   ├── api/                 # Especificaciones YAML
│   │   ├── middlewareExternalApi.yaml
│   │   └── pluginApi.yaml
│   ├── html/               # Páginas HTML guardadas
│   │   ├── Delivery Hero - POS Middleware API.html
│   │   ├── Delivery Hero - POS Plugin API.html
│   │   └── *_files/ (archivos de soporte)
│   ├── images/             # Capturas e imágenes
│   │   └── Sin título.jpg
│   └── README.md           # Guía de documentación
├── simulators/             # 🔧 HERRAMIENTAS DE TESTING
│   ├── cliente-sse.js      # Cliente SSE para pruebas
│   ├── simulador.js        # Simulador básico
│   ├── simulador-completo.js # Simulador con UI
│   ├── simulador-railway.js  # Testing con Railway
│   ├── test-simulator.js   # Testing automatizado
│   └── README.md           # Guía de simuladores
├── src/                    # 🚀 CÓDIGO FUENTE
│   ├── server.js           # Servidor de desarrollo
│   └── config.js           # Configuración del proyecto
├── package.json            # Scripts actualizados
└── README.md              # Documentación principal
```

## ✅ **LO QUE YA ESTÁ HECHO**

### 📚 **Documentación Completa**
- ✅ **Documentación oficial guardada**: HTML completos de PedidosYa APIs
- ✅ **Especificaciones YAML**: OpenAPI specs de Plugin y Middleware APIs
- ✅ **READMEs estructurados**: Guías para cada carpeta
- ✅ **Capturas de pantalla**: Ejemplos visuales guardados

### 🔧 **Simuladores Funcionales**
- ✅ **Cliente SSE**: Conecta y muestra eventos en tiempo real
- ✅ **Simulador básico**: Envía webhooks de prueba
- ✅ **Simulador completo**: Interfaz avanzada con múltiples opciones
- ✅ **Simulador Railway**: Testing específico para producción
- ✅ **Test automatizado**: Scripts de testing continuo

### ⚙️ **Configuración y Scripts**
- ✅ **Package.json actualizado**: Scripts para cada simulador
- ✅ **Configuración centralizada**: `src/config.js` con todas las settings
- ✅ **Paths corregidos**: Todo apunta a las nuevas ubicaciones

### 🎯 **Scripts Disponibles**
```bash
npm run dev                    # Servidor desarrollo local
npm run test:sse              # Cliente SSE (conectar a servidor)
npm run simulator             # Simulador básico
npm run simulator:complete    # Simulador completo con UI
npm run simulator:railway     # Testing directo con Railway
npm run test:simulator        # Testing automatizado
```

## ⚠️ **LO QUE FALTA POR HACER**

### 🧪 **Testing Avanzado**
- ❌ **Test de carga**: Simular 100+ pedidos simultáneos
- ❌ **Test de fallos**: Qué pasa si Railway se cae
- ❌ **Test de red**: Simulaciones con latencia/timeouts
- ❌ **Test end-to-end**: Desde PedidosYa real hasta PHP

### 📊 **Herramientas de Análisis**
- ❌ **Monitor de performance**: Tiempos de respuesta
- ❌ **Analítica de webhooks**: Tipos de pedidos más comunes
- ❌ **Dashboard de testing**: UI para ver resultados
- ❌ **Comparador de APIs**: Diff entre versiones de PedidosYa

### 🔄 **Simuladores Avanzados**
- ❌ **Simulador realista**: Basado en datos reales anonimizados
- ❌ **Simulador de errores**: Casos edge y errores comunes
- ❌ **Simulador multi-vendor**: Para múltiples restaurantes
- ❌ **Simulador de volumen**: Picos de demanda (ej. viernes noche)

### 📚 **Documentación Faltante**
- ❌ **Casos de uso**: Flujos completos documentados
- ❌ **Troubleshooting**: Guía de problemas comunes
- ❌ **Changelog**: Historial de cambios en APIs
- ❌ **Best practices**: Recomendaciones de implementación

## 📝 **NOTAS IMPORTANTES TÉCNICAS**

### 🔗 **URLs de Testing**
```bash
# Railway Production
https://test-pedidosya-sse-production.up.railway.app

# Local Development  
http://localhost:3000

# Endpoints importantes
/webhook/sse-events                          # SSE Connection
/api/webhooks/pedidosya/PYTEST007/orders     # Nuevos pedidos
/api/webhooks/pedidosya/PYTEST007/orders/{token}/status # Estados
/status                                      # Info del servidor
```

### 🔧 **Configuración Actual**
```javascript
// src/config.js - Configuración principal
{
  servidor: {
    puerto: 3000,
    cors: { origen: '*', metodos: [...], headers: [...] }
  },
  pedidosya: {
    integracion: "AR-ORGIUTO-SA-1",
    chainId: "ARORGIUTOSATEST0001", 
    vendorRemoteId: "PYTEST007",
    webhookUrl: "https://test-pedidosya-sse-production.up.railway.app"
  }
}
```

### 📡 **Tipos de Eventos SSE**
```javascript
// Eventos que envía el servidor
{
  type: "nuevo_pedido" | "cambio_estado" | "heartbeat" | "error",
  timestamp: "ISO string",
  orderToken: "string",
  remoteId: "PYTEST007", 
  data: { /* payload de PedidosYa */ }
}
```

### 🎯 **Formatos de Webhook Esperados**
```javascript
// Nuevo pedido
POST /api/webhooks/pedidosya/PYTEST007/orders
{
  "orderToken": "ABC123",
  "order": {
    "id": "12345",
    "client": { "name": "...", "phone": "..." },
    "items": [{ "name": "...", "quantity": 1, "price": 100 }],
    "total": 1500.50,
    "deliveryAddress": { "street": "...", "city": "..." },
    "paymentMethod": "CASH" | "CARD"
  }
}

// Cambio de estado
POST /api/webhooks/pedidosya/PYTEST007/orders/ABC123/status  
{
  "orderToken": "ABC123",
  "status": "CONFIRMED" | "PREPARING" | "READY" | "DISPATCHED" | "DELIVERED",
  "estimatedDeliveryTime": "2025-08-19T15:30:00Z"
}
```

## 🚨 **PROBLEMAS CONOCIDOS**

### 🔧 **Simuladores**
1. **simulador-railway.js**: A veces timeout en Railway por latencia
2. **cliente-sse.js**: Reconexión manual si se corta la conexión
3. **Config paths**: Verificar que apunten a `src/config.js` después del move

### 📚 **Documentación**
1. **HTML files**: Algunos links internos pueden estar rotos
2. **YAML specs**: Verificar que estén actualizados con última versión
3. **Screenshots**: Algunos pueden estar desactualizados

### 🔄 **Testing**
1. **Sin CI/CD**: Tests se ejecutan manualmente
2. **No hay mocks**: Dependemos de Railway real para testing
3. **Cleanup**: Tests no limpian datos de prueba

## 🔄 **PRÓXIMOS PASOS CUANDO SE RETOME**

### 🥇 **Prioridad ALTA**
1. **Verificar que todos los simuladores funcionen** después de la reorganización
2. **Actualizar documentación** con cualquier cambio de PedidosYa
3. **Implementar testing automatizado** (CI/CD)

### 🥈 **Prioridad MEDIA**  
1. **Crear simulador realista** con datos más cercanos a producción
2. **Dashboard de testing** para visualizar resultados
3. **Integración con PHP Tachyon** para testing end-to-end

### 🥉 **Prioridad BAJA**
1. **Migrar a TypeScript** para mejor tipado
2. **Dockerizar** para desarrollo consistente
3. **Crear ambiente de staging** separado de test

## 📞 **RECURSOS Y ENLACES**

### 🔗 **Enlaces Importantes**
- **Railway Dashboard**: [URL del proyecto TestPEdidosYa]
- **PedidosYa Developer Portal**: [si tenemos acceso]
- **Plugin API Docs**: `docs/html/Delivery Hero - POS Plugin API.html`
- **Middleware API Docs**: `docs/html/Delivery Hero - POS Middleware API.html`

### 📋 **Credenciales de Testing**
```
Integration: Orgiuto SA (AR-ORGIUTO-SA-1)
Chain ID: ARORGIUTOSATEST0001
Vendor Remote ID: PYTEST007
Environment: TEST/SANDBOX
```

### 🛠️ **Herramientas Recomendadas**
- **Postman**: Para testing manual de APIs
- **curl**: Para testing rápido desde terminal
- **Browser DevTools**: Para debugging SSE connections
- **Railway CLI**: Para deployment y logs

---

## ⚠️ **IMPORTANTE AL RETOMAR**

1. **Verificar que Railway esté funcionando** - revisar logs y métricas
2. **Comprobar que PedidosYa no cambió las APIs** - revisar documentación oficial
3. **Testear todos los simuladores** - ejecutar cada script y verificar funcionamiento
4. **Revisar configuración** - confirmar que URLs y credenciales siguen válidas
5. **Actualizar dependencias** - `npm audit` y `npm update`

**📅 Fecha de congelación**: 19 de Agosto 2025  
**🔄 Recordatorio**: Actualizar este README cuando se retome el desarrollo
