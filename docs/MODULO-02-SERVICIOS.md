# Módulo 2 – Proveedores y servicios

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se puede probar y mergear sola: una rama y un PR por parte en cada repo.
> Al terminar una parte: marcar `[x]` en sus tareas, cambiar su estado en la tabla y anotar la fecha y el PR en el registro de avances.
> Visión general del proyecto: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-001 (especificación funcional). Endpoints: §6.2 (SPEC técnica).

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Punto de partida

Lo que ya existe antes de empezar:

- **Base de datos:** tablas `providers` y `services` (V2), con categorías, periodicidad y validación de fechas. Catálogo de 20 proveedores con Coopelectric (V7) y reglas de detección por email (V8).
- **Backend:** modelos de dominio, entidades, mappers (MapStruct) y DTOs (`ProviderResponse`, `ProviderRequest`, `ServiceRequest`, `ServiceResponse`, `ServiceStatusRequest`). Falta todo lo demás: repositorios, casos de uso, endpoints y tests.
- **Frontend:** tipos en `src/types/api/provider.ts` y `service.ts`, y el sistema de diseño en `DESIGN.md` (tintes por tipo de servicio, `PageHeader`, `Panel`, tabla tipo libro de cuentas).
- **Requisito previo:** mergear `feature/design-system`, así el módulo se construye sobre el diseño nuevo.

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 2.1 | Catálogo de proveedores (solo lectura) | `feature/servicios-1-proveedores` | — | [x] sin PR |
| 2.2 | Alta, listado y detalle de servicios | `feature/servicios-2-alta-listado` | 2.1 | [x] sin PR |
| 2.3 | Edición, activar/desactivar y baja | `feature/servicios-3-edicion-estado` | 2.2 | [ ] |
| 2.4 | Proveedor propio ("no encuentro mi proveedor") | `feature/servicios-4-proveedor-propio` | 2.1, 2.2 | [ ] |
| 2.5 | Posibles duplicados y ayuda del nro. de socio | `feature/servicios-5-duplicados` | 2.2 | [ ] |

Orden recomendado: 2.1 → 2.2 → 2.3 → 2.4 → 2.5. Después de 2.2 el módulo ya es usable; 2.3 a 2.5 lo completan.

Queda fuera de este módulo (se suma cuando existan esos módulos):
- Facturas, obligaciones y documentos dentro del detalle del servicio: módulos 3, 4 y 5.
- Sugerencia "Conectá Gmail para recibir tus facturas": módulo 10 (Gmail). Hasta entonces no hay adónde llevar al usuario.

---

## Parte 2.1 – Catálogo de proveedores

**Objetivo:** el usuario puede buscar su proveedor (ej. Coopelectric) para asociarlo a un servicio.

### Backend
- [x] Puerto `ProviderRepository` y adaptador Panache: listar los proveedores visibles para el usuario (catálogo, con `user_id` nulo, más los propios).
- [x] Caso de uso `ProviderQueryUseCase`: listar con filtros (texto en nombre, categoría) y consultar por id.
- [x] `GET /providers?query=&category=&page=&size=` (paginado, `PageResponse`) y `GET /providers/{id}`.
- [x] Un proveedor propio de otro usuario responde 404, no 403, para no revelar que existe (RN-002).
- [x] Tests: filtros, paginación y aislamiento entre usuarios.

### Frontend
- [x] `src/modules/providers/api.ts`: `providersApi.list`, `providersApi.get`.
- [x] Componente `ProviderAutocomplete`: búsqueda con debounce, agrupado por categoría y con el tinte del servicio. Se usa en el formulario de la parte 2.2.
- [x] Mapeo de categoría → tinte (`ServiceKind`) y etiqueta en español, en un solo lugar.

**Listo cuando:** el autocompletado encuentra "Coopelectric" escribiendo "coope", y un usuario no ve los proveedores propios de otro.

**Hecho (25/11/2026):**
- Backend: `PageQuery` y `PageResult` en `shared/application/model` (paginación reutilizable, tamaño máximo 100) y `PageResponse.from(...)`. Búsqueda con `lower(name) like`, con `%` y `_` del usuario escapados. Categoría inválida responde 400 con mensaje (no el 404 de JAX-RS). 10 tests nuevos.
- Corrección de paso: `providers.email_domains` (`text[]`) estaba mapeado como `List<String>` y Hibernate lo leía como JSON (error 500 al listar proveedores con dominios). Ahora es `String[]` en la entidad.
- Frontend: `providersApi`, `ProviderAutocomplete` (debounce de 250 ms, descarta respuestas viejas, agrupado por categoría con su tinte, rótulo "Propio"), `src/lib/service-categories.ts` (14 categorías → 6 tintes), `toQueryString` y el hook `useDebouncedValue`. 5 tests nuevos.
- Verificado de punta a punta por el BFF: búsqueda "coope", filtro por categoría, paginación, aislamiento entre usuarios (404), validaciones (400). El autocompletado todavía no está en ninguna pantalla: se integra en el formulario de la parte 2.2.

---

## Parte 2.2 – Alta, listado y detalle de servicios

**Objetivo:** el usuario registra un servicio y lo ve en su lista (CU-001, flujo principal).

### Backend
- [x] Puerto `ServiceRepository` y adaptador Panache.
- [x] Caso de uso `RegisterServiceUseCase`: valida que el proveedor sea visible para el usuario; la categoría viene del proveedor por defecto y se puede cambiar; fechas coherentes (fin ≥ inicio).
- [x] Caso de uso `ServiceQueryUseCase`: listar (filtros: categoría, activo, texto) y consultar por id.
- [x] `POST /services` (201), `GET /services?category=&active=&query=&page=&size=` y `GET /services/{id}`. La respuesta del listado incluye el nombre del proveedor para no pedirlo aparte (ajustar el DTO y el tipo del front).
- [x] El `user_id` sale siempre del token (RN-001, RN-002); el servicio de otro usuario da 404.
- [x] Tests: alta válida, proveedor ajeno, fechas inválidas, filtros y aislamiento entre usuarios.

### Frontend
- [x] Ítem "Servicios" en el riel.
- [x] `/services`: tabla tipo libro de cuentas (franja de tinte, servicio, proveedor, nro. de socio, periodicidad, estado), con estados cargando, vacío ("Todavía no registraste servicios" + acción "Agregar servicio") y error.
- [x] Filtros por categoría y por activo/inactivo, guardados en la URL (`?category=&active=`).
- [x] `/services/new`: formulario con proveedor (`ProviderAutocomplete`), nombre, nro. de socio, categoría, periodicidad, fechas y notas; validación con yup igual a la del backend; errores por campo del backend.
- [x] `/services/[id]`: detalle con los datos del servicio. Las secciones de facturas y obligaciones quedan para los módulos 4 y 5.
- [x] En mobile, la tabla muestra solo franja + servicio + estado, como en inicio.

**Listo cuando:** se registra "Luz – Coopelectric – socio 10234", aparece en la lista con su tinte y su detalle abre; el backend rechaza el servicio de otro usuario.

**Hecho (25/11/2026):**
- Backend: `POST /services`, `GET /services?query=&category=&active=&page=&size=` (busca en nombre y nro. de socio) y `GET /services/{id}`, con `providerName` en la respuesta. El alta valida que el proveedor sea visible y activo y que las fechas sean coherentes; limpia textos (nombre, nro. de socio, notas en blanco). Extraídos a `shared`: `SearchText`, `LikePattern` y `EnumParams` (usados también por proveedores). 12 tests nuevos.
- Frontend: ítem "Servicios" en el riel; `/services` (libro de cuentas, filtros en la URL con estado por defecto "Activos", paginación, dos estados vacíos, `loading.tsx`), `/services/new` (formulario con `ProviderAutocomplete`, el proveedor completa categoría y nombre) y `/services/[id]` (detalle; aviso de alta con `?created=1`). Lectura desde Server Components con `serverGet`. Estilos de tabla compartidos en `components/ledger`. 4 tests nuevos.
- Aprendizaje: en Server Components no se puede pasar `NextLink` como `component` de MUI; se usan `ButtonLink` y `TextLink` (componentes de cliente).
- Verificado de punta a punta: alta, listado, búsqueda por nro. de socio, filtros, aislamiento entre usuarios (404), validaciones (400), claro/oscuro y mobile. Un id inválido en la URL muestra "No encontramos esta página" (con `loading.tsx` Next responde 200 + `noindex`, comportamiento documentado).

---

## Parte 2.3 – Edición, activar/desactivar y baja

**Objetivo:** el usuario mantiene sus servicios al día.

### Backend
- [ ] `PUT /services/{id}`: mismas validaciones que el alta.
- [ ] `PATCH /services/{id}/status` (`{ active }`): activar o desactivar.
- [ ] `DELETE /services/{id}`: baja lógica (desactiva, no borra), como dice la SPEC §6.2. El historial de facturas y obligaciones no se pierde.
- [ ] Tests: edición, cambio de estado, baja e intento sobre un servicio ajeno (404).

### Frontend
- [ ] `/services/[id]/edit`: reutiliza el formulario del alta.
- [ ] Activar/desactivar desde el detalle y desde la fila del listado, con confirmación solo para desactivar; el texto aclara que el historial se conserva.
- [ ] El listado muestra los inactivos atenuados y por defecto filtra solo activos.

**Listo cuando:** se edita el nro. de socio, se desactiva el servicio, desaparece del filtro "activos" y se puede reactivar.

---

## Parte 2.4 – Proveedor propio

**Objetivo:** si el proveedor no está en el catálogo, el usuario lo crea sin salir del formulario.

### Backend
- [ ] `POST /providers` (`ProviderRequest`): crea un proveedor con `user_id` del usuario y `custom = true`. El `code` se genera a partir del nombre.
- [ ] Validaciones: nombre obligatorio, categoría válida, sitio web con formato de URL; advertencia si ya existe uno con el mismo nombre en el catálogo.
- [ ] Tests: alta, visible solo para su dueño, nombre repetido.

### Frontend
- [ ] En `ProviderAutocomplete`, opción "No encuentro mi proveedor: crear «{texto}»" que abre un formulario corto (nombre, categoría, sitio web) y lo deja seleccionado.
- [ ] Los proveedores propios se distinguen del catálogo (ej. rótulo "Propio").

**Listo cuando:** se crea "Cooperativa de Agua X", se selecciona en el servicio y otro usuario no la ve.

---

## Parte 2.5 – Posibles duplicados y ayuda del nro. de socio

**Objetivo:** evitar servicios repetidos y ayudar a completar el dato que asocia las facturas del email al servicio (CU-001, flujo alternativo).

### Backend
- [ ] Al crear o editar, buscar servicios del mismo usuario con el mismo proveedor y el mismo nro. de socio (sin espacios ni guiones, sin distinguir mayúsculas).
- [ ] La respuesta de `POST` y `PUT` informa los posibles duplicados (`possibleDuplicates`) sin bloquear el alta. Si se prefiere confirmar antes de guardar, usar `GET /services/duplicates?providerId=&customerReference=`; decidirlo al empezar la parte.
- [ ] Tests de la normalización y de la detección.

### Frontend
- [ ] Aviso no bloqueante en el formulario: "Ya tenés un servicio de Coopelectric con el socio 10234" + enlace al existente.
- [ ] Campo "Nro. de socio / suministro" destacado, con ayuda de dónde encontrarlo en la factura. El texto de ayuda sale del proveedor cuando lo tiene; si no, uno genérico.

**Listo cuando:** registrar dos veces el mismo socio de Coopelectric muestra el aviso con el enlace al servicio existente.

---

## Definición de terminado (todas las partes)

- **Backend:** casos de uso con tests (incluido "un usuario no ve datos de otro"), endpoints documentados en Swagger, `mvnw test` verde.
- **Frontend:** `tsc`, ESLint y `npm test` verdes; estados cargando, vacío y error; claro y oscuro revisados; mobile revisado; tipos iguales a los DTOs.
- **Docs:** este archivo y `PLAN-FRONTEND.md` actualizados; copia en `docs/` del backend.

## Decisiones abiertas

| Tema | Opciones | Se decide en |
|---|---|---|
| Duplicados: aviso después de guardar o confirmación antes | `possibleDuplicates` en la respuesta / `GET /services/duplicates` | 2.5 |
| Texto de ayuda del nro. de socio por proveedor | Columna nueva en `providers` / dentro de `metadata` / texto fijo en el front | 2.5 |

## Registro de avances

| Fecha | Parte | Cambio | PR |
|---|---|---|---|
| 25/11/2026 | — | Plan del módulo creado | — |
| 25/11/2026 | 2.1 | Catálogo de proveedores: `GET /providers` y `GET /providers/{id}`, paginación compartida, `ProviderAutocomplete`, mapeo de categorías y tintes. Corrección del mapeo de `email_domains` | sin PR |
| 25/11/2026 | 2.2 | Alta, listado y detalle de servicios (API + pantallas), helpers compartidos de búsqueda y enums, tabla tipo libro de cuentas reutilizable | sin PR |
