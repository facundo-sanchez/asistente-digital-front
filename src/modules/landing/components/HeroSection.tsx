import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import styles from "../landing.module.css";
import { STEPS } from "../landing-content";
import { PrimaryActions } from "./PrimaryActions";

/** Primera pantalla: qué es, la acción y la roseta (decorativa); abajo, los cuatro pasos. */
export function HeroSection({ signedIn }: { signedIn: boolean }) {
  return (
    <section className={styles.wrap} aria-labelledby="hero-title">
      <div className={styles.hero}>
        <div>
          <h1 id="hero-title" className={styles.title}>
            Tu mes,
            <br />
            pagado <em>a tiempo</em>.
          </h1>
          <p className={styles.lead}>
            Servicios, facturas, vencimientos y tarjetas en un solo lugar. La IA lee lo que te llega por mail y vos solo confirmás.
          </p>
          <PrimaryActions signedIn={signedIn} secondary={{ href: "#como-funciona", label: "Ver cómo funciona" }} />
        </div>
        <div className={`${styles.rosette} ${styles.heroRosette}`}>
          <GuillocheRosette value={0.68} size="100%" lineColor="#2A4A52" arcColor="#8CC5B6" />
        </div>
      </div>
      <ol className={styles.stepRule}>
        {STEPS.map((step, i) => (
          <li key={step.title}>
            <b>
              <span className={styles.stepNumber}>{i + 1}</span>
              {step.title}
            </b>
            {step.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
