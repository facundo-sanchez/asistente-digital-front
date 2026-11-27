# Módulo 10 – Gmail (facturas y resúmenes desde el correo)

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Casos de uso: CU-003 (integrar una cuenta de correo), CU-013 (administrar integraciones), CU-015 (resumen detectado por email). Reglas: RN-007 (consentimiento para la IA), RN-011 (desconectar no borra el historial), RN-016. Criterio de código: simple, sin abstracciones de más.

**Estado (26/11/2026):** las 4 partes hechas y mergeadas en `develop`; probado con Gmail real (facturas de Camuzzi y Personal). Después se sumó el remitente de facturas en proveedores propios (ver ROADMAP).

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
| Qué pasa con cada email | Si trae el PDF (o foto, o Excel), se guarda el adjunto; si la factura viene en el cuerpo (Camuzzi, Coopelectric, Personal), se guarda el texto del email. Los dos van a Documentos (origen Gmail) y a la cola de la IA; la propuesta aparece en "Para revisar" y en la campana | Reusa todo el módulo 9 y no hace falta mantener expresiones por proveedor para los importes; el usuario siempre confirma |
| Consentimiento IA (RN-007) | Conectar Gmail incluye aceptar que los adjuntos detectados se lean con IA (se dice en la pantalla previa) | Sin eso no hay automatización |
| Cada cuánto | Cada 15 minutos, y un botón "Sincronizar ahora" | Suficiente para facturas; no gasta cuota de la API |
| Desconectar | Revoca el permiso en Google y borra los tokens; los documentos importados quedan (RN-011) | Lo que ya se cargó es del usuario |
| Verificación de Google | Mientras la app no esté verificada por Google, solo funciona con las cuentas cargadas como "usuarios de prueba" en Google Cloud | `gmail.readonly` es un permiso restringido |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 10.1 | Conectar y desconectar Gmail: pantalla Integraciones, OAuth, tokens cifrados | `feature/gmail-1-2` (junto con 10.2) | — | [x] |
| 10.2 | Sincronización: busca por reglas, guarda los adjuntos (o el texto del email) y los manda a la IA | `feature/gmail-1-2` | 10.1 | [x] |
| 10.3 | Resumen sin PDF en el cuerpo (BBVA) y facturas de proveedores sin servicio | `feature/gmail-3-4` (junto con 10.4) | 10.2 | [x] |
| 10.4 | "Detectado en tu correo", reconexión y avisos | `feature/gmail-3-4` | 10.2 | [x] |

Orden recomendado: 10.1 → 10.2 → 10.3 → 10.4. Con 10.1 y 10.2 las facturas ya llegan solas.

---

## Parte 10.1 – Conectar Gmail

### Backend
- [x] `POST /integrations/gmail/authorization` (URL de Google con `gmail.readonly`, PKCE y state) y `POST /integrations/gmail` (canjea el código, guarda la integración con la cuenta de Gmail y los tokens cifrados, y "desde cuándo").
- [x] `GET /integrations` (estado, cuenta, última sincronización) y `DELETE /integrations/{id}` (revoca en Google, borra tokens, queda `DISCONNECTED`).
- [x] Renovación del token de acceso con el refresh token; si Google lo rechaza, `REAUTH_REQUIRED`.
- [x] Tests: cifrado ida y vuelta, state/PKCE, aislamiento.

### Frontend
- [x] Ítem "Integraciones" en el menú; pantalla con Gmail (conectar / conectado como … / desconectar con confirmación).
- [x] Pantalla previa: qué se lee (solo correos de tus proveedores), que no se envía nada y que los adjuntos se leen con IA; elegir desde cuándo.
- [x] Ruta de vuelta de Google en el BFF y resultado (conectado / cancelado / error).

**Listo cuando:** conecto mi Gmail, veo "Conectado como …" y al desconectar el permiso desaparece en mi cuenta de Google.

**Hecho, falta la prueba con una cuenta real (26/11/2026):** `ConnectGmailUseCase` (URL con `gmail.readonly`, `access_type=offline` y PKCE; canje, cuenta por `/profile`, reconectar la misma cuenta la reactiva), `GmailAccess` (renueva el token con margen; si Google lo rechaza, `REAUTH_REQUIRED`), `AesGcmTokenCipher` (AES-256-GCM, clave `INTEGRATIONS_KEY`), `GmailApiClient` por HTTP. BFF: `/api/integrations/gmail` (state + PKCE en una cookie propia, "desde cuándo") y su callback. Front: ítem "Integraciones" en el menú, explicación previa, elegir desde cuándo, cuenta conectada, "Revisar ahora" y desconectar con confirmación. **Para probarlo hace falta** `INTEGRATIONS_KEY` en el `.env` y, en Google Cloud, habilitar la API de Gmail, registrar `FRONTEND_URL/api/integrations/gmail/callback` y cargar la cuenta como usuario de prueba.

---

## Parte 10.2 – Sincronización

### Backend
- [x] `GmailSyncJob` cada 15 minutos (y `POST /integrations/{id}/sync`): arma la búsqueda con los remitentes de `provider_email_rules` desde la última sincronización (o desde "desde cuándo"), recorre los mensajes y aplica la regla del proveedor (asunto, nombre del adjunto).
- [x] Cada adjunto que coincide: se guarda en Documentos (origen `GMAIL`, tipo según la regla), se asocia al servicio por el nro. de cliente cuando se puede y se encola para la IA. Cada mensaje queda en `integration_processed_items` (no se procesa dos veces).
- [x] Mismo archivo ya subido (checksum): `DUPLICATE`, sin crear otro documento.
- [x] Tests con un Gmail simulado: coincide/no coincide, sin duplicados al sincronizar dos veces, el cursor avanza.

**Listo cuando:** me llega la factura de luz por email y en unos minutos está en "Para revisar".

**Hecho, falta la prueba con una cuenta real (26/11/2026):** `GmailSyncUseCase`: búsqueda `from:(remitentes y dominios de las reglas) after:` desde la última revisión (con un día de margen), "desde cuándo" o la conexión; la regla coincide por dirección exacta o dominio/subdominio del proveedor (un dominio parecido no pasa) y por asunto. Adjunto legible → `importFile`; sin adjunto y regla `EMAIL_BODY` → el texto del email (`text/plain`, que `AiInputs` le pasa a la IA como texto). Servicio: por el nro. de cliente del email o, si no, el único servicio activo del proveedor. Cada mensaje queda en `integration_processed_items` (importado, descartado, duplicado o falló). Hasta 50 mensajes por revisión. `GmailSyncJob` cada 15 minutos.

---

## Parte 10.3 – Resúmenes en el cuerpo y proveedores sin servicio

> Cambió respecto del plan original: el email (adjunto o texto) ya entra a la IA desde 10.2, así que el resumen de BBVA sin PDF llega a la revisión de resúmenes como cualquier otro y la tarjeta se busca por los últimos 4 de la cuenta. Acá quedó pulir esas revisiones.

### Backend
- [x] `EmailOriginRepository`: si un documento llegó por Gmail, de qué proveedor y con qué servicio se asoció.
- [x] Revisión de factura: usa el servicio que asoció Gmail; si no hay, avisa que es de un proveedor sin servicio y devuelve `suggestedProviderId`.
- [x] Revisión de resumen: si llegó por email sin consumos, avisa que trae solo los totales.

### Frontend
- [x] En la revisión de factura: "Registralo acá" lleva al alta de servicio con el proveedor y el nro. de cliente completos, y al guardar vuelve a la revisión.

**Listo cuando:** el email de BBVA crea el resumen con su vencimiento y su tarjeta, y una factura de un proveedor sin servicio se registra sin tipear el proveedor.

**Hecho, falta la prueba con una cuenta real (26/11/2026).** Queda afuera: subir después el PDF de un resumen que llegó sin consumos para sumarle los movimientos (hoy sería otro resumen con el mismo vencimiento).

---

## Parte 10.4 – Detectado en tu correo y reconexión

### Frontend
- [x] En el detalle de la integración: lista de mensajes procesados (remitente, asunto, fecha y resultado: importado, descartado, duplicado, falló) con enlace al documento.
- [x] "Sincronizar ahora" y última sincronización.
- [x] Aviso y banner de "Reconectá Gmail" cuando Google revoca o vence el permiso (`REAUTH_REQUIRED` → aviso `INTEGRATION_DISCONNECTED`).

**Listo cuando:** veo qué emails se importaron y, si revoco el permiso desde Google, la app me pide reconectar.

**Hecho, falta la prueba con una cuenta real (26/11/2026):** `GET /integrations/{id}/emails` y panel "Detectado en tu correo" en Integraciones (asunto con enlace al documento, remitente, fecha y resultado: importado, ya estaba, no es factura, falló y se reintenta). Al pasar a `REAUTH_REQUIRED` se avisa una vez (`INTEGRATION_DISCONNECTED`, en la campana y por email según preferencias; el aviso lleva a Integraciones, donde está "Volver a conectar Gmail").
