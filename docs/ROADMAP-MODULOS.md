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
| 7 | **Dashboard** | `feature/dashboard` | Resumen y próximos vencimientos | KPIs y gráficos | 4, 5, 6 | [ ] |
| 8 | **Notificaciones** | `feature/notificaciones` | Scheduler, preferencias | Campana, preferencias | 4 | [ ] |
| 9 | **IA documental** ⏭ siguiente | `feature/ia-<n>-*` (5 partes, ver [MODULO-09-IA-DOCUMENTAL.md](./MODULO-09-IA-DOCUMENTAL.md)) | Cola de procesamiento, Gemini, extracción de resúmenes (Excel, PDF, imagen) y facturas, movimientos con cuotas | Subir con "Leer con IA", estado del procesamiento, pantalla de revisión y confirmación | 3, 5, 6 | [~] 4/5 partes |
| 10 | **Gmail** (incluye BBVA) | `feature/gmail` | OAuth, lectura de emails, reglas por proveedor | Conexión, "detectado en tu correo" | 6, 9 | [ ] |
| 11 | **Consumos e informe de tarjeta** | `feature/informe-tarjetas` | Vistas del informe, categorías y reglas por comercio (los movimientos con cuota n de m, cuotas pagas y monto se guardan desde el módulo 9) | Informe y cuotas; **exportar el resumen a PDF y Excel** | 6, 9 | [ ] |
| 12 | **Asistente IA** | `feature/asistente` | Herramientas sobre los módulos anteriores | Chat | todo lo anterior | [ ] |

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
