import React from 'react';
import { DirectContactButtons } from './DirectContactButtons';
import { EnquiryForm } from './forms/EnquiryForm';

export function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <span className="eyebrow">Connect With Adviora</span>
          <h2>
            LET’S GET
            <br />
            YOU STARTED.
          </h2>
          <p>
            Tell us what you want to achieve—whether it’s evaluating IT operating maturity, implementing ServiceNow and AI workflows, or developing professional capabilities across your teams.
          </p>

          <DirectContactButtons />

          <div className="contact-list">
            <span>For enterprise &amp; mid-sized organisations</span>
            <span>For IT leadership &amp; transformation teams</span>
            <span>For professionals, freshers &amp; learners</span>
          </div>
        </div>

        <EnquiryForm idPrefix="inline" />
      </div>
    </section>
  );
}
