# 🔧 Simuladores PedidosYa

Esta carpeta contiene diferentes simuladores y herramientas de testing para la integración con PedidosYa.

## 📋 Archivos Disponibles

### `cliente-sse.js`
**Propósito**: Cliente SSE para probar la conexión en tiempo real con el servidor Railway.
```bash
npm run test:sse
```
- Se conecta al endpoint SSE del servidor
- Muestra todos los eventos recibidos en tiempo real
- Útil para verificar que los webhooks lleguen correctamente

### `simulador.js`
**Propósito**: Simulador básico de webhooks de PedidosYa.
```bash
npm run simulator
```
- Envía webhooks de prueba al servidor
- Simula pedidos nuevos y cambios de estado
- Configuración básica y fácil de usar

### `simulador-completo.js`
**Propósito**: Simulador completo con interfaz y múltiples opciones.
```bash
npm run simulator:complete
```
- Interfaz más avanzada
- Múltiples tipos de webhooks
- Configuración detallada de pedidos

### `simulador-railway.js`
**Propósito**: Simulador específico para testing con Railway en producción.
```bash
npm run simulator:railway
```
- Configurado para apuntar al servidor de Railway
- Usa las credenciales reales de PedidosYa
- Para testing en ambiente de producción

### `test-simulator.js`
**Propósito**: Testing automatizado de la integración.
```bash
npm run test:simulator
```
- Ejecuta tests automáticos
- Verifica respuestas del servidor
- Útil para CI/CD o testing continuo

## 🚀 Uso Rápido

1. **Para probar localmente:**
   ```bash
   npm run dev          # Inicia servidor local
   npm run test:sse     # En otra terminal, conecta cliente SSE
   npm run simulator    # En otra terminal, envía webhooks
   ```

2. **Para probar con Railway:**
   ```bash
   npm run test:sse            # Cliente SSE (local o Railway)
   npm run simulator:railway   # Envía a Railway
   ```

## 🔧 Configuración

Los simuladores leen la configuración desde `../src/config.js`. Puedes modificar:
- URLs de los servidores
- Credenciales de PedidosYa  
- Tipos de webhooks a simular
- Tiempos de espera y reintentos

## 📝 Notas

- Todos los simuladores incluyen logs detallados
- Los webhooks siguen el formato oficial de PedidosYa
- Se incluyen ejemplos de pedidos reales (anonimizados)
