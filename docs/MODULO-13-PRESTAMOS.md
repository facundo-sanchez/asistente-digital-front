# Módulo 13 – Préstamos

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Reutiliza vencimientos, pagos, avisos y documentos (módulos 3, 4 y 8) y la lectura con IA (módulo 9). Criterio de código: simple, sin abstracciones de más.

**Estado (27/11/2026):** 13.1 y 13.2 hechas en `feature/prestamos-1-2` (backend y front), con tests. Cambios: la migración es V17 (recrea `v_obligations` para que vea las columnas nuevas); la **lectura con IA del comprobante de alta pasa a 13.3**, junto con la del comprobante de pago (misma infraestructura); por ahora el contrato se adjunta con el tipo de documento existente `CONTRACT`. El estado "Pagado" se calcula (sin cuotas pendientes), no se guarda.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Registrar los préstamos que tomó el usuario (banco, financiera, una persona) y saber en todo momento cuánto debe, cuántas cuotas faltan y cuándo termina. Cada cuota es un vencimiento más: aviso antes, pago con comprobante y botón Pagar. El alta y los pagos se pueden cargar desde los comprobantes del banco, que lee la IA.

**Alcance:** solo préstamos **tomados**. La plata que el usuario prestó a otros queda afuera.

## Punto de partida

- **Ya hay:** vencimientos (`obligations`) con tipos, estados, saldo y pagos parciales; pagos con comprobante; avisos (módulo 8); documentos; lectura de PDF e imagen con Gemini y revisión antes de confirmar (módulo 9); el botón Pagar con billetera; el asistente con herramientas (módulo 12).
- **Falta:** el préstamo como cosa entera (entidad, número, capital, cuotas), el vínculo de cada cuota con su préstamo y la lectura de los comprobantes de préstamos.

## Qué traen los comprobantes (BBVA de ejemplo)

| Comprobante | Datos que trae | Lo que **no** trae |
|---|---|---|
| **Alta** ("Concepto: ALTA") | número de préstamo, tipo (préstamo personal), capital, moneda, tasa fija o variable, TNA, CFTEA, fecha de alta | cantidad de cuotas, importe de la cuota, fecha de la primera cuota |
| **Aviso por email** (avisos@bbva.com.ar, asunto "Mensajes y avisos por e-mail - PRESTAMOS", unos días antes) | número de cuota, referencia corta del préstamo (ej. "203/2"), moneda, importe real y fecha de vencimiento, en una frase fija: "La cuota 10 de su préstamo personal 203/2, por ars 584292,14, vence el 07/11/2026." | el número largo del préstamo, el saldo, el desglose |
| **Pago de cuota** ("Concepto: PAGO DE RECIBO") | número de préstamo, monto del préstamo, fecha de desembolso, número de cuota pagada, cuotas pendientes, fecha de vencimiento de la cuota, fecha de pago, importe total, desglose (capital, intereses, IVA, sellados), saldo anterior y nuevo saldo | — |

Consecuencias para el diseño:
- El alta solo con su comprobante no alcanza para armar el cronograma: la cantidad de cuotas, el importe y la primera fecha los completa el usuario, o salen de un comprobante de pago (cuota pagada + pendientes = total; el día de vencimiento; el importe).
- El importe de la cuota cambia mes a mes aunque la tasa sea fija (sistema francés: baja el interés y con él el IVA). Por eso **todas** las cuotas se tratan como estimadas hasta que llega su comprobante.
- El aviso por email llega **antes** del vencimiento con el importe real: con Gmail conectado, la cuota deja de ser estimada sin que el usuario haga nada. Pero usa una referencia corta ("203/2") distinta del número del comprobante, así que el préstamo guarda también esa referencia.
- El "saldo" del banco es **capital adeudado**, no lo que falta pagar (las cuotas suman además intereses, IVA y sellados). La ficha muestra los dos, cada uno con su nombre.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Qué es una cuota | Un vencimiento de tipo nuevo `LOAN` con `loan_id` y número de cuota | Hereda avisos, pagos, saldo, estado vencido y el botón Pagar |
| Cuándo se crean las cuotas | Todas juntas al dar de alta el préstamo | El cronograma completo y la fecha de la última cuota desde el primer día |
| Importe de las cuotas | El de la cuota informada (o el que pone el usuario), marcado como estimado; el comprobante de pago lo reemplaza por el real | Sin calcular amortización ni tasas: el banco manda el importe |
| Identificar el préstamo | Por número de préstamo (único por usuario) | Así un comprobante de pago encuentra su préstamo y su cuota sin que el usuario elija |
| Comprobantes | Se guardan como documentos (tipos nuevos `LOAN_CONTRACT` y `LOAN_RECEIPT`) y se leen con la IA del módulo 9, con revisión antes de confirmar (RN de siempre: nada se registra sin confirmar) | Reutiliza la cola, Gemini y la pantalla de revisión |
| Aviso de cuota por email | Lo detecta Gmail (módulo 10) con una regla del proveedor BBVA por remitente y asunto, y lo lee **con un patrón, sin IA** (la frase es fija; no gasta cuota de Gemini). Actualiza importe y fecha de la cuota; no registra ningún pago | El importe real llega antes de pagar, sin intervención |
| Referencia corta del préstamo | Se guarda en el préstamo la primera vez que llega un aviso: si el usuario tiene un solo préstamo de esa entidad se asocia solo; si tiene varios, se le pregunta a cuál corresponde y se recuerda | El aviso no trae el número largo |
| Saldo del banco | Se guarda el último "nuevo saldo" leído, con su fecha | Es el dato que el banco usa para cancelar anticipadamente |
| Moneda | ARS o USD, por separado (RN-018); UVA = ARS con cuota variable | Igual que el resto de la app |
| Cuotas ya pagadas al cargar | Se indica cuántas: se crean pagadas, sin comprobante | Cargar un préstamo en curso sin inventar pagos |
| Cancelación anticipada | Cancela las cuotas pendientes con un motivo; las pagadas quedan | Mismo mecanismo que cancelar un vencimiento |
| Datos personales del comprobante | Titular, CUIT, domicilio y cuenta no se guardan como datos del préstamo (quedan solo en el PDF) | No hacen falta y son sensibles |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 13.1 | Alta del préstamo (a mano o desde el comprobante de alta) y sus cuotas como vencimientos | `feature/prestamos-1-2` (junto con 13.2) | — | [~] |
| 13.2 | Ficha: cuánto falta, cronograma, cambiar importe, cancelar | `feature/prestamos-1-2` | 13.1 | [x] |
| 13.3 | Comprobante de pago de cuota: la IA lo lee y registra el pago en su cuota | `feature/prestamos-3-4` (junto con 13.4) | 13.2 | [ ] |
| 13.4 | Préstamos en el inicio, en vencimientos y en el asistente | `feature/prestamos-3-4` | 13.2 | [ ] |
| 13.5 | Aviso de cuota por email (Gmail): importe y fecha reales antes de pagar | `feature/prestamos-5-6` (junto con 13.6) | 13.2, módulo 10 | [ ] |
| 13.6 | Cada cuánto se leen los emails, configurable en Mi perfil | `feature/prestamos-5-6` | módulo 10 | [ ] |

---

## Parte 13.1 – Alta del préstamo

### Backend
- [x] Migración V14: tabla `loans` (usuario, entidad, nombre, número de préstamo, referencia corta del banco, moneda, capital, tasa fija/variable, TNA, fecha de alta, cantidad de cuotas, fecha de la primera cuota, documento del alta, último saldo del banco y su fecha, notas, estado `ACTIVE`/`PAID`/`CANCELLED`); único (usuario, número de préstamo); `obligations.loan_id` e `installment_number`; tipo de vencimiento `LOAN`; tipos de documento `LOAN_CONTRACT` y `LOAN_RECEIPT`.
- [x] `POST /loans`: valida (cuotas 1 a 360, importe > 0, ARS o USD, cuotas ya pagadas < total, número no repetido) y en una transacción crea el préstamo y sus N cuotas: el mismo día de cada mes que la primera (si el mes no lo tiene, el último), título "Préstamo {nombre} · cuota n/N", importe estimado; las ya pagadas quedan pagadas.
- [ ] Lectura del comprobante de alta (esquema `loan_contract/1` en el módulo 9): entidad, número, tipo, capital, moneda, tasa, TNA, fecha de alta. `POST /loans/from-document/{documentId}` devuelve la propuesta para completar.
- [ ] Si se adjunta un comprobante de **pago** en el alta, la propuesta suma total de cuotas (pagada + pendientes), día de vencimiento, importe de referencia, cuotas ya pagadas y saldo.
- [x] `GET /loans` (cuotas pagadas y pendientes, lo que falta pagar, saldo del banco, próxima cuota) y `GET /loans/{id}`.
- [x] Tests: N cuotas con fechas correctas (31/1 → 28/2), cuotas ya pagadas, número repetido, aislamiento; lectura con el comprobante de ejemplo (fixture **anonimizado**: sin titular, CUIT, domicilio ni cuenta reales).

### Frontend
- [x] "Préstamos" en el menú: lista con entidad, cuota n/N, lo que falta por moneda y próxima fecha.
- [ ] Alta en dos caminos: **"Subir el comprobante"** (alta y, opcional, un pago: la IA completa lo que puede y marca lo que falta) o **"Cargarlo a mano"**.
- [x] Formulario: entidad, nombre, número de préstamo, moneda, capital, tasa, cantidad de cuotas, importe de la cuota, fecha de la primera cuota, cuotas ya pagadas; los datos leídos por la IA se ven marcados para revisar.
- [x] Antes de guardar, vista previa: primera y última cuota y total estimado a pagar.

**Listo cuando:** subo el comprobante de alta de BBVA, completo 30 cuotas que vencen los 7, y aparecen los 30 vencimientos con el capital y la tasa leídos.

---

## Parte 13.2 – Ficha del préstamo

### Backend
- [x] `PATCH /loans/{id}/installments/{n}` (`amount`): cambia el importe de una cuota pendiente. Una cuota con pagos no se edita.
- [x] `POST /loans/{id}/cancel` (`reason`): cancela las cuotas pendientes y marca el préstamo `CANCELLED`.
- [x] El préstamo pasa a `PAID` cuando se paga su última cuota pendiente.
- [x] `PUT /loans/{id}`: editar nombre, entidad, notas y documento del alta (no cuotas ni montos).
- [x] Tests: editar cuota, no editar una pagada, cancelar deja las pagadas, `PAID` con la última.

### Frontend
- [x] Ficha: **lo que falta pagar** (suma de cuotas pendientes, estimado) y **saldo de capital según el banco** (con su fecha), cada uno con su nombre; cuotas pagadas n de N con barra de progreso; fecha de la última cuota; total pagado; TNA y tipo de tasa.
- [x] Cronograma: cada cuota con fecha, importe (real o "estimado"), estado y link a su vencimiento; "Cambiar importe" en las pendientes.
- [~] Comprobante de alta con vista previa (falta: se hace con 13.3); "Cancelar el préstamo" con confirmación y motivo.

**Listo cuando:** pago la cuota 4 desde su vencimiento y la ficha muestra 4 de 30 pagadas y lo que falta actualizado.

---

## Parte 13.3 – Comprobante de pago de cuota

### Backend
- [ ] Lectura del comprobante de pago (esquema `loan_receipt/1`): número de préstamo, cuota pagada, cuotas pendientes, fecha de vencimiento, fecha de pago, importe total, desglose (capital, intereses, IVA, sellados), saldo anterior y nuevo.
- [ ] Revisión antes de confirmar: busca el préstamo por número y la cuota por número; avisa si no encuentra el préstamo ("Cargalo primero o elegí el préstamo"), si la cuota ya está pagada o si la cantidad de cuotas no coincide con lo cargado.
- [ ] Al confirmar, en una transacción: fija el importe real de la cuota, registra el pago (fecha de pago, importe, el comprobante adjunto), guarda el nuevo saldo del banco y su fecha. El desglose queda en el pago para mostrarlo.
- [ ] El mismo comprobante subido dos veces no registra dos pagos (checksum del documento, como en el módulo 3).
- [ ] Tests: registra el pago en la cuota correcta, actualiza importe y saldo, rechaza la cuota ya pagada, aislamiento.

### Frontend
- [ ] En la ficha y en cada cuota: "Subir comprobante de pago" → revisión con los datos leídos (cuota n/N, importe, fecha, desglose, nuevo saldo) → Confirmar.
- [ ] También desde **Subir con IA** general: un comprobante de pago de préstamo se reconoce y va a esta revisión.
- [ ] En el detalle de la cuota pagada: desglose de capital, intereses, IVA y sellados, y el comprobante.

**Listo cuando:** subo el comprobante de pago de la cuota 10 y queda pagada con $ 584.292,14 del 11/11, el saldo del banco pasa a $ 5.820.337,83 y la ficha muestra 10 de 30.

---

## Parte 13.4 – Inicio, vencimientos y asistente

### Backend
- [ ] `GET /dashboard`: lo que falta pagar de préstamos por moneda.
- [ ] Herramienta del asistente `loans()`: préstamos activos con cuotas restantes, lo que falta, saldo del banco y próxima cuota (referencias a cada préstamo).

### Frontend
- [ ] Inicio: "Préstamos" con lo que falta por moneda y la próxima cuota.
- [ ] En vencimientos, el tipo "Préstamo" con filtro; en el detalle de una cuota, "Ver el préstamo".
- [ ] El asistente responde "¿cuánto me falta del préstamo?" con link a la ficha.

**Listo cuando:** el inicio muestra cuánto debo de préstamos y el asistente responde cuántas cuotas me faltan.

---

## Parte 13.5 – Aviso de cuota por email

### Backend
- [ ] Regla de email del proveedor BBVA: remitente `avisos@bbva.com.ar`, asunto que contiene "PRESTAMOS", lectura del cuerpo (V15 si hace falta una regla nueva en `provider_email_rules`).
- [ ] Lector por patrón de la frase "La cuota {n} de su préstamo {tipo} {referencia}, por {moneda} {importe}, vence el {dd/mm/aaaa}" (importe con coma decimal). Si la frase no coincide, el email queda en "Detectado en tu correo" como no leído, sin tocar nada.
- [ ] Asociación: préstamo por referencia corta; si no hay, el único préstamo activo de BBVA (y se guarda la referencia); si hay varios, queda pendiente para que el usuario elija.
- [ ] Actualiza la cuota n: importe real (deja de ser estimado) y fecha de vencimiento si cambió. No toca cuotas con pagos. El mismo email no se procesa dos veces (como el resto de Gmail).
- [ ] Tests con el texto del ejemplo (anonimizado): importe 584292,14 → 584.292,14; fecha; préstamo único se asocia solo; con dos, queda pendiente; cuota pagada no cambia.

### Frontend
- [ ] En la cuota: "Importe confirmado por el banco el 05/11" en lugar de "estimado".
- [ ] En "Detectado en tu correo" (Integraciones): el aviso del préstamo con lo que se actualizó, o "¿A qué préstamo corresponde?" con un selector cuando hay varios.

**Listo cuando:** con Gmail conectado, llega el aviso de la cuota 10 y su vencimiento pasa de estimado a $ 584.292,14 con vencimiento 07/11, sin tocar nada.

---

## Parte 13.6 – Cada cuánto se leen los emails

Hoy Gmail se revisa cada 15 minutos para todos (`app.integrations.sync-every`). Con esta parte cada usuario elige la frecuencia en **Mi perfil**. Es una mejora del módulo 10; va acá porque el aviso de cuota la vuelve más útil (y porque cada lectura con IA gasta cuota de Gemini).

### Decisiones
- Opciones: **cada 15 minutos** (por defecto, como hoy), **cada hora**, **cada 6 horas**, **una vez por día** (a las 8, antes de los avisos de las 9) y **solo cuando toco "Revisar ahora"**.
- La tarea sigue corriendo cada 15 minutos como reloj; para cada cuenta revisa solo si ya pasó su intervalo desde `last_sync_at` (columna que ya existe). Sin tareas nuevas ni cron por usuario.
- "Revisar ahora" (Integraciones) sigue funcionando con cualquier opción.

### Backend
- [ ] Migración: `users.email_check_interval` (`15M`, `1H`, `6H`, `DAILY`, `MANUAL`; por defecto `15M`).
- [ ] `PUT /users/me/email-check-interval` y el valor en `GET /users/me` (como la billetera: endpoint propio para no pisar el resto del perfil).
- [ ] `GmailSyncUseCase`: antes de revisar una cuenta, compara `last_sync_at` con el intervalo de su usuario; `DAILY` revisa una vez por día desde las 8 en la zona del usuario; `MANUAL` nunca en automático.
- [ ] Tests: con 1 hora no revisa a los 30 minutos y sí a los 61; `DAILY` una sola vez por día; `MANUAL` nunca en automático pero sí con "Revisar ahora".

### Frontend
- [ ] Mi perfil → sección **Correo**: "Revisar mis emails" con las cinco opciones y Guardar; solo se ve si el usuario tiene Gmail conectado (si no, un link a Integraciones).
- [ ] En Integraciones, junto a la cuenta: "Se revisa cada hora · última revisión 10:15".

**Listo cuando:** elijo "cada 6 horas" en Mi perfil y Gmail no se vuelve a revisar hasta 6 horas después de la última vez, salvo que toque "Revisar ahora".

---

## Fuera de alcance

- Plata prestada a otros (lo que me deben).
- Calcular las cuotas a partir de tasa y plazo (sistema francés o alemán).
- Detectar en Gmail los comprobantes de alta y de pago (hoy se suben a mano); solo se detecta el aviso de cuota.
- Avisos de otros bancos: se suman con su regla y su patrón (o con la IA del módulo 10) cuando haya ejemplos.
- Refinanciaciones y renovaciones: se cancela el préstamo y se carga uno nuevo.
