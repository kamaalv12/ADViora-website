import React from 'react';
import { APPROACH_STEPS } from '@/lib/data';

export function ApproachSection() {
  return (
    <section className="section approach-section" id="approach">
      <div className="wrap">
        <div className="section-intro">
          <span className="eyebrow">Our Approach</span>
          <h2>From business challenge to measurable outcomes</h2>
          <p>
            A disciplined, practitioner-guided framework designed to translate organizational ambitions into resilient, sustainable operations.
          </p>
        </div>

        <div className="approach-grid" role="list" aria-label="Our four-step engagement approach">
          {APPROACH_STEPS.map((step, idx) => (
            <article key={step.step} className="approach-card" role="listitem">
              <div className="approach-card-header">
                <span className="approach-step-num">{step.step}</span>
                {idx < APPROACH_STEPS.length - 1 && (
                  <span className="approach-connector-arrow" aria-hidden="true">→</span>
                )}
              </div>
              <h3 className="approach-title">{step.title}</h3>
              <p className="approach-desc">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
