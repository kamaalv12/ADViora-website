import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { VerticalsGrid } from '@/components/VerticalsGrid';
import { ApproachSection } from '@/components/ApproachSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

export const metadata: Metadata = {
  title: 'ADViora Digital — Technology Consulting, Digital Transformation & Learning',
  description:
    'ADViora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
  openGraph: {
    title: 'ADViora Digital — Technology Consulting, Digital Transformation & Learning',
    description:
      'ADViora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
  },
};

export default function DigitalPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/">
          ← Home
        </Link>
        <span className="eyebrow">Integrated Capabilities</span>
        <h1>ADViora Digital</h1>
        <p>
          We bring together industry experience, proven frameworks, modern technology and practical learning approaches to help organisations translate business challenges into measurable outcomes.
        </p>

        <div className="hero-actions" style={{ marginTop: '24px' }}>
          <Link href="#services" className="button">
            Explore our verticals <span>↗</span>
          </Link>
          <EnquiryTrigger variant="button secondary">
            Discuss your requirements <span>↗</span>
          </EnquiryTrigger>
        </div>

        <figure className="detail-cover">
          <Image
            src="/images/technology.webp"
            alt="Engineers and consultants collaborating on digital architecture"
            width={1200}
            height={380}
            priority
          />
          <figcaption>Consulting · Technology Solutions · Professional Academy · Enterprise Capability</figcaption>
        </figure>
      </section>

      {/* The Four Business Verticals */}
      <VerticalsGrid />

      {/* Approach */}
      <ApproachSection />

      {/* Why Choose ADViora */}
      <WhyChooseUs />

      <ContactSection />
    </>
  );
}
