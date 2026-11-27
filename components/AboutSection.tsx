import React from 'react';

export function AboutSection() {
  return (
    <section className="section wrap about-section" id="about">
      <div className="about-grid">
        <div className="about-main-col">
          <span className="eyebrow">About Adviora</span>
          <h2>
            Translating complex challenges into measurable outcomes.
          </h2>

          <div className="about-text-content">
            <p>
              Adviora is a technology consulting, digital transformation and professional learning organisation focused on helping businesses improve performance, strengthen operational capabilities and prepare for the future.
            </p>
            <p>
              We bring together industry experience, proven frameworks, modern technology and practical learning approaches to help organisations translate business challenges into measurable outcomes.
            </p>
            <p>
              Our capabilities span IT Service Management (ITSM), ITIL, enterprise service management, digital transformation, AI adoption, technology optimisation, governance and international management standards.
            </p>
            <p>
              We work with enterprises, mid-sized organisations, startups and educational institutions to improve processes, modernise technology environments, develop skilled workforces and build sustainable operating models.
            </p>
            <p>
              Our approach combines consulting, assessment, implementation support and capability development. Rather than offering one-size-fits-all solutions, we align our engagements with each organisation’s business objectives, technology landscape and operational priorities.
            </p>
          </div>

          <div className="about-mission-statement">
            <blockquote>
              &ldquo;Our focus is simple: Advancing People, Organisations and Performance.&rdquo;
            </blockquote>
          </div>
        </div>

        <div className="about-sidebar-col">
          <div className="about-card-stat">
            <span className="about-stat-label">Core Capabilities</span>
            <ul className="about-capabilities-pills">
              <li>IT Service Management (ITSM) &amp; ITIL</li>
              <li>Enterprise Service Management</li>
              <li>Digital Transformation &amp; AI Adoption</li>
              <li>Technology Optimisation &amp; Governance</li>
              <li>International Management Standards (ISO)</li>
              <li>Operating Model &amp; Capability Design</li>
            </ul>
          </div>

          <div className="about-brand-box">
            <span className="brand-box-tag">Brand Philosophy</span>
            <h3>Advance · Vision · Aura</h3>
            <p>
              Adviora is conceptually inspired by Advance, Vision and Aura: driving purposeful progress, strategic clarity and enduring excellence across organizations and teams.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
