---
version: 1
slug: "src-app-layout-tsx"
primary_target: "src/app/layout.tsx"
related_targets: ["src/app/(private)/dashboard/page.tsx","src/app/(auth)/layout.tsx"]
---

# App shell y pantallas de cuenta

Alcance: diseño predeterminado de toda la app (Operate): shell privado (riel + contenido), pantallas de autenticación, inicio y perfil. Modo claro y oscuro.

Audiencia y tarea: público general en Argentina que revisa qué vence, qué pagó y qué falta. Tarea frecuente y breve; la claridad de montos y fechas manda.

Restricciones: Next.js 16 + MUI 9 (componentes estándar: botones, campos, menús, listas). Nombre visible "Asistente de Vida Digital". Sin datos inventados en la app real: los módulos de datos (servicios, obligaciones) todavía no existen, así que inicio muestra estados vacíos honestos.

## Direction contract

THESIS: Las cuentas del hogar con la seriedad del papel moneda: tinta profunda, papel teñido y un tinte por tipo de servicio. Rechaza el panel fintech blanco con tarjetas de KPI azules.

OWN-WORLD: Papel de seguridad verde agua pálido (claro) o tinta petróleo profunda (oscuro); tinta intaglio petróleo #16323A para texto y riel; tintes de denominación (naranja hornero, ocre, verde yaguareté, rosa, azul cóndor) como código de servicio con leyenda; filetes finos; cifras tabulares; Archivo y Archivo Narrow para rótulos.

STORY: El visitante entiende en un vistazo cuánto del mes ya pagó y qué viene; cree que sus datos están en un lugar serio; entra, revisa y sale.

FIRST VIEWPORT: Riel lateral en tinta petróleo con marca y navegación; a la derecha, saludo y mes en curso; panel "Este mes" con la roseta guilloché que se completa según lo pagado; panel de vencimientos con fila por obligación y franja de tinte. Acción principal en el panel de vencimientos.

FORM: Papel moneda (billetes de pesos argentinos), candidato 6 de mi lista ordenada; seed:0f26caf1c005a0fa. Movimiento firma: la roseta guilloché como medidor del mes pagado. Raises: color como código con leyenda (Saville); cifras tabulares a densidad de datos (Ikeda); un solo acento marca todo estado vivo (Metro).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
