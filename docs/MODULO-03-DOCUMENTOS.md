# Módulo 3 – Documentos

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola: una rama y un PR por parte en cada repo.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar fecha y PR en el registro.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-009. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Punto de partida

- **Base de datos (V3):** tabla `documents` con tipo, título, archivo original, `storage_key`, MIME, tamaño, SHA-256 (único por usuario mientras no esté borrado), origen, estado de procesamiento, vencimiento, borrado lógico (`deleted_at`) y asociación opcional a servicio o bien.
- **Backend:** modelo `Document`, entidad, mapper y DTOs (`DocumentResponse`, `DocumentUpdateRequest`). Falta el almacenamiento de archivos, casos de uso y endpoints.
- **Frontend:** tipos en `src/types/api/document.ts`; diseño en `DESIGN.md` (libro de cuentas, paneles, tintes).

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Dónde se guardan los archivos | Disco local (carpeta configurable, `DOCUMENTS_DIR`) detrás de un puerto `FileStorage` | Funciona sin Docker y alcanza para el despliegue en LAN. MinIO/S3 sería otro adaptador del mismo puerto (parte 3.6, opcional) |
| Nombre del archivo guardado | `storage_key` = `{userId}/{uuid}`; el nombre original solo se guarda en la base | Evita rutas armadas con datos del usuario (path traversal) y choques de nombres |
| Tipos admitidos | PDF, JPG, PNG y WEBP; hasta 10 MB | Lo que se usa para facturas y comprobantes. El tipo se verifica por el contenido (bytes iniciales), no por la extensión |
| Archivo repetido | Mismo SHA-256 del mismo usuario → 409 con enlace al documento existente | La base ya lo impide (índice único); se informa en vez de fallar |
| Procesamiento con IA | Los documentos manuales quedan `NOT_REQUIRED` | La extracción con IA llega en el módulo 9 |
| Asociación | Solo a servicio en este módulo | Bienes no tienen módulo todavía; obligaciones se vinculan a través de facturas (módulo 5) |
| Borrado | Lógico (`deleted_at`); el archivo queda en disco | Se puede recuperar; la limpieza de archivos borrados es una tarea posterior |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 3.1 | Subir un documento (almacenamiento en disco + validaciones) | `feature/documentos-1-subida` | — | [x] sin PR |
| 3.2 | Repositorio: listado, búsqueda y filtros | `feature/documentos-2-listado` | 3.1 | [ ] |
| 3.3 | Descarga y vista previa | `feature/documentos-3-descarga` | 3.1 | [ ] |
| 3.4 | Edición, asociación a servicio, vencimiento y baja | `feature/documentos-4-edicion` | 3.2 | [ ] |
| 3.5 | Documentos dentro del servicio | `feature/documentos-5-en-servicio` | 3.4 | [ ] |
| 3.6 | (Opcional) Adaptador MinIO/S3 | `feature/documentos-6-minio` | 3.1 | [ ] |

Orden recomendado: 3.1 → 3.2 → 3.3 → 3.4 → 3.5. Con 3.1 a 3.3 el módulo ya es usable.

---

## Parte 3.1 – Subir un documento

**Objetivo:** el usuario sube un PDF o una foto y queda guardado.

### Backend
- [x] Puerto `FileStorage` (`save`, `open`) y adaptador `LocalFileStorage` (carpeta `DOCUMENTS_DIR`, por defecto `./data/documentos`).
- [x] Caso de uso `UploadDocumentUseCase`: valida tamaño (≤ 10 MB) y tipo por contenido (PDF, JPG, PNG, WEBP), calcula SHA-256, rechaza el repetido (409), guarda el archivo y la fila. Si falla la base, borra el archivo guardado.
- [x] `POST /documents` (multipart: `file`, `documentType`, `title` opcional) → 201 con `DocumentResponse`.
- [x] Tests: tipo inválido, tamaño, repetido, usuario dueño, limpieza si falla.

### Frontend
- [x] `/documents/new`: zona para arrastrar o elegir el archivo, tipo de documento y título; valida tipo y tamaño antes de subir; barra de progreso.
- [x] El BFF genérico reenvía el multipart (cambio respecto del plan: lo tiene en memoria, hasta 10 MB; una ruta con streaming no hacía falta para este tamaño).
- [x] Ítem "Documentos" en el riel.

**Listo cuando:** se sube un PDF de 1 MB, aparece guardado en disco y en la base; un `.exe` renombrado a `.pdf` se rechaza; subir el mismo archivo dos veces avisa que ya existe.

**Hecho (25/11/2026):** `FileStorage` + `LocalFileStorage` (la clave no puede salir de la carpeta raíz), `FileType` (tipo por los primeros bytes), `UploadDocumentUseCase` (SHA-256 por bloques, repetido → 409 con el nombre del existente, borra el archivo si falla la base), `POST /documents` multipart, `quarkus.http.limits.max-body-size=11M`. Front: `/documents/new` con arrastrar y soltar, validación previa y barra de progreso (`uploadFile` con XMLHttpRequest). Verificado: subida 201 y archivo en disco, repetido 409, `.exe` renombrado 400, más de 10 MB 400, sin sesión 401. 8 tests de backend y 3 de front nuevos.

---

## Parte 3.2 – Repositorio: listado, búsqueda y filtros

### Backend
- [ ] `GET /documents?query=&documentType=&serviceId=&page=&size=` (sin borrados, más nuevos primero; busca en título y nombre de archivo).
- [ ] `GET /documents/{id}` (404 si es de otro usuario o está borrado).
- [ ] Tests: filtros y aislamiento entre usuarios.

### Frontend
- [ ] `/documents`: tabla tipo libro de cuentas (tipo, título/archivo, servicio, tamaño, fecha), filtros en la URL, paginación, estados vacío y cargando.

**Listo cuando:** se filtran facturas de un servicio y se busca por nombre de archivo.

---

## Parte 3.3 – Descarga y vista previa

### Backend
- [ ] `GET /documents/{id}/download`: envía el archivo con su tipo y nombre original (`Content-Disposition`), sin cargarlo entero en memoria.

### Frontend
- [ ] El BFF reenvía la descarga tal cual (streaming).
- [ ] `/documents/[id]`: datos del documento, vista previa (PDF embebido o imagen) y botón Descargar.

**Listo cuando:** se ve un PDF y una foto en la vista previa y se descargan con su nombre original.

---

## Parte 3.4 – Edición, asociación, vencimiento y baja

### Backend
- [ ] `PUT /documents/{id}` (`DocumentUpdateRequest`: título, tipo, servicio, vencimiento). El servicio tiene que ser del usuario.
- [ ] `DELETE /documents/{id}`: borrado lógico (204).
- [ ] Tests: asociar a un servicio ajeno (400), baja, aislamiento.

### Frontend
- [ ] Editar desde el detalle (título, tipo, servicio con autocompletado, vencimiento).
- [ ] Eliminar con confirmación.

**Listo cuando:** se asocia una factura a "Luz casa" con vencimiento y se elimina otro documento.

---

## Parte 3.5 – Documentos dentro del servicio

### Frontend (backend ya cubierto por el filtro `serviceId`)
- [ ] En `/services/[id]`, panel "Documentos" con los del servicio y "Subir documento" que ya lo deja asociado.

**Listo cuando:** desde el detalle de un servicio se sube un documento y aparece en su panel.

---

## Parte 3.6 – (Opcional) MinIO / S3

- [ ] Adaptador `S3FileStorage` del mismo puerto; se elige con una variable (`DOCUMENTS_STORAGE=local|s3`).
- [ ] Solo si el despliegue lo necesita (varios servidores o backups en objeto).

---

## Definición de terminado

- **Backend:** tests de casos de uso (incluido "un usuario no ve documentos de otro"), Swagger, `mvnw test` verde.
- **Frontend:** `tsc`, ESLint y `npm test` verdes; estados cargando, vacío y error; claro, oscuro y mobile revisados por el usuario.
- **Docs:** este archivo, `PLAN-FRONTEND.md` y `ROADMAP-MODULOS.md` actualizados; copia en `docs/` del backend.

## Registro de avances

| Fecha | Parte | Cambio | PR |
|---|---|---|---|
| 25/11/2026 | — | Plan del módulo creado | — |
| 25/11/2026 | 3.1 | Subida de documentos: almacenamiento en disco, validación por contenido, repetidos, barra de progreso | sin PR |
