import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_VERTICALS } from '@/lib/data';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

const vertical = BUSINESS_VERTICALS.find((v) => v.id === 'enterprise-solutions')!;

export const metadata: Metadata = {
  title: 'Enterprise Capability Development — Enterprise Solutions — ADViora Consulting',
  description:
    'Workforce upskilling, leadership development, fresh-graduate employability training and change management to build sustainable enterprise capability.',
  openGraph: {
    title: 'Enterprise Capability Development — Enterprise Solutions — ADViora Consulting',
    description:
      'Workforce upskilling, leadership development, fresh-graduate employability training and change management to build sustainable enterprise capability.',
  },
};

export default function EnterpriseSolutionsPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/">
          ← Home
        </Link>
        <span className="eyebrow">ADViora Consulting · 04</span>
        <h1>Enterprise Capability Development</h1>
        <p>
          We help organisations build sustainable human and operational capabilities through targeted workforce upskilling, IT leadership programmes, graduate readiness and organisational change enablement.
        </p>

        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <EnquiryTrigger
            service="Professional training"
            itemContext="Enterprise Capability Development"
          >
            Discuss enterprise solutions <span>↗</span>
          </EnquiryTrigger>
        </div>

        <figure className="detail-cover">
          <Image
            src="/images/consulting.webp"
            alt="Enterprise leaders in an operational excellence and capability alignment session"
            width={1200}
            height={380}
            priority
          />
          <figcaption>Workforce Upskilling, Leadership Development &amp; Organisational Readiness</figcaption>
        </figure>
      </section>

      <section className="section detail-page-body">
        <div className="wrap">
          <div className="section-intro">
            <span className="eyebrow">Capability Development Offerings</span>
            <h2>Our Enterprise Capability Solutions</h2>
            <p>
              Customised capability programmes designed around your organisation&apos;s actual operational priorities, team structures and talent development roadmaps.
            </p>
          </div>

          <div className="vertical-services-list">
            {vertical.services.map((service, idx) => (
              <article key={idx} className="service-list-item">
                <span className="service-item-number">0{idx + 1}</span>
                <div className="service-item-body">
                  <h3>{service}</h3>
                  <p>
                    Practical workshops, competency roadmaps and structured mentoring to foster an outcome-driven service mindset and prepare teams for modern digital execution.
                  </p>
                </div>
                <div className="service-item-cta">
                  <EnquiryTrigger
                    service={
                      service.toLowerCase().includes('change') || service.toLowerCase().includes('excellence')
                        ? 'Business transformation'
                        : 'Professional training'
                    }
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
          <Link href="/technology-solutions">Technology &amp; Digital Solutions ↗</Link>
          <Link href="/academy-training">Professional Academy &amp; Training ↗</Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
