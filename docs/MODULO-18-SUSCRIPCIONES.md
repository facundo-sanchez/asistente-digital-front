# Módulo 18 – Suscripciones en la tarjeta

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md) y [MEJORAS-15-24.md](./MEJORAS-15-24.md). Usa los consumos del módulo 11. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Ver los cargos que se repiten todos los meses en la tarjeta (Netflix, Spotify, YouTube, el gimnasio, el seguro del celular), cuánto suman por mes, desde cuándo se pagan y cuál aumentó, para decidir qué dar de baja.

## Punto de partida

- **Ya hay (módulo 11):** los consumos de cada resumen confirmado en `card_transactions`, con comercio normalizado (`merchant_name`, mayúsculas, sin sucursal), rubro, moneda, tipo de movimiento y cuota n de m; la vista `v_card_spending` (sin pagos, con el mes de cierre); reglas de rubro por comercio.
- **Falta:** reconocer qué comercios se cobran todos los meses y mostrarlos juntos.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Qué es una suscripción | Un comercio con al menos un consumo **sin cuotas** en 3 de los últimos 4 resúmenes cerrados de la misma tarjeta y moneda | Lo mensual se ve como un cargo por resumen; 3 de 4 tolera un mes que no se cobró o cayó en otro cierre |
| Importes que varían | Se acepta que cada importe esté dentro de ±30 % de la mediana de esos meses | En pesos las suscripciones suben seguido; un consumo muy distinto (una compra grande en el mismo comercio) no es la suscripción |
| Cuotas | Se excluyen los consumos en cuotas (`installment_total` > 1) | Ya están en "Cuotas pendientes" (módulo 11); no son suscripciones |
| Cómo se agrupa el comercio | Por `merchant_name` normalizado, sin números ni códigos al final ("NETFLIX.COM 12345" y "NETFLIX.COM 67890" son el mismo) | Los resúmenes agregan referencias distintas cada mes |
| Se calcula o se guarda | Se calcula al pedirlo, desde los consumos (no hay tabla de suscripciones) | Los datos ya están; nada que sincronizar |
| "No es una suscripción" | El usuario la descarta y se recuerda por comercio (tabla `card_subscription_dismissals`) | Ej. el supermercado de todos los meses |
| Aumento | Último importe contra el anterior; se marca desde 10 % | Lo que importa es "este mes te cobraron más" |
| Moneda | Por separado, sin convertir (RN-018) | Igual que el resto de la app |
| Baja | La app no da de baja nada: muestra cuánto suma y desde cuándo | La baja se hace en cada servicio |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 18.1 | Detectar suscripciones y la pantalla "Suscripciones" | `feature/suscripciones` (junto con 18.2) | módulo 11 | [ ] |
| 18.2 | Descartar, aumentos, inicio y asistente | `feature/suscripciones` | 18.1 | [ ] |

---

## Parte 18.1 – Detectar y mostrar

### Backend
- [ ] `SubscriptionDetector` (caso de uso): toma los consumos de resúmenes confirmados de los últimos 4 cierres por tarjeta (tipo compra, sin cuotas), agrupa por tarjeta, moneda y comercio normalizado, y se queda con los que aparecen en ≥ 3 de esos cierres con importes dentro de ±30 % de su mediana.
- [ ] Por suscripción: comercio, tarjeta, rubro, moneda, último importe y fecha, importe anterior, desde cuándo (primer consumo encontrado en los últimos 12 meses), cantidad de meses cobrados.
- [ ] `GET /cards/subscriptions?cardId=`: la lista y el total mensual por moneda (suma de los últimos importes).
- [ ] Puerto `CardSubscriptionRepository` con la consulta de consumos candidatos (JPQL sobre `card_transactions` + `card_statements` confirmados), adaptador y su versión en memoria para tests.
- [ ] Tests: detecta 3 de 4; no detecta 2 de 4; excluye cuotas; un consumo fuera del ±30 % no cuenta; agrupa "NETFLIX.COM 12345" con "NETFLIX.COM 67890"; otra moneda por separado; aislamiento entre usuarios.

### Frontend
- [ ] "Suscripciones" en Tarjetas (botón junto a Informe y Cuotas pendientes) → `/cards/subscriptions`.
- [ ] Total mensual por moneda arriba; tabla: comercio, tarjeta, rubro (con su color), último importe, desde cuándo, meses cobrados; filtro por tarjeta.
- [ ] Cada fila lleva a sus consumos (`/cards/transactions?merchant=`), como el informe.
- [ ] Estado vacío: "Necesitamos al menos 3 resúmenes confirmados para reconocer lo que se cobra todos los meses."

**Listo cuando:** con 4 resúmenes cargados, Netflix y Spotify aparecen con su importe y el total mensual, y una compra en 6 cuotas no aparece.

---

## Parte 18.2 – Descartar, aumentos, inicio y asistente

### Backend
- [ ] Migración: `card_subscription_dismissals` (usuario, comercio normalizado, fecha); `POST /cards/subscriptions/dismiss` (`merchant`) y `DELETE` para volver a mostrarla. Las descartadas no se listan.
- [ ] Aumento: `increase` (%) cuando el último importe supera al anterior en 10 % o más.
- [ ] `GET /dashboard`: total mensual de suscripciones por moneda.
- [ ] Herramienta del asistente `subscriptions()`: lista con importes, total y aumentos ("¿cuánto pago de suscripciones?").
- [ ] Tests: descartar la saca y se recuerda en el próximo cálculo; volver a mostrarla; aumento desde 10 %.

### Frontend
- [ ] En cada fila: "No es una suscripción" (con deshacer en el aviso); el aumento marcado ("+25 % este mes").
- [ ] "Ocultas (2)" al pie para volver a mostrarlas.
- [ ] Inicio: una línea "Suscripciones: $ 28.400 por mes" con link a la pantalla.

**Listo cuando:** descarto "SUPERMERCADO DIA" y no vuelve a aparecer, Netflix muestra "+25 % este mes" y el asistente responde cuánto pago de suscripciones.

---

## Fuera de alcance

- Dar de baja una suscripción desde la app.
- Suscripciones pagadas fuera de la tarjeta (débito en cuenta, Mercado Pago): las que se cargan como servicio ya tienen su vencimiento.
- Avisos push o email de "se renueva mañana": los resúmenes llegan después del cobro, no hay fecha previa confiable.
- Detectar suscripciones anuales (un cargo por año).
