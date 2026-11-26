import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_VERTICALS } from '@/lib/data';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

const vertical = BUSINESS_VERTICALS.find((v) => v.id === 'technology-solutions')!;

export const metadata: Metadata = {
  title: 'Technology & Digital Solutions — ADViora Consulting',
  description:
    'AI, ServiceNow, automation, cloud and SRE solutions designed to modernise IT environments and accelerate digital execution.',
  openGraph: {
    title: 'Technology & Digital Solutions — ADViora Consulting',
    description:
      'AI, ServiceNow, automation, cloud and SRE solutions designed to modernise IT environments and accelerate digital execution.',
  },
};

export default function TechnologySolutionsPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/">
          ← Home
        </Link>
        <span className="eyebrow">ADViora Consulting · 02</span>
        <h1>Technology &amp; Digital Solutions</h1>
        <p>
          We deliver modern technology strategy, artificial intelligence enablement, ServiceNow optimisation and cloud automation to transform enterprise IT service management and operations.
        </p>

        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <EnquiryTrigger
            service="ITSM / AI / digital transformation"
            itemContext="Technology & Digital Solutions"
          >
            Discuss technology solutions <span>↗</span>
          </EnquiryTrigger>
        </div>

        <figure className="detail-cover">
          <Image
            src="/images/technology.webp"
            alt="Engineers collaborating on enterprise technology and automation systems"
            width={1200}
            height={380}
            priority
          />
          <figcaption>Artificial Intelligence, ServiceNow, Automation &amp; Cloud Transformation</figcaption>
        </figure>
      </section>

      <section className="section detail-page-body">
        <div className="wrap">
          <div className="section-intro">
            <span className="eyebrow">Enterprise Capabilities</span>
            <h2>Our Technology &amp; Digital Solutions</h2>
            <p>
              Pragmatic, scalable technology interventions designed to streamline complex digital workflows, reduce toil and harness artificial intelligence.
            </p>
          </div>

          <div className="vertical-services-list">
            {vertical.services.map((service, idx) => (
              <article key={idx} className="service-list-item">
                <span className="service-item-number">0{idx + 1}</span>
                <div className="service-item-body">
                  <h3>{service}</h3>
                  <p>
                    Strategic implementation and architecture support to modernise systems, improve platform reliability and unlock predictive operational intelligence.
                  </p>
                </div>
                <div className="service-item-cta">
                  <EnquiryTrigger
                    service="ITSM / AI / digital transformation"
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

      <section className="section wrap related-verticals-section">
        <span className="eyebrow">Explore Further</span>
        <h2>Explore our other business verticals</h2>
        <div className="related-links">
          <Link href="/consulting-advisory">Consulting &amp; Advisory ↗</Link>
          <Link href="/academy-training">Professional Academy &amp; Training ↗</Link>
          <Link href="/enterprise-solutions">Enterprise Capability Development ↗</Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
