import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ExpertiseCard } from '@/components/ExpertiseCard';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

export const metadata: Metadata = {
  title: 'ADViora Digital — Business Transformation, Technology & AI',
  description:
    'Align people, processes and technology to help your organization navigate change and build lasting capability.',
  openGraph: {
    title: 'ADViora Digital — Business Transformation, Technology & AI',
    description:
      'Align people, processes and technology to help your organization navigate change and build lasting capability.',
  },
};

export default function DigitalPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/#divisions">
          ← Our divisions
        </Link>
        <span className="eyebrow">Business transformation, technology and training</span>
        <h1>ADViora Digital</h1>
        <p>
          Align people, processes and technology to help your organization navigate change and build
          lasting capability.
        </p>
        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <EnquiryTrigger service="Business transformation">Discuss your goals ↗</EnquiryTrigger>
        </div>
        <div className="division-page-photo">
          <Image
            src="/images/technology.webp"
            alt="A laptop displaying software code"
            width={1200}
            height={320}
            priority
          />
        </div>
      </section>

      <section className="section wrap">
        <div className="section-intro">
          <span className="eyebrow">Our areas of focus</span>
          <h2>Explore ADViora Digital</h2>
        </div>
        <div className="division-services">
          <ExpertiseCard
            prefix="01 / ADViora Digital"
            title="Business transformation"
            description="Connect business priorities with people, processes and practical plans for change."
            route="/business-transformation"
          />
          <ExpertiseCard
            prefix="02 / ADViora Digital"
            title="ITSM, AI & digital transformation"
            description="Explore service management, automation opportunities and digital ways of working."
            route="/technology-digital"
          />
          <ExpertiseCard
            prefix="03 / ADViora Digital"
            title="Technology & professional training"
            description="Build the knowledge and confidence your team needs to apply new skills."
            route="/professional-training"
          />
        </div>
      </section>

      <ContactSection />
    </>
  );
}
