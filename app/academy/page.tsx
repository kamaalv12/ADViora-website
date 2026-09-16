import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ExpertiseCard } from '@/components/ExpertiseCard';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

export const metadata: Metadata = {
  title: 'ADViora Academy — Sports, Athlete Development & Professional Training',
  description:
    'Bring learning into action. Explore development pathways for individuals, teams, schools and communities.',
  openGraph: {
    title: 'ADViora Academy — Sports, Athlete Development & Professional Training',
    description:
      'Bring learning into action. Explore development pathways for individuals, teams, schools and communities.',
  },
};

export default function AcademyPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/#divisions">
          ← Our divisions
        </Link>
        <span className="eyebrow">Sports, athlete development and professional training</span>
        <h1>ADViora Academy</h1>
        <p>
          Bring learning into action. Explore development pathways for individuals, teams, schools and
          communities.
        </p>
        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <EnquiryTrigger service="Professional training">Discuss your goals ↗</EnquiryTrigger>
        </div>
        <div className="division-page-photo">
          <Image
            src="/images/training.webp"
            alt="Participants attending a professional learning workshop"
            width={1200}
            height={320}
            priority
          />
        </div>
      </section>

      <section className="section wrap">
        <div className="section-intro">
          <span className="eyebrow">Our areas of focus</span>
          <h2>Explore ADViora Academy</h2>
        </div>
        <div className="division-services">
          <ExpertiseCard
            prefix="01 / ADViora Academy"
            title="Sports programmes"
            description="Explore coaching, participation and school or community sports programmes."
            route="/sports-athlete-development"
          />
          <ExpertiseCard
            prefix="02 / ADViora Academy"
            title="Athlete development"
            description="Discuss a structured approach to building sporting skills and confidence."
            route="/sports-athlete-development"
          />
          <ExpertiseCard
            prefix="03 / ADViora Academy"
            title="Professional training"
            description="Develop practical knowledge and professional capability for the next step."
            route="/professional-training"
          />
        </div>
      </section>

      <ContactSection />
    </>
  );
}
