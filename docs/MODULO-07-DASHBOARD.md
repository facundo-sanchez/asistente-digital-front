# Módulo 7 – Dashboard (Inicio)

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola: una rama por parte en cada repo.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-012. Reglas: RN-012 (zona horaria del usuario), RN-017 y RN-018 (monedas por separado). Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Al entrar, el usuario ve en un vistazo cómo está: cuánto vence este mes y cuánto ya pagó, qué está vencido, qué vence pronto, qué tiene para revisar (lo que leyó la IA) y en qué se le va la plata. Cada bloque lleva al detalle (CU-012 paso 4).

## Punto de partida

- **Datos:** todo existe — vencimientos con saldo y estado efectivo (`v_obligations`), pagos, facturas, tarjetas, resúmenes y movimientos (`v_card_spending`), documentos con vencimiento, propuestas de la IA pendientes.
- **Frontend:** el Inicio tiene la estructura (saludo, mes, `UpcomingPanel` y `MonthPanel`) pero vacía, sin datos inventados. Chart.js y `react-chartjs-2` ya están instalados.
- **No existe:** un endpoint de resumen; `audit_logs` (para "últimas actividades") existe en la base pero nada escribe en ella.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| "Este mes" | Se calcula con la zona horaria del usuario (RN-012) | Un vencimiento del día 1 a la noche no puede caer en el mes anterior |
| Monedas | Pesos y dólares siempre por separado; los dólares se muestran solo si hay | RN-018: no se suman ni se convierten |
| Qué cuenta en "este mes" | Vencimientos con fecha en el mes, no cancelados: total, pagado (pagos vigentes) y falta pagar | Es lo que el usuario tiene que cubrir; lo vencido de meses anteriores va aparte |
| Un endpoint de resumen | `GET /dashboard` con los números del Inicio en una sola consulta; las listas usan los endpoints que ya existen | Una sola llamada para los indicadores; no duplicar listados |
| Gastos por categoría | Lo pagado en el mes, agrupado por la categoría del servicio (luz, gas, tarjetas…) | Sale de pagos + servicios, sin depender de que la IA haya categorizado consumos (eso es el módulo 11) |
| "Últimas actividades" | Se arma con lo que ya está registrado (pagos, facturas, documentos, resúmenes más recientes), sin escribir en `audit_logs` | Llevar una auditoría en todos los módulos es un trabajo aparte; esto da la misma información para el Inicio |
| Sin datos | Cada bloque tiene su estado vacío con la acción para empezar (cargar factura, registrar servicio…) | Un usuario nuevo ve qué hacer, no ceros |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 7.1 | Indicadores del mes: total, pagado, falta pagar, vencido, servicios activos (`GET /dashboard`) | `feature/dashboard-1-2` (junto con 7.2) | — | [~] |
| 7.2 | Próximos vencimientos y vencidos (con el color del servicio) | `feature/dashboard-1-2` | 7.1 | [~] |
| 7.3 | Para revisar y documentos por vencer | `feature/dashboard-3-4` (junto con 7.4) | 7.1 | [~] |
| 7.4 | Gráficos: pagado por mes (últimos 6) y por categoría del mes | `feature/dashboard-3-4` | 7.1 | [~] |
| 7.5 | Últimas actividades | `feature/dashboard-5-actividad` | 7.1 | [ ] |

Orden recomendado: 7.1 → 7.2 → 7.3 → 7.4 → 7.5. Con 7.1 y 7.2 el Inicio ya es útil.

---

## Parte 7.1 – Indicadores del mes

### Backend
- [x] `DashboardUseCase` + `GET /dashboard`: mes actual en la zona del usuario; por moneda: total del mes, pagado, falta pagar; vencido (cantidad y saldo, cualquier mes); cuántos vencen en los próximos 7 días; servicios activos.
- [x] Tests: límites del mes según zona horaria, cancelados afuera, monedas separadas, aislamiento.

### Frontend
- [x] Fila de indicadores en el Inicio y `MonthPanel` con lo pagado del mes (barra de avance); cada número lleva a su listado filtrado.

**Listo cuando:** con dos vencimientos del mes (uno pagado a medias) y uno vencido del mes anterior, los números coinciden con los de Vencimientos.

**Hecho, falta la prueba contra la base (26/11/2026):** `DashboardUseCase` + `GET /dashboard` (mes en la zona del usuario con `Clock`; totales, pagado y falta pagar por moneda con los vencimientos del mes no cancelados; vencido por moneda; vencen en 7 días; servicios activos; cuántos del mes no tienen importe). Front: `KpiRow` (4 indicadores con acceso al listado filtrado) y `MonthPanel` con la roseta llena según lo pagado. Tests OK (límite del mes por zona horaria, monedas separadas, cancelados afuera).

---

## Parte 7.2 – Próximos vencimientos y vencidos

### Backend
- [x] `serviceCategory` en la respuesta de vencimientos (para el color del servicio).

### Frontend
- [x] `UpcomingPanel`: primero los vencidos, después lo que vence en los próximos 30 días (con franja del color del servicio, fecha, monto o saldo y estado); "Ver todos" lleva a Vencimientos.

**Listo cuando:** el Inicio muestra el vencido arriba y los próximos ordenados por fecha.

**Hecho, falta la prueba contra la base (26/11/2026):** `serviceCategory` en la respuesta de vencimientos (`ServiceRepository.findCategories`); `UpcomingPanel` con lo vencido primero y lo que vence en 30 días (franja del color del servicio, lo que falta pagar, estado).

---

## Parte 7.3 – Para revisar y documentos por vencer

### Backend
- [x] En `GET /dashboard`: propuestas de la IA pendientes (con su documento y tipo) y documentos que vencen en los próximos 30 días.

### Frontend
- [x] Panel "Para revisar" (resúmenes y facturas leídos por la IA, con acceso a la revisión) y "Documentos por vencer" (pólizas, garantías…). Se ocultan si no hay nada.

**Listo cuando:** al subir un resumen con IA aparece en "Para revisar" y desaparece al confirmarlo.

**Hecho, falta la prueba contra la base (26/11/2026):** `toReview` (propuestas PENDING con el nombre del documento) y `expiringDocuments` (no borrados, vencen hoy a 30 días) en `GET /dashboard`. Front: `ReviewPanel` (lleva a la revisión de resumen o factura según `schemaVersion`) y `ExpiringDocumentsPanel`; se ocultan si están vacíos.

---

## Parte 7.4 – Gráficos

### Backend
- [x] `GET /dashboard/spending`: pagado por mes (últimos 6, por moneda) y pagado en el mes por categoría del servicio.

### Frontend
- [x] Barras por mes (Chart.js) y barras horizontales por categoría con su nombre y color; tabla accesible como alternativa. Se cambió el anillo: las 14 categorías comparten 6 tintes y en un anillo no se distinguen.

**Listo cuando:** los gráficos muestran lo pagado y coinciden con los pagos registrados.

**Hecho, falta la prueba contra la base (26/11/2026):** `SpendingRepository` con dos sumas en SQL sobre pagos no anulados (por mes y moneda; por categoría del servicio, OTHER si no tiene); el caso de uso completa con ceros los 6 meses (pesos siempre). Front: `SpendingPanel` con `MonthChart` por moneda y lo del mes por categoría.

---

## Parte 7.5 – Últimas actividades

### Backend
- [ ] En `GET /dashboard`: los últimos 10 movimientos del usuario (pagos, facturas, resúmenes, documentos) con fecha, texto y enlace.

### Frontend
- [ ] Lista "Últimas actividades" con enlace a cada cosa.

**Listo cuando:** registrar un pago aparece primero en la lista.
