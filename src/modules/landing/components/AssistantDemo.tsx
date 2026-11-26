import styles from "../landing.module.css";

/** El asistente respondiendo una pregunta, con datos de ejemplo. */
export function AssistantDemo() {
  return (
    <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="assistant-title">
      <div className={styles.split}>
        <div>
          <h2 id="assistant-title" className={styles.h2}>
            Preguntale a tu cuenta.
          </h2>
          <p className={styles.sectionLead}>
            El asistente responde con tus vencimientos, facturas, gastos y documentos, y te deja el link a cada uno. Solo consulta: no cambia nada sin vos.
          </p>
        </div>
        <figure role="img" aria-label="Ejemplo: le preguntan qué vence esta semana y responde con tres vencimientos y su total." style={{ margin: 0 }}>
          <div className={styles.chat} aria-hidden>
            <span className={styles.sample}>Ejemplo</span>
            <div className={styles.question}>¿Qué vence esta semana?</div>
            <div className={styles.answer}>
              Esta semana vencen 3 cosas, <strong className={styles.tabular}>$ 84.200</strong> en total:
              <ul className={styles.tabular}>
                <li>Gas casa, $ 32.100, jueves 4/12</li>
                <li>Internet, $ 18.900, viernes 5/12</li>
                <li>Seguro del auto, $ 33.200, sábado 6/12</li>
              </ul>
              <div className={styles.chipRow}>
                <span className={styles.chip}>Factura gas</span>
                <span className={styles.chip}>Factura internet</span>
                <span className={styles.chip}>Seguro del auto</span>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
