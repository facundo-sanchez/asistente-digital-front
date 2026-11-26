import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import styles from "../landing.module.css";
import { SAMPLE_MONTH } from "../landing-content";

/** La roseta guilloché con el mes de ejemplo: el arco es lo pagado. */
export function MonthRosette({ value, paid, className }: { value: number; paid: string; className?: string }) {
  return (
    <div className={`${styles.rosette} ${className ?? ""}`}>
      <GuillocheRosette value={value} size="100%" lineColor="var(--engrave)" arcColor="var(--mint)" />
      <div className={styles.rosetteCenter} aria-hidden>
        <span className={styles.rosetteMonth}>{SAMPLE_MONTH.label}</span>
        <strong className={`${styles.rosetteAmount} ${styles.tabular}`}>{paid}</strong>
        <span className={`${styles.rosetteOf} ${styles.tabular}`}>pagado de {SAMPLE_MONTH.total}</span>
      </div>
      <span className={styles.srOnly}>
        Ejemplo: {paid} pagado de {SAMPLE_MONTH.total} en {SAMPLE_MONTH.label}
      </span>
    </div>
  );
}
