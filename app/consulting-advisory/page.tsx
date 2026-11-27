import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_VERTICALS } from '@/lib/data';
import { ConsultingPackages } from '@/components/ConsultingPackages';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

const vertical = BUSINESS_VERTICALS.find((v) => v.id === 'consulting-advisory')!;

export const metadata: Metadata = {
  title: 'Consulting & Advisory — Adviora Consulting',
  description:
    'ITSM, ITIL, ISO, transformation and governance consulting to strengthen IT operating models and service performance.',
  openGraph: {
    title: 'Consulting & Advisory — Adviora Consulting',
    description:
      'ITSM, ITIL, ISO, transformation and governance consulting to strengthen IT operating models and service performance.',
  },
};

export default function ConsultingAdvisoryPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/">
          ← Home
        </Link>
        <span className="eyebrow">Adviora Consulting · 01</span>
        <h1>Consulting &amp; Advisory</h1>
        <p>
          We partner with enterprises, mid-sized organisations and public institutions to evaluate maturity, design modern IT operating models, optimise ITSM processes and embed international standards.
        </p>

        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <EnquiryTrigger
            service="Business transformation"
            itemContext="Consulting & Advisory"
          >
            Discuss consulting requirements <span>↗</span>
          </EnquiryTrigger>
        </div>

        <figure className="detail-cover">
          <Image
            src="/images/consulting.webp"
            alt="Consulting team evaluating operating model and IT service management strategy"
            width={1200}
            height={380}
            priority
          />
          <figcaption>IT Operating Models, ITSM Maturity, Governance &amp; Continual Improvement</figcaption>
        </figure>
      </section>

      {/* Complete List of 9 Consulting & Advisory Services */}
      <section className="section detail-page-body">
        <div className="wrap">
          <div className="section-intro">
            <span className="eyebrow">Advisory Services</span>
            <h2>Comprehensive Consulting Capabilities</h2>
            <p>
              Practitioner-led engagements tailored to align IT service delivery with strategic organizational priorities and measurable service outcomes.
            </p>
          </div>

          <div className="vertical-services-list">
            {vertical.services.map((service, idx) => (
              <article key={idx} className="service-list-item">
                <span className="service-item-number">0{idx + 1}</span>
                <div className="service-item-body">
                  <h3>{service}</h3>
                  <p>
                    Targeted assessment, gap analysis and actionable roadmaps to elevate operational maturity, improve governance and reduce operational risk.
                  </p>
                </div>
                <div className="service-item-cta">
                  <EnquiryTrigger
                    service="Business transformation"
                    itemContext={service}
                    variant="button secondary"
                  >
                    Enquire <span>↗</span>
                  </EnquiryTrigger>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Other Consulting Engagements We Offer (All 7 Packages) */}
      <ConsultingPackages showHeading={true} />

      {/* Related Verticals */}
      <section className="section wrap related-verticals-section">
        <span className="eyebrow">Explore Further</span>
        <h2>Explore our other business verticals</h2>
        <div className="related-links">
          <Link href="/technology-solutions">Technology &amp; Digital Solutions ↗</Link>
          <Link href="/academy-training">Professional Academy &amp; Training ↗</Link>
          <Link href="/enterprise-solutions">Enterprise Capability Development ↗</Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
