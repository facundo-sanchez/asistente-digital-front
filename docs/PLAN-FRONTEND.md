# Plan de desarrollo – Frontend (Asistente de Vida Digital)

> Documento vivo. Marcar `[x]` al completar, `[~]` en progreso y anotar la fecha o el PR al lado cuando aplique.
> Referencias: [Especificación funcional](./Especificación%20funcional%20–%20Asistente%20de%20Vida%20Digital.md) · [SPEC técnica](./SPEC%20técnica%20–%20Asistente%20de%20Vida%20Digital.md)

**Stack:** Next.js 16.3 (App Router) · React 19 · TypeScript · MUI 9 · Tailwind 4 · react-hook-form + yup · Chart.js (react-chartjs-2) · Vitest. Instalados pero sin uso: Redux Toolkit, axios, material-react-table, moment

> ⚠️ Next.js 16 tiene cambios incompatibles con versiones anteriores (por ejemplo, `middleware.ts` ahora es `proxy.ts`). Antes de implementar algo, leer la guía correspondiente en `node_modules/next/dist/docs/`.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho · 🔗 depende del backend

---

## Estado actual (26/11/2026)

- Hechos (front + backend, mergeados en `develop`): base y autenticación (módulos 0 y 1), servicios (2), documentos (3), vencimientos y pagos con recurrencias (4), facturas (5), tarjetas con resúmenes en pesos y dólares (6) e IA documental (9: resúmenes y facturas desde Excel, PDF o foto, con revisión y confirmación). Detalle por parte en los `MODULO-0N-*.md`.
- Hecho, sin mergear (ramas `feature/dashboard-*`): **dashboard (7)** completo, 7.1 a 7.5; falta la prueba contra la base. También ahí: subir el comprobante desde el formulario del pago.
- Siguiente: **módulo 8 (Notificaciones)**, planificado en [MODULO-08-NOTIFICACIONES.md](./MODULO-08-NOTIFICACIONES.md), esperando confirmar las decisiones.
- Decisiones tomadas en el camino que cambian este plan: no se usó Redux ni material-react-table (Server Components + `fetch`, tablas propias "libro de cuentas"); fechas con `Intl` en vez de moment; filtros en la URL.

## Decisiones pendientes

- [x] **Integración con proveedores (luz, gas, agua…):** vía email (Gmail, solo lectura) + extracción IA + confirmación del usuario. Sin APIs de proveedores ni scraping por ahora. (24/11/2026)
- [x] **Autenticación:** JWT propio del backend (RS256 + refresh rotativo) y Next.js como BFF con cookies httpOnly. Better Auth descartado. Documentado en SPEC técnica §7.1. (24/11/2026)
- [~] **basePath / nombre de la app:** ahora es configurable con `NEXT_PUBLIC_BASE_PATH` (vacío = raíz). Falta decidir el valor final (hoy los `.env` locales usan `/mi-balance`).
- [x] **Estado del servidor:** sin Redux. Server Components + `fetch` al BFF, filtros en la URL y `router.refresh()` después de guardar (26/11/2026)
- [ ] **Estilos:** definir cuándo se usa MUI y cuándo Tailwind, para no mezclarlos sin criterio.
- [x] **Contratos API:** interfaces TypeScript escritas a mano en `src/types/api/`, espejo 1:1 de los DTOs Java (`interface` + uniones de strings para enums, no clases). Evaluar más adelante generarlas desde OpenAPI (`openapi-typescript`). (24/11/2026)

---

## Fase 0 – Limpieza y base del proyecto

- [x] Crear el proyecto con Next.js 16 + TypeScript
- [x] Instalar las dependencias base (MUI, RTK, RHF, yup, axios, charts, tablas)
- [x] Dockerfile multi-stage con salida `standalone`
- [x] Renombrar `package.json` (`deudas`), los metadata (`MiBalance`) y `lang="es"` — falta el README
- [x] `basePath` configurable por `NEXT_PUBLIC_BASE_PATH` y redirect de `/` en `next.config.ts`
- [x] Variables de entorno: `.env.example` (`API_BACKEND`, `NEXT_PUBLIC_BASE_PATH`, `COOKIE_SECURE`)
- [x] Eliminar `src/app/api/env/route.ts` (estaba vacío)
- [x] Estructura de carpetas de la SPEC §10.1: `components/`, `modules/`, `lib/`, `types/`, `theme/`, `hooks/`. Un tipo por archivo; props en `*-props.ts`
- [~] `npm run lint` y `npm run build` pasan. Prettier se usa a 140 columnas, pero falta su archivo de configuración
- [~] Testing con Vitest (`npm test`): seguridad del login, formateadores y validaciones. Falta Testing Library para componentes
- [~] Script `test` en `package.json` (falta `typecheck`)

## Fase 1 – Infraestructura de UI y cliente HTTP

### Tema y layout
- [x] Tema MUI "Papel moneda" (ver DESIGN.md): paleta clara y oscura con selector y modo del sistema por defecto, tipografía Archivo, tintes por tipo de servicio, roseta guilloché, locale es (25/11/2026)
- [x] Integración entre Tailwind 4 y MUI (`@layer theme, base, mui, components, utilities` + `enableCssLayer`)
- [x] Fechas con el `input type="date"` nativo y formato con `Intl`: no hizo falta `LocalizationProvider` ni moment
- [x] Layout privado: sidebar con módulos, topbar con usuario y logout (`components/layout/AppShell`) — notificaciones en el módulo 8
- [x] Layout responsive (drawer colapsable en mobile)
- [x] Páginas `not-found`, `error.tsx`, `global-error.tsx` y `loading.tsx` en los listados

### Componentes comunes (`components/common`, `components/forms`)
- [x] Tablas propias "libro de cuentas" (`components/ledger`) con paginación (`UrlPagination`) y filtros del servidor en la URL (`useUrlFilters`). Sin material-react-table
- [x] Inputs conectados a RHF: texto, select, fecha, importe y contraseña (`FormTextField`, `FormPasswordField`); archivos con `DocumentPicker` (elegir uno o subirlo ahí mismo) y la zona de carga de Documentos
- [x] Confirmación en las operaciones sensibles (cancelar vencimiento, anular pago, borrar documento, rechazar propuesta)
- [ ] Snackbar/toast global para éxito y error
- [x] Estados vacíos con la acción para empezar, skeletons en `loading.tsx` y estados con punto + palabra (vencimiento, factura, procesamiento)
- [x] Formateadores: `formatMoney` (ISO 4217) y `formatDate`/`formatDay`; el "hoy" se calcula en la zona del usuario (RN-012)

### Cliente API (`lib/api`)
- [x] Cliente HTTP centralizado con `fetch` (`lib/api/client.ts`): basePath, reintento ante 401, `ApiError`. Se descartó axios: no hacía falta
- [x] Manejo uniforme de errores con el `ErrorResponse` del backend (incluye `violations` por campo → `applyApiErrors` los marca en el formulario)
- [x] Tipos genéricos: `PageResponse<T>`, `PageParams`, `ErrorResponse`, alias de fechas/importes (`src/types/api/common.ts`)
- [x] Tipos de request/response y enums de todos los módulos (`src/types/api/*.ts`)
- [x] BFF en Next: `/api/auth/*` (sesión en cookies httpOnly) y `/api/backend/[...path]` (reenvío con token + refresh automático)
- [x] Sin store Redux (ver la decisión): solo `AppProviders` con el tema

## Fase 2 – Autenticación y usuario (MVP) 🔗

- [x] Modelo de autenticación: JWT propio del backend + BFF
- [x] `app/(auth)/login`: formulario de email/contraseña, con `?next=` validado (sin open redirect)
- [x] **Login con Google** (backend + front): OAuth 2.0 + PKCE vía BFF, vinculación segura por email verificado, "Crear contraseña" en el perfil para cuentas solo Google (25/11/2026)
- [x] `app/(auth)/register` con validación yup
- [x] Recuperar contraseña (forgot/reset)
- [x] Validación de email al registrarse (confirmación con botón, no al abrir el enlace) + reenvío desde el banner
- [x] **Confirmación de email:** envío real por SMTP (`quarkus-mailer`), elegido con `EMAIL_DELIVERY=smtp`. Desarrollo con Mailpit, producción con Gmail u otro SMTP. Si el SMTP falla, el registro sigue y el usuario puede reenviar (25/11/2026)
- [x] `proxy.ts`: proteger el área privada y redirigir a login
- [x] Manejar la expiración y renovación de la sesión (proxy + BFF), y el logout
- [x] Perfil `/profile`: nombre, zona horaria, idioma, moneda y cambio de contraseña
- [ ] Preferencias de notificación → se hacen en el módulo 8 (Notificaciones)

## Fase 3 – Servicios y proveedores (CU-001) 🔗

> Se desarrolla en 5 partes: ver [MODULO-02-SERVICIOS.md](./MODULO-02-SERVICIOS.md).

- [x] Tipos `Service`, `Provider` y `ServiceCategory`
- [x] API: `GET/POST/PUT/DELETE /services`, `PATCH /services/{id}/status`, `GET /providers`
- [x] Listado de servicios con filtros (categoría, activo/inactivo)
- [x] Formulario de alta y edición: categoría, proveedor, referencia de cliente y periodicidad
- [x] Campo "Nro. de socio / suministro" destacado, con ayuda de dónde encontrarlo en la factura (es lo que asocia las facturas del email al servicio)
- [ ] (módulo 10) Al crear un servicio de un proveedor con detección por email, sugerir "Conectá Gmail para recibir tus facturas automáticamente"
- [x] Advertencia de posible duplicado
- [x] Detalle del servicio con paneles de documentos, facturas, vencimientos y (si es un banco) tarjetas
- [x] Activar o desactivar un servicio

## Fase 4 – Documentos (CU-009) 🔗

> Se desarrolla en partes: ver [MODULO-03-DOCUMENTOS.md](./MODULO-03-DOCUMENTOS.md).

- [x] Tipos `Document` y `ProcessingStatus`
- [x] API: `GET/POST/DELETE /documents`, `POST /documents/upload`, `GET /documents/{id}/download`
- [x] Repositorio documental: listado, búsqueda y filtros por categoría o servicio
- [x] Carga de archivos con drag & drop, validación de tipo y tamaño en el cliente y barra de progreso
- [x] Asociar el documento a un servicio (obligación y bien: no en este módulo)
- [x] Vista previa de PDF/imagen y descarga (Excel: solo descarga)
- [x] Fecha de vencimiento del documento (opcional)

## Fase 5 – Facturas y obligaciones (CU-002, CU-005) 🔗

### Facturas
- [x] Tipos `Invoice` y `ExtractionStatus`
- [x] API: `/invoices` (alta confirmada, listado, detalle, edición), `/invoices/duplicates`, `/invoices/{id}/reject`
- [x] Listado de facturas con el estado de su vencimiento (las pendientes de validación llegan con la IA, módulo 9)
- [x] Carga manual de una factura: adjuntar el archivo y completar los datos
- [x] Advertencia de factura duplicada (RN-005)

### Obligaciones
- [x] Tipos `Obligation` y `ObligationStatus` (Pendiente, Próxima a vencer, Vencida, Pagada, Cancelada)
- [x] API: `/obligations` (alta, edición, filtros por estado, servicio, categoría y período), `POST /{id}/cancel`, `/recurring-rules` (vencimientos que se repiten)
- [x] Tabla de obligaciones con filtros: período, proveedor, categoría y estado
- [x] Alta de una obligación sin factura (por ejemplo, VTV o renovación de licencia)
- [x] Detalle: importe, vencimiento, documento asociado, pagos e historial
- [x] Cancelar una obligación (con confirmación)

## Fase 6 – Pagos (CU-006) 🔗

- [x] Tipos `Payment`
- [x] API: `/payments` (CRUD), `/obligations/{id}/payments`
- [x] Diálogo para registrar un pago: fecha, importe, método y comprobante adjunto
- [x] Pagos parciales: mostrar el saldo pendiente y la diferencia
- [x] Historial de pagos con comprobantes descargables
- [x] Corregir un pago conservando la trazabilidad

## Fase 6b – Tarjetas de crédito y resúmenes (CU-015) 🔗

- [x] Tipos `Card`, `CardStatement`
- [x] API: `/cards` (alta, edición, baja lógica), `/cards/{id}/statements`, `/card-statements` (alta confirmada, edición, `reject`, búsqueda por vencimiento)
- [x] Listado de tarjetas: marca, últimos 4 dígitos y banco; el próximo cierre y vencimiento se muestran en la tarjeta según el último resumen
- [x] Alta/edición de tarjeta: servicio del emisor (categoría `CREDIT_CARD`), marca, últimos 4, titular, adicional y límite. **Sin días de cierre y vencimiento**: los fija el banco en cada resumen
- [x] Carga de resumen: adjuntar PDF o **Excel** + totales en pesos y dólares, pago mínimo, cierre y vencimiento
- [x] Detalle del resumen: totales por moneda, obligaciones generadas (ARS / USD) y su estado de pago
- [x] Aviso de resumen duplicado (misma tarjeta y fecha de vencimiento, RN-016)
- [x] Campo "últimos 4 del número de cuenta" en la tarjeta, con ayuda: "figura en el email del resumen (ej. BBVA: Número de cuenta ****4521)"
- [ ] (módulo 10) Resumen detectado por email sin PDF (ej. BBVA): mostrar totales y vencimiento, aviso "Subí el PDF para ver los consumos" (notificación `CARD_STATEMENT_AVAILABLE`) y botón de carga
- [x] Mostrar las obligaciones `CREDIT_CARD_PAYMENT` en obligaciones y en el dashboard

## Fase 7 – Dashboard (CU-012) 🔗

> Hecho en partes: ver [MODULO-07-DASHBOARD.md](./MODULO-07-DASHBOARD.md). Falta la prueba contra la base y el merge.

- [x] KPIs: falta pagar este mes, vencido, vence en 7 días y servicios activos, cada uno con acceso a su listado filtrado (7.1)
- [x] "Este mes": roseta con lo pagado del mes; pesos y dólares por separado (7.1)
- [x] Próximos vencimientos: lo vencido primero y lo que vence en 30 días, con el color del servicio (7.2)
- [x] "Para revisar" (lo que leyó la IA) y documentos que vencen en 30 días (7.3)
- [x] Lo pagado: barras por mes de los últimos 6 (Chart.js) y barras por categoría del mes, con tabla accesible (7.4)
- [x] Últimas actividades: pagos, facturas, resúmenes y documentos, con enlace (7.5)

## Fase 8 – Notificaciones (CU-007) 🔗

> Planificado en partes: ver [MODULO-08-NOTIFICACIONES.md](./MODULO-08-NOTIFICACIONES.md). Es lo siguiente.

- [ ] Campana en la barra con las no leídas y listado; pantalla `/notifications` (8.2)
- [ ] Marcar como leída y todas como leídas (8.1, 8.2)
- [ ] Preferencias en Mi perfil: canales (en la app, email) y anticipación (7, 3, 1 y 0 días) (8.3)
- [ ] Email diario con los avisos del día (8.4)
- [ ] Web Push (post-MVP)

**✅ Fin del MVP (fase 1 de producto)**: verificar los criterios de aceptación de la especificación funcional §10.

## Fase 9 – Procesamiento documental con IA (CU-002, CU-004, CU-014) 🔗

> Hecho en partes (9.1 a 9.5): ver [MODULO-09-IA-DOCUMENTAL.md](./MODULO-09-IA-DOCUMENTAL.md). La IA (Gemini) lee Excel, PDF e imágenes; el usuario revisa y confirma.

- [x] Estado del procesamiento en el documento (en cola, leyendo, listo para revisar, error)
- [~] Consulta periódica del estado (`GET /documents/{id}/processing`); SSE queda para más adelante
- [x] Pantallas de revisión editables: resumen de tarjeta (`/extractions/[id]`, con movimientos y cuotas) y factura (`/invoice-extractions/[id]`)
- [x] Avisos de lo que no cierra (totales del resumen contra los movimientos) y de los datos que faltan
- [x] Confirmar o rechazar la propuesta; volver a leer (`POST /documents/{id}/process`)
- [x] "Para revisar" en el Inicio (7.3); "Cargar desde archivo" en tarjetas y facturas
- [ ] Propuestas de recurrencia: confirmar o editar la regla y distinguir lo estimado de lo real

## Fase 9b – Consumos e informe de compras con tarjeta (CU-016, CU-017) 🔗

> Los movimientos con cuota n de m, cuotas pagas e importe se guardan desde el módulo 9 (parte 9.4). Acá quedan el informe, las categorías y **exportar el resumen a PDF y Excel**.

### Consumos
- [~] API: `/card-statements/{id}/transactions` (hecho en 9.4); faltan `/card-transactions/{id}`, `PATCH /card-transactions/{id}/category`, `/card-statements/{id}/reconciliation`
- [~] Tabla de consumos del resumen: fecha, comercio, cuota N/M, importe y moneda (9.4); falta la categoría
- [x] Revisión de la extracción IA: editar, agregar y eliminar consumos (9.4)
- [ ] Recategorizar con opción "aplicar siempre a este comercio" (crea la regla, RN-019)
- [x] Conciliación en la revisión: diferencia entre el total del resumen y la suma de consumos, por moneda (9.4)
- [ ] Pantalla de reglas por comercio (`/card-merchant-rules`): listar y eliminar

### Informe (`/cards/report`)
- [ ] Filtros: período, tarjeta(s), moneda
- [ ] KPIs: total por moneda (pesos y dólares separados, RN-018)
- [ ] Gráfico de gasto por categoría (dona) y evolución mensual (barras) con Chart.js
- [ ] Gasto por tarjeta y top de comercios
- [ ] Cuotas pendientes (`/cards/installments/pending`): restante por compra, total por moneda y fecha estimada de la última cuota
- [ ] Drill-down: click en una categoría, mes o comercio → lista de consumos
- [ ] Exportar el resumen de la tarjeta (totales, consumos y cuotas) a PDF y a Excel

## Fase 10 – Integraciones / Gmail (CU-003, CU-013) 🔗

- [ ] Listado de integraciones disponibles y conectadas
> Vía elegida para proveedores (luz, gas, agua, internet): **email**. Flujo: Gmail → filtro por proveedor (`provider_email_rules`) → PDF → extracción IA → asociación al servicio por nro. de socio → confirmación del usuario.

- [ ] Conectar Gmail (inicio de OAuth y página de callback con resultado)
- [ ] Pantalla previa a OAuth: explicar el permiso de solo lectura y qué correos se analizan
- [ ] Elegir desde cuándo importar (solo nuevos / últimos 3 / 6 / 12 meses → `sync_from`)
- [ ] Detalle: estado, permisos y última sincronización; botón "Sincronizar"
- [ ] Desconectar (con confirmación, aclarando que no se borra el historial, RN-011)
- [ ] Aviso de "reconexión requerida" cuando vence la autorización (`REAUTH_REQUIRED`)
- [ ] "Detectado en tu correo": lista de mensajes procesados (remitente, asunto, fecha, resultado: importado / descartado / duplicado)
- [ ] Factura de un proveedor sin servicio registrado o con nro. de socio desconocido: proponer crear o vincular el servicio
- [ ] Confirmar las facturas detectadas (reutiliza la pantalla de revisión de la Fase 9)

## Fase 11 – Asistente IA (CU-008) 🔗

- [ ] Lista de conversaciones: crear y eliminar
- [ ] Chat (evaluar `@mui/x-chat`) con streaming SSE
- [ ] Respuestas con referencias y enlaces a los registros (facturas, obligaciones)
- [ ] Sugerencias de consultas frecuentes

## Fase 12 – Bienes y futuro (CU-010) 🔗

- [ ] CRUD de bienes (vehículos, propiedades, electrodomésticos)
- [ ] Documentos, mantenimientos y vencimientos por bien
- [ ] Exportación a Excel (obligaciones y pagos)
- [ ] Configuración de cuenta avanzada / gestión familiar

---

## Transversal (aplicar en todas las fases)

- [~] Accesibilidad básica: labels, foco y contraste; el color nunca es la única señal; tablas ocultas para los gráficos
- [~] Responsive: shell con drawer y tablas que ocultan columnas en el celular; falta una pasada completa
- [ ] Tests unitarios de componentes y utilidades críticas (formateadores, validaciones)
- [ ] E2E con Playwright de los flujos MVP: login → servicio → factura → obligación → pago
- [ ] No exponer secretos ni tokens en el cliente (SPEC §10.2)
- [ ] Mensajes de error claros a partir de Problem Details
- [ ] Docker de producción actualizado y probado con el backend

## Registro de avances

| Fecha | Cambio |
|---|---|
| 24/11/2026 | Plan creado |
| 24/11/2026 | Backend: migraciones V1–V8 (esquema completo + catálogo de proveedores + reglas de detección por email) |
| 24/11/2026 | Decisión: integración con proveedores vía email (Gmail) |
| 24/11/2026 | Backend: entities, modelos de dominio, DTOs y mappers (MapStruct) de los 12 módulos. Front: tipos `src/types/api/` alineados con los DTOs |
| 24/11/2026 | Tarjetas de crédito: CU-015/016/017 y RN-016..020 en las specs, migración V9, módulo `card` en backend y `src/types/api/card.ts`. Nuevas fases 6b y 9b |
| 24/11/2026 | Módulo 0 + 1 (rama `feature/auth-user`): base del front, BFF, proxy, login/registro/recupero/verificación, perfil. Backend: Flyway, manejo de errores, auth JWT, tests. Probado de punta a punta |
| 24/11/2026 | Caso BBVA (resumen en el cuerpo del email, sin PDF): migración V10, extracción por regex (`EMAIL_BODY`), `account_last_four`, cierre opcional, RN-016 por vencimiento |
| 25/11/2026 | Confirmación de email: adaptador SMTP en el backend (`EMAIL_DELIVERY=log\|smtp`, variables `SMTP_*`). Probado con un servidor SMTP real |
| 25/11/2026 | Login con Google: `POST /auth/google/authorization` y `POST /auth/google` en el backend; `/api/auth/google` y su callback en el BFF; botón en login y registro. Probado de punta a punta contra un Google simulado (firma, PKCE, state, cancelación, reuso del código, vinculación) |
| 25/11/2026 | Revisión de código (ponytail-review) y correcciones: claves JWT fuera del repo y obligatorias en producción; emails nunca al log en producción; refresh atómico con 409 cuando otro pedido ya rotó la sesión (el BFF y el proxy no borran las cookies); cambio de contraseña con sesión vencida; tests del id_token de Google (backend) y de `safeNextPath`/state (Vitest) |
| 25/11/2026 | Rediseño "Papel moneda" (rama `feature/design-system`): diseño predeterminado de la app con modo claro y oscuro, shell con riel de tinta, pantallas de cuenta en dos paneles, inicio con estados vacíos y roseta guilloché, PRODUCT.md y DESIGN.md |
| 26/11/2026 | Módulos 2 a 6 completos y mergeados en `develop`: servicios, documentos, vencimientos y pagos (con recurrencias), facturas y tarjetas (con carga de Excel) |
| 26/11/2026 | Módulo 9 (IA documental) mergeado: cola de procesamiento, Gemini, resúmenes con movimientos y cuotas, facturas desde archivo, revisión y confirmación |
| 26/11/2026 | Módulo 7 (dashboard) hecho en `feature/dashboard-*`: indicadores, próximos vencimientos, para revisar, documentos por vencer, gráficos de lo pagado y últimas actividades. Comprobante subido desde el formulario del pago |
| 26/11/2026 | Plan del módulo 8 (notificaciones) |
