# Módulo 14 – Outlook

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Extiende el módulo 10 (Gmail). Criterio de código: simple, sin abstracciones de más.

**Estado (26/11/2026):** plan listo, sin empezar.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Que quien usa Outlook (outlook.com, hotmail.com, live.com o Microsoft 365) tenga lo mismo que con Gmail: facturas, resúmenes y avisos de cuota detectados en su correo, leídos y listos para confirmar.

## Punto de partida

- **Ya hay (módulo 10):** OAuth con PKCE y cookie del intento en el BFF; tokens cifrados con AES-GCM; reglas por proveedor (remitente, dominio, asunto); importación de adjuntos y del cuerpo del email; reintento de los fallidos; "Detectado en tu correo"; aviso de reconexión; tarea que revisa cada 15 minutos.
- **Atado a Gmail:** el puerto `GmailClient` y su adaptador `GmailApiClient`, `GmailAccess` (renovar el token), `GmailSyncUseCase`, los modelos `GmailMessage`, `GmailAttachment`, `GmailMessagePage`, las rutas `/integrations/gmail` del backend y del BFF, y el `CHECK` de `integrations.provider` (`GMAIL`, `PROVIDER_API`).

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Cómo se conecta | Microsoft Graph con OAuth 2.0 + PKCE, permiso delegado `Mail.Read` y `offline_access` (refresh token) | Lo mismo que Gmail; IMAP con contraseña ya no lo permite Outlook.com |
| Tipo de cuentas | Endpoint `common`: cuentas personales y de trabajo o escuela | Una sola app sirve para hotmail y Microsoft 365 (en una empresa, su administrador puede bloquear el consentimiento) |
| Registro de la app | Microsoft Entra (gratis), multi-tenant, con publicador verificado (gratis) | Sin verificar, Microsoft muestra "app no verificada" |
| Código común | El puerto pasa a ser `MailClient` (buscar, leer, bajar adjunto, revocar) con dos adaptadores: Gmail y Outlook; la sincronización deja de llamarse Gmail | Las reglas, la importación, la IA, los avisos y "Detectado" no cambian |
| Búsqueda | Gmail: `from:(...) after:` como hoy. Outlook: `$filter` por `receivedDateTime` y `from/emailAddress/address`, `$top` y paginado con `@odata.nextLink` | Cada API con su sintaxis, dentro de su adaptador |
| Dominios de remitente | Graph no filtra por dominio en el servidor: se pide por fecha y se filtra por remitente o dominio en el backend con la misma regla de hoy | Mismo criterio de coincidencia que Gmail |
| Varias cuentas | Un usuario puede tener Gmail y Outlook a la vez; cada cuenta se revisa por separado | Hay quien usa una para el banco y otra para los servicios |
| Frecuencia | La de Mi perfil (parte 13.6) vale para todas sus cuentas | Una sola preferencia |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 14.1 | Gmail pasa a ser "un correo": el mismo comportamiento sobre un puerto común | `feature/outlook-1` | módulo 10 | [ ] |
| 14.2 | Conectar Outlook y leer sus emails | `feature/outlook-2-3` (junto con 14.3) | 14.1 | [ ] |
| 14.3 | Outlook en Integraciones, Mi perfil y la presentación | `feature/outlook-2-3` | 14.2 | [ ] |

---

## Parte 14.1 – Un correo, dos proveedores

Refactor sin cambios visibles: Gmail tiene que funcionar exactamente igual al terminar.

### Backend
- [ ] `MailClient` (puerto) con `search`, `message`, `attachment`, `refresh`, `revoke`; modelos `MailMessage`, `MailAttachment`, `MailMessagePage` (los de Gmail renombrados); `GmailApiClient` lo implementa.
- [ ] `MailSync` (ex `GmailSyncUseCase`) y `MailAccess` (ex `GmailAccess`) eligen el adaptador por `integration.provider`.
- [ ] Migración: `ck_integrations_provider` suma `OUTLOOK`.
- [ ] Tests: los de Gmail pasan sin cambios de comportamiento (solo nombres).

### Frontend
- [ ] Sin cambios.

**Listo cuando:** toda la suite pasa y "Revisar ahora" con tu Gmail importa igual que antes.

---

## Parte 14.2 – Conectar Outlook

### Backend
- [ ] Configuración `MICROSOFT_CLIENT_ID` y `MICROSOFT_CLIENT_SECRET` (sin ellas, "Conectar Outlook" no disponible, como Gmail).
- [ ] `POST /integrations/outlook/authorization` y `POST /integrations/outlook` (canje del código, cuenta = email de `/me`, tokens cifrados).
- [ ] `OutlookGraphClient`: `GET /me/messages` con `$filter`, `$select` y paginado; cuerpo en texto (`Prefer: outlook.body-content-type="text"`); adjuntos con `/attachments/{id}/$value`; renovación con el refresh token; al desconectar se borran los tokens (Graph no tiene revocación por token: se avisa que se puede quitar el permiso en la cuenta de Microsoft).
- [ ] Token revocado o vencido: estado `REAUTH_REQUIRED` y aviso, como Gmail.
- [ ] Tests con un cliente falso: búsqueda por fecha y filtro por remitente/dominio, adjunto PDF importado, cuerpo como texto, paginado, revocación.

### Frontend
- [ ] BFF: `/api/integrations/outlook` y su callback (cookie propia del intento, con el chequeo de origen de Gmail).
- [ ] Integraciones: "Conectar Outlook" junto a "Conectar Gmail", con el mismo "desde cuándo" (solo nuevos, 3, 6 o 12 meses).

**Listo cuando:** conecto una cuenta de hotmail y una factura con PDF que llega ahí aparece en "Para revisar".

---

## Parte 14.3 – Outlook en toda la app

### Frontend
- [ ] Integraciones: cada cuenta con su ícono y su proveedor; "Detectado en tu correo" dice de qué cuenta vino.
- [ ] Mi perfil (13.6): "Revisar mis emails" aparece con cualquiera de las dos conectadas.
- [ ] Textos que dicen "Gmail" donde vale para los dos pasan a "tu correo" (presentación, avisos de reconexión, origen de los documentos).
- [ ] Presentación: "Gmail y Outlook, solo lectura".

### Backend
- [ ] Aviso de reconexión con el nombre del proveedor ("Volvé a conectar Outlook").

**Listo cuando:** con Gmail y Outlook conectados, cada factura dice de qué cuenta llegó y los dos se revisan con la frecuencia de Mi perfil.

---

## Fuera de alcance

- Reenvío de emails a una dirección de la app (sirve para Yahoo y otros proveedores): posible módulo aparte.
- IMAP con contraseña.
- Calendario de Outlook o de Google.
