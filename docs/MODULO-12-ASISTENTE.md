# Módulo 12 – Asistente IA

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Caso de uso: CU-008. SPEC técnica: 4.8 (módulo `assistant`), 6.9 (API), 9.5 (herramientas controladas). Criterio de código: simple, sin abstracciones de más.

**Estado (26/11/2026):** las 4 partes hechas (12.1–12.2 en `feature/asistente-1-2`, 12.3–12.4 en `feature/asistente-3-4`) (backend y front), con tests; falta probarlas con Gemini real (sobre todo el streaming con herramientas). En el celular el asistente es una burbuja flotante en toda la app. Detener deja de mostrar la respuesta, pero el servidor la termina y la guarda. Los errores de Gemini responden 503 y la cuota 429. Cambios: se usó el esqueleto del módulo que ya existía (la respuesta trae `metadata.references` y `metadata.tools`); las sugerencias de la conversación vacía y el título con la primera pregunta se adelantaron de 12.3; `monthTotal(month)` quedó como `monthSummary()` (el mes actual) y `serviceSpending` como `servicePayments()`.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

## Objetivo

Preguntarle a la app en lenguaje natural por tus datos: "¿Qué vence esta semana?", "¿Cuánto gasté en servicios en los últimos tres meses?", "¿Qué facturas no pagué?". La respuesta sale de tus registros reales y trae links a ellos.

## Punto de partida

- **Base (ya existe):** `assistant_conversations` (título, borrado lógico) y `assistant_messages` (rol `USER`/`ASSISTANT`/`TOOL`/`SYSTEM`, contenido, `metadata` jsonb), en V6.
- **Ya hay:** Gemini por quarkus-langchain4j (`ChatModel`, ya se usa para leer documentos), y los casos de uso de cada módulo: vencimientos, facturas, servicios, documentos, dashboard, tarjetas y consumos.
- **Falta:** el módulo `assistant`, las herramientas y la pantalla de chat.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Cómo accede a los datos | Por **herramientas** (function calling de Gemini, `@Tool` de langchain4j) que llaman a los casos de uso existentes, nunca a la base | SPEC 9.5: el modelo no ve más de lo que el usuario puede ver |
| Usuario de las herramientas | Sale del token, nunca de lo que diga el modelo | Una pregunta no puede leer datos de otro usuario |
| Solo lectura | Las herramientas solo consultan; no crean, pagan ni borran nada | Un error del modelo no puede cambiar datos. Acciones, más adelante |
| Referencias | Cada herramienta devuelve el id y el tipo de cada registro; la respuesta guarda esas referencias en `metadata` y el front las muestra como links | CU-008 paso 7 |
| Historial que ve el modelo | Los últimos 20 mensajes de la conversación | Límite de tokens y costo |
| Respuesta progresiva | Primero la respuesta entera (12.1–12.2); streaming por SSE en 12.3 | Primero que responda bien, después que se vea rápido |
| Límite de uso | 30 mensajes por usuario por hora | La clave de Gemini es una sola y tiene cuota |
| Fechas | "Hoy" y "este mes" en la zona horaria del usuario, que se le pasa al modelo en el mensaje de sistema | Si no, "esta semana" depende del servidor |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 12.1 | Conversaciones y chat básico (sin datos) | `feature/asistente-1-2` (junto con 12.2) | — | [~] |
| 12.2 | Herramientas: responde con tus datos y con links | `feature/asistente-1-2` | 12.1 | [~] |
| 12.3 | Respuesta progresiva (SSE), título automático y sugerencias | `feature/asistente-3-4` (junto con 12.4) | 12.2 | [~] |
| 12.4 | Límites y cuidado: cuota por hora, errores del modelo, auditoría | `feature/asistente-3-4` | 12.2 | [~] |

---

## Parte 12.1 – Conversaciones y chat básico

### Backend
- [x] Módulo `assistant` (puerto `AssistantModel` con adaptador Gemini, repositorios de conversación y mensaje).
- [x] `GET/POST /assistant/conversations`, `GET /assistant/conversations/{id}` (con mensajes), `DELETE /assistant/conversations/{id}` (borrado lógico).
- [x] `POST /assistant/conversations/{id}/messages` (`content`, hasta 2000 caracteres): guarda la pregunta, llama al modelo con el historial y guarda la respuesta.
- [x] Mensaje de sistema: quién es, que responde en castellano rioplatense, que no inventa datos, la fecha de hoy y la zona horaria del usuario.
- [x] Tests: aislamiento entre usuarios, borrado lógico, historial de 20 mensajes (con un modelo falso).

### Frontend
- [x] `/assistant`: lista de conversaciones a la izquierda (nueva, borrar) y el chat a la derecha; en el celular, una cosa por vez.
- [x] Chat: mensajes, caja de texto (Enter envía, Shift+Enter salto de línea), "Pensando…" mientras responde.
- [x] Ítem "Asistente" en el menú.

**Listo cuando:** creo una conversación, pregunto algo, veo la respuesta y al volver sigue ahí.

---

## Parte 12.2 – Herramientas

### Backend
Herramientas de solo lectura; cada una llama al caso de uso existente con el usuario del token:

| Herramienta | Responde | Caso de uso |
|---|---|---|
| `upcomingObligations(days)` | Qué vence en los próximos N días | vencimientos (upcoming) |
| `overdueObligations()` | Qué está vencido sin pagar | vencimientos (overdue) |
| `unpaidInvoices()` | Facturas sin pagar | facturas |
| `monthTotal(month)` | Cuánto hay que pagar en un mes, por moneda | dashboard |
| `activeServices()` | Servicios activos | servicios |
| `serviceSpending(months)` | Gasto en servicios por mes | dashboard (spending) |
| `cardSpending(from, to, category)` | Consumos de tarjeta por rubro o comercio | informe de consumos |
| `pendingInstallments()` | Cuotas que faltan | cuotas pendientes |
| `expiringDocuments(days)` | Documentos por vencer (seguro, garantía) | documentos |
| `searchDocuments(text)` | Buscar un documento por nombre | documentos |

- [x] Cada resultado trae `type` + `id` de los registros. La respuesta guarda las referencias usadas en `metadata.references`.
- [x] Respuestas cortas: como máximo 20 registros por herramienta; si hay más, dice cuántos faltan.
- [x] Tests: cada herramienta usa el usuario del token (no hay parámetro de usuario), y las referencias quedan guardadas.

### Frontend
- [x] Debajo de la respuesta, las referencias como chips con link (factura, vencimiento, servicio, documento, resumen).
- [x] Montos y fechas en el formato del usuario (lo pide el mensaje de sistema).

**Listo cuando:** "¿Qué facturas no pagué?" responde con mis facturas reales, y cada una lleva a su detalle.

---

## Parte 12.3 – Respuesta progresiva, título y sugerencias

### Backend
- [x] `POST /assistant/conversations/{id}/messages/stream` por SSE: va mandando el texto a medida que llega; al final, un evento con las referencias.
- [x] Título de la conversación: la primera pregunta recortada a 60 caracteres (sin otra llamada al modelo).

### Frontend
- [x] El BFF reenvía el SSE tal cual (ya transmite el cuerpo por partes).
- [x] El texto aparece mientras se escribe; botón "Detener".
- [x] Conversación vacía: 4 sugerencias de CU-008 ("¿Qué vence esta semana?", "¿Cuánto tengo que pagar este mes?", "¿Qué facturas no pagué?", "¿Cuánto gasté con la tarjeta este mes?").

**Listo cuando:** la respuesta empieza a verse en menos de 2 segundos y las sugerencias funcionan con un toque.

---

## Parte 12.4 – Límites y cuidado

### Backend
- [x] Cuota: 30 mensajes por usuario por hora; al pasarla, 429 con "Llegaste al límite de consultas, probá en un rato".
- [x] Errores del modelo (cuota de Gemini, timeout): la pregunta queda guardada y el chat muestra "No pude responder, probá de nuevo" con reintento.
- [x] `metadata` de cada respuesta: herramientas usadas y tokens, para ver el costo.
- [x] Tests: cuota por hora, error del modelo no pierde la pregunta.

### Frontend
- [x] Mensajes de error y reintento en el chat.
- [x] Aviso fijo y discreto: "Las respuestas salen de tus datos, pero pueden tener errores: revisá los links".

**Listo cuando:** con Gemini caído, la app avisa y deja reintentar sin perder la pregunta.

---

## Fuera de alcance

- Acciones desde el chat (registrar un pago, crear un vencimiento): primero que consulte bien.
- Leer el contenido de los documentos para responder (RAG sobre los PDF): solo se usan los datos ya extraídos.
- Voz y adjuntar archivos en el chat.
