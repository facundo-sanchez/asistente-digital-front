import styles from "../landing.module.css";
import { FEATURES } from "../landing-content";

/** Lo que ordena la app, como una planilla: cada fila con su tinte, su nombre y qué hace. */
export function FeatureLedger() {
  return (
    <section id="funciones" className={`${styles.wrap} ${styles.section}`} aria-labelledby="features-title">
      <h2 id="features-title" className={styles.h2}>
        Todo lo de la casa, en una planilla.
      </h2>
      <p className={styles.sectionLead}>Cada cosa en su fila, en pesos y en dólares por separado.</p>
      <div className={styles.ledger}>
        {FEATURES.map((feature) => (
          <div key={feature.name} className={styles.ledgerRow}>
            <span className={styles.tint} style={{ background: feature.tint }} aria-hidden />
            <h3>{feature.name}</h3>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
