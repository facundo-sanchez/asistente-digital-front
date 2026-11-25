# Plan de desarrollo – Frontend (Asistente de Vida Digital)

> Documento vivo. Marcar `[x]` al completar, `[~]` en progreso y anotar la fecha o el PR al lado cuando aplique.
> Referencias: [Especificación funcional](./Especificación%20funcional%20–%20Asistente%20de%20Vida%20Digital.md) · [SPEC técnica](./SPEC%20técnica%20–%20Asistente%20de%20Vida%20Digital.md)

**Stack:** Next.js 16.3 (App Router) · React 19 · TypeScript · MUI 9 · Tailwind 4 · Redux Toolkit · react-hook-form + yup · axios · Chart.js · material-react-table · moment

> ⚠️ Next.js 16 tiene cambios incompatibles con versiones anteriores (por ejemplo, `middleware.ts` ahora es `proxy.ts`). Antes de implementar algo, leer la guía correspondiente en `node_modules/next/dist/docs/`.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho · 🔗 depende del backend

---

## Estado actual (24/11/2026)

- Proyecto base creado a partir de un proyecto anterior ("MiBalance"): todavía quedan nombre, `basePath`, títulos y el README de ese proyecto.
- Solo existen `layout.tsx`, `page.tsx` (placeholder), `not-found.tsx` y `api/env/route.ts` (vacío).
- El backend (Quarkus) también es un esqueleto: tiene DTOs del proyecto anterior (Gasto, Tarjeta, Ahorro), login propio con JWT y login con Google. Todavía no tiene endpoints del nuevo dominio.

## Decisiones pendientes

- [x] **Integración con proveedores (luz, gas, agua…):** vía email (Gmail, solo lectura) + extracción IA + confirmación del usuario. Sin APIs de proveedores ni scraping por ahora. (24/11/2026)
- [ ] **Autenticación:** la SPEC propone Better Auth en Next.js (BFF) con un JWT firmado hacia Quarkus, pero el backend actual ya tiene un login propio con JWT y Google. Hay que elegir uno de los dos modelos y documentarlo.
- [ ] **basePath / nombre de la app:** mantener `/mi-balance` o cambiarlo (por ejemplo, `/asistente`).
- [ ] **Estado del servidor:** Redux Toolkit + RTK Query, o Redux solo para la UI y fetch/Server Components para los datos.
- [ ] **Estilos:** definir cuándo se usa MUI y cuándo Tailwind, para no mezclarlos sin criterio.
- [x] **Contratos API:** interfaces TypeScript escritas a mano en `src/types/api/`, espejo 1:1 de los DTOs Java (`interface` + uniones de strings para enums, no clases). Evaluar más adelante generarlas desde OpenAPI (`openapi-typescript`). (24/11/2026)

---

## Fase 0 – Limpieza y base del proyecto

- [x] Crear el proyecto con Next.js 16 + TypeScript
- [x] Instalar las dependencias base (MUI, RTK, RHF, yup, axios, charts, tablas)
- [x] Dockerfile multi-stage con salida `standalone`
- [ ] Renombrar `package.json` (`deudas`), los metadata (`MiBalance`), `lang="es"` y el README
- [ ] Definir `basePath` y redirects en `next.config.ts`
- [ ] Variables de entorno: `.env.example` (`API_INTERNAL_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_BASE_PATH`)
- [ ] Revisar o eliminar `src/app/api/env/route.ts`
- [ ] Crear la estructura de carpetas de la SPEC §10.1 (`components/`, `modules/`, `lib/`, `hooks/`, `types/`, `theme/`)
- [ ] Configurar ESLint y Prettier, y verificar que pasen `npm run lint` y `npm run build`
- [ ] Configurar el testing: Vitest + Testing Library
- [ ] Scripts `typecheck` y `test` en `package.json`

## Fase 1 – Infraestructura de UI y cliente HTTP

### Tema y layout
- [ ] Tema MUI (paleta, tipografía Nunito, modo claro/oscuro) con `@mui/material-nextjs` (AppRouterCacheProvider)
- [ ] Integración entre Tailwind 4 y MUI (orden de CSS layers)
- [ ] `LocalizationProvider` de los date pickers (moment, locale `es`)
- [ ] Layout privado: sidebar con módulos, topbar con usuario, notificaciones y logout
- [ ] Layout responsive (drawer colapsable en mobile)
- [ ] Páginas `not-found`, `error.tsx`, `loading.tsx` y `global-error.tsx`

### Componentes comunes (`components/common`, `components/forms`)
- [ ] Wrapper de tabla (material-react-table) con paginación y filtros del servidor
- [ ] Inputs de formulario conectados a RHF: texto, select, fecha, moneda/importe, archivo
- [ ] Diálogo de confirmación para operaciones sensibles
- [ ] Snackbar/toast global para éxito y error
- [ ] Estados vacíos, skeletons y chips de estado (obligación, factura, procesamiento)
- [ ] Formateadores: moneda (ARS, ISO 4217), fechas con la zona horaria del usuario (RN-012)

### Cliente API (`lib/api`)
- [ ] Instancia de axios centralizada: base URL, interceptores y serialización de parámetros
- [ ] Manejo uniforme de errores según Problem Details (`type`, `title`, `status`, `detail`, `code`)
- [x] Tipos genéricos: `PageResponse<T>`, `PageParams`, `ErrorResponse`, alias de fechas/importes (`src/types/api/common.ts`)
- [x] Tipos de request/response y enums de todos los módulos (`src/types/api/*.ts`)
- [ ] Proxy BFF en Next (route handlers) para no exponer tokens ni la URL interna en el navegador
- [ ] Store Redux y providers (según la decisión sobre el estado del servidor)

## Fase 2 – Autenticación y usuario (MVP) 🔗

- [ ] Implementar el modelo de autenticación elegido (Better Auth o el JWT actual del backend)
- [ ] `app/(auth)/login`: formulario de email/contraseña y login con Google
- [ ] `app/(auth)/register` con validación yup
- [ ] Recuperar contraseña (forgot/reset)
- [ ] Validación de email al registrarse
- [ ] `proxy.ts`: proteger `(private)/*` y redirigir a login
- [ ] Manejar la expiración y renovación de la sesión, y el logout
- [ ] Perfil `/users/me`: ver y editar nombre, zona horaria y locale
- [ ] Preferencias de usuario `/users/me/preferences`

## Fase 3 – Servicios y proveedores (CU-001) 🔗

- [ ] Tipos `Service`, `Provider` y `ServiceCategory`
- [ ] API: `GET/POST/PUT/DELETE /services`, `PATCH /services/{id}/status`, `GET /providers`
- [ ] Listado de servicios con filtros (categoría, activo/inactivo)
- [ ] Formulario de alta y edición: categoría, proveedor, referencia de cliente y periodicidad
- [ ] Campo "Nro. de socio / suministro" destacado, con ayuda de dónde encontrarlo en la factura (es lo que asocia las facturas del email al servicio)
- [ ] Al crear un servicio de un proveedor con detección por email, sugerir "Conectá Gmail para recibir tus facturas automáticamente"
- [ ] Advertencia de posible duplicado
- [ ] Detalle del servicio: facturas, obligaciones y documentos asociados
- [ ] Activar o desactivar un servicio

## Fase 4 – Documentos (CU-009) 🔗

- [ ] Tipos `Document` y `ProcessingStatus`
- [ ] API: `GET/POST/DELETE /documents`, `POST /documents/upload`, `GET /documents/{id}/download`
- [ ] Repositorio documental: listado, búsqueda y filtros por categoría o servicio
- [ ] Carga de archivos con drag & drop, validación de tipo y tamaño en el cliente y barra de progreso
- [ ] Asociar el documento a un servicio, una obligación o un bien
- [ ] Vista previa de PDF/imagen y descarga
- [ ] Fecha de vencimiento del documento (opcional)

## Fase 5 – Facturas y obligaciones (CU-002, CU-005) 🔗

### Facturas
- [ ] Tipos `Invoice` y `ExtractionStatus`
- [ ] API: `/invoices` (CRUD), `/invoices/{id}/confirm`, `/invoices/{id}/reject`
- [ ] Listado de facturas con estado (pendiente de validación, confirmada, rechazada)
- [ ] Carga manual de una factura: adjuntar el archivo y completar los datos
- [ ] Advertencia de factura duplicada (RN-005)

### Obligaciones
- [ ] Tipos `Obligation` y `ObligationStatus` (Pendiente, Próxima a vencer, Vencida, Pagada, Cancelada)
- [ ] API: `/obligations` (CRUD + filtros), `/upcoming`, `/overdue`, `/summary`, `PATCH /{id}/cancel`
- [ ] Tabla de obligaciones con filtros: período, proveedor, categoría y estado
- [ ] Alta de una obligación sin factura (por ejemplo, VTV o renovación de licencia)
- [ ] Detalle: importe, vencimiento, documento asociado, pagos e historial
- [ ] Cancelar una obligación (con confirmación)

## Fase 6 – Pagos (CU-006) 🔗

- [ ] Tipos `Payment`
- [ ] API: `/payments` (CRUD), `/obligations/{id}/payments`
- [ ] Diálogo para registrar un pago: fecha, importe, método y comprobante adjunto
- [ ] Pagos parciales: mostrar el saldo pendiente y la diferencia
- [ ] Historial de pagos con comprobantes descargables
- [ ] Corregir un pago conservando la trazabilidad

## Fase 6b – Tarjetas de crédito y resúmenes (CU-015) 🔗

- [ ] Tipos `Card`, `CardStatement` (`src/types/api/card.ts` ✔)
- [ ] API: `/cards` (CRUD), `/cards/{id}/statements`, `/card-statements` (alta, edición, `confirm`, `reject`)
- [ ] Listado de tarjetas: marca, últimos 4 dígitos, próximo cierre y vencimiento
- [ ] Alta/edición de tarjeta: elegir o crear el servicio del emisor (categoría `CREDIT_CARD`), marca, últimos 4, días de cierre y vencimiento, límite
- [ ] Carga de resumen: adjuntar PDF + totales en pesos y dólares, pago mínimo, cierre y vencimiento
- [ ] Detalle del resumen: totales por moneda, obligaciones generadas (ARS / USD) y su estado de pago
- [ ] Aviso de resumen duplicado (misma tarjeta y fecha de vencimiento, RN-016)
- [ ] Campo "últimos 4 del número de cuenta" en la tarjeta, con ayuda: "figura en el email del resumen (ej. BBVA: Número de cuenta ****4521)"
- [ ] Resumen detectado por email sin PDF (ej. BBVA): mostrar totales y vencimiento, aviso "Subí el PDF para ver los consumos" (notificación `CARD_STATEMENT_AVAILABLE`) y botón de carga
- [ ] Mostrar las obligaciones `CREDIT_CARD_PAYMENT` en obligaciones y dashboard

## Fase 7 – Dashboard (CU-012) 🔗

- [ ] KPIs: obligaciones pendientes, vencidas, total del período y servicios activos
- [ ] Lista de próximos vencimientos (7/15/30 días)
- [ ] Documentos próximos a vencer
- [ ] Gráfico de gastos por mes y por categoría (Chart.js)
- [ ] Últimas actividades (auditoría)
- [ ] Accesos directos al detalle de cada sección

## Fase 8 – Notificaciones (CU-007) 🔗

- [ ] Centro de notificaciones: campana en la topbar con contador y listado
- [ ] Marcar como leída (`PATCH /notifications/{id}/read`)
- [ ] Preferencias: canales (email, web, push) y anticipación (7, 3 y 1 día, y el día del vencimiento)
- [ ] Web Push (opcional, post-MVP)

**✅ Fin del MVP (fase 1 de producto)**: verificar los criterios de aceptación de la especificación funcional §10.

## Fase 9 – Procesamiento documental con IA (CU-002, CU-004, CU-014) 🔗

- [ ] Visualizar el pipeline: recibido → validando → extrayendo → validando datos → esperando confirmación → registrado
- [ ] Consultar el estado periódicamente (`GET /documents/{id}/processing`) y luego migrar a SSE
- [ ] Pantalla de revisión: datos extraídos junto a la vista previa del documento, editables
- [ ] Resaltar los campos con baja confianza (RN-006, RN-013)
- [ ] Confirmar o rechazar la propuesta; reprocesar (`POST /documents/{id}/reprocess`)
- [ ] Bandeja "pendientes de validación"
- [ ] Propuestas de recurrencia: confirmar o editar la regla y distinguir lo estimado de lo real

## Fase 9b – Consumos e informe de compras con tarjeta (CU-016, CU-017) 🔗

### Consumos
- [ ] API: `/card-statements/{id}/transactions`, `/card-transactions/{id}`, `PATCH /card-transactions/{id}/category`, `/card-statements/{id}/reconciliation`
- [ ] Tabla de consumos del resumen: fecha, comercio, categoría, cuota N/M, importe con signo y moneda
- [ ] Revisión de la extracción IA: resaltar baja confianza, editar, agregar y eliminar consumos
- [ ] Recategorizar con opción "aplicar siempre a este comercio" (crea la regla, RN-019)
- [ ] Banner de conciliación: diferencia entre total del resumen y suma de consumos, por moneda
- [ ] Pantalla de reglas por comercio (`/card-merchant-rules`): listar y eliminar

### Informe (`/cards/report`)
- [ ] Filtros: período, tarjeta(s), moneda
- [ ] KPIs: total por moneda (pesos y dólares separados, RN-018)
- [ ] Gráfico de gasto por categoría (dona) y evolución mensual (barras) con Chart.js
- [ ] Gasto por tarjeta y top de comercios
- [ ] Cuotas pendientes (`/cards/installments/pending`): restante por compra, total por moneda y fecha estimada de la última cuota
- [ ] Drill-down: click en una categoría, mes o comercio → lista de consumos

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

- [ ] Accesibilidad básica: labels, foco y contraste
- [ ] Responsive verificado en mobile
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
| 24/11/2026 | Caso BBVA (resumen en el cuerpo del email, sin PDF): migración V10, extracción por regex (`EMAIL_BODY`), `account_last_four`, cierre opcional, RN-016 por vencimiento |
