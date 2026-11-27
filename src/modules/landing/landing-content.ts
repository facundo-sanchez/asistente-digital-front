/** Textos y datos de ejemplo de la presentación. Los importes son inventados y se rotulan como ejemplo. */

export const LINKEDIN_URL = "https://www.linkedin.com/in/facundo-sanchez-647b5a21a/";

/** Un mes de ejemplo: lo pagado después de cada paso de la historia. */
export const SAMPLE_MONTH = { label: "Noviembre", total: "$ 1.005.142" };

export const STEPS = [
  { title: "Llega la factura", text: "Camuzzi te la manda por mail, como siempre." },
  { title: "La IA la lee", text: "Importe, vencimiento y código de pago, solos." },
  { title: "Confirmás", text: "Revisás y se crea el vencimiento con su aviso." },
  { title: "Pagás", text: "Lo registrás y la roseta del mes se completa." },
] as const;

/** Cuánto del mes de ejemplo está pagado al llegar a cada paso. */
export const STORY_PROGRESS = [
  { value: 0.25, paid: "$ 251.300" },
  { value: 0.5, paid: "$ 502.600" },
  { value: 0.75, paid: "$ 753.800" },
  { value: 1, paid: "$ 1.005.142" },
] as const;

/** Lo que ordena la app. El color es el tinte de la categoría y va siempre junto a su nombre. */
export const FEATURES = [
  { name: "Servicios", tint: "#C9772A", text: "Luz, gas, agua, internet y seguros, cada uno con su número de cliente para reconocer sus facturas." },
  { name: "Facturas", tint: "#D3A934", text: "Las cargás vos o llegan solas desde Gmail. La IA lee el importe, el vencimiento y el código de pago." },
  { name: "Vencimientos", tint: "#5D8A57", text: "Ves qué vence esta semana y qué ya venció. Te avisamos antes, en la app y por email." },
  { name: "Pagos", tint: "#8CC5B6", text: "Registrás cada pago con su comprobante. El botón Pagar copia el código y abre tu billetera." },
  { name: "Tarjetas", tint: "#3B6A99", text: "Resúmenes en pesos y en dólares, consumos por rubro, informe por mes y las cuotas que faltan." },
  { name: "Débito automático", tint: "#4F7C74", text: "Marcás qué servicios se debitan solos: el día del vencimiento se registra el pago y la víspera te avisamos." },
  { name: "Préstamos", tint: "#6B5B95", text: "Cargás el comprobante de alta y se arma el cronograma con cada cuota, su interés y el capital que queda. Los avisos del banco las actualizan." },
  { name: "Aumentos", tint: "#C0563B", text: "Si una factura viene bastante más cara que las anteriores, te lo marcamos con el porcentaje." },
  { name: "Documentos", tint: "#B0597C", text: "Pólizas, garantías y comprobantes en un lugar, con aviso cuando están por vencer." },
  { name: "Asistente", tint: "#E9A35E", text: "Le preguntás «¿qué vence esta semana?» y te responde con tus datos y links a cada registro." },
  { name: "En el celular", tint: "#5A6E8C", text: "Se instala como app desde el navegador y te manda los avisos como notificaciones." },
  { name: "Gmail", tint: "#7E8C8A", text: "Conexión de solo lectura: detecta las facturas y resúmenes de tus proveedores y te los deja para revisar." },
] as const;

/** Lo que está planificado y todavía no está en la app. */
export const UPCOMING = [
  { name: "Suscripciones", text: "Detecta en el resumen de la tarjeta lo que se cobra todos los meses y si aumentó." },
  { name: "Outlook", text: "Las facturas que llegan a Outlook o Hotmail, igual que con Gmail." },
  { name: "Calendario", text: "Tus vencimientos en Google Calendar o en el iPhone con un link." },
  { name: "Presupuesto", text: "Un tope por rubro para el mes y aviso cuando te acercás." },
  { name: "Bienes", text: "El auto, la casa y los electrodomésticos con su seguro, VTV, garantía y services." },
  { name: "Resumen anual", text: "Todo lo que pagaste en el año, por servicio y por mes, descargable en Excel." },
  { name: "Hogar compartido", text: "Invitás a quienes viven con vos y ven quién pagó cada cosa." },
  { name: "Seguridad", text: "Verificación en dos pasos y cerrar la sesión en todos tus dispositivos." },
] as const;
