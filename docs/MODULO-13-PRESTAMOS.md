# Módulo 13 – Préstamos

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Reutiliza vencimientos, pagos, avisos y documentos (módulos 3, 4 y 8). Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Registrar los préstamos que tomó el usuario (banco, financiera, una persona) y saber en todo momento cuánto debe, cuántas cuotas faltan y cuándo termina, con cada cuota como un vencimiento más: aviso antes, pago con comprobante y botón Pagar.

**Alcance:** solo préstamos **tomados**. La plata que el usuario prestó a otros queda afuera.

## Punto de partida

- **Ya hay:** vencimientos (`obligations`) con tipos, estados, saldo y pagos parciales; recurrencias; pagos con comprobante; avisos por umbral (módulo 8); documentos con vencimiento; el botón Pagar con billetera; el asistente con herramientas de solo lectura (módulo 12).
- **Falta:** el préstamo como cosa entera (entidad, monto, cuotas) y el vínculo de cada cuota con su préstamo.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Qué es una cuota | Un vencimiento (`obligations`) de tipo nuevo `LOAN` con `loan_id` y número de cuota | Hereda avisos, pagos, saldo, estado vencido y el botón Pagar sin código nuevo |
| Cuándo se crean las cuotas | Todas juntas al dar de alta el préstamo | El usuario ve el cronograma completo y la fecha de la última cuota desde el primer día |
| Importe | Cuota fija por defecto; en préstamos de cuota variable (UVA, tasa variable) se corrige el importe de cada cuota antes de pagarla | Sin calcular amortización ni tasas: el banco manda el importe y el usuario lo carga |
| Moneda | ARS o USD, por separado (RN-018) | Un préstamo UVA se paga en pesos: es ARS con cuota variable |
| Capital e interés | No se separan | El dato que importa es cuánto falta pagar; separar exige la tabla del banco |
| Cuotas ya pagadas | Al dar de alta un préstamo en curso, se indica cuántas cuotas ya se pagaron: se crean como pagadas, sin comprobante | Permite cargar un préstamo empezado sin inventar pagos uno por uno |
| Cancelación anticipada | "Cancelar el préstamo" cancela las cuotas pendientes con un motivo; las pagadas quedan | Mismo mecanismo que cancelar un vencimiento |
| Contrato | Documento adjunto (tipo nuevo `LOAN_CONTRACT`) | Reutiliza el repositorio documental |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 13.1 | Alta del préstamo y sus cuotas como vencimientos | `feature/prestamos-1-2` (junto con 13.2) | — | [ ] |
| 13.2 | Ficha del préstamo: cuánto falta, cronograma, editar cuota variable, cancelar | `feature/prestamos-1-2` | 13.1 | [ ] |
| 13.3 | Préstamos en el inicio, en la lista de vencimientos y en el asistente | `feature/prestamos-3` | 13.2 | [ ] |

---

## Parte 13.1 – Alta del préstamo

### Backend
- [ ] Migración V14: tabla `loans` (usuario, entidad, nombre, moneda, monto pedido, cantidad de cuotas, importe de la cuota, cuota variable sí/no, fecha de la primera cuota, documento del contrato, notas, estado `ACTIVE`/`PAID`/`CANCELLED`, fechas); `obligations.loan_id` y `obligations.installment_number`; tipo de vencimiento `LOAN`; tipo de documento `LOAN_CONTRACT`.
- [ ] `POST /loans`: valida (cuotas 1 a 360, importe > 0, moneda ARS o USD, cuotas ya pagadas menor que el total) y crea el préstamo y sus N cuotas en una transacción: el mismo día de cada mes que la primera (si el mes no tiene ese día, el último), título "Préstamo {nombre} · cuota n/N"; las ya pagadas quedan pagadas.
- [ ] `GET /loans` (con cuotas pagadas, pendientes, deuda restante y próxima cuota) y `GET /loans/{id}`.
- [ ] Tests: genera N cuotas con las fechas correctas (31/1 → 28/2), las ya pagadas, aislamiento entre usuarios.

### Frontend
- [ ] "Préstamos" en el menú: lista con entidad, cuota n/N, deuda restante por moneda y próxima fecha.
- [ ] Alta: entidad, nombre, moneda, monto pedido, cantidad de cuotas, importe de la cuota, "la cuota cambia cada mes", fecha de la primera cuota, cuotas ya pagadas, contrato (opcional).
- [ ] Antes de guardar, vista previa del cronograma: primera y última cuota, total a pagar.

**Listo cuando:** cargo un préstamo de 12 cuotas de $ 50.000 que empezó hace 3 meses y aparecen 9 vencimientos pendientes, con el primero el mes que viene.

---

## Parte 13.2 – Ficha del préstamo

### Backend
- [ ] `PATCH /loans/{id}/installments/{n}` (`amount`): cambia el importe de una cuota pendiente (cuota variable). Una cuota con pagos no se edita.
- [ ] `POST /loans/{id}/cancel` (`reason`): cancela las cuotas pendientes y marca el préstamo `CANCELLED`.
- [ ] El préstamo pasa a `PAID` solo cuando se paga su última cuota pendiente.
- [ ] `PUT /loans/{id}`: editar nombre, entidad, notas y contrato (no cuotas ni montos).
- [ ] Tests: editar cuota variable, no editar una pagada, cancelar deja las pagadas, pasa a `PAID` con la última.

### Frontend
- [ ] Ficha: deuda restante grande, cuotas pagadas n de N con una barra de progreso del préstamo, fecha de la última cuota, total pagado.
- [ ] Cronograma: cada cuota con fecha, importe, estado y link a su vencimiento (donde se paga); en cuota variable, "Cambiar importe" en las pendientes.
- [ ] Contrato adjunto con vista previa; "Cancelar el préstamo" con confirmación y motivo.

**Listo cuando:** pago la cuota 4 desde su vencimiento y la ficha muestra 4 de 12 pagadas y la deuda restante actualizada.

---

## Parte 13.3 – Inicio, vencimientos y asistente

### Backend
- [ ] `GET /dashboard`: deuda de préstamos por moneda.
- [ ] Herramienta del asistente `loans()`: préstamos activos con cuotas restantes, deuda y próxima cuota (referencias a cada préstamo).

### Frontend
- [ ] Inicio: "Préstamos" con la deuda restante por moneda y la próxima cuota.
- [ ] En la lista de vencimientos, el tipo "Préstamo" con filtro; en el detalle de una cuota, link "Ver el préstamo".
- [ ] El asistente responde "¿cuánto me falta del préstamo?" con link a la ficha.

**Listo cuando:** el inicio muestra cuánto debo de préstamos y el asistente responde cuántas cuotas me faltan.

---

## Fuera de alcance

- Plata prestada a otros (lo que me deben).
- Calcular cuotas a partir de tasa y plazo (sistema francés o alemán) y separar capital e interés.
- Leer el importe de la cuota con IA desde el email o el resumen del banco (posible mejora sobre el módulo 10).
- Refinanciaciones: se cancela el préstamo y se carga uno nuevo.
