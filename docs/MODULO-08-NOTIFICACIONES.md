# Módulo 8 – Notificaciones

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-007. Reglas: RN-009 (respetar las preferencias), RN-012 (zona horaria del usuario). Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Que el usuario no tenga que entrar a mirar: la app le avisa lo que vence, lo que se venció, los documentos por vencer y lo que leyó la IA, en la campana y por email, según lo que eligió.

## Punto de partida

- **Base:** `notifications` (con `idempotency_key` única, `scheduled_at`, `sent_at`, `read_at`, `status`, `attempts`) y `notification_preferences` (canal `EMAIL`/`WEB`/`PUSH`, tipo, `enabled`, `days_before` por defecto `[7, 3, 1, 0]`) ya existen (V5). Ningún código las usa.
- **Ya hay:** Quarkus Scheduler (lo usa la cola de la IA), envío SMTP (verificación de email), zona horaria del usuario, `v_obligations` con el estado efectivo, documentos con `expires_on`, propuestas de la IA pendientes.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Cuándo se generan | Una tarea cada hora; a cada usuario le toca cuando en su zona son las 8 (o más tarde, si se perdió esa hora) | RN-012: el "faltan 3 días" se cuenta con el día del usuario, y el aviso llega a una hora razonable |
| Duplicados | La clave `OBLIGATION_DUE:{id}:{días}:{canal}` (única en la base) evita avisar dos veces lo mismo, aunque la tarea corra de nuevo | Ya está en el diseño de la tabla |
| Qué se avisa | Vence en 7, 3, 1 y 0 días (lo que el usuario elija); se venció (una vez, al día siguiente); documento vence en 30 y 7 días; la IA terminó de leer un archivo (al momento) | Lo que el Inicio ya muestra, ahora sin entrar |
| Pagado | Un vencimiento pagado o cancelado no avisa | Sería ruido |
| Canales | En la app (campana) y email. `PUSH` queda para más adelante | Push necesita service worker y permisos del navegador: es trabajo aparte |
| Por defecto | En la app: todo activado. Email: activado, con 3, 1 y 0 días | Avisar sin que haga falta configurar; el usuario lo baja si le molesta |
| Email | Un solo email por día con todo lo de ese día, no uno por aviso. Reintentos si falla el SMTP | Varios vencimientos el mismo día no deben llegar como varios emails |
| Historial | Se ven los últimos 30 días; los leídos se pueden marcar todos juntos | La campana no es un archivo |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 8.1 | Generación de avisos en la app + `GET /notifications`, marcar leída y todas leídas | `feature/notificaciones-1-2` (junto con 8.2) | — | [ ] |
| 8.2 | Campana en la barra con las no leídas y pantalla de avisos | `feature/notificaciones-1-2` | 8.1 | [ ] |
| 8.3 | Preferencias: qué avisos, cuántos días antes y por qué canal | `feature/notificaciones-3-4` (junto con 8.4) | 8.1 | [ ] |
| 8.4 | Email diario con los avisos del día | `feature/notificaciones-3-4` | 8.3 | [ ] |

Orden recomendado: 8.1 → 8.2 → 8.3 → 8.4. Con 8.1 y 8.2 los avisos ya aparecen en la app.

---

## Parte 8.1 – Generar avisos

### Backend
- [ ] `NotificationScheduler` (cada hora) → `GenerateNotificationsUseCase`: para cada usuario al que le tocan las 8, vencimientos que vencen en los días configurados, vencidos de ayer y documentos que vencen en 30 y 7 días; guarda uno por clave (si ya existe, nada).
- [ ] Al terminar la lectura de la IA, un aviso "Tu resumen/factura está listo para revisar" con el enlace a la revisión.
- [ ] `GET /notifications?unread=` (paginado, últimos 30 días), `PATCH /notifications/{id}/read`, `POST /notifications/read-all`, `GET /notifications/unread-count`.
- [ ] Tests: días según la zona del usuario, sin duplicados al correr dos veces, pagado/cancelado no avisa, aislamiento.

**Listo cuando:** un vencimiento a 3 días genera un solo aviso aunque la tarea corra varias veces.

---

## Parte 8.2 – Campana y pantalla de avisos

### Frontend
- [ ] Campana en la barra superior con la cantidad de no leídas; al abrirla, los últimos avisos con enlace a cada cosa (vencimiento, documento, revisión) y "Marcar todo como leído".
- [ ] `/notifications`: todos los avisos de los últimos 30 días, filtro "Solo no leídos".
- [ ] La cantidad se actualiza al navegar (sin consultas cada pocos segundos).

**Listo cuando:** se ve el aviso en la campana, al tocarlo lleva al vencimiento y queda leído.

---

## Parte 8.3 – Preferencias

### Backend
- [ ] `GET /notification-preferences` (con los valores por defecto si el usuario no guardó nada) y `PUT` (por canal: activado, tipos y días antes).
- [ ] La generación respeta las preferencias (RN-009).

### Frontend
- [ ] Sección "Notificaciones" en Mi perfil: por canal (en la app, email), qué avisos y cuántos días antes.

**Listo cuando:** desactivar "vence pronto" por email deja de generarlos para ese canal.

---

## Parte 8.4 – Email diario

### Backend
- [ ] Los avisos de email se juntan por usuario y día y salen en un solo email (asunto con la cantidad, lista con fecha, monto y enlace a la app).
- [ ] Envío con reintentos (`attempts`, `last_error`); después de 5 intentos queda `FAILED`.

**Listo cuando:** dos vencimientos el mismo día llegan en un solo email y un SMTP caído se reintenta.
