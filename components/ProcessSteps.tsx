import React from 'react';
import { PROCESS_STEPS } from '@/lib/data';

export function ProcessSteps() {
  return (
    <section className="section process">
      <div className="wrap">
        <div className="section-intro">
          <span className="eyebrow">A clear path forward</span>
          <h2>Big ambitions. Practical steps.</h2>
        </div>
        <div className="steps">
          {PROCESS_STEPS.map((step) => (
            <article key={step.step} className="step">
              <span className="step-no">{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
