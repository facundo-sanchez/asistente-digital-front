# Módulo 4 – Obligaciones y pagos

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola: una rama por parte en cada repo.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Casos de uso: CU-005 y CU-006. Reglas: RN-008 y RN-012. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Punto de partida

- **Base de datos (V4):** `obligations` (título, tipo, servicio, importe y moneda opcionales, vencimiento, estado persistido, cancelación), `payments` (pagos parciales, medio, comprobante, anulación con motivo, `replaces_payment_id` para correcciones) y la vista `v_obligations`, que calcula `paid_amount`, `balance` y `effective_status` (vencida / próxima a vencer, con "hoy" en la zona horaria del usuario).
- **Backend:** modelos `Obligation` y `Payment`, entidades (incluida `ObligationViewEntity`), mappers y DTOs (`ObligationRequest/Response`, `CancelObligationRequest`, `PaymentRequest/Response`, `VoidPaymentRequest`). Faltan repositorios, casos de uso y endpoints.
- **Frontend:** tipos en `src/types/api/`; en el detalle de servicio ya hay un panel vacío "Facturas y vencimientos".

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Estados | Se guardan `PENDING`, `PARTIALLY_PAID`, `PAID`, `CANCELLED`; "próxima a vencer" (7 días) y "vencida" los calcula la vista | No hay que actualizar filas cuando pasa el tiempo (RN-012) |
| Quién crea obligaciones | Alta manual en este módulo (VTV, impuestos, seguros…). Las de facturas las crea el módulo 5 al confirmar la factura | Así el módulo se puede usar solo |
| Estado después de un pago | Pagado ≥ importe → `PAID` (con `paid_at`); si no, `PARTIALLY_PAID`. Una obligación **sin importe** queda `PAID` con el primer pago | Cubre el flujo alternativo de CU-006 ("se registra la diferencia": queda el saldo) |
| Moneda del pago | La misma que la de la obligación (ARS o USD). Sin importe en la obligación, la elige el usuario | Evita sumar monedas distintas |
| Pago de más | Se acepta; el saldo queda en 0 | Pasa en la vida real (recargos, redondeos); no se bloquea al usuario |
| Pagos | No se borran ni se editan: se **anulan** con motivo; corregir = anular y crear uno nuevo que lo reemplaza | RN-008: historial completo |
| Cancelar | Solo si no está pagada; con motivo opcional. Una obligación con pagos no se cancela: primero se anulan | Cancelar algo con pagos vigentes dejaría el saldo sin sentido |
| Comprobante | `receiptDocumentId` opcional: un documento ya subido del usuario | Reusa el módulo 3; subir uno nuevo desde el pago queda para después si hace falta |
| Recurrencias (CU-014) | Las configura el usuario (parte 4.6): alquiler, seguros, VTV. Las **detectadas** desde facturas quedan para el módulo 5 | El alquiler vence todos los meses y no tiene factura: cargarlo a mano cada mes no tiene sentido |
| Cómo se generan | Una tarea diaria crea solo el **próximo** vencimiento de cada regla activa, unos días antes del período; nunca dos para el mismo período | La lista no se llena de meses futuros y un servidor apagado se pone al día solo |
| Importes | `BigDecimal` en el backend; en el front se formatean con `Intl.NumberFormat("es-AR")` | Sin errores de redondeo |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 4.1 | Alta manual y listado con filtros | `feature/obligaciones-1-2` (junto con 4.2) | — | [x] |
| 4.2 | Detalle, edición y cancelación | `feature/obligaciones-1-2` | 4.1 | [x] |
| 4.3 | Registrar un pago (total o parcial) | `feature/obligaciones-3-pago` | 4.2 | [x] |
| 4.4 | Historial de pagos, anulación y corrección | `feature/obligaciones-4-historial` | 4.3 | [x] |
| 4.5 | Vencimientos dentro del servicio | `feature/obligaciones-5-en-servicio` | 4.1 | [ ] |
| 4.6 | Vencimientos que se repiten (alquiler, seguros) | `feature/obligaciones-6-recurrentes` | 4.2 | [ ] |

Orden: 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6. Con 4.1 a 4.3 el módulo ya es usable.

---

## Parte 4.1 – Alta manual y listado

**Objetivo:** el usuario carga un vencimiento (ej. "VTV auto", 15/12) y lo ve en una tabla con su estado.

### Backend
- [x] `ObligationRepository` (puerto + adaptador Panache): guardar en `obligations`, leer de `v_obligations` (estado efectivo, pagado, saldo).
- [x] `RegisterObligationUseCase`: valida que el servicio sea del usuario; importe y moneda juntos.
- [x] `POST /obligations` → 201.
- [x] `GET /obligations?query&status&serviceId&category&from&to&page&size` (estado efectivo; período por vencimiento; ordenado por vencimiento, las vencidas primero). Incluye `serviceName`.
- [x] Tests: servicio ajeno, estados calculados, filtros, aislamiento entre usuarios.

### Frontend
- [x] `/obligations` ("Vencimientos" en el riel): tabla tipo libro de cuentas (vencimiento, título, servicio, importe, saldo, estado con color), filtros en la URL, paginación, estados vacío y cargando.
- [x] `/obligations/new`: título, tipo, servicio (opcional), importe y moneda, vencimiento.

**Listo cuando:** se carga "VTV auto" con vencimiento en 3 días y aparece como "Próxima a vencer"; una con fecha pasada aparece "Vencida".

**Hecho (25/11/2026):** `ObligationRepository` (escribe en `obligations`, lee de `v_obligations`), `ObligationDraftValidator` (servicio del usuario, importe y moneda juntos, solo ARS o USD), `RegisterObligationUseCase`, `ObligationQueryUseCase` (nombres de servicio en una consulta). `GET /obligations` con `status` separado por comas (estado efectivo), `serviceId`, `category` (la del servicio), `from`/`to` y `query`; `serviceName` en la respuesta. Front: "Vencimientos" en el riel, `/obligations` con filtros en la URL (por defecto "Por pagar"), tabla con importe, saldo y estado (punto + palabra), `/obligations/new`. Verificado contra la base: en 3 días → Próxima a vencer, hace 10 días → Vencida, filtros por estado, categoría, período y texto, otro usuario ve 0. 7 tests de backend y 6 de front nuevos.

---

## Parte 4.2 – Detalle, edición y cancelación

### Backend
- [x] `GET /obligations/{id}` (404 si es de otro usuario).
- [x] `PUT /obligations/{id}` (mismas validaciones que el alta; no cambia el estado).
- [x] `POST /obligations/{id}/cancel` (motivo opcional; no si está pagada o tiene pagos vigentes).
- [x] Tests: cancelar pagada (400), editar ajena (404).

### Frontend
- [x] `/obligations/[id]`: datos, importe, pagado y saldo, documentos del servicio asociados; Editar y Cancelar (con confirmación).
- [x] `/obligations/[id]/edit`.

**Listo cuando:** se edita el importe de una obligación y se cancela otra; la cancelada figura como "Cancelada".

**Hecho (25/11/2026):** `ManageObligationUseCase` (`update`: no si está pagada o cancelada, ni con importe menor a lo pagado; `cancel`: motivo opcional, no si ya está cancelada o tiene pagos). `GET/PUT /obligations/{id}`, `POST /obligations/{id}/cancel` (204). Front: detalle con estado, importe, pagado, saldo y los documentos del servicio; Editar y "Cancelar vencimiento" con motivo. Corrección encontrada en la prueba: la respuesta de la edición traía los datos viejos porque Hibernate devolvía la fila de la vista ya leída en la transacción; ahora se refresca después de guardar.

---

## Parte 4.3 – Registrar un pago

### Backend
- [x] `PaymentRepository` y `RegisterPaymentUseCase`: obligación del usuario y no cancelada ni pagada, moneda igual a la de la obligación, comprobante del usuario; actualiza estado y `paid_at` en la misma transacción.
- [x] `POST /payments` → 201.
- [x] Tests: pago total → `PAID`, parcial → `PARTIALLY_PAID` con saldo, sin importe → `PAID`, moneda distinta (400), obligación ajena (404), cancelada (400).

### Frontend
- [x] "Registrar pago" en el detalle: diálogo con importe (sugiere el saldo), fecha (hoy), medio de pago, comprobante opcional (documentos del usuario) y notas.

**Listo cuando:** se paga la mitad de una factura y queda "Pago parcial" con el saldo; al pagar el resto queda "Pagada".

**Hecho (25/11/2026):** `Obligation.applyPaidAmount` (nada → Pendiente, todo o más o sin importe → Pagada con `paid_at`, si no → Pago parcial; lo reusa la anulación de la 4.4), `PaymentRepository`, `RegisterPaymentUseCase` (obligación del usuario, ni pagada ni cancelada, misma moneda, comprobante del usuario) y `POST /payments`. Front: "Registrar pago" en el detalle (sugiere el saldo, fecha de hoy, medio, comprobante entre los documentos, notas); "Cancelar vencimiento" se oculta si ya hay pagos. Verificado contra la base: 15000 de 40000 → Pago parcial con saldo 25000, el resto → Pagada, otra moneda / fecha futura / ya pagada 400, ajena 404, cancelar con pagos 400. 7 tests de backend y 2 de front nuevos. Atajo anotado: dos pagos simultáneos de la misma obligación no se bloquean (un usuario por cuenta).

---

## Parte 4.4 – Historial, anulación y corrección

### Backend
- [x] `GET /obligations/{id}/payments` (incluye anulados).
- [x] `POST /payments/{id}/void` (motivo obligatorio) y `PUT /payments/{id}` (anula y crea el reemplazo, en una transacción). Recalculan el estado de la obligación.
- [x] Tests: anular el único pago vuelve a `PENDING`; corrección conserva el anulado; pago ajeno (404).

### Frontend
- [x] Historial de pagos en el detalle (los anulados tachados, con motivo), acciones Anular y Corregir.

**Listo cuando:** se anula un pago cargado por error y la obligación vuelve a "Pendiente", con el pago anulado visible en el historial.

**Hecho (25/11/2026):** `PaymentDraftValidator` (moneda y comprobante, compartido por registrar y corregir), `ManagePaymentUseCase` (`history`, `voidPayment`, `correct`: anula con motivo «Corregido» y crea el reemplazo con `replacesPaymentId`; el estado se recalcula con `applyPaidAmount`). `GET /obligations/{id}/payments`, `POST /payments/{id}/void` (204), `PUT /payments/{id}`. Front: panel "Pagos" en el detalle (fecha, importe, medio, comprobante con enlace, notas; anulados tachados con motivo) y acciones Corregir y Anular; el formulario del pago pasó a `PaymentDialog`, compartido por registrar y corregir. Verificado contra la base: anular uno de dos → Pago parcial, corregir 4000 → 40000 → Pagada, sin motivo / ya anulado 400, ajeno 404. 4 tests de backend nuevos.

---

## Parte 4.5 – Vencimientos dentro del servicio

### Frontend (backend cubierto por el filtro `serviceId`)
- [ ] En `/services/[id]`, el panel "Facturas y vencimientos" muestra las obligaciones del servicio y "Nuevo vencimiento" que ya lo deja asociado.

**Listo cuando:** desde el detalle de "Luz casa" se carga un vencimiento y aparece en su panel.

---

## Parte 4.6 – Vencimientos que se repiten

**Objetivo:** el alquiler (o un seguro, la VTV) se carga una vez y el sistema genera el vencimiento de cada período.

### Backend
- [ ] Tipo de obligación `RENT` ("Alquiler"), con migración Flyway (la base valida los tipos).
- [ ] `RecurringRuleRepository` y casos de uso: crear (crea también el primer vencimiento), editar (afecta a los próximos, no a los ya creados), desactivar.
- [ ] `POST/GET/PUT /recurring-rules`, `PATCH /recurring-rules/{id}/status`.
- [ ] Tarea diaria (Quarkus Scheduler) que crea el próximo vencimiento de cada regla activa unos días antes; día 31 → último día de los meses cortos; sin duplicados por período (`recurrence_id` + vencimiento).
- [ ] Tests: cálculo de fechas (mensual, bimestral, anual, día 31, febrero), no duplica, regla inactiva no genera, regla ajena (404).

### Frontend
- [ ] En el alta de vencimiento: "Se repite" con periodicidad y día del mes.
- [ ] En el detalle: "Se repite cada mes" con acceso a editar o desactivar la regla.

**Listo cuando:** se carga "Alquiler depto" mensual el día 10 y, al correr la tarea, aparece el vencimiento del mes siguiente con el mismo importe; al desactivar la regla deja de generarse.
