# Módulo 6 – Tarjetas y resúmenes

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola: una rama por parte en cada repo.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-015. Reglas: RN-016 y RN-018. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Punto de partida

- **Base de datos (V9, V10):** `cards` (servicio del emisor, nombre, marca, últimos 4 de la tarjeta y de la cuenta, titular, adicional, días de cierre y vencimiento, límite, moneda, activa; marca + últimos 4 únicos por usuario), `card_statements` (cierre opcional, vencimiento, próximos cierre y vencimiento, total en pesos y en dólares, pago mínimo, PDF, `obligation_id` y `obligation_usd_id`; un solo resumen confirmado por tarjeta y vencimiento, RN-016). Ya existe el tipo de vencimiento `CREDIT_CARD_PAYMENT`.
- **Backend:** modelos, entidades, mappers y DTOs de tarjetas, resúmenes, consumos e informe. Faltan repositorios, casos de uso y endpoints.
- **Fuera de este módulo:** consumos del resumen, categorías, cuotas (producto, cuota n de m, cuotas pagas, monto) e informe de compras (CU-016, CU-017), y **exportar el resumen a PDF o Excel**, van en el **módulo 11**; la lectura del PDF con IA, en el 9; el resumen por email (BBVA), en el 10.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Tarjeta y servicio | Toda tarjeta pertenece a un servicio de categoría *Tarjetas* (el banco o emisor). Desde el alta se puede elegir uno existente; si no hay, se avisa con enlace a crearlo | CU-015 paso 2; reusa Servicios |
| Resumen cargado a mano | Queda **confirmado** al guardar, como las facturas | Mismo criterio del módulo 5: el usuario ya revisó los datos |
| Vencimientos del resumen | Uno por moneda con saldo: «Visa Galicia · resumen 2026-12» en pesos y otro en dólares si hay saldo en USD. Tipo *Tarjeta de crédito* | RN-018: las monedas no se suman ni se convierten |
| Pago mínimo | Se guarda y se muestra; el vencimiento es por el total | El usuario decide cuánto paga: un pago menor queda como pago parcial (módulo 4) |
| Repetido (RN-016) | Un resumen por tarjeta y vencimiento: el segundo responde 409 con mensaje claro | La base ya lo impide |
| Fechas de cierre y vencimiento | La app **no las calcula**: cada resumen trae las suyas, tal como las informa el banco. La tarjeta no pide días fijos; muestra el próximo cierre y vencimiento del **último resumen** como dato informativo | El banco las fija con un criterio propio que puede cambiar mes a mes (feriados, ciclos); calcularlas daría fechas falsas |
| Editar o anular un resumen | Mientras sus vencimientos no tengan pagos; los cambios se copian a ellos; anular los cancela | Mismo criterio de facturas (5.3) |
| Archivo del resumen | PDF o Excel (los bancos ofrecen los dos). XLSX se verifica por contenido (ZIP con el libro de Excel); Excel no tiene vista previa: se descarga. Leer sus consumos llega con los módulos 9 y 11 | El usuario baja el que le da su banco |
| Baja de tarjeta | Desactivar (no se borra): sus resúmenes y vencimientos se conservan | Historial (RN-008) |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 6.1 | Tarjetas: alta, listado, detalle, edición y baja | `feature/tarjetas-1-tarjetas` | — | [x] |
| 6.2 | Cargar un resumen (genera los vencimientos en pesos y dólares) | `feature/tarjetas-2-resumen` | 6.1 | [x] |
| 6.3 | Detalle, edición y anulación del resumen | `feature/tarjetas-3-detalle` | 6.2 | [x] |
| 6.4 | Resúmenes dentro de la tarjeta, el servicio y el vencimiento | `feature/tarjetas-4-enlaces` | 6.3 | [x] |

Orden recomendado: 6.1 → 6.2 → 6.3 → 6.4. Con 6.1 y 6.2 el módulo ya es usable.

---

## Parte 6.1 – Tarjetas

**Objetivo:** el usuario registra su "Visa Galicia terminada en 1234".

### Backend
- [x] `CardRepository` y casos de uso: alta y edición (servicio del usuario de categoría *Tarjetas*, últimos 4 numéricos, marca + últimos 4 sin repetir → 409), activar/desactivar. Los días de cierre y vencimiento de la tabla no se usan (los fija el banco en cada resumen).
- [x] `GET /cards?active=`, `GET /cards/{id}`, `POST /cards`, `PUT /cards/{id}`, `PATCH /cards/{id}/status`. Incluye `serviceName`.
- [x] Tests: servicio ajeno o de otra categoría, repetida, aislamiento.

### Frontend
- [x] "Tarjetas" en el riel. `/cards`: tarjetas como lista (nombre, marca, terminación, banco, estado).
- [x] `/cards/new` y `/cards/[id]/edit`: servicio emisor, nombre, marca, últimos 4, titular, adicional, límite.
- [x] `/cards/[id]`: datos y Desactivar / Reactivar.

**Listo cuando:** se registra una Visa del servicio "Galicia" y una segunda tarjeta con la misma marca y terminación se rechaza.

**Hecho (26/11/2026):** `CardRepository`, `ManageCardUseCase` (servicio del usuario de categoría Tarjetas, marca + terminación sin repetir → 409, baja lógica) y `CardResource`. `CardRequest`/`CardResponse` sin días de cierre y vencimiento; la respuesta trae `serviceName`. Front: "Tarjetas" en el riel, `/cards` (activas y dadas de baja), `/cards/new` (también `?serviceId=`), `/cards/[id]`, `/cards/[id]/edit`; aviso si no hay servicios de Tarjetas. Verificado: tests y e2e OK.

---

## Parte 6.2 – Cargar un resumen

### Backend
- [x] `CardStatementRepository` y `RegisterCardStatementUseCase`: tarjeta del usuario, vencimiento ≥ cierre, importes ≥ 0, PDF del usuario; confirmado y con sus vencimientos (pesos y dólares según saldo) en la misma transacción; repetido → 409.
- [x] `POST /card-statements` (la tarjeta va en el cuerpo), `GET /cards/{id}/statements`.
- [x] Tests: dos monedas → dos vencimientos, solo pesos → uno, repetido, tarjeta ajena.

### Frontend
- [x] `/cards/[id]/statements/new`: cierre, vencimiento, total en pesos, total en dólares, pago mínimo, próximos cierre y vencimiento, PDF (elegir o subir, como en facturas). Al guardar lleva a la tarjeta.

**Listo cuando:** se carga el resumen de diciembre con $ 250.000 y US$ 40 y aparecen dos vencimientos «Visa Galicia · resumen 2026-12».

**Hecho (26/11/2026, junto con la 6.3):** `CardStatementRepository`, `CardStatementDraftValidator` (tarjeta del usuario y activa al cargar, cierre ≤ vencimiento, documento del usuario, RN-016 → 409), `StatementObligations` (un vencimiento por moneda con saldo: crea, actualiza o cancela; «Visa Galicia · resumen 2026-12» y «… · dólares») y `ManageCardStatementUseCase`. Front: `/cards/[id]/statements/new` con `StatementForm` (fechas y totales del banco, PDF con `DocumentPicker`). Verificado: tests y e2e OK.

---

## Parte 6.3 – Detalle, edición y anulación del resumen

### Backend
- [x] `GET /card-statements/{id}`, `PUT /card-statements/{id}` (copia los cambios a sus vencimientos; crea o cancela el de dólares si cambia el saldo en USD), `POST /card-statements/{id}/reject`. No si algún vencimiento tiene pagos.
- [x] Tests: editar agrega dólares, anular cancela los dos, con pagos (400).

### Frontend
- [x] `/card-statements/[id]`: datos, vencimientos con su estado y acceso a pagar, PDF; Editar y Anular.

**Listo cuando:** se corrige el total en pesos de un resumen y su vencimiento muestra el nuevo; al anular otro, sus vencimientos quedan cancelados.

**Hecho (26/11/2026):** `GET/PUT /card-statements/{id}`, `POST /card-statements/{id}/reject`, `GET /card-statements?obligationId=`. `CardStatement.reject` admite anular uno confirmado. Front: `/card-statements/[id]` (totales con el estado de cada vencimiento y acceso a pagar, PDF), `/card-statements/[id]/edit`, Anular. Verificado: tests y e2e OK.

---

## Parte 6.4 – Resúmenes dentro de la tarjeta, el servicio y el vencimiento

### Frontend (backend cubierto)
- [x] En `/cards/[id]`: últimos resúmenes con totales, "Cargar resumen" y el próximo cierre y vencimiento del último resumen (informativo).
- [x] En `/services/[id]` de un servicio *Tarjetas*: panel con sus tarjetas.
- [x] En `/obligations/[id]`: si viene de un resumen, enlace a él.

**Listo cuando:** desde la tarjeta se carga un resumen, aparece en su lista y desde su vencimiento se llega al resumen.

**Hecho (26/11/2026):** `CardStatementsPanel` en la tarjeta (con el próximo cierre y vencimiento del último resumen), `ServiceCardsPanel` en los servicios de Tarjetas, fila "Resumen" en el vencimiento. Verificado: e2e OK.
