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
            Tell us what you want to achieve—whether it’s transforming your organization, developing your
            team or exploring sports.
          </p>

          <DirectContactButtons />

          <div className="contact-list">
            <span>For businesses &amp; professional teams</span>
            <span>For schools &amp; community partners</span>
            <span>For athletes, learners &amp; parents</span>
          </div>
        </div>

        <EnquiryForm idPrefix="inline" />
      </div>
    </section>
  );
}
