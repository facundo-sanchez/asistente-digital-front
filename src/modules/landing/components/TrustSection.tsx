import LockOutlined from "@mui/icons-material/LockOutlined";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import styles from "../landing.module.css";

/** Por qué se puede confiar: lo que la app hace y lo que no hace con tus datos. */
export function TrustSection() {
  return (
    <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="trust-title">
      <h2 id="trust-title" className={styles.h2}>
        Vos confirmás, siempre.
      </h2>
      <dl className={styles.trust}>
        <div>
          <dt>
            <MarkEmailReadOutlined fontSize="small" /> Gmail en solo lectura
          </dt>
          <dd>Solo busca las facturas y resúmenes de tus proveedores. No envía ni borra nada, y lo desconectás cuando quieras.</dd>
        </div>
        <div>
          <dt>
            <TaskAltOutlined fontSize="small" /> Nada sin tu confirmación
          </dt>
          <dd>Lo que lee la IA queda para revisar. Recién cuando confirmás se crea la factura y su vencimiento.</dd>
        </div>
        <div>
          <dt>
            <LockOutlined fontSize="small" /> Accesos cifrados
          </dt>
          <dd>Las credenciales de Gmail se guardan cifradas y tu sesión vive en una cookie que el navegador no expone.</dd>
        </div>
      </dl>
    </section>
  );
}
