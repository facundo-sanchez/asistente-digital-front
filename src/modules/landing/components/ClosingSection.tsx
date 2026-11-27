import styles from "../landing.module.css";
import { MonthRosette } from "./MonthRosette";
import { PrimaryActions } from "./PrimaryActions";

/** El cierre: el mes completo y la acción. */
export function ClosingSection({ signedIn }: { signedIn: boolean }) {
  return (
    <section className={`${styles.wrap} ${styles.closing}`} aria-labelledby="closing-title">
      <div>
        <h2 id="closing-title" className={styles.h2}>
          Empezá este mes con todo en orden.
        </h2>
        <p className={styles.sectionLead} style={{ marginBottom: 32 }}>
          Creás tu cuenta con tu email o con Google, cargás tus servicios y listo.
        </p>
        <PrimaryActions signedIn={signedIn} />
      </div>
      <MonthRosette value={1} paid="$ 1.005.142" className={styles.closingRosette} />
    </section>
  );
}
