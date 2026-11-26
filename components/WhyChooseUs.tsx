import React from 'react';
import { WHY_CHOOSE_ADVIORA } from '@/lib/data';

export function WhyChooseUs() {
  return (
    <section className="section wrap why-choose-section" id="why-choose">
      <div className="section-intro">
        <span className="eyebrow">Our Distinct Advantage</span>
        <h2>Why choose ADViora?</h2>
        <p>
          We combine seasoned enterprise practitioner experience with practical execution frameworks to deliver lasting business value.
        </p>
      </div>

      <div className="why-choose-grid">
        {WHY_CHOOSE_ADVIORA.map((item) => (
          <article key={item.title} className="why-choose-card">
            <span className="why-choose-icon" aria-hidden="true">
              {item.icon}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
