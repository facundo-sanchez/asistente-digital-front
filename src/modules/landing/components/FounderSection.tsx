import Image from "next/image";
import LinkedIn from "@mui/icons-material/LinkedIn";
import { withBasePath } from "@/lib/config";
import styles from "../landing.module.css";
import { LINKEDIN_URL } from "../landing-content";

/** Quién hace la app. */
export function FounderSection() {
  return (
    <section id="fundador" className={`${styles.wrap} ${styles.section}`} aria-labelledby="founder-title">
      <div className={styles.founder}>
        <Image
          src={withBasePath("/1692893986525.jpg")}
          alt="Facundo Sanchez"
          width={200}
          height={200}
          className={styles.founderPhoto}
        />
        <div>
          <h2 id="founder-title" className={styles.founderName}>
            Facundo Sanchez
          </h2>
          <p className={styles.founderRole}>Fundador de Asistente de Vida Digital</p>
          <a className={`${styles.btn} ${styles.btnGhost}`} href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <LinkedIn fontSize="small" />
            Ver su LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
