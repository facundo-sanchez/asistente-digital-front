---
name: Asistente de Vida Digital
description: Las cuentas del hogar con la seriedad del papel moneda.
colors:
  tinta-petroleo: "#16323A"
  petroleo: "#1D4650"
  petroleo-claro: "#2C5C67"
  naranja-hornero: "#A85A17"
  papel-seguridad: "#E9EFEB"
  papel-hoja: "#F6F9F7"
  tinta-gris: "#48656B"
  filete: "#C9D8D0"
  riel-texto: "#BFD2C9"
  error: "#B3261E"
  advertencia: "#8A6A0A"
  exito: "#3F6E3A"
  info: "#2F5E8C"
  noche-petroleo: "#0F2328"
  noche-hoja: "#14303A"
  riel-noche: "#0A1B1F"
  riel-noche-texto: "#A9C2B8"
  verde-agua: "#8CC5B6"
  verde-agua-hondo: "#6FAE9E"
  verde-agua-claro: "#AAD7CB"
  hornero-claro: "#E9A35E"
  texto-noche: "#E3ECE7"
  texto-noche-gris: "#9DB8AE"
  filete-noche: "#2A4A52"
  error-noche: "#F2A39C"
  advertencia-noche: "#E2C066"
  exito-noche: "#8DBF84"
  info-noche: "#8DB4DB"
  tinte-luz: "#C9772A"
  tinte-gas: "#D3A934"
  tinte-agua: "#5D8A57"
  tinte-internet: "#B0597C"
  tinte-tarjetas: "#3B6A99"
  tinte-otros: "#7E8C8A"
typography:
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  button:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "0em"
  label:
    fontFamily: "Archivo Narrow, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    letterSpacing: "0.06em"
rounded:
  franja: "4px"
  control: "10px"
  panel: "14px"
  nav: "20px"
spacing:
  unidad: "8px"
  margen-mobile: "16px"
  margen-escritorio: "40px"
  panel: "24px"
  panel-mobile: "20px"
  grilla: "24px"
  seccion: "32px"
components:
  button-primary:
    backgroundColor: "{colors.petroleo}"
    textColor: "{colors.papel-hoja}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "8px 18px"
  button-primary-dark:
    backgroundColor: "{colors.verde-agua}"
    textColor: "{colors.noche-petroleo}"
  button-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.petroleo}"
    rounded: "{rounded.control}"
    padding: "8px 18px"
  input:
    backgroundColor: "{colors.papel-hoja}"
    textColor: "{colors.tinta-petroleo}"
    rounded: "{rounded.control}"
  panel:
    backgroundColor: "{colors.papel-hoja}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  rail:
    backgroundColor: "{colors.tinta-petroleo}"
    textColor: "{colors.riel-texto}"
    width: "248px"
  rail-dark:
    backgroundColor: "{colors.riel-noche}"
    textColor: "{colors.riel-noche-texto}"
  nav-item:
    rounded: "{rounded.nav}"
    textColor: "{colors.riel-texto}"
  top-bar:
    backgroundColor: "{colors.papel-seguridad}"
    height: "64px"
  tint-strip:
    rounded: "{rounded.franja}"
    width: "6px"
    height: "20px"
---

# Design System: Asistente de Vida Digital

## Overview

**Creative North Star: "El papel moneda"**

Las cuentas del hogar se tratan como un billete: papel de seguridad teñido, tinta intaglio petróleo, un grabado guilloché y un tinte por denominación. La seriedad viene de la materia y del orden, no de la decoración: superficies planas con filete fino, cifras tabulares alineadas en columna, títulos firmes en Archivo y rótulos de planilla en Archivo Narrow. El usuario entra, ve cuánto del mes ya pagó y qué viene, y sale.

El sistema tiene dos modos de igual rango. En claro, el fondo es papel de seguridad verde agua pálido y la tinta es petróleo profundo; en oscuro, el papel pasa a ser tinta petróleo nocturna y la tinta se vuelve verde agua. Los dos comparten estructura, tokens con el mismo rol y los mismos tintes de servicio. El modo arranca en el del sistema y el usuario lo cambia con el interruptor de la barra superior; se aplica antes de pintar, sin destello.

La densidad es de planilla, no de folleto: paneles con títulos y una línea de contexto, tablas tipo libro de cuentas, y un único elemento de firma, la roseta guilloché. Se rechaza el panel fintech blanco con tarjetas de KPI azules.

**Key Characteristics:**
- Papel teñido de fondo y tinta petróleo para texto, riel y botón principal.
- Un solo acento (naranja hornero) para todo estado vivo: foco, selección, cursor, sección activa.
- Tintes de denominación como código de servicio, siempre con su rótulo.
- Superficies planas con filete; sin sombras en reposo.
- Cifras tabulares en montos y fechas.
- La roseta guilloché como sello y como medidor del mes pagado.

## Colors

Paleta de billete: papel verde agua, tinta petróleo, un acento cálido y seis tintes de denominación. Cada rol tiene su valor en claro y en oscuro (MUI `colorSchemes`, expuestos como `--mui-palette-*`).

### Primary
- **Petróleo** (claro: `petroleo`, con `tinta-petroleo` como hondo y `petroleo-claro`; oscuro: `verde-agua`, `verde-agua-hondo`, `verde-agua-claro`): botón principal, avatar del usuario, roseta de la marca sobre papel y arco de progreso de la roseta. Es la tinta que manda; no es el acento.

### Secondary
- **Naranja hornero** (claro: `naranja-hornero`; oscuro: `hornero-claro`): el acento único. Anillo de foco de teclado (2px, separado 2px), borde y rótulo del campo enfocado, cursor de texto, selección de texto (al 28%) e icono de la sección activa del riel.

### Neutral
- **Papel de seguridad** (`papel-seguridad` / `noche-petroleo`): fondo de página y de la barra superior. También es el `theme-color` del navegador en cada modo.
- **Papel de hoja** (`papel-hoja` / `noche-hoja`): superficie de paneles y de los campos de texto, un paso más clara (u oscura) que el fondo.
- **Tinta petróleo** (`tinta-petroleo` / `texto-noche`): texto principal.
- **Tinta gris** (`tinta-gris` / `texto-noche-gris`): descripciones, encabezados de tabla, valores vacíos.
- **Filete** (`filete` / `filete-noche`): bordes de paneles, separadores de tabla, borde inferior de la barra, barra de desplazamiento.
- **Riel** (`tinta-petroleo` con `riel-texto` / `riel-noche` con `riel-noche-texto`): fondo y texto del riel lateral y del panel de marca de las pantallas públicas. Texto activo en blanco; hover blanco al 6% (5% en oscuro), seleccionado al 10% (8%).

### Estados
- **Error, advertencia, éxito, info** (`error`, `advertencia`, `exito`, `info` y sus pares `-noche`): solo en avisos (`Alert`) y validación de formularios. La advertencia es ocre, no naranja.

### Tintes de servicio
- **Luz** (`tinte-luz`), **Gas** (`tinte-gas`), **Agua** (`tinte-agua`), **Internet** (`tinte-internet`), **Tarjetas** (`tinte-tarjetas`), **Otros** (`tinte-otros`). Mismo valor en claro y oscuro. Viven en `palette.serviceTint` y en `src/theme/service-tints.ts` junto a sus rótulos (`SERVICE_LABELS`).

### Named Rules
**The Un Solo Acento Rule.** El naranja hornero marca todo estado vivo y nada más: foco, selección, cursor, sección actual. No se usa para botones, títulos, decoración ni datos.

**The Hornero no es Aviso Rule.** El acento (naranja hornero) significa "estás acá"; la advertencia (ocre) significa "prestá atención". Nunca comparten valor: un aviso no puede confundirse con un foco ni con la sección activa.

**The Denominación con Leyenda Rule.** Un tinte de servicio nunca es la única señal: va siempre junto al nombre del servicio en la misma fila o con una leyenda visible en el mismo panel. Los tintes se usan como franja o marca, nunca como color de texto ni de fondo de superficie.

**The Dos Papeles Rule.** Todo color se pide por rol del tema (`text.primary`, `background.paper`, `rail.background`), nunca como hex suelto en un componente, para que cambie con el modo. Los tintes de servicio son la única excepción, porque no cambian.

## Typography

**Display Font:** Archivo (con system-ui, sans-serif)
**Body Font:** Archivo (con system-ui, sans-serif)
**Label/Mono Font:** Archivo Narrow 500/600 (con system-ui, sans-serif)

**Character:** Archivo es un grotesco firme, de cifras claras, que da la seriedad del billete sin ceremonia; Archivo Narrow pone la voz de planilla en encabezados de columna y leyendas.

### Hierarchy
- **Headline** (700, 2rem, 1.2, -0.015em): el h1 de cada página (`PageHeader`) y de los formularios públicos (`AuthCard`). Uno por pantalla.
- **Title** (700, 1.125rem, 1.25, -0.01em): el h2 de cada `Panel`.
- **Body** (400, 1rem, 1.5): texto corriente y la línea de contexto bajo el h1. Párrafos limitados a 32–60ch.
- **Body small** (400, 0.875rem): descripción de panel, textos de estado vacío, leyendas.
- **Button** (600, sin mayúsculas, sin espaciado extra): todos los botones.
- **Label** (Archivo Narrow 600, 0.78rem, 0.06em, MAYÚSCULAS): encabezados de columna de tabla y título de la leyenda de tintes. Color tinta gris.

### Named Rules
**The Cifras en Columna Rule.** Montos y fechas llevan `font-variant-numeric: tabular-nums` (clase `tabular-nums`; los campos numéricos lo heredan solos) y los montos se alinean a la derecha.

**The Rótulo de Planilla Rule.** Las mayúsculas estrechas rotulan columnas y leyendas, nunca un título: no van encima de un h1 o h2 como antetítulo.

## Layout

Área privada: riel lateral fijo de 248px en escritorio (desde `md`, 900px); en mobile el riel se vuelve un cajón temporal que abre el botón de menú, y la marca pasa a la barra superior. Barra superior pegajosa de 64px con el interruptor de modo y el avatar, filete inferior. Contenido con margen de 16px en mobile y 40px en escritorio; 24px/40px de margen vertical.

Las páginas apilan `PageHeader`, avisos y paneles con 32px entre bloques, y fijan un ancho máximo (1200px el inicio, 720px las páginas de formulario). El inicio usa una grilla de una columna que desde `lg` (1200px) pasa a contenido flexible más una columna de 340px para "Este mes", con 24px de separación y paneles de igual alto.

Pantallas públicas: en escritorio, grilla de dos columnas (mín. 360px 5fr / 7fr): a la izquierda el panel de tinta con la marca, la roseta grande y el propósito; a la derecha el formulario centrado sobre el papel, ancho máximo 420px. En mobile solo el formulario, con la marca arriba.

Ritmo en la unidad de 8px de MUI.

## Elevation & Depth

Sistema plano. La profundidad la dan el cambio de papel (fondo → hoja) y el filete, no la sombra: los botones no tienen elevación y los paneles son `Paper` con borde. Solo las capas flotantes (menú del usuario, cajón del riel en mobile, tooltips) conservan la sombra por defecto de MUI, porque flotan de verdad sobre la página.

### Named Rules
**The Filete, no Sombra Rule.** Una superficie en reposo se separa con un filete de 1px en color `filete`, nunca con sombra.

## Shapes

Esquinas suaves y contenidas: 10px en controles (botones, campos, avisos), 14px en paneles, 20px en la píldora de la sección activa del riel y 4px en la franja de tinte. La forma recurrente es el círculo de la roseta frente a la geometría rectangular de paneles y tablas.

## Components

### Buttons
Firmes y planos, en tinta.
- **Shape:** esquina suave (10px), padding horizontal 18px.
- **Primary:** relleno petróleo (verde agua en oscuro) con texto de contraste; uno por formulario o pantalla. En pantallas públicas va en tamaño grande.
- **Outlined:** borde y texto petróleo, para la alternativa (ej. "Continuar con Google").
- **Inherit / small:** acción dentro de un aviso (ej. "Reenviar").
- **Focus:** el anillo de foco global en naranja hornero.

### Cards / Containers (`Panel`)
Cada sección de página es un `Panel`: papel de hoja, filete de 1px, esquina de 14px, padding 20px (mobile) / 24px. Cabecera con título h2 y descripción opcional en body small, acción opcional alineada a la derecha, 20px antes del contenido. Ocupa el alto disponible para alinear paneles vecinos.

### Page Header (`PageHeader`)
El h1 de la página, su línea de contexto en tinta gris y, si existe, la acción principal alineada abajo a la derecha. Toda página privada empieza con uno.

### Inputs / Fields
- **Style:** contorno de MUI, fondo papel de hoja, esquina de 10px, ancho completo por defecto.
- **Focus:** borde y rótulo en naranja hornero.
- **Error:** el rojo de error del modo.

### Navigation
Riel en tinta petróleo (más hondo en oscuro). Ítems con icono contorneado y texto 500; el activo pasa a texto blanco 600, fondo blanco al 10% en píldora de 20px e icono en naranja hornero, con `aria-current="page"`. Sin barras laterales de selección. En mobile el mismo riel vive en un cajón temporal.

### Avisos
`Alert` estándar de MUI con esquina de 10px. En mobile la acción baja debajo del mensaje para que el texto use todo el ancho.

### Franja de tinte y leyenda
La franja es un rectángulo de 6px de ancho y esquina de 4px con el tinte del servicio: 20px de alto en la leyenda, del alto de la fila en tablas. La leyenda ("Color por servicio") lista cada franja con su nombre y acompaña a todo panel que use tintes.

### Tabla de vencimientos
Libro de cuentas: primera columna angosta con la franja de tinte (con encabezado solo para lectores de pantalla), luego Servicio, Vence, Monto (a la derecha, tabular) y Estado. Encabezados en rótulo de planilla, filas separadas por filete. En mobile (por debajo de `sm`, 600px) se ocultan Vence, Monto y Estado y la fila queda en franja + servicio; desde `sm` se ven las cinco columnas y la tabla se desplaza en horizontal dentro del panel si no entra. Debajo, la explicación y enseguida la leyenda de tintes, en el flujo del panel (no anclada al fondo).

### Roseta guilloché (componente firma)
Grabado de dos bandas de hipotrocoides y filetes concéntricos, generado por `scripts/generate-guilloche.mjs` en `public/brand/guilloche.svg` y usado como máscara pintada con un color del tema. Con `value` entre 0 y 1 suma un anillo de progreso (trazo de 6px, extremos redondeados, desde las 12) en el color primario sobre un anillo base al 20%. El arco se dibuja una vez al aparecer (1.1s, `cubic-bezier(0.16, 1, 0.3, 1)`) y no se anima si el usuario pidió movimiento reducido. Tamaños en uso: 34px en la marca, 140px en la página 404, 200px en "Este mes", 300px en el panel de las pantallas públicas. Con `label` se anuncia como imagen; sin él es decorativa.

### Estados vacíos
Sin datos, un componente muestra su estructura real y lo dice: la roseta sin arco con "Sin vencimientos cargados", la tabla con sus columnas y una fila vacía con rayas. El texto explica qué va a aparecer cuando haya datos.

## Do's and Don'ts

### Do:
- **Do** pedir cada color por rol del tema para que funcione en claro y oscuro, y revisar toda pantalla nueva en los dos modos.
- **Do** reservar el naranja hornero para foco, selección, cursor y sección activa.
- **Do** acompañar cada tinte de servicio con su nombre o con la leyenda en el mismo panel.
- **Do** armar cada página con `PageHeader` y secciones `Panel` separadas 32px.
- **Do** usar `tabular-nums` y alineación a la derecha en montos.
- **Do** mostrar estados vacíos con la estructura real y un texto honesto de qué va a aparecer.
- **Do** respetar `prefers-reduced-motion`: el dibujo del arco de la roseta es el único movimiento propio de la app.

### Don't:
- **Don't** anidar un `Panel` dentro de otro; dentro de un panel se ordena con filetes y espacio.
- **Don't** inventar montos, fechas ni filas de ejemplo para llenar un estado vacío.
- **Don't** usar un tinte de servicio como única señal, como color de texto o como fondo de superficie.
- **Don't** usar el acento en botones, títulos o decoración, ni darle a la advertencia el color del acento.
- **Don't** separar superficies en reposo con sombras; se separan con filete.
- **Don't** poner antetítulos en mayúsculas estrechas sobre los títulos.
- **Don't** armar tarjetas de KPI con números grandes sobre fondo blanco: el resumen del mes es la roseta.
