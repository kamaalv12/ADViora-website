import React from 'react';
import { DirectContactButtons } from './DirectContactButtons';
import { EnquiryForm } from './forms/EnquiryForm';

export function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <span className="eyebrow">Let’s move forward, together</span>
          <h2>
            LET’S GET
            <br />
            YOU STARTED.
          </h2>
          <p>
            Tell us what you want to achieve—whether it’s transforming your organization, improving
            technology services or developing your team.
          </p>

          <DirectContactButtons />

          <div className="contact-list">
            <span>For businesses and organizations</span>
            <span>For IT and transformation teams</span>
            <span>For professionals and team leaders</span>
          </div>
        </div>

        <EnquiryForm idPrefix="inline" />
      </div>
    </section>
  );
}
