import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_VERTICALS } from '@/lib/data';
import { DeliveryLevels } from '@/components/DeliveryLevels';
import { TrainingCatalogue } from '@/components/TrainingCatalogue';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

const vertical = BUSINESS_VERTICALS.find((v) => v.id === 'academy-training')!;

export const metadata: Metadata = {
  title: 'Professional Training Catalogue — Professional Academy & Training — Adviora Consulting',
  description:
    'Comprehensive professional training in ITIL, ITSM, ServiceNow, ISO standards, Artificial Intelligence, Agile, DevOps, SRE and modern IT management.',
  openGraph: {
    title: 'Professional Training Catalogue — Professional Academy & Training — Adviora Consulting',
    description:
      'Comprehensive professional training in ITIL, ITSM, ServiceNow, ISO standards, Artificial Intelligence, Agile, DevOps, SRE and modern IT management.',
  },
};

export default function AcademyTrainingPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/">
          ← Home
        </Link>
        <span className="eyebrow">Adviora Consulting · 03</span>
        <h1>Professional Training Catalogue</h1>
        <p>
          Practical, industry-relevant training designed to empower IT professionals, transformation teams and enterprise leaders with modern skills across service management, cloud, AI, governance and operating standards.
        </p>

        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <EnquiryTrigger
            service="Professional training"
            itemContext="Corporate and customised technology training"
          >
            Enquire about corporate training <span>↗</span>
          </EnquiryTrigger>
        </div>

        <figure className="detail-cover">
          <Image
            src="/images/training.webp"
            alt="Professional workshop participants engaged in hands-on IT service management training"
            width={1200}
            height={380}
            priority
          />
          <figcaption>Practical, Scenario-Based Training for Modern Enterprise Teams</figcaption>
        </figure>
      </section>

      {/* High-level vertical capabilities */}
      <section className="section wrap academy-vertical-overview">
        <div className="section-intro">
          <span className="eyebrow">Professional Academy &amp; Training</span>
          <h2>Our Core Learning Pathways</h2>
          <p>
            Curated pathways connecting foundational understanding to advanced practitioner application and external examination readiness.
          </p>
        </div>

        <div className="vertical-services-list" style={{ marginBottom: '48px' }}>
          {vertical.services.map((service, idx) => (
            <article key={idx} className="service-list-item">
              <span className="service-item-number">0{idx + 1}</span>
              <div className="service-item-body">
                <h3>{service}</h3>
                <p>
                  Delivered through real-world exercises, case studies, tool demonstrations and interactive cohort discussions.
                </p>
              </div>
              <div className="service-item-cta">
                <EnquiryTrigger
                  service="Professional training"
                  itemContext={service}
                  variant="button secondary"
                >
                  Enquire <span>↗</span>
                </EnquiryTrigger>
              </div>
            </article>
          ))}
        </div>

        {/* Delivery Levels (Awareness, Practitioner, Certification preparation) */}
        <DeliveryLevels />
      </section>

      {/* Full 6-Category Interactive Catalogue */}
      <section className="section wrap catalogue-section">
        <div className="section-intro">
          <span className="eyebrow">Search &amp; Filter By Discipline</span>
          <h2>Course Directory &amp; Syllabus Topics</h2>
          <p>
            Explore our complete curriculum across all six domains. Search by keyword or filter by discipline to request an engagement outline.
          </p>
        </div>

        <TrainingCatalogue />
      </section>

      {/* Related Verticals */}
      <section className="section wrap related-verticals-section">
        <span className="eyebrow">Explore Further</span>
        <h2>Explore our other business verticals</h2>
        <div className="related-links">
          <Link href="/consulting-advisory">Consulting &amp; Advisory ↗</Link>
          <Link href="/technology-solutions">Technology &amp; Digital Solutions ↗</Link>
          <Link href="/enterprise-solutions">Enterprise Capability Development ↗</Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
