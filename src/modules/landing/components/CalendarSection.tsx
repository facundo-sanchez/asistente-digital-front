import styles from "../landing.module.css";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Diciembre de ejemplo: empieza el martes; los vencimientos son inventados. */
const EVENTS: Record<number, { title: string; color: string }[]> = {
  1: [{ title: "Internet · $ 18.900", color: "#7E8C8A" }],
  4: [{ title: "Gas · $ 32.100", color: "#D3A934" }],
  7: [{ title: "Préstamo · cuota 11", color: "#6B5B95" }],
  10: [
    { title: "Alquiler · $ 515.000", color: "#C9772A" },
    { title: "Luz · $ 41.380", color: "#D3A934" },
  ],
  15: [{ title: "Visa · $ 386.240", color: "#3B6A99" }],
  22: [{ title: "Seguro auto · $ 33.200", color: "#B0597C" }],
};
const FIRST_WEEKDAY = 2;
const DAYS = 31;
const TODAY = 3;

/** Los vencimientos en el calendario de siempre: cómo se ve y cómo se agrega el link. */
export function CalendarSection() {
  const cells = Array.from({ length: 35 }, (_, i) => i - FIRST_WEEKDAY + 1);
  return (
    <section id="calendario" className={`${styles.wrap} ${styles.section}`} aria-labelledby="calendar-title">
      <div className={styles.split}>
        <div>
          <h2 id="calendar-title" className={styles.h2}>
            Tus vencimientos, en tu calendario.
          </h2>
          <p className={styles.sectionLead}>
            Cada vencimiento sin pagar aparece en Google Calendar o en el iPhone, con su importe y un link para pagarlo. Cuando lo pagás, desaparece solo.
          </p>
          <ol className={styles.calendarSteps}>
            <li>
              <span>
                En <strong>Mi perfil → Calendario</strong>, copiá tu link privado.
              </span>
            </li>
            <li>
              <span>
                Pegalo en <strong>Google Calendar</strong> (Desde URL) o en el <strong>iPhone</strong> (Calendario suscrito).
              </span>
            </li>
            <li>
              <span>Listo: el calendario se actualiza solo cada vez que cargás o pagás algo.</span>
            </li>
          </ol>
        </div>
        <figure
          role="img"
          aria-label="Ejemplo: diciembre en el calendario con internet el 1, gas el 4, la cuota del préstamo el 7, alquiler y luz el 10, la Visa el 15 y el seguro del auto el 22."
          style={{ margin: 0 }}
        >
          <div className={styles.month} aria-hidden>
            <div className={styles.monthHead}>
              <span className={styles.monthTitle}>Diciembre</span>
              <span className={styles.sample}>Ejemplo</span>
            </div>
            <div className={styles.monthGrid}>
              {WEEKDAYS.map((d) => (
                <span key={d} className={styles.weekday}>
                  {d}
                </span>
              ))}
              {cells.map((day, i) => {
                const inMonth = day >= 1 && day <= DAYS;
                const shown = inMonth ? day : day < 1 ? 30 + day : day - DAYS;
                return (
                  <span key={i} className={`${inMonth ? "" : styles.outside} ${day === TODAY ? styles.today : ""}`}>
                    <span className={styles.dayNumber}>{shown}</span>
                    {inMonth &&
                      EVENTS[day]?.map((e) => (
                        <span key={e.title} className={styles.event} style={{ ["--event" as string]: e.color }}>
                          {e.title}
                        </span>
                      ))}
                  </span>
                );
              })}
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
