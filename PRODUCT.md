# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público general en Argentina que organiza la vida administrativa de su hogar: servicios (luz, gas, agua, internet), facturas, vencimientos, pagos y tarjetas de crédito. Es un producto público: cualquier persona puede registrarse, así que la app tiene que generar confianza desde la primera pantalla. Entran unos minutos cuando llega una factura o se acerca un vencimiento, desde el celular o la computadora.

## Product Purpose

Reunir en un solo lugar servicios, facturas, vencimientos, pagos y resúmenes de tarjeta, para que la persona sepa de un vistazo qué vence, qué está pagado y qué falta. Éxito: el usuario no se pierde un vencimiento y siente que tiene sus cuentas bajo control.

## Positioning

Asistente que trabaja por el usuario: detecta facturas y resúmenes de tarjeta en su correo (Gmail, solo lectura), extrae los datos con IA y le pide confirmación antes de registrar nada. El usuario revisa y confirma; no carga todo a mano.

## Operating Context

- Flujo principal: llega una factura o un resumen (por email o cargado a mano) → se confirma → genera una obligación con vencimiento → se registra el pago.
- Montos en pesos (ARS) y dólares (USD); formato regional es-AR.
- Proveedores reales del catálogo (ej. Coopelectric, BBVA para tarjetas).
- Autenticación con email y contraseña o con Google.

## Capabilities and Constraints

- Hecho: registro, login (email y Google), verificación de email, recupero de contraseña, perfil (nombre, zona horaria, idioma, moneda).
- Planificado (ver docs/ROADMAP-MODULOS.md): proveedores y servicios, documentos, obligaciones y pagos, facturas, tarjetas y resúmenes, dashboard, notificaciones, IA documental, Gmail, informe de consumos, asistente IA.
- Stack: Next.js 16 (App Router), React 19, MUI 9, Tailwind 4. El navegador nunca habla con el backend directo: todo pasa por el BFF.
- Modo claro y oscuro (pedido del usuario).

## Brand Commitments

- Nombre visible: "Asistente de Vida Digital". No hay logo todavía.
- Voz en español rioplatense (vos), clara y tranquila.

## Evidence on Hand

No hay testimonios, clientes, métricas ni capturas reales. No inventarlos.

## Product Principles

1. Tranquilidad antes que urgencia: mostrar el estado con claridad, sin alarmismo; lo urgente se destaca, lo demás descansa.
2. El usuario confirma: nada se registra sin que lo vea (facturas detectadas, propuestas de la IA).
3. De un vistazo: qué vence, qué está pagado y qué falta tiene que leerse sin navegar.
4. Confianza: datos financieros privados; la interfaz nunca debe parecer improvisada.
