import type { ReactNode } from "react";
import styles from "../landing.module.css";

/**
 * Las pantallas de la app dibujadas para cada paso, con datos de ejemplo.
 * Son ilustraciones: se leen como una imagen con su descripción.
 */
export const STORY_PLATES: { description: string; plate: ReactNode }[] = [
  {
    description: "Ejemplo: un email de Camuzzi con la factura del período 05/26 en la bandeja de entrada.",
    plate: (
      <div className={styles.plate}>
        <div className={styles.mail}>
          <span className={styles.mailAvatar}>C</span>
          <div>
            <div className={styles.plateStrong}>Camuzzi Gas Pampeana</div>
            <div className={styles.mailMeta}>Tu factura del período 05/26 · factura.pdf</div>
          </div>
        </div>
        <div className={styles.chipRow}>
          <span className={styles.chip}>Detectado en tu correo</span>
          <span className={styles.chip}>Gmail · solo lectura</span>
        </div>
      </div>
    ),
  },
  {
    description: "Ejemplo: la IA leyó la factura: Camuzzi, $ 32.100,00, vence el jueves 4/12, con su código de pago.",
    plate: (
      <div className={styles.plate}>
        <div className={styles.plateRow}>
          <span className={styles.plateLabel}>Proveedor</span>
          <span className={styles.plateStrong}>Camuzzi Gas Pampeana</span>
        </div>
        <div className={styles.plateRow}>
          <span className={styles.plateLabel}>Importe</span>
          <span className={`${styles.plateStrong} ${styles.tabular}`}>$ 32.100,00</span>
        </div>
        <div className={styles.plateRow}>
          <span className={styles.plateLabel}>Vence</span>
          <span className={styles.tabular}>jueves 4/12</span>
        </div>
        <div className={styles.plateRow}>
          <span className={styles.plateLabel}>Código de pago</span>
          <span className={styles.tabular}>3000645009210002</span>
        </div>
      </div>
    ),
  },
  {
    description: "Ejemplo: el vencimiento de gas listo para confirmar.",
    plate: (
      <div className={styles.plate}>
        <div className={styles.plateRow}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span className={styles.tint} style={{ background: "#D3A934" }} />
            <span className={styles.plateStrong}>Gas casa · factura 05/26</span>
          </span>
          <span className={`${styles.plateStrong} ${styles.tabular}`}>$ 32.100</span>
        </div>
        <div className={styles.plateRow}>
          <span className={styles.plateLabel}>Te avisamos 3 días antes</span>
          <span className={styles.fakeButton}>Confirmar</span>
        </div>
      </div>
    ),
  },
  {
    description: "Ejemplo: el pago con Mercado Pago quedó registrado y el vencimiento figura como pagado.",
    plate: (
      <div className={styles.plate}>
        <div className={styles.plateRow}>
          <span className={styles.plateLabel}>Código copiado</span>
          <span className={styles.fakeButton}>Pagar con Mercado Pago</span>
        </div>
        <div className={styles.plateRow}>
          <span className={styles.plateStrong}>Gas casa</span>
          <span className={styles.paid}>Pagado · 3/12</span>
        </div>
      </div>
    ),
  },
];
