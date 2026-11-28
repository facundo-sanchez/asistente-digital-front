import type { ReactNode } from "react";
import styles from "../landing.module.css";

type Example = { description: string; plate: ReactNode };

/** Una fila de la lámina: rótulo a la izquierda, valor a la derecha. */
function Row({ label, value, strong, tabular }: { label: ReactNode; value: ReactNode; strong?: boolean; tabular?: boolean }) {
  return (
    <div className={styles.plateRow}>
      <span className={styles.plateLabel}>{label}</span>
      <span className={`${strong ? styles.plateStrong : ""} ${tabular ? styles.tabular : ""}`}>{value}</span>
    </div>
  );
}

/**
 * Un ejemplo chico de cada función, con datos inventados, dibujado como la pantalla real.
 * Se leen como una imagen con su descripción (la planilla muestra el texto al lado).
 */
export const FEATURE_EXAMPLES: Record<string, Example> = {
  Servicios: {
    description: "Ejemplo: el servicio de gas, Camuzzi, con su número de cliente.",
    plate: (
      <>
        <Row label="Gas casa" value="Camuzzi" strong />
        <Row label="N.º de cliente" value="9100 4471 22" tabular />
      </>
    ),
  },
  Facturas: {
    description: "Ejemplo: la IA leyó una factura de luz de $ 41.380 que vence el 12/12.",
    plate: (
      <>
        <Row label="Luz · Edenor" value="$ 41.380,00" strong tabular />
        <Row label={<span className={styles.chip}>Leída con IA</span>} value="vence 12/12" tabular />
      </>
    ),
  },
  Vencimientos: {
    description: "Ejemplo: internet vence en 2 días y el seguro ya venció.",
    plate: (
      <>
        <Row label="Internet" value={<span className={styles.tabular}>en 2 días · $ 18.900</span>} />
        <Row label="Seguro del auto" value={<span className={styles.overdue}>Vencido</span>} />
      </>
    ),
  },
  Pagos: {
    description: "Ejemplo: el gas se pagó con Mercado Pago el 3/12 y tiene su comprobante.",
    plate: (
      <>
        <Row label="Gas casa" value={<span className={styles.paid}>Pagado · 3/12</span>} />
        <Row label="Mercado Pago" value="comprobante.pdf" />
      </>
    ),
  },
  Tarjetas: {
    description: "Ejemplo: el resumen de la Visa de noviembre, en pesos y en dólares.",
    plate: (
      <>
        <Row label="Visa · noviembre" value="$ 386.240,10" strong tabular />
        <Row label="En dólares" value="US$ 42,99" tabular />
      </>
    ),
  },
  "Débito automático": {
    description: "Ejemplo: el agua se debita sola mañana de la cuenta del banco.",
    plate: (
      <>
        <Row label="Agua · AySA" value={<span className={styles.chip}>Se debita sola</span>} />
        <Row label="Mañana" value="$ 12.600" tabular />
      </>
    ),
  },
  Préstamos: {
    description: "Ejemplo: un préstamo con 10 de 30 cuotas pagas, la próxima de $ 576.333 y $ 5,2 millones de capital adeudado.",
    plate: (
      <>
        <Row label="Cuota 11 de 30" value="$ 576.333,79" strong tabular />
        <div className={styles.meter} aria-hidden>
          <span style={{ width: "33%" }} />
        </div>
        <Row label="Saldo de capital" value="$ 5.218.904,12" tabular />
      </>
    ),
  },
  Aumentos: {
    description: "Ejemplo: la factura de gas vino 38 % más cara que el promedio de las anteriores.",
    plate: (
      <>
        <Row label="Gas · factura 11/26" value="$ 44.300" strong tabular />
        <Row label="Contra tus últimas 3" value={<span className={styles.warn}>+38 %</span>} tabular />
      </>
    ),
  },
  Suscripciones: {
    description: "Ejemplo: Netflix y Spotify en la tarjeta suman $ 21.400 por mes; Netflix subió 25 %.",
    plate: (
      <>
        <Row label="NETFLIX.COM" value={<span className={styles.tabular}>$ 12.400 <span className={styles.warn}>+25 %</span></span>} />
        <Row label="SPOTIFY" value="$ 9.000" tabular />
        <Row label="Por mes" value="$ 21.400" strong tabular />
      </>
    ),
  },
  Calendario: {
    description: "Ejemplo: el link privado del calendario, listo para copiar.",
    plate: (
      <>
        <Row label={<span className={styles.mono}>…/calendar/k3P9…xQ.ics</span>} value={<span className={styles.fakeButtonSmall}>Copiar link</span>} />
        <Row label="Google Calendar · iPhone" value="se actualiza solo" />
      </>
    ),
  },
  Documentos: {
    description: "Ejemplo: la póliza del auto vence en 12 días.",
    plate: (
      <>
        <Row label="Póliza auto.pdf" value={<span className={styles.warn}>vence en 12 días</span>} />
        <Row label="Garantía heladera" value="hasta 3/2028" tabular />
      </>
    ),
  },
  Asistente: {
    description: "Ejemplo: le preguntan cuánto pagan de luz por mes.",
    plate: (
      <>
        <div className={styles.questionSmall}>¿Cuánto pago de luz por mes?</div>
        <Row label="En promedio" value="$ 38.900" strong tabular />
      </>
    ),
  },
  "En el celular": {
    description: "Ejemplo: una notificación en el celular avisa que el gas vence mañana.",
    plate: (
      <div className={styles.notice}>
        <span className={styles.mailAvatar}>A</span>
        <div>
          <div className={styles.plateStrong}>Vence mañana: Gas casa</div>
          <div className={styles.mailMeta}>$ 32.100 · tocá para pagarlo</div>
        </div>
      </div>
    ),
  },
  Gmail: {
    description: "Ejemplo: se detectaron 2 facturas nuevas en el correo, para revisar.",
    plate: (
      <>
        <Row label="Detectado en tu correo" value="2 facturas" strong />
        <Row label="Camuzzi · Personal" value={<span className={styles.fakeButtonSmall}>Revisar</span>} />
      </>
    ),
  },
};
