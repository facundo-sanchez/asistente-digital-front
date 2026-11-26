import Link from "next/link";
import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import { ColorModeToggle } from "@/components/theme/ColorModeToggle";
import styles from "../landing.module.css";

/** Barra de la presentación. Con sesión, la acción es volver a la cuenta. */
export function LandingNav({ signedIn }: { signedIn: boolean }) {
  return (
    <header className={styles.nav}>
      <nav className={`${styles.wrap} ${styles.navInner}`} aria-label="Principal">
        <Link href="/" className={styles.brand}>
          <GuillocheRosette value={null} size={34} lineColor="var(--mint)" />
          <span>
            Asistente de
            <br />
            Vida Digital
          </span>
        </Link>
        <div className={styles.navLinks}>
          <span className={styles.navSections}>
            <a className={styles.navLink} href="#como-funciona">Cómo funciona</a>
            <a className={styles.navLink} href="#funciones">Funciones</a>
            <a className={styles.navLink} href="#fundador">Fundador</a>
          </span>
          <ColorModeToggle />
          {signedIn ? (
            <Link className={`${styles.btn} ${styles.btnSmall} ${styles.btnLight}`} href="/dashboard">
              Ir a mi cuenta
            </Link>
          ) : (
            <>
              <Link className={styles.navLink} href="/login">Ingresar</Link>
              <Link className={`${styles.btn} ${styles.btnSmall} ${styles.btnLight}`} href="/register">
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
