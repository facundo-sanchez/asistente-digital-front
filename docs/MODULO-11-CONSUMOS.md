# Módulo 11 – Consumos e informe de tarjeta

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Casos de uso: CU-016 (consumos), CU-017 (informe). Reglas: RN-017 (solo resúmenes confirmados), RN-018 (monedas por separado), RN-019 (regla por comercio), RN-020 (cuotas entre resúmenes). Criterio de código: simple, sin abstracciones de más.

**Estado (26/11/2026):** las 5 partes hechas y mergeadas en `develop`, con tests; falta validar el informe con varios resúmenes reales. Cambios respecto del plan: la PDF es la versión para imprimir del resumen (`/card-statements/{id}/print`, "Guardar como PDF" del navegador); el informe usa el mes de cierre (como el banco). Las consultas del informe (JPQL sobre `v_card_spending`) todavía no corrieron contra Postgres.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Saber en qué se va la plata de la tarjeta: cada consumo con su rubro, cuánto falta pagar de cada compra en cuotas, un informe por período y el resumen exportado a PDF o Excel.

## Punto de partida

- **Base (ya existe):** `card_transactions` con categoría (15 rubros), origen de la categoría (`AI`, `RULE`, `USER`), cuota n de m y `purchase_group_id`; `card_merchant_rules` (rubro elegido por el usuario para un comercio); vistas `v_card_spending` (consumos de resúmenes confirmados, sin pagos, con el mes de facturación) y `v_card_pending_installments` (cuotas que faltan por compra).
- **Ya hay:** los movimientos con cuotas se guardan al confirmar un resumen leído por la IA (módulo 9), Apache POI para Excel y Chart.js en el front.
- **Falta:** la IA no clasifica los consumos (todos quedan en `OTHER`), nada usa las reglas por comercio, las cuotas de distintos resúmenes no se unen y no hay informe ni exportación.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Quién pone el rubro | La IA lo propone al leer el resumen; si el usuario ya eligió un rubro para ese comercio, manda su regla | Lo más automático posible, y lo que el usuario corrigió no se pierde |
| Corregir un rubro | En el detalle del resumen; con "aplicar siempre a este comercio" se crea la regla y se recategorizan sus otros consumos (los que no corrigió a mano) | RN-019 |
| Unir cuotas (RN-020) | Al confirmar, la cuota n se une a la n-1 de la misma tarjeta, mismo comercio, mismo total de cuotas y mismo importe (±1 %) | Sin un id de compra en los resúmenes, esos datos alcanzan |
| Informe | Por mes de facturación (cierre del resumen), por moneda, sin convertir (RN-018); solo resúmenes confirmados (RN-017) | Es como lo muestra el banco |
| Exportar | Excel generado en el backend (POI); PDF con una versión para imprimir del resumen y "Guardar como PDF" del navegador | Excel ya tiene librería; para PDF no hace falta sumar una |
| Resumen que llegó sin consumos (módulo 10) | Al confirmar la lectura del PDF de un resumen ya registrado sin movimientos (misma tarjeta y vencimiento), se le agregan los movimientos en vez de rechazarlo como repetido | Cierra el caso BBVA: primero llega el email, después el PDF |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 11.1 | Rubros: la IA los propone, reglas por comercio, corregir en el resumen | `feature/consumos-1-2` (junto con 11.2) | — | [x] |
| 11.2 | Cuotas: unir entre resúmenes y cuotas pendientes | `feature/consumos-1-2` | — | [x] |
| 11.3 | Informe de consumos con filtros y gráficos | `feature/consumos-3-5` (junto con 11.4 y 11.5) | 11.1 | [x] |
| 11.4 | Exportar el resumen a Excel y PDF | `feature/consumos-3-5` | — | [x] |
| 11.5 | Sumar los consumos a un resumen que llegó sin ellos | `feature/consumos-3-5` | — | [x] |

---

## Parte 11.1 – Rubros

### Backend
- [x] La IA devuelve el rubro de cada movimiento (`category` en el esquema `card_statement/1`; si no es uno de los 15, `OTHER`).
- [x] Al confirmar: si hay regla para el comercio, el rubro es el de la regla (`RULE`); si no, el de la IA (`AI`).
- [x] `PATCH /card-transactions/{id}/category` (`category`, `always`): cambia el rubro (`USER`); con `always`, crea o actualiza la regla y recategoriza los demás consumos de ese comercio que no corrigió a mano.
- [x] `GET /card-merchant-rules` y `DELETE /card-merchant-rules/{id}`.
- [x] Tests: la regla gana a la IA, "aplicar siempre" no pisa lo corregido a mano, aislamiento.

### Frontend
- [x] En los movimientos del resumen: el rubro como selector; al cambiarlo, "¿Aplicar siempre a este comercio?".
- [x] Reglas por comercio (en Tarjetas): lista y borrar.

**Listo cuando:** corrijo "YPF" a Nafta con "aplicar siempre" y el próximo resumen lo trae como Nafta.

---

## Parte 11.2 – Cuotas

### Backend
- [x] Al confirmar un resumen, cada cuota n > 1 se une a la cuota n-1 de un resumen anterior (mismo `purchase_group_id`).
- [x] `GET /cards/installments/pending` (de `v_card_pending_installments`): por compra, cuota actual, cuántas faltan, cuánto falta y cierre estimado de la última; total por moneda.
- [x] Tests: une 2/6 con 1/6, no une importes distintos ni otra tarjeta.

### Frontend
- [x] "Cuotas pendientes" en Tarjetas: compra, tarjeta, cuota n de m, cuánto falta y cuándo termina; total por moneda.

**Listo cuando:** con dos resúmenes seguidos, una compra en 6 cuotas aparece una sola vez con lo que falta.

---

## Parte 11.3 – Informe

### Backend
- [x] `GET /cards/report?from=&to=&cardId=`: por moneda, total, por rubro, por mes, por tarjeta y los 10 comercios con más gasto (de `v_card_spending`).
- [x] `GET /card-transactions?from=&to=&cardId=&category=&merchant=` paginado para ver el detalle.

### Frontend
- [x] `/cards/report`: filtros (meses, tarjeta), total por moneda, barras por rubro y por mes, por tarjeta, comercios; cada rubro o comercio lleva a sus consumos.

**Listo cuando:** el total del informe de un mes coincide con la suma de los consumos de sus resúmenes.

---

## Parte 11.4 – Exportar

### Backend
- [x] `GET /card-statements/{id}/export.xlsx`: hoja con los datos del resumen (totales, vencimiento, pago mínimo) y hoja de movimientos (fecha, comercio, rubro, cuota, importe, moneda).

### Frontend
- [x] En el detalle del resumen: "Descargar Excel" y "Imprimir / PDF" (versión para imprimir del resumen).

**Listo cuando:** el Excel abre con los movimientos del resumen y el PDF sale con totales y movimientos.

---

## Parte 11.5 – Consumos de un resumen que llegó sin ellos

### Backend
- [x] Al confirmar la lectura de un resumen cuya tarjeta y vencimiento ya tienen un resumen confirmado **sin movimientos**, se agregan los movimientos (y el archivo) a ese resumen en vez de avisar que está repetido.

### Frontend
- [x] En el detalle de un resumen sin movimientos: "Cargar los consumos desde el PDF" (lleva a subirlo con IA).

**Listo cuando:** el resumen de BBVA que llegó por email suma sus movimientos al subir el PDF.
