# Módulo 9 – IA documental: cargar resúmenes y facturas desde un archivo

> Plan del módulo dividido en partes. Cada parte es una porción vertical (backend + frontend) que se prueba y se mergea sola: una rama por parte en cada repo.
> Al terminar una parte: marcar `[x]`, cambiar su estado en la tabla y anotar la fecha.
> Visión general: [ROADMAP-MODULOS.md](./ROADMAP-MODULOS.md). Casos de uso: CU-002, CU-004, CU-015, CU-016. Reglas: RN-006, RN-007, RN-013, RN-016, RN-017, RN-018. Criterio de código: simple, sin abstracciones de más.

**Leyenda:** `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

**Estado:** en desarrollo (9.1 hecha). Se adelanta al módulo 7 porque es lo que más trabajo le ahorra al usuario.

## Objetivo

El usuario adjunta un archivo —**Excel, PDF o foto**— del resumen de su tarjeta (o de una factura) y los datos se cargan solos: totales, vencimiento, tarjeta, movimientos con su **cuota n de m** y su importe. El usuario solo revisa y confirma. La carga manual de los módulos 5 y 6 queda como respaldo.

## Punto de partida

- **Base de datos:** `document_processing_jobs` (cola con estado, intentos, reintento y bloqueo de tareas abandonadas), `ai_extraction_results` (propuesta de la IA con modelo, versión de esquema, datos, confianza por campo y estado de revisión, separada del dato confirmado: RN-006, RN-013), `card_transactions` (movimientos con cuota, total de cuotas, importe original, tipo y categoría), vistas `v_card_spending` y `v_pending_installments`, `card_statements.extraction_result_id` e `invoices.extraction_result_id`.
- **Backend:** modelos y DTOs de trabajos, resultados de extracción y movimientos; `quarkus-langchain4j-ai-gemini` configurado (`GEMINI_API_KEY`). Falta todo el procesamiento.
- **Frontend:** subida de documentos (PDF, imágenes y Excel), formularios manuales de resumen y factura, `DocumentPicker`.

## Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Un solo camino para todos los archivos | La IA interpreta los tres formatos. El **Excel se convierte antes a una tabla de texto** (genérico, sin saber de qué banco es); **PDF e imágenes** se le envían directo (Gemini es multimodal) | Cada banco arma su Excel distinto: un lector por banco obliga a programar y mantener un formato por cada uno y se rompe cuando el banco cambia una columna |
| Modelo | Gemini Flash Lite (`gemini-3.5-flash-lite`, configurable con `GEMINI_MODEL`; `gemini-2.5-flash` ya no se ofrece a cuentas nuevas), temperatura baja, **salida JSON con esquema fijo** versionado (`schema_version`) | Datos estructurados y comparables; si el esquema cambia, los resultados viejos siguen identificados |
| Leer Excel | Apache POI (`poi-ooxml`): XLSX y XLS, todas las hojas, celdas como texto | Librería estándar; además permite distinguir un XLS real de un `.doc` (pendiente anotado en `FileType`) |
| La IA no confirma nada | Todo resultado queda **pendiente de revisión** (CU-004, RN-013). El dato confirmado vive en `card_statements` / `invoices`; la propuesta, en `ai_extraction_results` | Regla de la especificación; trazabilidad del origen y la confianza (RN-006) |
| Controles automáticos | Suma de movimientos = total del resumen (por tarjeta y moneda); cuota n ≤ m; tarjeta asociada por últimos 4 (de tarjeta o de cuenta); vencimiento ≥ cierre; RN-016 (resumen repetido). Lo que no cuadra se marca en la revisión | No confiar ciegamente en la IA (CU-016 paso 7) |
| Datos que el archivo no trae | Se piden en la revisión (ej. el Excel de BBVA no informa cierre ni vencimiento) | El usuario completa solo lo que falta |
| Procesamiento en segundo plano | Al subir, se crea un trabajo en `document_processing_jobs`; una tarea programada lo procesa con reintentos (hasta 5, con espera creciente) y recupera los abandonados (`locked_until`). El documento muestra "Procesando…", "Listo para revisar" o "No pudimos leerlo" | La IA puede tardar o fallar; la subida no espera ni se pierde |
| Privacidad (RN-007, RN-010) | Se envía a Gemini **solo con el consentimiento del usuario** (opción "Leer el archivo con IA" al subir, recordada en el perfil). No se registra el contenido en los logs: `log-requests` y `log-responses` en `false` fuera de desarrollo. Los errores guardan código, no contenido | El archivo tiene datos personales y financieros |
| Costo y límites | Máximo 10 MB (el de documentos); Excel convertido a texto (pocos tokens); un trabajo por documento; un tope diario de procesamientos por usuario configurable | Evitar costos inesperados |
| Movimientos y cuotas | Al confirmar un resumen se guardan sus movimientos en `card_transactions` con cuota n de m, cuotas pagas (= n), restantes (m − n) e importe; las cuotas de una misma compra se vinculan entre resúmenes (RN-020) | Base del informe y de las cuotas pendientes (módulo 11) |
| Categorías de consumo | La IA propone una categoría por movimiento; corregirla y las reglas por comercio (RN-019) quedan para el módulo 11 | Mantener este módulo acotado |
| Sin clave de Gemini | Si `GEMINI_API_KEY` no está, la opción "Leer con IA" no aparece y todo sigue funcionando a mano | La app no depende de un servicio externo para lo básico |

## Resumen de partes

| Parte | Qué entrega | Rama | Depende de | Estado |
|---|---|---|---|---|
| 9.1 | Conexión con Gemini y lectura de archivos (Excel a texto, PDF e imagen) | `feature/ia-1-lectura` | — | [x] |
| 9.2 | Cola de procesamiento: subir con "Leer con IA", estado en el documento, reintentos | `feature/ia-2-cola` | 9.1 | [ ] |
| 9.3 | Extracción de resúmenes de tarjeta (totales, tarjetas, movimientos y cuotas) con controles | `feature/ia-3-resumen` | 9.2 | [ ] |
| 9.4 | Pantalla de revisión y confirmación del resumen (crea resumen, vencimientos y movimientos) | `feature/ia-4-revision-resumen` | 9.3 | [ ] |
| 9.5 | Facturas desde un archivo (extracción, servicio sugerido, revisión y confirmación) | `feature/ia-5-facturas` | 9.2 | [ ] |

Orden recomendado: 9.1 → 9.2 → 9.3 → 9.4 → 9.5. Con 9.1 a 9.4 se cargan resúmenes solos.

**Antes de empezar se necesita:**
- [x] `GEMINI_API_KEY` en el `.env` del backend (nunca en el repositorio).
- [x] Ejemplos de BBVA: Excel ("Movimientos del período": tarjeta por últimos 4, fecha, comercio, cuota n/m, importes en $ y U$S, totales por tarjeta; **sin** cierre ni vencimiento) y PDF (cierre, vencimiento, próximos, saldos en $ y U$S, pago mínimo, saldo anterior y pagos, cuotas a vencer por mes, movimientos con `C.n/m` y cupón agrupados por titular). No hay ejemplos de otros bancos: el esquema se diseña genérico y se prueba con BBVA.

---

## Parte 9.1 – Conexión con Gemini y lectura de archivos

### Backend
- [x] Configuración: modelo (`gemini-2.5-flash`), temperatura, timeout; `log-requests`/`log-responses` en `false` salvo en desarrollo.
- [x] `SpreadsheetText` (Apache POI): XLSX/XLS → tabla de texto (una sección por hoja, celdas separadas, filas vacías fuera). Reemplaza la detección de XLS por cabecera en `FileType` por una lectura real.
- [x] Puerto `DocumentReader` y adaptador Gemini: recibe el documento (texto de la planilla, o PDF/imagen como archivo) y un esquema; devuelve JSON. Errores tipados (sin clave, tiempo agotado, respuesta inválida) sin contenido del documento.
- [x] Tests: planilla de ejemplo → texto esperado; adaptador con un modelo falso.

**Listo cuando:** el Excel de BBVA se convierte a una tabla legible y una llamada de prueba a Gemini devuelve JSON válido.

**Hecho (26/11/2026):** Apache POI (`poi-ooxml` 5.2.3); `SpreadsheetText` (cualquier XLSX/XLS → tabla de texto, formato es-AR, sin filas vacías, tope de 2000 filas); `FileType` abre el XLS como planilla (un `.doc` con cabecera OLE ya no pasa); puerto `DocumentReader` (`available`, `readJson`) con `DocumentInput` (texto o archivo) y `DocumentReadException` + `ReadFailure` (sin contenido del documento); `GeminiDocumentReader` (PDF con `PdfFileContent`, imagen con `ImageContent`, planilla como texto; respuesta JSON validada, quita el envoltorio ```json). Config: modelo, timeout y logs de pedidos apagados por defecto. Verificado: tests OK y una llamada real a Gemini devolvió JSON con comercio y cuota de una fila de BBVA.

---

## Parte 9.2 – Cola de procesamiento

### Backend
- [ ] Al subir un documento con "Leer con IA": `processing_status = PENDING` y un trabajo en `document_processing_jobs`.
- [ ] Tarea programada: toma trabajos pendientes (bloqueándolos con `locked_until`), procesa, reintenta con espera creciente hasta `max_attempts`, marca `DEAD` y recupera los abandonados.
- [ ] `GET /documents/{id}/processing` (estado y error legible) y `POST /documents/{id}/process` (reintentar a pedido).
- [ ] Tope diario por usuario; consentimiento guardado en el perfil.
- [ ] Tests: reintento, máximo de intentos, recuperación de abandonados, tope.

### Frontend
- [ ] En la subida (Documentos, factura y resumen): opción "Leer el archivo con IA" con aviso de privacidad.
- [ ] Estado en el documento y en las listas: Procesando… / Listo para revisar / No pudimos leerlo (con Reintentar).

**Listo cuando:** se sube un archivo, aparece "Procesando…" y luego "Listo para revisar"; si Gemini falla, reintenta solo.

---

## Parte 9.3 – Extracción de resúmenes de tarjeta

### Backend
- [ ] Esquema `card_statement/1`: banco, tarjetas (últimos 4 de tarjeta o cuenta, titular), cierre, vencimiento, próximos cierre y vencimiento, totales en pesos y en dólares, pago mínimo; movimientos (fecha, descripción, comercio, cuota n de m, importe, moneda, tipo: compra, cuota, devolución, comisión, impuesto, interés, pago) y totales por tarjeta.
- [ ] Controles: cuadre de totales por tarjeta y moneda (con la diferencia), cuotas válidas, tarjeta encontrada por últimos 4, resumen repetido (RN-016). Confianza por campo.
- [ ] Guarda el resultado en `ai_extraction_results` (`PENDING`).
- [ ] Tests con las salidas de los archivos de ejemplo (sin llamar a Gemini): Excel de BBVA con dos tarjetas y cuotas, otro banco.

**Listo cuando:** el Excel de BBVA de ejemplo produce sus 7 movimientos, las cuotas 6/6, 10/12, 18/18 y 4/12, los totales por tarjeta (****0002 y ****8995) y el total del período cuadrado.

---

## Parte 9.4 – Revisión y confirmación del resumen

### Backend
- [ ] `GET /extractions/{id}` y `POST /extractions/{id}/confirm` (con las correcciones) / `reject`.
- [ ] Confirmar crea, en una transacción: el resumen (`source = AI_EXTRACTION`, `extraction_result_id`), sus vencimientos (módulo 6) y los movimientos con cuotas vinculadas entre resúmenes (RN-020). Estado `CONFIRMED` o `CORRECTED` según si el usuario cambió algo.
- [ ] Tests: confirmar sin cambios, con correcciones, tarjeta no registrada, repetido.

### Frontend
- [ ] Pantalla de revisión: datos del resumen (con lo que falta pedido explícitamente, ej. vencimiento), tarjeta asociada (o "Crear tarjeta terminada en 8995"), movimientos con cuota n de m e importe, cuadre de totales y campos de baja confianza resaltados; Confirmar o Descartar.
- [ ] Aviso "Hay resúmenes para revisar" en Tarjetas y en el Inicio.

**Listo cuando:** se sube el Excel de BBVA, se completa el vencimiento y al confirmar aparecen el resumen, sus vencimientos y los 7 movimientos con sus cuotas.

---

## Parte 9.5 – Facturas desde un archivo

### Backend
- [ ] Esquema `invoice/1`: proveedor, número, período, emisión, vencimiento, importe, moneda, código de pago, número de socio.
- [ ] Servicio sugerido por proveedor y número de socio (CU-004 paso 5); posibles repetidas (RN-005).
- [ ] Confirmar crea la factura (`source = AI_EXTRACTION`) y su vencimiento (módulo 5).

### Frontend
- [ ] "Cargar factura desde un archivo" y la misma pantalla de revisión adaptada a facturas.

**Listo cuando:** se sube el PDF de una factura de luz y, tras revisar, queda la factura con su vencimiento.

---

## Qué queda para el módulo 11

Informe de compras (por categoría, comercio y mes), corrección de categorías y reglas por comercio (RN-019), listado de cuotas pendientes y **exportar el resumen a PDF y Excel**. Los movimientos y sus cuotas ya quedan guardados desde la parte 9.4.
