# Roadmap por módulos

> Orden de desarrollo del backend (Quarkus) y del frontend (Next.js), un módulo por vez.
> Marcar `[x]` al terminar y anotar el PR. El detalle de tareas del front está en [PLAN-FRONTEND.md](./PLAN-FRONTEND.md).

## Criterios

- Casi todo depende del **usuario autenticado** (todo registro tiene `user_id`, RN-002) y del **servicio** (facturas, obligaciones, tarjetas y detección por email cuelgan de un servicio).
- El primer módulo de negocio (**Proveedores + Servicios**) fija los patrones que se copian en el resto.
- Dentro de cada módulo, **el backend va primero**: al terminarlo, Swagger muestra el contrato real y el front lo consume (los tipos ya están en `src/types/api/`).

## Orden

| # | Módulo | Rama | Backend | Frontend | Depende de | Estado |
|---|---|---|---|---|---|---|
| 0 | **Base** | `feature/auth-user` | Flyway, datasource, manejo de errores, paginación, "usuario actual" | Layout, tema MUI, cliente HTTP, BFF | — | [x] sin PR |
| 1 | **Auth + Usuario** | `feature/auth-user` | Registro, login, JWT + refresh, verificación de email, recupero de contraseña, `/users/me` | Login, registro, `proxy.ts`, perfil | 0 | [x] sin PR |
| 2 | **Proveedores + Servicios** ⭐ | `feature/servicios-<n>-*` (5 partes, ver [MODULO-02-SERVICIOS.md](./MODULO-02-SERVICIOS.md)) | Primer CRUD completo (repositorio, caso de uso, resource, tests) | Listado, alta/edición, detalle | 1 | [x] 5/5 partes, sin PR |
| 3 | **Documentos** | `feature/documentos-<n>-*` (5 partes + 1 opcional, ver [MODULO-03-DOCUMENTOS.md](./MODULO-03-DOCUMENTOS.md)) | Carga a storage (MinIO), descarga | Repositorio documental, carga de archivos | 1 | [x] 5/5 partes (3.6 opcional) |
| 4 | **Obligaciones + Pagos** | `feature/obligaciones-<n>-*` (6 partes, ver [MODULO-04-OBLIGACIONES-PAGOS.md](./MODULO-04-OBLIGACIONES-PAGOS.md)) | Vista `v_obligations`, pagos parciales | Tabla con filtros, registro de pago | 2, 3 | [x] 6/6 partes |
| 5 | **Facturas** (carga manual) | `feature/facturas-<n>-*` (4 partes, ver [MODULO-05-FACTURAS.md](./MODULO-05-FACTURAS.md)) | Confirmar factura genera la obligación | Carga manual y validación | 2, 3, 4 | [x] 4/4 partes |
| 6 | **Tarjetas y resúmenes** | `feature/tarjetas-<n>-*` (4 partes, ver [MODULO-06-TARJETAS.md](./MODULO-06-TARJETAS.md)) | Tarjetas, resumen y obligaciones ARS/USD | Tarjetas y carga de resumen | 2, 4 | [x] 4/4 partes |
| 7 | **Dashboard** | `feature/dashboard-<n>-*` (5 partes, ver [MODULO-07-DASHBOARD.md](./MODULO-07-DASHBOARD.md)) | Resumen y próximos vencimientos | KPIs y gráficos | 4, 5, 6 | [x] 5/5 partes |
| 8 | **Notificaciones** | `feature/notificaciones-<n>-*` (4 partes, ver [MODULO-08-NOTIFICACIONES.md](./MODULO-08-NOTIFICACIONES.md)) | Avisos por umbral, preferencias, email diario | Campana, preferencias | 4 | [x] 4/4 partes |
| 9 | **IA documental** | `feature/ia-<n>-*` (5 partes, ver [MODULO-09-IA-DOCUMENTAL.md](./MODULO-09-IA-DOCUMENTAL.md)) | Cola de procesamiento, Gemini, extracción de resúmenes (Excel, PDF, imagen) y facturas, movimientos con cuotas | Subir con "Leer con IA", estado del procesamiento, pantalla de revisión y confirmación | 3, 5, 6 | [x] 5/5 partes |
| 10 | **Gmail** (incluye BBVA) | `feature/gmail-<n>-*` (4 partes, ver [MODULO-10-GMAIL.md](./MODULO-10-GMAIL.md)) | OAuth, lectura de emails, reglas por proveedor | Conexión, "detectado en tu correo" | 6, 9 | [~] 4/4 partes, falta probar con Gmail real |
| 11 | **Consumos e informe de tarjeta** | `feature/consumos-<n>-*` (5 partes, ver [MODULO-11-CONSUMOS.md](./MODULO-11-CONSUMOS.md)) | Vistas del informe, categorías y reglas por comercio (los movimientos con cuota n de m, cuotas pagas y monto se guardan desde el módulo 9) | Informe y cuotas; **exportar el resumen a PDF y Excel** | 6, 9 | [~] 5/5 partes, falta probar contra la base |
| 12 | **Asistente IA** | `feature/asistente-<n>-*` (4 partes, ver [MODULO-12-ASISTENTE.md](./MODULO-12-ASISTENTE.md)) | Herramientas sobre los módulos anteriores | Chat | todo lo anterior | [ ] |
| 13 | **Préstamos** (tomados) | `feature/prestamos-<n>-*` (6 partes, ver [MODULO-13-PRESTAMOS.md](./MODULO-13-PRESTAMOS.md)) | Préstamo con sus cuotas como vencimientos; comprobantes de alta y de pago leídos con IA; aviso de cuota por Gmail; frecuencia de lectura de emails en Mi perfil | Lista, alta desde el comprobante, ficha, pago de cuota | 4, 8, 9, 10 | [ ] |
| 14 | **Outlook** | `feature/outlook-<n>-*` (3 partes, ver [MODULO-14-OUTLOOK.md](./MODULO-14-OUTLOOK.md)) | Gmail pasa a ser un correo entre dos; Microsoft Graph con `Mail.Read` | Conectar Outlook, cuentas por proveedor | 10 | [ ] |
| 15 | **App instalable y notificaciones push** | `feature/push-<n>-*` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 8 | [ ] |
| 16 | **Alerta de aumentos** | `feature/aumentos` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 5, 8 | [ ] |
| 17 | **Débito automático** | `feature/debito-automatico` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 2, 4 | [ ] |
| 18 | **Suscripciones en la tarjeta** | `feature/suscripciones` (2 partes, ver [MODULO-18-SUSCRIPCIONES.md](./MODULO-18-SUSCRIPCIONES.md)) | ver plan | ver plan | 11 | [ ] |
| 19 | **Calendario (iCal)** | `feature/calendario` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 4 | [ ] |
| 20 | **Presupuesto del mes** | `feature/presupuesto` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 11 | [ ] |
| 21 | **Bienes** | `feature/bienes-<n>-*` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 3, 4 | [ ] |
| 22 | **Resumen anual** | `feature/resumen-anual` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 4, 11 | [ ] |
| 23 | **Hogar compartido** | `feature/hogar-<n>-*` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | todos | [ ] |
| 24 | **Seguridad (2 pasos, sesiones)** | `feature/seguridad` (ver [MEJORAS-15-24.md](./MEJORAS-15-24.md)) | ver plan | ver plan | 1 | [ ] |

Módulos 0 a 8 = **MVP**. Desde el 9: automatización e IA.

**Cambio de orden (26/11/2026):** después del módulo 6 se sigue con el **9 (IA documental)**, antes del 7 y el 8. Motivo: la idea es que el usuario adjunte el resumen o la factura (Excel, PDF o foto) y los datos se carguen solos; cada banco arma su Excel distinto, así que la lectura se resuelve con IA para todos los formatos en vez de programar un lector por banco. Los módulos 7 y 8 no dependen de esto.

## Forma de trabajo por módulo

- Una rama `feature/<modulo>` en cada repo (mismo nombre), PR hacia `develop`.
- **Definición de terminado**
  - **Backend:** repositorio Panache, casos de uso, endpoints REST, tests (incluido "un usuario no ve datos de otro") y Swagger.
  - **Frontend:** funciones del cliente API, páginas, formularios con validación, estados de carga / vacío / error, tarea marcada en el plan.

## Decisiones tomadas

| Fecha | Decisión |
|---|---|
| 24/11/2026 | Autenticación con **JWT propio del backend** (SmallRye JWT, RS256, bcrypt) + refresh token rotativo. Better Auth queda descartado para el MVP. |
| 24/11/2026 | El front actúa como **BFF**: los tokens viven en cookies `httpOnly`; el navegador nunca los ve (SPEC §10.2). |
