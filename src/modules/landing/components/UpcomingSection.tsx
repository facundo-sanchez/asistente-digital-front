import styles from "../landing.module.css";
import { UPCOMING } from "../landing-content";

/** Lo que viene: la misma planilla, sin tinte porque todavía no existe. */
export function UpcomingSection() {
  return (
    <section id="proximamente" className={`${styles.wrap} ${styles.section}`} aria-labelledby="upcoming-title">
      <h2 id="upcoming-title" className={styles.h2}>
        Lo que viene.
      </h2>
      <p className={styles.sectionLead}>Está planificado y se va sumando a la app.</p>
      <div className={styles.ledger}>
        {UPCOMING.map((item) => (
          <div key={item.name} className={styles.ledgerRow}>
            <span className={`${styles.tint} ${styles.tintPending}`} aria-hidden />
            <h3>{item.name}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
