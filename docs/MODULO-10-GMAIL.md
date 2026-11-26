# Módulo 10 – Gmail (facturas y resúmenes desde el correo)

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Casos de uso: CU-003 (integrar una cuenta de correo), CU-013 (administrar integraciones), CU-015 (resumen detectado por email). Reglas: RN-007 (consentimiento para la IA), RN-011 (desconectar no borra el historial), RN-016. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Que el usuario no tenga que bajar ni subir nada: conecta su Gmail una vez y las facturas de luz, gas, internet, etc. y los resúmenes de tarjeta que le llegan por correo se cargan solos, leídos por la IA y esperando su confirmación en "Para revisar".

## Punto de partida

- **Base (ya existe, sin código que la use):** `integrations` (proveedor, cuenta, estado, `sync_cursor`, `last_sync_at`), `integration_credentials` (tokens cifrados, `key_version`), `integration_processed_items` (un registro por mensaje/adjunto: importado, descartado, duplicado, fallido) y `provider_email_rules` (remitente, asunto, adjunto, tipo de documento, regex del nro. de cliente) con reglas cargadas para los 29 proveedores del catálogo. El caso BBVA (resumen en el cuerpo del email, sin PDF) está modelado en V10.
- **Ya hay:** login con Google (OAuth + PKCE vía BFF), la cola de lectura con IA (módulo 9) con sus procesadores de facturas y resúmenes, "Para revisar" en el Inicio, avisos (módulo 8) y el servicio asociado por nro. de cliente.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Permiso | Solo `gmail.readonly`, pedido aparte del login (al tocar "Conectar Gmail"), con una pantalla previa que explica qué se lee | El login no debe pedir acceso al correo; el usuario decide cuándo |
| Qué correos se leen | Solo los que coinciden con las reglas de proveedores (búsqueda de Gmail por remitente); el resto ni se descarga | Privacidad: no leemos el correo personal |
| Desde cuándo | El usuario elige: solo los nuevos, últimos 3, 6 o 12 meses | Cargar el historial es útil, pero que no sea obligatorio |
| Tokens | Cifrados con AES-GCM y una clave del `.env` (`INTEGRATIONS_KEY`), nunca al log ni al front | Son credenciales de su correo |
| Cliente de Gmail | Llamadas HTTP directas a la API de Gmail (`java.net.http`), sin la librería de Google | Son 3 endpoints; no vale sumar una dependencia grande |
| Qué pasa con cada adjunto | Se guarda en Documentos (origen Gmail) y entra a la cola de la IA; la propuesta aparece en "Para revisar" y en la campana | Reusa todo el módulo 9; el usuario siempre confirma |
| Consentimiento IA (RN-007) | Conectar Gmail incluye aceptar que los adjuntos detectados se lean con IA (se dice en la pantalla previa) | Sin eso no hay automatización |
| Cada cuánto | Cada 15 minutos, y un botón "Sincronizar ahora" | Suficiente para facturas; no gasta cuota de la API |
| Desconectar | Revoca el permiso en Google y borra los tokens; los documentos importados quedan (RN-011) | Lo que ya se cargó es del usuario |
| Verificación de Google | Mientras la app no esté verificada por Google, solo funciona con las cuentas cargadas como "usuarios de prueba" en Google Cloud | `gmail.readonly` es un permiso restringido |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 10.1 | Conectar y desconectar Gmail: pantalla Integraciones, OAuth, tokens cifrados | `feature/gmail-1-2` (junto con 10.2) | — | [ ] |
| 10.2 | Sincronización: busca por reglas, guarda los adjuntos y los manda a la IA | `feature/gmail-1-2` | 10.1 | [ ] |
| 10.3 | Resumen sin PDF en el cuerpo (BBVA) y facturas de proveedores sin servicio | `feature/gmail-3-4` (junto con 10.4) | 10.2 | [ ] |
| 10.4 | "Detectado en tu correo", reconexión y avisos | `feature/gmail-3-4` | 10.2 | [ ] |

Orden recomendado: 10.1 → 10.2 → 10.3 → 10.4. Con 10.1 y 10.2 las facturas ya llegan solas.

---

## Parte 10.1 – Conectar Gmail

### Backend
- [ ] `POST /integrations/gmail/authorization` (URL de Google con `gmail.readonly`, PKCE y state) y `POST /integrations/gmail` (canjea el código, guarda la integración con la cuenta de Gmail y los tokens cifrados, y "desde cuándo").
- [ ] `GET /integrations` (estado, cuenta, última sincronización) y `DELETE /integrations/{id}` (revoca en Google, borra tokens, queda `DISCONNECTED`).
- [ ] Renovación del token de acceso con el refresh token; si Google lo rechaza, `REAUTH_REQUIRED`.
- [ ] Tests: cifrado ida y vuelta, state/PKCE, aislamiento.

### Frontend
- [ ] Ítem "Integraciones" en el menú; pantalla con Gmail (conectar / conectado como … / desconectar con confirmación).
- [ ] Pantalla previa: qué se lee (solo correos de tus proveedores), que no se envía nada y que los adjuntos se leen con IA; elegir desde cuándo.
- [ ] Ruta de vuelta de Google en el BFF y resultado (conectado / cancelado / error).

**Listo cuando:** conecto mi Gmail, veo "Conectado como …" y al desconectar el permiso desaparece en mi cuenta de Google.

---

## Parte 10.2 – Sincronización

### Backend
- [ ] `GmailSyncJob` cada 15 minutos (y `POST /integrations/{id}/sync`): arma la búsqueda con los remitentes de `provider_email_rules` desde la última sincronización (o desde "desde cuándo"), recorre los mensajes y aplica la regla del proveedor (asunto, nombre del adjunto).
- [ ] Cada adjunto que coincide: se guarda en Documentos (origen `GMAIL`, tipo según la regla), se asocia al servicio por el nro. de cliente cuando se puede y se encola para la IA. Cada mensaje queda en `integration_processed_items` (no se procesa dos veces).
- [ ] Mismo archivo ya subido (checksum): `DUPLICATE`, sin crear otro documento.
- [ ] Tests con un Gmail simulado: coincide/no coincide, sin duplicados al sincronizar dos veces, el cursor avanza.

**Listo cuando:** me llega la factura de luz por email y en unos minutos está en "Para revisar".

---

## Parte 10.3 – Resúmenes en el cuerpo y proveedores sin servicio

### Backend
- [ ] Resumen que solo informa totales en el cuerpo (BBVA): se registra el resumen con vencimiento y saldos en pesos y dólares (`PENDING_VALIDATION`, sin consumos), identificando la tarjeta por los últimos 4 de la cuenta, y aviso `CARD_STATEMENT_AVAILABLE` ("Subí el PDF para ver los consumos").
- [ ] Factura de un proveedor del catálogo sin servicio registrado (o con nro. de cliente desconocido): el documento queda importado y el aviso propone crear o vincular el servicio.

### Frontend
- [ ] En el resumen detectado por email: totales, vencimiento y botón para subir el PDF.
- [ ] Desde el aviso, alta del servicio con el proveedor y el nro. de cliente ya completos.

**Listo cuando:** el email de BBVA crea el resumen con su vencimiento y su tarjeta, y aparece en Vencimientos.

---

## Parte 10.4 – Detectado en tu correo y reconexión

### Frontend
- [ ] En el detalle de la integración: lista de mensajes procesados (remitente, asunto, fecha y resultado: importado, descartado, duplicado, falló) con enlace al documento.
- [ ] "Sincronizar ahora" y última sincronización.
- [ ] Aviso y banner de "Reconectá Gmail" cuando Google revoca o vence el permiso (`REAUTH_REQUIRED` → aviso `INTEGRATION_DISCONNECTED`).

**Listo cuando:** veo qué emails se importaron y, si revoco el permiso desde Google, la app me pide reconectar.
