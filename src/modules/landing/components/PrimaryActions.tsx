import Link from "next/link";
import styles from "../landing.module.css";

/** Crear cuenta (o volver a la cuenta con sesión) y la acción secundaria. */
export function PrimaryActions({ signedIn, secondary }: { signedIn: boolean; secondary?: { href: string; label: string } }) {
  return (
    <div className={styles.actions}>
      <Link className={`${styles.btn} ${styles.btnPrimary}`} href={signedIn ? "/dashboard" : "/register"}>
        {signedIn ? "Ir a mi cuenta" : "Crear cuenta gratis"}
      </Link>
      {secondary && (
        <a className={`${styles.btn} ${styles.btnGhost}`} href={secondary.href}>
          {secondary.label}
        </a>
      )}
    </div>
  );
}
