"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../landing.module.css";
import { STEPS, STORY_PROGRESS } from "../landing-content";
import { MonthRosette } from "./MonthRosette";
import { STORY_PLATES } from "./StoryPlates";

/** Cómo funciona: la roseta queda fija y se completa con cada paso que pasa por el centro de la pantalla. */
export function MonthStory() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      // El paso cuenta cuando cruza la franja del medio de la pantalla
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((step) => step && observer.observe(step));
    return () => observer.disconnect();
  }, []);

  const progress = STORY_PROGRESS[active];

  return (
    <section id="como-funciona" className={`${styles.wrap} ${styles.section}`} aria-labelledby="story-title">
      <h2 id="story-title" className={styles.h2}>
        Así se completa un mes.
      </h2>
      <p className={styles.sectionLead}>Una factura de gas, de punta a punta. Los datos son de ejemplo.</p>
      <div className={styles.story}>
        <div className={styles.storyAside}>
          <MonthRosette value={progress.value} paid={progress.paid} className={styles.storyRosette} />
          <span className={styles.sample} aria-live="polite">
            Paso {active + 1} de {STEPS.length} · {STEPS[active].title}
          </span>
        </div>
        <ol className={styles.storySteps}>
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              ref={(el) => {
                steps.current[i] = el;
              }}
              data-index={i}
              data-active={i === active}
              className={styles.storyStep}
            >
              <h3>
                <span className={styles.stepNumber}>{i + 1}</span>
                {step.title}
              </h3>
              <p>{step.text}</p>
              <figure role="img" aria-label={STORY_PLATES[i].description} style={{ margin: 0 }}>
                <div aria-hidden>{STORY_PLATES[i].plate}</div>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
