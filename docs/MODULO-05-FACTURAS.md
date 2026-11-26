# Módulo 5 – Facturas (carga manual)

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola: una rama por parte en cada repo.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-002. Reglas: RN-003, RN-004, RN-005. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Punto de partida

- **Base de datos (V4):** `invoices` con servicio obligatorio (RN-003), documento opcional, número, período, emisión, vencimiento, importe, moneda, código de pago, estado (`PENDING_VALIDATION`, `CONFIRMED`, `REJECTED`), origen y confianza (para la IA del módulo 9). Índice único: no se pueden **confirmar** dos facturas con el mismo número para el mismo servicio (RN-005). `obligations.invoice_id` es único: una factura genera **un** vencimiento.
- **Backend:** modelo `Invoice`, entidad, mappers y DTOs (`InvoiceRequest`, `InvoiceResponse`). Faltan repositorio, casos de uso y endpoints.
- **Ya hecho en módulos anteriores:** servicios (2), documentos con PDF y vista previa (3), vencimientos y pagos (4). La factura los une.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Carga manual y confirmación | La factura cargada a mano se guarda **confirmada** y genera su vencimiento en el mismo paso | El usuario ya revisó los datos al tipearlos: pedirle "confirmar" de nuevo es un paso de más. `PENDING_VALIDATION` queda para las que propongan la IA (módulo 9) y Gmail (módulo 10) |
| Vencimiento generado | Tipo Factura, mismo servicio, importe, moneda y vencimiento; título «Luz casa · factura 2026-12» (o el número si no hay período) | El pago, saldo y estado ya funcionan sobre el vencimiento (módulo 4) |
| Duplicados (RN-005) | Al cargar, aviso si el servicio ya tiene una factura con ese número, o del mismo período y mismo importe; la base rechaza el número repetido (409) | Advertir sin bloquear los casos dudosos; bloquear el seguro |
| Editar una factura | Se puede mientras su vencimiento no tenga pagos; los cambios de importe, vencimiento o servicio se copian al vencimiento | Con pagos, cambiar el importe dejaría el saldo sin sentido: primero se anulan |
| Anular una factura | Pasa a `REJECTED` y cancela su vencimiento (solo sin pagos); queda en el historial | Mismo criterio que cancelar un vencimiento (4.2) |
| PDF de la factura | Se elige entre los documentos del usuario o se sube desde el mismo formulario | Reusa el módulo 3 |
| Moneda | ARS o USD, como los vencimientos | Mismo criterio del módulo 4 |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 5.1 | Cargar una factura (genera su vencimiento) y listado | `feature/facturas-1-carga` | — | [ ] |
| 5.2 | Aviso de facturas repetidas | `feature/facturas-2-duplicados` | 5.1 | [ ] |
| 5.3 | Detalle, edición y anulación | `feature/facturas-3-detalle` | 5.1 | [ ] |
| 5.4 | PDF de la factura y facturas dentro del servicio y del vencimiento | `feature/facturas-4-enlaces` | 5.3 | [ ] |

Orden recomendado: 5.1 → 5.2 → 5.3 → 5.4. Con 5.1 el módulo ya es usable.

---

## Parte 5.1 – Cargar una factura y listado

**Objetivo:** el usuario carga la factura de luz de diciembre y aparece su vencimiento, listo para pagar.

### Backend
- [ ] `InvoiceRepository` (puerto + adaptador Panache).
- [ ] `RegisterInvoiceUseCase`: servicio del usuario (RN-003), documento del usuario si viene, ARS o USD, emisión ≤ vencimiento; guarda la factura `CONFIRMED` y crea su vencimiento en la misma transacción.
- [ ] `POST /invoices` → 201 con la factura y el id de su vencimiento.
- [ ] `GET /invoices?query&serviceId&status&from&to&page&size` (búsqueda por número; período por vencimiento; más nuevas primero). Incluye `serviceName`.
- [ ] Tests: servicio ajeno, documento ajeno, fechas, vencimiento generado, aislamiento.

### Frontend
- [ ] "Facturas" en el riel. `/invoices`: tabla (servicio con su tinte, número y período, vencimiento, importe, estado del vencimiento), filtros en la URL, paginación, estados vacío y cargando.
- [ ] `/invoices/new`: servicio (obligatorio), número, período, emisión, vencimiento, importe y moneda, código de pago. Al guardar lleva al vencimiento generado.

**Listo cuando:** se carga la factura de "Luz casa" de diciembre y en Vencimientos aparece «Luz casa · factura 2026-12» con su importe.

---

## Parte 5.2 – Aviso de facturas repetidas (RN-005)

### Backend
- [ ] `GET /invoices/duplicates?serviceId&invoiceNumber&billingPeriod&totalAmount`: facturas confirmadas del servicio con el mismo número, o del mismo período e importe.
- [ ] `POST /invoices` con número repetido → 409 con el mensaje claro (además del índice único).
- [ ] Tests: mismo número, mismo período e importe, otro servicio no cuenta.

### Frontend
- [ ] Aviso en el formulario mientras se completa (como el de servicios repetidos), con enlace a la factura existente.

**Listo cuando:** al cargar dos veces la misma factura se avisa antes de guardar y la segunda no se confirma.

---

## Parte 5.3 – Detalle, edición y anulación

### Backend
- [ ] `GET /invoices/{id}` (404 si es de otro usuario).
- [ ] `PUT /invoices/{id}`: mismas validaciones; copia importe, moneda, vencimiento y servicio a su vencimiento; no si el vencimiento tiene pagos.
- [ ] `POST /invoices/{id}/reject`: anula la factura y cancela su vencimiento (no si tiene pagos).
- [ ] Tests: editar con pagos (400), anular cancela el vencimiento, ajena (404).

### Frontend
- [ ] `/invoices/[id]`: datos, código de pago (con botón copiar), vencimiento generado con su estado y acceso a pagar; Editar y Anular (con confirmación).
- [ ] `/invoices/[id]/edit`.

**Listo cuando:** se corrige el importe de una factura y su vencimiento muestra el nuevo; al anular otra, su vencimiento queda "Cancelada".

---

## Parte 5.4 – PDF y facturas dentro del servicio y del vencimiento

### Backend
- [ ] (cubierto) `documentId` en alta y edición; filtro `serviceId` del listado.

### Frontend
- [ ] En el alta: elegir el PDF entre los documentos o subirlo ahí mismo (queda asociado al servicio).
- [ ] En el detalle de la factura: vista previa del PDF.
- [ ] En `/services/[id]`: panel "Facturas" con las últimas del servicio y "Cargar factura" que ya lo deja elegido.
- [ ] En `/obligations/[id]`: si viene de una factura, enlace a ella y a su PDF.

**Listo cuando:** desde "Luz casa" se carga una factura con su PDF, se ve en el panel del servicio y desde su vencimiento se abre el PDF.
