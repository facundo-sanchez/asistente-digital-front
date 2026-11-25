24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

###### **ChatGPT dijo:** 

# **SPEC técnica – Asistente de Vida Digital** 

**Documento técnico v1.0 Arquitectura modular Java 21 · Quarkus · Next.js** 

**Objetivo:** definir la arquitectura, los componentes, el modelo de dominio, las interfaces, las integraciones y la infraestructura necesaria para implementar el Asistente de Vida Digital. 

La propuesta parte de una decisión arquitectónica importante: desarrollar inicialmente un **monolito modular con arquitectura hexagonal** , preparado para incorporar procesamiento asíncrono y servicios independientes cuando el crecimiento del producto lo justifique. 

No empezaría con microservicios. El dominio todavía está evolucionando y conviene mantener una implementación sencilla de desarrollar, probar y desplegar, sin perder separación de responsabilidades. 

## **1. Stack tecnológico** 

|**Capa**|**Tecnología**|**Responsabilidad**|
|---|---|---|
|Frontend|Next.js 16 + React|Aplicación web|
|Lenguaje frontend|TypeScript|Tipado y contratos|
|UI|MUI 6|Componentes visuales|
|Backend|Java 21 + Quarkus 3.x|API y lógica de negocio|
|Persistencia|PostgreSQL|Datos relacionales|
|ORM|Hibernate ORM + Panache|Persistencia|
|Migraciones|Flyway|Evolución del esquema|
|Autenticación|JWT propio (SmallRye JWT) + BFF Next.js|Sesiones y autenticación|
|Integración externa|Google Gmail API|Recepción de documentos|
|IA|LLM mediante proveedor<br>intercambiable|Interpretación documental y<br>asistente|
|Procesamiento<br>documental|Apache Tika + OCR|Extracción de contenido|
|Almacenamiento|S3 compatible|Archivos originales|
|Mensajería|PostgreSQL Outbox inicialmente|Procesamiento asíncrono|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

1/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|Comunicación|REST + OpenAPI|Contratos frontend/backend|
|---|---|---|
|Infraestructura|Docker|Contenedores|
|Observabilidad|OpenTelemetry|Logs, métricas y trazas|



### **Decisiones arquitectónicas** 

**1.** Modular Monolith para el backend. 

**2.** Hexagonal Architecture en cada módulo. 

**3.** Domain-Driven Design para delimitar responsabilidades. 

**4.** REST para comunicación entre frontend y backend. 

**5.** Procesamiento asíncrono para documentos y notificaciones. 

**6.** PostgreSQL como fuente principal de información. 

**7.** Almacenamiento de archivos separado de la base de datos. 

**8.** IA desacoplada del dominio mediante puertos y adaptadores. 

**9.** Seguridad multiusuario desde el inicio. 

## **2. Arquitectura general** 

La aplicación estará compuesta por cuatro grandes bloques: 

- Frontend: interacción con el usuario. 

- Backend: lógica de negocio y administración de información. 

- Integraciones: comunicación con servicios externos. 

- Procesamiento inteligente: extracción documental y funcionalidades de IA. 

### **Diagrama de arquitectura** 

### **Frontend – Next.js** 

Dashboard · Servicios · Finanzas · Documentos · Asistente IA 

HTTPS / REST / JSON 

|**Backend –**|**Quarkus**||
|---|---|---|
||**Identity / User**|**Services**|
||**Documents**|**Obligations**|
||**Payments**|**Notifications**|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

2/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 



<!-- Start of picture text -->
Integrations AI Assistant<br>PostgreSQL Object Storage<br>Datos y Outbox Documentos originales<br>Gmail API AI Provider<br>Correos y adjuntos OCR / LLM<br>Procesadores asíncronos – Quarkus Workers<br>Documentos · Correos · Notificaciones · Sincronización<br><!-- End of picture text -->

### **Flujo general** 

**1.** El usuario interactúa con Next.js. 

**2.** Next.js consume la API REST de Quarkus. 

**3.** Quarkus valida la sesión y los permisos. 

**4.** Los casos de uso ejecutan la lógica correspondiente. 

**5.** Los adaptadores de persistencia acceden a PostgreSQL. 

**6.** Las operaciones que requieren procesamiento externo generan tareas asíncronas. 

**7.** Los workers procesan esas tareas. 

**8.** El resultado se persiste y queda disponible para el frontend. 

## **3. Arquitectura hexagonal del backend** 

Cada módulo deberá respetar una estructura basada en: 

Domain: entidades, objetos de valor y reglas de negocio. 

- Application: casos de uso y puertos. 

- Infrastructure: adaptadores externos y persistencia. 

### **Estructura propuesta** 

```
src/main/java/com/vidadigital/
│
├── shared/
```

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

3/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
├── user/
│   ├── domain/
│   ├── application/
│   │   ├── port/
│   │   └── usecase/
│   └── infrastructure/
│       ├── persistence/
│       └── rest/
│
├── service/
├── document/
├── invoice/
├── obligation/
├── payment/
├── asset/
├── card/
├── notification/
├── integration/
├── ai/
├── assistant/
├── audit/
│
└── config/
   └── infrastructure/
```

### Cada módulo tendrá su propia estructura hexagonal: 

#### `document/` 

```
├── domain/
│   ├── model/
│   ├── valueobject/
│   ├── exception/
│   └── service/
│
├── application/
│   ├── port/
│   │   ├── input/
│   │   └── output/
│   └── usecase/
│
└── infrastructure/
```

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

4/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
   ├── persistence/
   │   ├── entity/
   │   └── repository/
   ├── rest/
   │   ├── resource/
   │   ├── dto/
   │   └── mapper/
   └── storage/
```

### **Reglas de dependencia** 

|**Componente**|**Puede depender de**|
|---|---|
|Domain|Java y componentes propios del dominio|
|Application|Domain y puertos|
|Infrastructure|Application, Domain y frameworks|
|REST|Application|
|Persistence|Domain / Application|
|External adapters|Puertos definidos por Application|



El dominio no debe depender de Panache, Hibernate, Quarkus REST, Gmail API ni proveedores de IA. 

Los casos de uso deben recibir sus dependencias mediante inyección de interfaces. 

**Persistencia:** utilizaría Panache Repository Pattern, evitando Active Record en las entidades del dominio. 

# **4. Definición de módulos funcionales** 

El backend se dividirá en los siguientes módulos. Cada uno tendrá responsabilidades y límites claramente definidos. 

|**Módulo**|**Responsabilidad**|
|---|---|
|User|Usuarios y preferencias personales|
|Service|Servicios y proveedores contratados|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

5/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|Document|Almacenamiento y administración documental|
|---|---|
|Invoice|Facturas y datos extraídos|
|Obligation|Obligaciones económicas y vencimientos|
|Payment|Registro de pagos|
|Asset|Bienes personales|
|Notification|Alertas y recordatorios|
|Integration|Conexiones con proveedores externos|
|AI|Extracción documental y procesamiento inteligente|
|Assistant|Consultas conversacionales|
|Audit|Trazabilidad de operaciones|
|Card|Tarjetas de crédito, resúmenes, consumos e informe de compras|



### **4.1. User** 

Responsabilidades: 

- Identidad del usuario. 

- Preferencias regionales. 

- Zona horaria. 

- Preferencias de notificaciones. 

- Estado de la cuenta. 

La autenticación y las sesiones las administra este backend con JWT propio (ver §7.1). Quarkus valida la identidad y resuelve el contexto del usuario. 

### **4.2. Service** 

Representa un servicio contratado o administrado por el usuario. 

Ejemplos: 

- Electricidad. 

- Gas. 

- Internet. 

- Agua. 

- Seguro automotor. 

- Telefonía. 

- Suscripciones digitales. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

6/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### Responsabilidades: 

- Registrar proveedores. 

- Administrar servicios activos e inactivos. 

- Identificar servicios recurrentes. 

- Asociar documentos y facturas. 

- Configurar periodicidad. 

### **4.3. Document** 

Responsabilidades: 

- Carga de documentos. 

- Almacenamiento de archivos. 

- Metadatos. 

- Clasificación documental. 

- Versionado. 

- Relación con servicios, facturas y bienes. 

- Seguimiento del procesamiento. 

Los archivos binarios no se almacenarán directamente en PostgreSQL. 

### **4.4. Invoice** 

Responsabilidades: 

- Registrar facturas. 

- Identificar importes y fechas. 

- Asociar facturas a servicios. 

- Conservar información original. 

- Detectar duplicados. 

- Gestionar validación humana. 

Una factura puede estar pendiente de validación, confirmada o rechazada. 

### **4.5. Obligation** 

Representa una obligación que el usuario debe cumplir. 

Ejemplos: 

- Pago de una factura. 

- Vencimiento de un seguro. 

- Renovación de VTV. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

7/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

- Renovación de documentación. 

- Pago de impuestos. 

Este módulo no dependerá obligatoriamente de Invoice, porque existen obligaciones que no generan una factura. 

### **4.6. Payment** 

Responsabilidades: 

- Registrar pagos. 

- Asociar comprobantes. 

- Registrar fecha e importe. 

- Mantener historial. 

- Gestionar pagos parciales. 

El MVP no ejecutará pagos ni se conectará directamente a cuentas bancarias para realizar transferencias. 

### **4.7. Integration** 

Responsabilidades: 

- Administrar conexiones externas. 

- Autorizaciones OAuth. 

- Tokens de acceso. 

- Sincronización. 

- Webhooks. 

- Estado de integraciones. 

- Renovación y revocación de credenciales. 

### **4.8. AI y Assistant** 

Se dividirán en dos módulos diferentes: 

### **AI** 

- Procesamiento documental. 

- OCR. 

- Extracción estructurada. 

- Clasificación. 

- Validación asistida. 

- Adaptadores de modelos. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

8/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **Assistant** 

Conversaciones. 

- Interpretación de intenciones. 

- Recuperación de información. 

- Construcción de respuestas. 

- Ejecución controlada de herramientas. 

Esta separación permite reutilizar los servicios de IA sin acoplarlos al asistente conversacional. 

### **4.9. Card** 

Administra tarjetas de crédito, sus resúmenes mensuales y los consumos incluidos en cada resumen (CU-015, CU-016, CU-017). 

Responsabilidades: 

- Registrar tarjetas (marca, últimos 4 dígitos, días de cierre y vencimiento, límite). 

- Registrar resúmenes con totales por moneda (pesos y dólares) y pago mínimo. 

- Generar las obligaciones de pago del resumen al confirmarlo (una por moneda con saldo, tipo `CREDIT_CARD_PAYMENT`). 

- Registrar y categorizar consumos: compras, cuotas, devoluciones, cargos, impuestos e intereses. 

- Vincular las cuotas de una misma compra entre resúmenes (`purchase_group_id`). 

- Recordar la categoría elegida por el usuario para cada comercio. 

- Calcular el informe de compras y las cuotas pendientes. 

Decisiones: 

- Una tarjeta siempre pertenece a un servicio de categoría `CREDIT_CARD`, cuyo proveedor es el emisor. Así se reutilizan la detección por email (reglas con `document_type = CARD_STATEMENT`) y las obligaciones. 

- El resumen no se registra como factura (`invoices`): tiene estructura propia (dos monedas, pago mínimo, movimientos). 

- Los importes de los consumos se guardan con signo, tal como figuran en el resumen: positivo = cargo, negativo = crédito (devolución, pago, bonificación). 

- Los pagos del resumen anterior (`PAYMENT`) no cuentan como gasto. 

- No hay conexión con bancos: la información proviene del resumen (manual o detectado por email). 

# **5. Modelo de datos** 

La base de datos utilizará PostgreSQL. 

Se propone utilizar UUID como identificador principal y `TIMESTAMPTZ` para fechas y horas que representen instantes. 

Los importes monetarios utilizarán `NUMERIC(19,4)` y una moneda explícita mediante ISO 4217, por ejemplo ARS. 

## **5.1. Entidades principales** 

### **users** 

Administración de usuarios de la aplicación. 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|id|UUID|Identificador|
|email|VARCHAR(255)|Correo|
|name|VARCHAR(150)|Nombre|
|timezone|VARCHAR(60)|Zona horaria|
|locale|VARCHAR(10)|Configuración regional|
|active|BOOLEAN|Estado|
|created_at|TIMESTAMPTZ|Alta|
|updated_at|TIMESTAMPTZ|Modificación|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

9/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Nota: `users` guarda el hash bcrypt de la contraseña (`password_hash`) y el `google_subject` para el login con Google. Los tokens de un solo uso (verificación, reseteo, refresh) van en `user_tokens`, solo su hash. 

### **providers** 

Catálogo de proveedores. 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|name|VARCHAR(150)|
|code|VARCHAR(80)|
|category|VARCHAR(50)|
|website|TEXT|
|active|BOOLEAN|



### Ejemplos de categorías: 

- ELECTRICITY 

- GAS 

- WATER 

- INTERNET 

- INSURANCE 

- TAX 

- SUBSCRIPTION 

- OTHER 

### **services** 

Servicios administrados por el usuario. 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|provider_id|UUID|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

10/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|name|VARCHAR(150)|
|---|---|
|customer_reference|VARCHAR(150)|
|category|VARCHAR(50)|
|billing_frequency|VARCHAR(30)|
|start_date|DATE|
|end_date|DATE|
|active|BOOLEAN|
|metadata|JSONB|
|created_at|TIMESTAMPTZ|



`customer_reference` representa el número de cliente o identificador de contrato. 

La combinación de usuario, proveedor y referencia deberá contar con controles de duplicidad adecuados, considerando los servicios que no tengan referencia externa. 

### **documents** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|service_id|UUID NULL|
|document_type|VARCHAR(50)|
|original_filename|VARCHAR(255)|
|storage_key|TEXT|
|mime_type|VARCHAR(100)|
|file_size|BIGINT|
|checksum|VARCHAR(128)|
|processing_status|VARCHAR(30)|
|created_at|TIMESTAMPTZ|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

11/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

El documento conservará su ubicación física en el almacenamiento de objetos y sus metadatos en PostgreSQL. 

### **invoices** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|service_id|UUID|
|document_id|UUID|
|invoice_number|VARCHAR(120)|
|billing_period|VARCHAR(30)|
|issue_date|DATE|
|due_date|DATE|
|total_amount|NUMERIC(19,4)|
|currency|CHAR(3)|
|extraction_status|VARCHAR(30)|
|confidence_score|NUMERIC(5,4)|
|created_at|TIMESTAMPTZ|



La confianza de extracción es una referencia técnica, no una garantía de exactitud. 

### **obligations** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|service_id|UUID NULL|
|invoice_id|UUID NULL|
|title|VARCHAR(200)|
|description|TEXT|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

12/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|obligation_type|VARCHAR(50)|
|---|---|
|amount|NUMERIC(19,4) NULL|
|currency|CHAR(3) NULL|
|due_date|DATE|
|status|VARCHAR(30)|
|recurrence_id|UUID NULL|
|created_at|TIMESTAMPTZ|
|updated_at|TIMESTAMPTZ|



### **payments** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|obligation_id|UUID|
|amount|NUMERIC(19,4)|
|currency|CHAR(3)|
|payment_date|DATE|
|payment_method|VARCHAR(40)|
|receipt_document_id|UUID NULL|
|notes|TEXT|
|created_at|TIMESTAMPTZ|



Se permitirá que una obligación tenga varios pagos, siempre que el saldo pendiente y las reglas de cancelación sean consistentes. 

### **integrations** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

13/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|user_id|UUID|
|---|---|
|provider|VARCHAR(50)|
|external_account_id|VARCHAR(255)|
|status|VARCHAR(30)|
|scopes|JSONB|
|last_sync_at|TIMESTAMPTZ|
|created_at|TIMESTAMPTZ|
|updated_at|TIMESTAMPTZ|



Los tokens no se guardarán en texto plano en esta tabla. Se almacenarán mediante un mecanismo de cifrado y gestión de secretos. 

### **integration_credentials** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|integration_id|UUID|
|encrypted_access_token|BYTEA|
|encrypted_refresh_token|BYTEA|
|access_token_expires_at|TIMESTAMPTZ|
|key_version|VARCHAR(30)|
|updated_at|TIMESTAMPTZ|



### **notification_preferences** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|channel|VARCHAR(30)|
|enabled|BOOLEAN|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

14/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|days_before<br>created_at|JSONB<br>TIMESTAMPTZ|
|---|---|



### **notifications** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|obligation_id|UUID NULL|
|notification_type|VARCHAR(50)|
|channel|VARCHAR(30)|
|scheduled_at|TIMESTAMPTZ|
|sent_at|TIMESTAMPTZ NULL|
|status|VARCHAR(30)|
|attempts|INTEGER|



|**assets**|
|---|



|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|name|VARCHAR(150)|
|asset_type|VARCHAR(50)|
|description|TEXT|
|purchase_date|DATE NULL|
|metadata|JSONB|
|active|BOOLEAN|



Ejemplo: un vehículo puede tener documentos, seguros, VTV y obligaciones relacionadas. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

15/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **recurring_rules** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|
|service_id|UUID NULL|
|title|VARCHAR(200)|
|frequency|VARCHAR(30)|
|next_expected_date|DATE|
|estimated_amount|NUMERIC(19,4) NULL|
|active|BOOLEAN|



### **document_processing_jobs** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|document_id|UUID|
|user_id|UUID|
|status|VARCHAR(30)|
|attempts|INTEGER|
|provider|VARCHAR(80)|
|error_code|VARCHAR(80) NULL|
|created_at|TIMESTAMPTZ|
|completed_at|TIMESTAMPTZ NULL|



### **audit_logs** 

|**Campo**|**Tipo**|
|---|---|
|id|UUID|
|user_id|UUID|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

16/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|action|VARCHAR(100)|
|---|---|
|entity_type|VARCHAR(80)|
|entity_id|UUID|
|metadata|JSONB|
|created_at|TIMESTAMPTZ|



Los registros de auditoría no deberán incluir tokens, contraseñas ni contenido documental sensible. 

### **cards** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|id|UUID|Identificador|
|user_id|UUID|Usuario|
|service_id|UUID|Servicio `CREDIT_CARD` del emisor|
|name|VARCHAR(100)|Ej. "Visa Galicia"|
|brand|VARCHAR(30)|VISA, MASTERCARD, AMEX, CABAL, NARANJA, DINERS, OTHER|
|last_four|CHAR(4) NULL|Últimos 4 dígitos de la tarjeta|
|account_last_four|CHAR(4) NULL|Últimos 4 dígitos del número de cuenta (BBVA informa la cuenta, no la tarjeta)|
|holder_name|VARCHAR(150) NULL|Titular|
|additional|BOOLEAN|Tarjeta adicional|
|closing_day|SMALLINT NULL|Día de cierre habitual (1-31)|
|due_day|SMALLINT NULL|Día de vencimiento habitual (1-31)|
|credit_limit|NUMERIC(19,4) NULL|Límite de compra|
|currency|CHAR(3)|Moneda principal (ARS)|
|active|BOOLEAN|Estado|
|created_at / updated_at|TIMESTAMPTZ||

Única por usuario + marca + últimos 4 dígitos (cuando se informan). 

### **card_statements** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|id|UUID|Identificador|
|user_id|UUID|Usuario|
|card_id|UUID|Tarjeta|
|document_id|UUID NULL|PDF del resumen|
|extraction_result_id|UUID NULL|Propuesta de la IA|
|obligation_id|UUID NULL|Obligación de pago en moneda local|
|obligation_usd_id|UUID NULL|Obligación de pago en dólares|
|period_start|DATE NULL|Inicio del período|
|closing_date|DATE NULL|Fecha de cierre (falta si el resumen llegó por email sin PDF)|
|due_date|DATE|Vencimiento|
|next_closing_date / next_due_date|DATE NULL|Próximo cierre y vencimiento|
|currency|CHAR(3)|Moneda local del resumen (ARS)|
|total_amount|NUMERIC(19,4)|Total en moneda local|
|total_amount_usd|NUMERIC(19,4)|Total en dólares|
|minimum_payment|NUMERIC(19,4) NULL|Pago mínimo (moneda local)|
|status|VARCHAR(30)|PENDING_VALIDATION, CONFIRMED, REJECTED|
|source|VARCHAR(30)|MANUAL, AI_EXTRACTION, GMAIL|
|confirmed_at|TIMESTAMPTZ NULL||
|created_at / updated_at|TIMESTAMPTZ||

Un solo resumen confirmado por tarjeta y fecha de vencimiento (RN-016). `source_message_id` guarda el id del email de origen y evita registrar dos veces el mismo email. Si falta `closing_date`, las vistas usan `due_date` para ubicar el mes. 

### **Resúmenes de tarjeta detectados en el cuerpo del email** 

Algunos emisores no adjuntan el PDF. Caso real **BBVA** (asunto *"Ya podés descargar tu resumen de tarjeta Mastercard BBVA"*): el cuerpo informa *Número de cuenta \*\*\*\*NNNN*, *Fecha de vencimiento* (dd-MM-yyyy), *Saldo en pesos*, *Saldo en dólares* y *Pago mínimo* (formato 1.234,56), y el PDF se descarga desde un link que exige login. 

- `provider_email_rules.extraction_mode = EMAIL_BODY` y `body_fields` (JSONB) definen una regex por campo (grupo 1 = valor) y su formato (`dd-MM-yyyy`, `es-AR`). No interviene la IA. 

- Las regex se aplican sobre el texto del email sin HTML y con los espacios normalizados (incluido el espacio duro U+00A0, que `\s` de Java no reconoce). 

- La tarjeta se identifica por `cards.account_last_four`. Si no hay coincidencia, se propone crear la tarjeta. 

- Se crea el resumen con `source = GMAIL`, sin cierre ni consumos, en `PENDING_VALIDATION`, y una notificación `CARD_STATEMENT_AVAILABLE` invita a subir el PDF para cargar los consumos. 

- **El sistema no sigue links de los emails** (requieren sesión del home banking; riesgo de phishing y SSRF, §7.4). 

### **card_transactions** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|id|UUID|Identificador|
|user_id|UUID|Usuario|
|card_id|UUID|Tarjeta|
|statement_id|UUID|Resumen al que pertenece|
|transaction_date|DATE|Fecha del movimiento (en cuotas, la fecha de compra)|
|description|VARCHAR(255)|Texto tal como figura en el resumen|
|merchant_name|VARCHAR(150) NULL|Comercio normalizado|
|category|VARCHAR(40)|Categoría de gasto|
|category_source|VARCHAR(20)|AI, RULE, USER|
|transaction_type|VARCHAR(30)|PURCHASE, INSTALLMENT, REFUND, FEE, TAX, INTEREST, PAYMENT, ADJUSTMENT|
|amount|NUMERIC(19,4)|Con signo: positivo = cargo, negativo = crédito|
|currency|CHAR(3)|ARS / USD|
|installment_number / installment_total|SMALLINT NULL|Cuota N de M|
|original_amount|NUMERIC(19,4) NULL|Importe total de la compra en cuotas|
|purchase_group_id|UUID NULL|Agrupa las cuotas de una misma compra|
|reference|VARCHAR(100) NULL|Nro. de cupón / comprobante|
|confidence_score|NUMERIC(5,4) NULL|Confianza de la extracción|
|created_at / updated_at|TIMESTAMPTZ||

Categorías de gasto: SUPERMARKET, RESTAURANTS, FUEL, TRANSPORT, HEALTH, EDUCATION, ENTERTAINMENT, TRAVEL, CLOTHING, HOME, TECHNOLOGY, SERVICES, SUBSCRIPTIONS, TAXES_FEES, OTHER. 

### **card_merchant_rules** 

|**Campo**|**Tipo**|**Descripción**|
|---|---|---|
|id|UUID|Identificador|
|user_id|UUID|Usuario|
|merchant_name|VARCHAR(150)|Comercio normalizado|
|category|VARCHAR(40)|Categoría a aplicar|
|created_at / updated_at|TIMESTAMPTZ||

Única por usuario + comercio (RN-019). 

### **Vistas del informe** 

- `v_card_spending`: consumos de resúmenes confirmados (RN-017), sin pagos del resumen, con el mes de facturación (`billing_month`, según la fecha de cierre). Base de todos los totales del informe. 

- `v_card_pending_installments`: última cuota registrada de cada compra en cuotas, con las cuotas restantes, el importe restante y la fecha de cierre estimada del resumen que incluirá la última cuota. 

Ambas devuelven importes por moneda, sin conversión (RN-018). 

## **5.2. Entidades adicionales para la IA y el asistente** 

Se incorporarán cuando se implemente la fase de asistente conversacional: 

### **assistant_conversations** 

- id 

- user_id 

- title 

- created_at 

- updated_at 

### **assistant_messages** 

- id 

- conversation_id 

- role 

- content 

- metadata 

- created_at 

### **ai_extraction_results** 

- id 

- document_id 

- model 

- schema_version 

- extracted_data (JSONB) 

- confidence_data (JSONB) 

- validation_status 

- created_at 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

17/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

El resultado de extracción se mantendrá separado de la factura confirmada. Así se conserva la diferencia entre una inferencia de IA y un dato validado por el usuario. 

## **5.3. Relaciones principales** 



### **Consideraciones del modelo** 

- Los registros tendrán `user_id` siempre que pertenezcan a un usuario. 

- Se utilizarán claves foráneas y restricciones de integridad. 

- Las operaciones críticas se realizarán dentro de transacciones. 

- Se aplicarán índices sobre `user_id` , `status` , `due_date` , `provider_id` y fechas de consulta. 

- Se evitará utilizar JSONB para reemplazar relaciones que deban ser consultables y consistentes. 

Se utilizará borrado lógico únicamente donde tenga sentido funcional y legal. 

# **6. API REST** 

La API estará versionada: 

```
/api/v1
```

Se utilizarán: 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

18/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

- JSON. 

- HTTP status codes adecuados. 

DTOs independientes del dominio. 

- Validaciones Bean Validation. 

- Paginación. 

- Filtros. 

- OpenAPI. 

Manejo uniforme de errores mediante Problem Details. 

## **6.1. Usuarios y perfil** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/users/me`|Consultar perfil|
|PUT|`/users/me`|Actualizar perfil|
|GET|`/users/me/preferences`|Consultar preferencias|
|PUT|`/users/me/preferences`|Actualizar preferencias|



|Método|Endpoint|Descripción|
|---|---|---|
|POST|`/auth/register`|Crear cuenta (deja la sesión iniciada)|
|POST|`/auth/login`|Iniciar sesión|
|POST|`/auth/refresh`|Renovar la sesión (refresh rotativo)|
|POST|`/auth/logout`|Cerrar sesión|
|POST|`/auth/verify-email`|Confirmar email|
|POST|`/auth/resend-verification`|Reenviar el email de verificación|
|POST|`/auth/forgot-password`|Pedir enlace de reseteo (202 siempre)|
|POST|`/auth/reset-password`|Definir contraseña nueva|
|POST|`/auth/google/authorization`|URL de Google para elegir la cuenta (state y PKCE los genera el BFF). 503 si no está configurado|
|POST|`/auth/google`|Login con Google: canjea el código y vincula o crea la cuenta|
|PUT|`/users/me/password`|Cambiar contraseña|

Ver §7.1. Las preferencias de notificación están en §6.8. 

## **6.2. Servicios** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/services`|Listar servicios|
|POST|`/services`|Crear servicio|
|GET|`/services/{id}`|Consultar servicio|
|PUT|`/services/{id}`|Actualizar servicio|
|PATCH|`/services/{id}/status`|Cambiar estado|
|DELETE|`/services/{id}`|Desactivar servicio|
|GET|`/providers`|Listar proveedores|
|GET|`/providers/{id}`|Consultar proveedor|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

19/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

## **6.3. Documentos** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/documents`|Listar documentos|
|POST|`/documents`|Registrar documento|
|POST|`/documents/upload`|Cargar archivo|
|GET|`/documents/{id}`|Consultar documento|
|GET|`/documents/{id}/download`|Descargar documento|
|GET|`/documents/{id}/processing`|Consultar procesamiento|
|POST|`/documents/{id}/reprocess`|Reprocesar documento|
|DELETE|`/documents/{id}`|Eliminar documento|



Para cargas grandes se podrá utilizar carga directa al almacenamiento mediante URLs firmadas, con validación posterior por el backend. 

## **6.4. Facturas** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/invoices`|Listar facturas|
|POST|`/invoices`|Registrar factura|
|GET|`/invoices/{id}`|Consultar factura|
|PUT|`/invoices/{id}`|Actualizar factura|
|POST|`/invoices/{id}/confirm`|Confirmar extracción|
|POST|`/invoices/{id}/reject`|Rechazar propuesta|
|GET|`/invoices/{id}/document`|Obtener documento asociado|



## **6.5. Obligaciones** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/obligations`|Listar obligaciones|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

20/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|POST|`/obligations`|Crear obligación|
|---|---|---|
|GET|`/obligations/{id}`|Consultar obligación|
|PUT|`/obligations/{id}`|Actualizar obligación|
|PATCH|`/obligations/{id}/cancel`|Cancelar obligación|
|GET|`/obligations/upcoming`|Próximos vencimientos|
|GET|`/obligations/overdue`|Obligaciones vencidas|
|GET|`/obligations/summary`|Resumen económico|



Filtros sugeridos: 

```
GET /api/v1/obligations
```

- `?status=PENDING` 

- `&from=2026-12-01` 

- `&to=2026-12-31` 

- `&serviceId=UUID` 

- `&page=0` 

- `&size=20` 

- `&sort=dueDate,asc` 

## **6.6. Pagos** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/payments`|Listar pagos|
|POST|`/payments`|Registrar pago|
|GET|`/payments/{id}`|Consultar pago|
|PUT|`/payments/{id}`|Corregir pago|
|GET|`/obligations/{id}/payments`|Pagos de una obligación|



La modificación y eliminación de pagos deberá conservar trazabilidad. 

## **6.7. Integraciones** 

**Método Endpoint** 

##### **Descripción** 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

21/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|GET|`/integrations`|Listar integraciones|
|---|---|---|
|GET|`/integrations/available`|Integraciones disponibles|
|POST|`/integrations/gmail/connect`|Iniciar conexión Gmail|
|GET|`/integrations/gmail/callback`|Callback OAuth|
|GET|`/integrations/{id}`|Consultar integración|
|POST|`/integrations/{id}/sync`|Solicitar sincronización|
|DELETE|`/integrations/{id}`|Desconectar integración|



## **6.8. Notificaciones** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/notifications`|Listar notificaciones|
|PATCH|`/notifications/{id}/read`|Marcar como leída|
|GET|`/notification-preferences`|Consultar preferencias|
|PUT|`/notification-preferences`|Actualizar preferencias|



## **6.9. Asistente IA** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/assistant/conversations`|Listar conversaciones|
|POST|`/assistant/conversations`|Crear conversación|
|GET|`/assistant/conversations/{id}`|Consultar conversación|
|POST|`/assistant/conversations/{id}/messages`|Enviar consulta|
|DELETE|`/assistant/conversations/{id}`|Eliminar conversación|



La comunicación podrá utilizar streaming mediante SSE cuando se implemente la respuesta progresiva del asistente. 

## **6.11. Tarjetas de crédito** 

|**Método**|**Endpoint**|**Descripción**|
|---|---|---|
|GET|`/cards`|Listar tarjetas|
|POST|`/cards`|Registrar tarjeta|
|GET|`/cards/{id}`|Consultar tarjeta|
|PUT|`/cards/{id}`|Actualizar tarjeta|
|DELETE|`/cards/{id}`|Desactivar tarjeta|
|GET|`/cards/{id}/statements`|Resúmenes de una tarjeta|
|POST|`/card-statements`|Registrar resumen (manual)|
|GET|`/card-statements/{id}`|Consultar resumen|
|PUT|`/card-statements/{id}`|Corregir resumen|
|POST|`/card-statements/{id}/confirm`|Confirmar resumen y generar obligaciones|
|POST|`/card-statements/{id}/reject`|Rechazar propuesta|
|GET|`/card-statements/{id}/reconciliation`|Diferencia entre total del resumen y suma de consumos, por moneda|
|GET|`/card-statements/{id}/transactions`|Consumos del resumen|
|POST|`/card-statements/{id}/transactions`|Agregar consumo manual|
|PUT|`/card-transactions/{id}`|Editar consumo|
|PATCH|`/card-transactions/{id}/category`|Recategorizar (opcional: aplicar al comercio)|
|DELETE|`/card-transactions/{id}`|Eliminar consumo|
|GET|`/card-merchant-rules`|Reglas de categoría por comercio|
|DELETE|`/card-merchant-rules/{id}`|Eliminar regla|
|GET|`/cards/report`|Informe de compras|
|GET|`/cards/installments/pending`|Cuotas pendientes|

Filtros del informe: 

```
GET /api/v1/cards/report?from=2026-06-01&to=2026-11-30&cardId=UUID&currency=ARS
```

Ejemplo de respuesta (valores ilustrativos): 

```
{
  "from": "2026-06-01",
  "to": "2026-11-30",
  "totals": [
    { "currency": "ARS", "total": 1850000.00, "count": 142 },
    { "currency": "USD", "total": 85.40, "count": 6 }
  ],
  "byCategory": [
    { "category": "SUPERMARKET", "currency": "ARS", "total": 620000.00, "count": 38 }
  ],
  "byMonth": [
    { "month": "2026-11-01", "currency": "ARS", "total": 315000.00, "count": 24 }
  ],
  "byCard": [
    { "cardId": "…", "cardName": "Visa Galicia", "currency": "ARS", "total": 1200000.00, "count": 90 }
  ],
  "topMerchants": [
    { "merchant": "SUPERMERCADO X", "currency": "ARS", "total": 410000.00, "count": 20 }
  ],
  "pendingInstallments": [ … ],
  "pendingInstallmentsTotals": [
    { "currency": "ARS", "total": 540000.00, "count": 5 }
  ]
}
```

Los totales se calculan en PostgreSQL / Java. El frontend solo los presenta. 

## **6.10. Respuestas y errores** 

Se utilizará una estructura de error uniforme: 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

22/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
{
```

```
 "type": "https://api.example.com/errors/validation",
```

- `"title": "Validation Error",` 

- `"status": 400,` 

- `"detail": "The invoice contains invalid data.", "instance": "/api/v1/invoices",` 

```
 "code": "INVOICE_VALIDATION_ERROR",
```

```
 "timestamp": "2026-11-24T14:00:00Z"
```

```
}
```

Los identificadores internos de errores no deberán revelar información sensible. 

# **7. Seguridad y autenticación** 

La seguridad es uno de los aspectos más importantes del proyecto porque se administrará información personal, económica y documental. 

## **7.1. Autenticación** 

> **Decisión (24/11/2026):** la autenticación la implementa el **backend (Quarkus) con JWT propio**. Better Auth queda descartado para el MVP: agregaba un segundo modelo de usuarios y un token intermedio entre Next.js y Quarkus. 

Responsabilidades del backend (`/auth`, `/users/me`): 

- Registro con email y contraseña (bcrypt, costo 12). 

- Login, refresh y logout. 

- Verificación de email y recupero de contraseña con tokens de un solo uso (en la base se guarda solo su SHA-256). 

- Perfil y cambio de contraseña. 

- Login con Google (OAuth 2.0 + OpenID Connect, authorization code + PKCE). El BFF genera state y PKCE y los guarda en una cookie httpOnly de 10 min; el backend canjea el código con el client secret y verifica el id_token (firma RS256 con las claves de Google, audiencia, emisor y vencimiento). Reglas: se busca por `google_subject`; si no existe, se vincula a la cuenta con el mismo email solo si Google lo da por verificado; si esa cuenta nunca verificó su email se descartan su contraseña y su nombre y se cierran sus sesiones (evita que alguien registre un email ajeno de antemano); si no hay cuenta, se crea sin contraseña y con el email verificado. Callback registrado en Google Cloud: `FRONTEND_URL` + `/api/auth/google/callback`. 

### **Tokens** 

|**Token**|**Formato**|**Vida**|**Dónde vive**|
|---|---|---|---|
|Access token|JWT RS256 (iss, aud, sub = id de usuario, groups = rol)|15 min|Cookie httpOnly del BFF|
|Refresh token|Opaco, 256 bits, de un solo uso (rotativo)|30 días|Cookie httpOnly del BFF; en la base solo su hash|

- Cada refresh invalida el token usado y emite uno nuevo. Si un token ya usado se presenta de nuevo pasados 30 s, se asume robo y se cierran **todas** las sesiones del usuario. 

- Reseteo y cambio de contraseña cierran las demás sesiones. 

- El login no revela si un email existe: mismo mensaje y mismo costo de verificación. El recupero de contraseña responde siempre 202. 

- Las claves de firma no van en el repositorio en producción (`JWT_PRIVATE_KEY_LOCATION` / `JWT_PUBLIC_KEY_LOCATION`). 

### **BFF (Next.js)** 

El navegador nunca recibe los tokens: 

**1.** Los route handlers `/api/auth/*` llaman al backend y guardan los tokens en cookies `httpOnly`, `SameSite=Lax` y `Secure` (configurable con `COOKIE_SECURE`). 

**2.** `/api/backend/[...path]` reenvía las llamadas del navegador agregando `Authorization: Bearer`. Si el access token venció, renueva con el refresh token y reintenta una vez. Bloquea las rutas del backend que devuelven tokens. 

**3.** `proxy.ts` hace el chequeo optimista en cada navegación: sin sesión redirige a `/login?next=...` (solo rutas internas, sin open redirect), y con el access token vencido lo renueva en el mismo request. 

**4.** Los Server Components consultan `/users/me`; si el backend rechaza la sesión, se borran las cookies y se vuelve al login. 

**5.** Quarkus valida firma, emisor, audiencia y expiración de cada solicitud. El usuario se toma del claim `sub`, nunca de un parámetro del cliente. 

## **7.2. Autorización** 

Se aplicará aislamiento por usuario. 

Cada consulta deberá limitarse al usuario autenticado. 

Ejemplo conceptual: 

```
public List<Obligation> findByUser(
   UUID userId
```

```
) {
```

```
   return repository.find(
```

```
       "user.id = ?1",
       userId
   ).list();
}
```

La capa de aplicación obtendrá el usuario desde el contexto de seguridad, no desde un parámetro controlado por el cliente. 

También se validará la propiedad de cada recurso al consultar, modificar o eliminar documentos. 

## **7.3. Protección documental** 

Validar extensión, MIME type y contenido real. Limitar tamaño de archivos. 

Analizar archivos contra malware. 

Evitar archivos ejecutables. 

Utilizar URLs firmadas con expiración. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

24/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Mantener los buckets privados. Cifrar documentos. 

Aplicar políticas de retención y eliminación. Evitar exponer rutas internas de almacenamiento. 

## **7.4. Protección de integraciones** 

Tokens OAuth cifrados. 

- Secretos fuera del código fuente. Permisos mínimos. Rotación de claves. 

- Revocación de autorizaciones. 

- Protección contra CSRF. 

- Protección contra SSRF. 

- Validación de firmas en webhooks. Auditoría de accesos. 

## **7.5. Protección de IA** 

Los documentos y correos deben tratarse como contenido no confiable. 

Se deberá: 

Evitar ejecutar instrucciones encontradas dentro de documentos. 

- Separar contenido documental de instrucciones del sistema. No permitir que el modelo decida autorizaciones. Validar las herramientas antes de ejecutarlas. Limitar la información enviada al proveedor de IA. Evitar incluir documentos completos en logs. No enviar datos de un usuario en consultas de otro usuario. 

# **8. Integración con Gmail** 

Esta integración permitirá detectar facturas y documentos recibidos por correo electrónico. 

## **8.1. Flujo de conexión** 



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

25/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 



### **Permisos recomendados** 

Para el MVP utilizaría un permiso de solo lectura de Gmail, como: 

```
https://www.googleapis.com/auth/gmail.readonly
```

Este permiso permite consultar correos y adjuntos sin habilitar el envío, modificación o eliminación de mensajes. 

Los permisos de Gmail pueden requerir verificación de Google y estar sujetos a restricciones adicionales de acceso a datos sensibles o restringidos. Esto deberá contemplarse antes de publicar el producto. 

## **8.2. Detección de correos** 

Existen dos alternativas: 

**Alternativa A: Polling** 

El sistema consulta Gmail periódicamente buscando mensajes nuevos. 

Ventajas: 

Implementación inicial sencilla. 

No necesita infraestructura de notificaciones push. 

Desventajas: 

Mayor cantidad de consultas. 

Mayor latencia. 

Necesidad de administrar cuotas. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

26/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **Alternativa B: Gmail Push Notifications** 

Utilizar Gmail API Watch con Google Cloud Pub/Sub. 

Flujo: 

**1.** Quarkus configura una suscripción Watch. 

**2.** Gmail notifica cambios mediante Pub/Sub. 

**3.** Quarkus recibe la notificación. 

**4.** Consulta el historial mediante `historyId` . 

**5.** Obtiene los mensajes nuevos. 

**6.** Filtra mensajes relevantes. 

**7.** Descarga los adjuntos. 

**8.** Envía los documentos al procesamiento documental. 

La suscripción Watch debe renovarse periódicamente; Google establece una vigencia máxima de siete días. 

**Recomendación:** comenzar con polling para validar el MVP y migrar a Pub/Sub cuando aumente el volumen de usuarios. 

## **8.3. Filtros de detección** 

No todos los correos deben procesarse. 

Se buscarán: 

- Remitentes de proveedores conocidos. 

- Asuntos relacionados con facturas. 

- Adjuntos PDF. 

- Documentos de cobro. 

- Resúmenes de cuenta. 

- Avisos de vencimiento. 

La detección inicial combinará reglas determinísticas y clasificación mediante IA cuando sea necesario. 

## **8.4. Evitar duplicados** 

Se utilizarán: 

- Gmail message ID. 

- Gmail attachment ID. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

27/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Hash SHA-256 del archivo. 

Identificador de factura. 

Relación con el servicio. 

La deduplicación debe ser idempotente, incluso cuando Gmail o Pub/Sub entreguen notificaciones repetidas. 

# **9. Procesamiento asíncrono e inteligencia artificial** 

Este componente será el núcleo de automatización del producto. 

El procesamiento no debe ejecutarse dentro de la misma petición HTTP que recibe el archivo. 

## **9.1. Pipeline documental** 



## **9.2. Etapas de procesamiento** 

### **1. Recepción** 

Se recibe un documento mediante: 

Carga manual. 

Gmail. 

Integraciones externas. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

28/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **2. Validación** 

Se comprueba: 

- Tipo de archivo. 

- Tamaño. 

- Integridad. 

- Duplicación. 

- Seguridad. 

### **3. Almacenamiento** 

Se almacena el documento original en Object Storage. 

### **4. Extracción de texto** 

Se utilizarán herramientas de parsing y OCR. 

- Apache Tika para extracción de contenido de documentos compatibles. 

- Tesseract OCR o un servicio especializado para documentos escaneados. 

- Procesamiento específico para PDF e imágenes. 

### **5. Clasificación** 

El modelo identifica si el documento corresponde a: 

- Factura. 

- Resumen de tarjeta. 

- Comprobante de pago. 

- Póliza. 

- Contrato. 

- Documento personal. 

- Otro. 

### **6. Extracción estructurada** 

Se solicita una salida JSON validada contra un esquema. 

Ejemplo: 

```
{
```

- `"documentType": "INVOICE", "provider": "EDEA", "invoiceNumber": "0001-00001234", "billingPeriod": "2026-12",` 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

29/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
 "issueDate": "2026-11-20",
 "dueDate": "2026-12-15",
 "amount": 48500.00,
 "currency": "ARS",
 "customerReference": "123456789",
 "confidence": {
   "amount": 0.99,
   "dueDate": 0.97,
   "provider": 0.98
 }
}
```

Los valores son ilustrativos. 

Para un resumen de tarjeta (`documentType: CARD_STATEMENT`) el esquema incluye los movimientos: 

```
{
  "documentType": "CARD_STATEMENT",
  "issuer": "Banco Galicia",
  "brand": "VISA",
  "lastFour": "1234",
  "closingDate": "2026-11-27",
  "dueDate": "2026-12-09",
  "nextClosingDate": "2026-12-26",
  "nextDueDate": "2027-01-08",
  "totalAmount": 315000.00,
  "totalAmountUsd": 12.99,
  "minimumPayment": 45000.00,
  "transactions": [
    {
      "date": "2026-11-03",
      "description": "SUPERMERCADO X SUC 12",
      "amount": 25400.00,
      "currency": "ARS",
      "installmentNumber": null,
      "installmentTotal": null
    },
    {
      "date": "2026-08-15",
      "description": "TIENDA Y C.03/06",
      "amount": 18000.00,
      "currency": "ARS",
      "installmentNumber": 3,
      "installmentTotal": 6
    }
  ],
  "confidence": { "totalAmount": 0.99, "dueDate": 0.98, "transactions": 0.90 }
}
```

La suma de los movimientos debe coincidir con los totales del resumen; si no coincide, el resumen queda en revisión (`REQUIRES_REVIEW`) y se informa la diferencia. 

### **7. Validación de negocio** 

El backend valida: 

Formato de fechas. 

- Importe positivo. 

- Moneda. 

- Existencia del proveedor. Asociación con el servicio. 

Duplicidad. 

Coherencia entre período y fechas. 

### **8. Confirmación** 

El usuario revisa la propuesta antes de crear registros definitivos. 

## **9.3. Procesamiento asíncrono** 

Para el MVP recomiendo un patrón Transactional Outbox. 

Cuando se crea un documento: 

**1.** Se guarda el documento y sus metadatos. 

**2.** Se crea una tarea pendiente. 

**3.** Se registra un evento en una tabla Outbox dentro de la misma transacción. 

**4.** Un worker obtiene los eventos pendientes. 

**5.** Procesa el documento. 

**6.** Actualiza el estado. 

**7.** Registra el resultado. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

30/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Estados del procesamiento: 

#### `PENDING` 

```
PROCESSING
COMPLETED
FAILED
REQUIRES_REVIEW
```

Se deberán implementar: 

- Reintentos con backoff exponencial. 

- Límite de intentos. 

- Dead Letter Queue lógica. 

- Idempotencia. 

- Control de concurrencia. 

- Recuperación de tareas abandonadas. 

- Registro de errores sin exponer información sensible. 

El Outbox permite evitar inconsistencias entre la persistencia del documento y la generación de la tarea. 

En una etapa posterior se podrá incorporar Kafka o RabbitMQ si el volumen o la necesidad de distribución lo justifican. 

## **9.4. Arquitectura de proveedores de IA** 

El sistema no debe depender de un único proveedor de modelos. 

Se definirán interfaces: 

```
public interface DocumentExtractor {
```

```
   ExtractedDocument extract(
```

```
       DocumentContent content
```

```
   );
}
```

```
public interface DocumentClassifier {
```

```
   DocumentType classify(
       DocumentContent content
```

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

31/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
   );
}
public interface AssistantProvider {
   AssistantResponse generate(
       AssistantRequest request
   );
}
```

```
public interface AssistantProvider {
```

Los adaptadores implementarán la comunicación con los proveedores externos. 

Esto permitirá cambiar de modelo sin modificar el dominio. 

## **9.5. Asistente conversacional** 

El asistente no tendrá acceso directo a la base de datos. 

Utilizará herramientas controladas: 

```
Assistant
  |
  v
Intent Recognition
  |
  v
Tool Registry
  |
  +-- getUpcomingObligations()
  |
  +-- getMonthlyExpenses()
  |
  +-- getServiceDetails()
  |
  +-- getDocumentDetails()
  |
  +-- getAssetExpiration()
  |
  v
Response Generator
```

Cada herramienta ejecutará un caso de uso que validará el usuario autenticado. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

32/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Ejemplo: 

Usuario: 

### ¿Cuánto tengo que pagar durante diciembre? 

El asistente ejecutará una consulta controlada sobre obligaciones del usuario y devolverá los importes calculados por el backend. 

**Regla fundamental:** los cálculos financieros se realizarán en Java y PostgreSQL, no mediante estimaciones del modelo de lenguaje. 

# **10. Frontend – Next.js** 

El frontend utilizará Next.js con App Router y TypeScript. 

Se organizará por módulos funcionales, separando: 

- Presentación. 

- Componentes compartidos. 

- Consumo de API. 

- Autenticación. 

- Validaciones. 

- Estado global. 

- Modelos y contratos. 

### **10.1. Estructura propuesta** 

```
src/
```

```
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   └── (private)/
│       ├── dashboard/
│       ├── services/
│       ├── invoices/
│       ├── obligations/
│       ├── payments/
│       ├── documents/
│       ├── assets/
│       ├── cards/
```

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

33/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
│       ├── integrations/
│       ├── notifications/
│       └── assistant/
│
├── components/
│   ├── common/
│   ├── layout/
│   └── forms/
│
├── modules/
│   ├── services/
│   ├── invoices/
│   ├── obligations/
│   ├── documents/
│   ├── payments/
│   ├── cards/
│   └── assistant/
│
├── lib/
│   ├── api/
│   ├── auth/
│   └── validation/
│
├── hooks/
├── types/
└── theme/
```

### **10.2. Estrategia de consumo de API** 

Se utilizará un cliente HTTP centralizado. 

Responsabilidades: 

- Configuración de URL base. 

- Autenticación. 

- Interceptores. 

- Manejo de errores. 

- Tipado de respuestas. 

- Serialización de parámetros. 

Las páginas Server Components podrán recuperar información inicial desde el BFF. Las operaciones interactivas utilizarán servicios del frontend. 

No se expondrán credenciales de Gmail, tokens privados ni secretos de backend al navegador. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

34/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **10.3. Pantallas principales** 

|**Pantalla**|**Componentes principales**|
|---|---|
|Dashboard|Resumen, vencimientos, actividad|
|Servicios|Listado, registro, detalle|
|Facturas|Listado, carga y validación|
|Obligaciones|Tabla, filtros y estados|
|Documentos|Repositorio y búsqueda|
|Pagos|Historial y comprobantes|
|Bienes|Vehículos y propiedades|
|Integraciones|Gmail y conexiones|
|Notificaciones|Alertas y preferencias|
|Asistente|Chat conversacional|
|Tarjetas|Tarjetas, resúmenes, consumos e informe de compras|



### **10.4. Experiencia de procesamiento documental** 

Cuando el usuario cargue un documento, la interfaz deberá mostrar el progreso: 

|`Documento`|`recibido`|
|---|---|
|`|`||
|`v`||
|`Validando`|`archivo`|
|`|`||
|`v`||
|`Extrayend`<br>`|`|`o información`|
|`v`||
|`Validando`|`datos`|
|`|`||
|`v`||
|`Esperando`<br>`|`|`confirmación`|
|`v`||
|`Documento`|`registrado`|



La interfaz podrá consultar periódicamente el estado de procesamiento y, posteriormente, utilizar SSE para actualizarlo en tiempo real. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

35/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

# **11. Notificaciones y automatizaciones** 

El sistema contará con un motor de notificaciones desacoplado del dominio. 

### **Tipos de notificaciones** 

- Factura próxima a vencer. 

- Factura vencida. 

- Nuevo documento detectado. 

- Factura pendiente de validación. 

- Integración desconectada. 

- Renovación de documentación. 

- Mantenimiento próximo. 

### **Canales** 

|**Canal**|**Implementación**|
|---|---|
|Email|SMTP / proveedor de correo|
|Web|Centro de notificaciones|
|Push|Web Push|
|Mobile|Futuras notificaciones nativas|



### **Procesamiento** 

Un scheduler consultará obligaciones y eventos próximos. 

Ejemplo de configuración: 

```
Vencimiento: 15/12/2026
```

```
Recordatorios:
```

- `7 días antes.` 

- `3 días antes.` 

- `1 día antes.` 

- `Día del vencimiento.` 

Las preferencias serán configurables por usuario y por tipo de notificación. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

36/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **Reglas técnicas** 

- Evitar notificaciones duplicadas. 

- Persistir antes de enviar. 

- Registrar intentos. 

- Reintentar fallas temporales. 

- Respetar zona horaria. 

- No enviar notificaciones de obligaciones canceladas. 

- Utilizar claves de idempotencia. 

# **12. Infraestructura y despliegue** 

- La infraestructura inicial estará basada en Docker. 

Se propone mantener tres entornos: 

|**Entorno**|**Objetivo**|
|---|---|
|Development|Desarrollo local|
|Staging|Validación y pruebas integradas|
|Production|Usuarios reales|



## **12.1. Arquitectura de despliegue** 



<!-- Start of picture text -->
Internet / HTTPS<br>Reverse Proxy / Nginx<br>TLS · Routing<br>Next.js Quarkus<br>Web / BFF REST API<br>Background Workers<br>Documentos · Gmail · IA · Notificaciones<br><!-- End of picture text -->

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

37/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **PostgreSQL** 

### **Object Storage** 

### **Servicios externos** 

Google · Proveedores IA · Email 

## **12.2. Contenedores** 

El entorno inicial tendrá: 

|**Contenedor**|**Servicio**|
|---|---|
|frontend|Next.js|
|backend|Quarkus|
|worker|Procesamiento asíncrono Quarkus|
|database|PostgreSQL|
|storage|MinIO en desarrollo o S3 en producción|
|reverse-proxy|Nginx|



El worker podrá reutilizar los módulos de aplicación y adaptadores del backend, pero ejecutará procesos de fondo sin exponer endpoints públicos innecesarios. 

## **12.3. Variables de entorno** 

Ejemplo: 

```
# Frontend
```

```
NEXT_PUBLIC_APP_URL=
API_INTERNAL_URL=
```

```
# Backend
```

```
QUARKUS_DATASOURCE_JDBC_URL=
QUARKUS_DATASOURCE_USERNAME=
QUARKUS_DATASOURCE_PASSWORD=
```

#### `# Security` 

```
JWT_PUBLIC_KEY=
TOKEN_ENCRYPTION_KEY=
```

#### `# Google` 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

38/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

```
# AI
AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
```

```
# Storage
STORAGE_ENDPOINT=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Los valores reales se proporcionarán mediante un gestor de secretos y nunca se incluirán en Git. 

## **12.4. Persistencia y backups** 

Se implementarán: 

- Backups automáticos de PostgreSQL. 

- Recuperación a un punto en el tiempo cuando el proveedor lo permita. 

- Versionado o políticas de retención para documentos. 

- Cifrado de backups. 

- Pruebas periódicas de restauración. 

- Políticas de eliminación de datos. 

# **13. Testing y calidad** 

La estrategia de pruebas se dividirá por niveles. 

|**Nivel**|**Herramientas**|**Objetivo**|
|---|---|---|
|Unit Testing|JUnit 5, Mockito|Reglas de negocio|
|Integration Testing|Quarkus Test|Integraciones internas|
|Database Testing|PostgreSQL real|Persistencia|
|API Testing|REST Assured|Contratos REST|
|Frontend Testing|Vitest, Testing Library|Componentes|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

39/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

E2E 

Playwright 

Flujos completos 

### **Casos críticos que deberán probarse** 

**1.** Un usuario no puede consultar facturas de otro. 

**2.** Una factura duplicada no genera obligaciones duplicadas. 

**3.** Una factura extraída incorrectamente requiere corrección. 

**4.** Un pago parcial actualiza correctamente el saldo. 

**5.** Una obligación cancelada no genera recordatorios. 

**6.** Una integración desconectada no procesa nuevos correos. 

**7.** Un documento no puede descargarse sin autorización. 

**8.** Los eventos repetidos no generan operaciones duplicadas. 

**9.** Los errores del proveedor de IA no pierden documentos. 

**10.** Un proceso interrumpido puede reanudarse de forma segura. 

Se recomienda utilizar PostgreSQL real en las pruebas de integración para validar restricciones, transacciones, índices y consultas específicas. 

# **14. Observabilidad y monitoreo** 

Se utilizará OpenTelemetry para instrumentar: 

- Requests HTTP. 

- Consultas a base de datos. 

- Procesamiento documental. 

- Consumo de APIs externas. 

- Procesamiento de eventos. 

- Tareas programadas. 

### **Métricas principales** 

|**Métrica**|**Objetivo**|
|---|---|
|API response time|Tiempo de respuesta|
|API error rate|Errores HTTP|
|Document processing duration|Tiempo de extracción|
|Document processing failure rate|Fallos de IA/OCR|
|Outbox pending events|Eventos pendientes|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

40/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Fallos de sincronización 

Gmail synchronization failures Fallos de sincronización Notification delivery rate Entrega de alertas AI token consumption Consumo de modelos 

Consumo de modelos 

Los logs serán estructurados en JSON e incluirán correlation ID y referencias técnicas, sin exponer información personal ni contenido de documentos. 

# **15. Estrategia de implementación** 

La implementación se realizará progresivamente. 

|**Fase**|**Entregable**|**Prioridad**|
|---|---|---|
|1|Proyecto base, autenticación y usuarios|Alta|
|2|Servicios y proveedores|Alta|
|3|Documentos y almacenamiento|Alta|
|4|Facturas y obligaciones|Alta|
|5|Pagos y dashboard|Alta|
|5.1|Tarjetas de crédito y resúmenes (totales y vencimiento)|Alta|
|6|Notificaciones|Alta|
|7|Procesamiento documental con IA|Alta|
|7.1|Consumos de tarjeta e informe de compras|Alta|
|8|Integración Gmail|Media|
|9|Asistente conversacional|Media|
|10|Bienes y gestión familiar|Futura|



### **Hitos de desarrollo** 

### **Hito 1 – Base tecnológica** 

Repositorios. 

Docker. PostgreSQL. Flyway. Autenticación JWT. Quarkus. 

- Contratos REST. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

41/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

### **Hito 2 – Dominio principal** 

- Servicios. 

Proveedores. 

- Facturas. 

- Obligaciones. 

- Pagos. 

### **Hito 3 – Documentación** 

Upload. 

- Object Storage. OCR. 

- Extracción estructurada. 

- Validación humana. 

### **Hito 4 – Automatización** 

Gmail. 

Outbox. 

- Workers. 

- Notificaciones. 

### **Hito 5 – Inteligencia** 

Asistente IA. 

- Herramientas de consulta. 

- Recomendaciones. 

- Detección de patrones. 

# **16. Decisiones técnicas y consideraciones pendientes** 

Antes de comenzar la implementación, establecería las siguientes decisiones como criterios de arquitectura. 

|**Decisión**|**Definición**|
|---|---|
|Arquitectura|Monolito modular|
|Diseño|Arquitectura hexagonal|
|Persistencia|PostgreSQL + Panache Repository|



https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

42/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

|Identificadores|UUID|
|---|---|
|API|REST versionada|
|Autenticación|JWT propio en Quarkus + BFF Next.js con cookies httpOnly|
|Procesamiento|Workers + Transactional Outbox|
|Mensajería inicial|PostgreSQL|
|Archivos|Object Storage|
|IA|Proveedor intercambiable|
|Integraciones|Adaptadores independientes|
|Despliegue|Docker|



### **Decisiones que requieren definición antes de producción** 

**1. Identidad:** ~~definir cómo Better Auth emitirá la identidad~~ Resuelto: JWT propio y login con Google (§7.1). Pendiente: gestión de claves de firma en producción. 

**2. Google:** completar el proceso de autorización y verificación de permisos de Gmail. 

**3. IA:** seleccionar proveedor, modelo, costos y políticas de retención de datos. 

**4. OCR:** evaluar precisión con facturas reales de proveedores argentinos. 

**5. Almacenamiento:** definir proveedor, región, cifrado y retención. 

**6. Pagos:** determinar si en el futuro se incorporarán integraciones oficiales de pago. 

**7. Privacidad:** definir políticas de exportación, eliminación y conservación de documentos. 

## **17. Criterios de arquitectura que no deberían negociarse** 

Hay cinco decisiones que considero especialmente importantes para evitar problemas futuros: 

- **La IA no es la fuente de verdad:** los datos definitivos pertenecen al dominio y deben validarse. 

- **Las integraciones no pertenecen al dominio:** Gmail, OCR y proveedores externos se implementan como adaptadores. 

- **Las obligaciones son independientes de las facturas:** no todo vencimiento tiene que originarse en un documento. 

- **El procesamiento es asíncrono:** las operaciones lentas nunca deben bloquear la experiencia del usuario. 

- **La seguridad es multiusuario desde el inicio:** toda entidad y operación debe respetar el aislamiento de datos. 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

43/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

## **18. Resultado esperado** 

Al finalizar las primeras etapas, tendremos una plataforma donde un usuario podrá: 

**1.** Crear su cuenta. 

**2.** Registrar los servicios que tiene contratados. 

**3.** Cargar facturas y documentación. 

**4.** Obtener automáticamente información de esos documentos. 

**5.** Administrar sus obligaciones y vencimientos. 

**6.** Registrar pagos y comprobantes. 

**7.** Recibir alertas. 

**8.** Conectar su correo electrónico. 

**9.** Consultar sus obligaciones mediante inteligencia artificial. 

El objetivo a largo plazo será evolucionar desde un administrador personal hacia un agente digital proactivo, capaz de detectar necesidades y proponer acciones antes de que el usuario tenga que intervenir. 

## **19. Documentación técnica resultante** 

La SPEC puede organizarse en los siguientes archivos dentro del repositorio: 

```
docs/
```

```
├── 01-PRODUCT-SPEC.md
├── 02-FUNCTIONAL-SPEC.md
├── 03-TECHNICAL-SPEC.md
├── 04-ARCHITECTURE.md
├── 05-DATA-MODEL.md
├── 06-API-SPEC.md
├── 07-SECURITY-SPEC.md
├── 08-INTEGRATIONS-SPEC.md
├── 09-AI-PROCESSING-SPEC.md
├── 10-DEPLOYMENT-SPEC.md
└── 11-ROADMAP.md
```

**Mi recomendación para comenzar:** implementar primero el dominio `Service` , `Document` , `Invoice` , `Obligation` y `Payment` . Son los componentes centrales del producto y permitirán validar el modelo de negocio antes de invertir demasiado tiempo en integraciones complejas. 

El siguiente entregable que prepararía es la <u>Generar el modelo SQL y las migraciones Flyway.</u> 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

44/45 

24/11/26, 11:48 a.m. 

ChatGPT - Contenido compartido 

Fin de la especificación técnica v1.0 · Documento base para iniciar el desarrollo. 

### Si quieres, puedo: 

<u>Mostrar ejemplos detallados de endpoints REST para documentos Explicar el flujo de procesamiento asíncrono para documentos</u> 

- <u>Describir la interacción entre módulos AI y Assistant</u> 

https://chatgpt.com/s/t_6b05a365a9988191944654b2d3190fcc 

45/45 

