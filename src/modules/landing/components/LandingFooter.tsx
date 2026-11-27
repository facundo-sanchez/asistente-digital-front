import Link from "next/link";
import styles from "../landing.module.css";
import { LINKEDIN_URL } from "../landing-content";

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerInner}`}>
        <span>© 2026 Asistente de Vida Digital · Hecho en Argentina por Facundo Sanchez</span>
        <span style={{ display: "flex", gap: 20 }}>
          <Link href="/login">Ingresar</Link>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </span>
      </div>
    </footer>
  );
}
