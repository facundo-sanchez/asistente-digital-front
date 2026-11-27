# Módulos 15 a 24 – Mejoras

> Plan de las mejoras que siguen a los 14 módulos. Cada módulo se divide en partes verticales (backend + frontend) que se prueban y se mergean solas.
> Al terminar una parte: marcar `[x]` y anotar la fecha. Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

| Módulo | Mejora | Rama | Depende de | Estado |
|---|---|---|---|---|
| 15 | App instalable (PWA) y notificaciones push | `feature/push-<n>-*` | 8 | [ ] |
| 16 | Alerta de aumentos de servicios | `feature/aumentos` | 5, 8 | [ ] |
| 17 | Débito automático | `feature/debito-automatico` | 2, 4 | [ ] |
| 18 | Suscripciones en la tarjeta | `feature/suscripciones` | 11 | [ ] |
| 19 | Calendario (link iCal) | `feature/calendario` | 4 | [ ] |
| 20 | Presupuesto del mes | `feature/presupuesto` | 11 | [ ] |
| 21 | Bienes (auto, casa, electrodomésticos) | `feature/bienes-<n>-*` | 3, 4 | [ ] |
| 22 | Resumen anual exportable | `feature/resumen-anual` | 4, 11 | [ ] |
| 23 | Hogar compartido | `feature/hogar-<n>-*` | todos | [ ] |
| 24 | Seguridad: verificación en dos pasos y sesiones | `feature/seguridad` | 1 | [ ] |

Orden acordado: **17, 16 y 15** primero (débito automático, aumentos, push); después 18 y 19.

---

## Módulo 15 – App instalable (PWA) y notificaciones push

**Objetivo:** que la app se instale en el celular y avise con notificaciones del sistema, sin depender del email.

| Tema | Decisión | Por qué |
|---|---|---|
| Instalación | Manifiesto web (nombre, íconos de la roseta, colores, `display: standalone`) y service worker mínimo | Es lo que pide el navegador para "Instalar app" o "Agregar a inicio" |
| Offline | Sin modo sin conexión: el service worker solo recibe push y muestra una pantalla "Sin conexión" | Los datos son de cuentas: mostrar datos viejos confunde |
| Envío | Web Push estándar con claves VAPID, enviado desde el backend | Gratis, sin Firebase, funciona en Android, escritorio e iPhone con la app instalada (iOS 16.4+) |
| Qué se manda | Las mismas notificaciones del módulo 8 por un canal nuevo `PUSH` (que la tabla ya prevé), con sus preferencias | Un aviso, tres canales |
| Suscripciones | Una por navegador o dispositivo; se borra sola si el servicio de push responde 404/410 | El usuario puede tener celular y compu |

### Parte 15.1 – Instalable
- [ ] Front: `manifest.webmanifest`, íconos (192, 512, maskable) generados de la roseta, `theme-color` por modo, service worker en `public/sw.js` registrado solo en producción.
- [ ] Front: pantalla "Sin conexión" del service worker.
- **Listo cuando:** Chrome en Android ofrece "Instalar app" y abre sin barra del navegador.

### Parte 15.2 – Notificaciones push
- [ ] Backend: migración `push_subscriptions` (usuario, endpoint, claves p256dh y auth, user agent, fechas); `POST /push-subscriptions` y `DELETE /push-subscriptions`; claves `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` (sin ellas, push no disponible).
- [ ] Backend: envío con cifrado Web Push (librería `web-push` de Java); tarea que manda las notificaciones `PUSH` pendientes como el resumen por email (reintentos, `FAILED` al quinto); borra la suscripción ante 404/410.
- [ ] Backend: preferencias del módulo 8 con el canal `PUSH`.
- [ ] Front: service worker muestra la notificación y al tocarla abre su link; Mi perfil → Avisos: "En este dispositivo" (activar o desactivar, pide permiso al tocarlo, nunca al entrar).
- [ ] Tests: suscribir, enviar (cliente falso), borrar ante 410, aislamiento.
- **Listo cuando:** con la app instalada en el celular llega "Mañana vence Gas casa · $ 32.100" y al tocarla abre el vencimiento.

---

## Módulo 16 – Alerta de aumentos

**Objetivo:** avisar cuando una factura de un servicio viene bastante más cara que las anteriores.

| Tema | Decisión | Por qué |
|---|---|---|
| Con qué se compara | Con el promedio de las últimas 3 facturas confirmadas del mismo servicio y la misma moneda (mínimo 1) | Una sola factura anterior puede ser un mes raro |
| Umbral | 20 % por defecto, configurable en Mi perfil (10 %, 20 %, 30 %, 50 %) | Con inflación, aumentos chicos son normales |
| Cuándo | Al confirmar la factura (manual, leída por IA o de Gmail) | Es cuando el dato está listo |
| Cómo se avisa | Notificación nueva `PRICE_INCREASE` (web, email y push con sus preferencias) y una marca en la factura | Mismo sistema de avisos |

### Parte 16.1
- [ ] Backend: al confirmar una factura, compara y, si supera el umbral, crea la notificación (idempotente por factura) y guarda el porcentaje en la factura; tipo `PRICE_INCREASE` en preferencias; `users.price_increase_threshold`.
- [ ] Front: en la factura, "38 % más que el promedio de tus últimas 3 ($ 23.300)"; en la lista de facturas un indicador; en el detalle del servicio, gráfico de barras con el importe de cada factura.
- [ ] Front: Mi perfil → Avisos: "Avisarme si una factura sube más de…".
- [ ] Tests: sin historial no avisa; 3 anteriores y 25 % avisa con 20 %; otra moneda no se compara; no duplica.
- **Listo cuando:** confirmo una factura de gas 38 % más cara y me llega "Tu factura de gas subió 38 %".

---

## Módulo 17 – Débito automático

**Objetivo:** que los servicios que se debitan solos no obliguen a registrar el pago cada mes.

| Tema | Decisión | Por qué |
|---|---|---|
| Dónde se marca | En el servicio: "Se paga por débito automático", con el medio (tarjeta o cuenta, texto libre) | Es una propiedad del servicio |
| Qué hace | El día del vencimiento, la tarea diaria registra el pago de sus vencimientos pendientes con importe (método `AUTOMATIC_DEBIT`, sin comprobante) | Lo que el usuario haría a mano |
| Avisos | Los vencimientos con débito no mandan "vence pronto" ni "vencido": mandan "Mañana se debita Gas casa · $ 32.100" | El usuario no tiene que hacer nada, solo saber |
| Sin importe | Si el vencimiento no tiene importe, no se registra el pago y se avisa "No sabemos cuánto se debitó" | No inventar montos |
| Corregir | El pago automático se anula como cualquier otro (por ejemplo, si el débito rebotó) | Mismo mecanismo de pagos |

### Parte 17.1
- [ ] Backend: migración `services.auto_debit` (bool) y `auto_debit_method` (texto); método de pago `AUTOMATIC_DEBIT`; la tarea diaria registra los pagos del día (idempotente: no paga dos veces); notificación `AUTO_DEBIT` un día antes; los de débito se excluyen de "vence pronto" y "vencido".
- [ ] Front: en el formulario del servicio, "Se paga por débito automático" y el medio; en vencimientos y en el inicio, la marca "Débito automático"; en la factura, el botón Pagar no aparece (se debita solo).
- [ ] Tests: registra el pago el día del vencimiento, no duplica, sin importe no paga y avisa, excluido de vencidos, aislamiento.
- **Listo cuando:** marco Luz como débito automático y el día que vence aparece pagada sola, con el aviso del día anterior.

---

## Módulo 18 – Suscripciones en la tarjeta

**Objetivo:** ver los cargos que se repiten todos los meses en la tarjeta, cuánto suman y cuál aumentó.

- Decisión: es suscripción un comercio con consumo sin cuotas en al menos 3 de los últimos 4 resúmenes, con importes dentro del ±30 % (las suscripciones en pesos suben seguido). El usuario puede marcar "No es una suscripción" y se recuerda por comercio.
- [ ] Backend: `GET /cards/subscriptions` desde `v_card_spending`; tabla de comercios descartados; aumento respecto del mes anterior.
- [ ] Front: "Suscripciones" en Tarjetas: comercio, último importe, desde cuándo, aumento, total por mes por moneda.
- [ ] Asistente: herramienta `subscriptions()`.
- **Listo cuando:** Netflix y Spotify aparecen como suscripciones con su total mensual.

## Módulo 19 – Calendario

**Objetivo:** ver los vencimientos en Google Calendar, Outlook o el calendario del celular.

- Decisión: un link iCal privado por usuario (token largo y aleatorio, se puede regenerar), de solo lectura, con los vencimientos pendientes de los próximos 12 meses; el calendario lo actualiza solo.
- [ ] Backend: `users.calendar_token`; `GET /calendar/{token}.ics` público (el token es la clave), eventos de todo el día con título, importe y link a la app.
- [ ] Front: Mi perfil → Calendario: copiar link, cómo agregarlo en Google y en el iPhone, "Generar otro link" (invalida el anterior).
- **Listo cuando:** agrego el link en Google Calendar y veo los vencimientos del mes.

## Módulo 20 – Presupuesto del mes

**Objetivo:** fijar cuánto gastar por mes (en total o por rubro de tarjeta y categoría de servicio) y saber cómo vas.

- Decisión: presupuestos por moneda, mensuales; se compara con lo pagado de vencimientos y lo consumido con tarjeta en el mes de cierre; avisos al 80 % y al 100 %.
- [ ] Backend: tabla `budgets` (usuario, rubro o categoría o total, moneda, monto); `GET /budgets/current` con lo gastado; notificación `BUDGET_THRESHOLD` idempotente por mes.
- [ ] Front: "Presupuesto" con barras por rubro (la roseta para el total), alta y edición; en el inicio, el total del mes.
- **Listo cuando:** con $ 200.000 para supermercado, al pasar los $ 160.000 me avisa.

## Módulo 21 – Bienes

**Objetivo:** el auto, la casa y los electrodomésticos con sus vencimientos, documentos y mantenimientos (CU-010).

- Decisión: usa la tabla `assets` que ya existe; vencimientos y documentos ya pueden apuntar a un bien.
- [ ] 21.1 Backend y front: alta, edición y baja de bienes por tipo (vehículo: patente, modelo, año; inmueble: dirección; electrodoméstico: marca, modelo, fecha de compra).
- [ ] 21.2 Ficha del bien: sus vencimientos (seguro, VTV, patente, garantía) y documentos; atajos para crear "VTV anual" o "Seguro mensual" como recurrencia.
- [ ] 21.3 Mantenimientos: registro (fecha, kilometraje, costo, comprobante) y "próximo service" como vencimiento.
- **Listo cuando:** el auto muestra su seguro, la VTV y el último service con su comprobante.

## Módulo 22 – Resumen anual

**Objetivo:** lo pagado en el año, por servicio, categoría y rubro, para revisar o para Ganancias (alquiler, prepaga, servicio doméstico).

- [ ] Backend: `GET /reports/yearly?year=` por moneda; `GET /reports/yearly.xlsx` con hojas por servicio, por mes y de pagos con comprobante.
- [ ] Front: "Resumen anual" con selector de año, totales y descarga del Excel; versión para imprimir.
- **Listo cuando:** descargo el Excel de 2026 con lo pagado de alquiler mes por mes y sus comprobantes listados.

## Módulo 23 – Hogar compartido

**Objetivo:** compartir servicios, vencimientos y pagos con la pareja o la familia.

- Decisión: un "hogar" con miembros (dueño y miembros, invitación por email); los servicios se crean en el hogar o personales; cada pago registra quién pagó. Es el cambio más grande: toda consulta pasa de "del usuario" a "del usuario o de su hogar" (RN-002).
- [ ] 23.1 Hogar e invitaciones (aceptar, salir, quitar miembro).
- [ ] 23.2 Servicios, vencimientos, facturas y documentos compartidos; filtro "Míos / Del hogar".
- [ ] 23.3 Quién pagó cada cosa y cuánto puso cada uno en el mes.
- **Listo cuando:** mi pareja ve la factura de luz, la paga y yo la veo pagada por ella.

## Módulo 24 – Seguridad

**Objetivo:** proteger cuentas con datos sensibles al abrir la app al público.

- [ ] Verificación en dos pasos con app de autenticación (TOTP), códigos de recuperación, obligatoria para pedir al iniciar sesión con contraseña si está activada.
- [ ] Sesiones activas en Mi perfil (dispositivo, fecha) y "Cerrar sesión en todos los dispositivos" (revoca los refresh tokens).
- [ ] Límite de intentos de login por email e IP.
- **Listo cuando:** con la verificación activada, el login pide el código y desde Mi perfil cierro la sesión del celular.
