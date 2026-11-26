import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { AboutSection } from '@/components/AboutSection';
import { VerticalsGrid } from '@/components/VerticalsGrid';
import { ApproachSection } from '@/components/ApproachSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { DeliveryLevels } from '@/components/DeliveryLevels';
import { ConsultingPackages } from '@/components/ConsultingPackages';
import { OrganisationsGrid } from '@/components/OrganisationsGrid';
import { ContactSection } from '@/components/ContactSection';
import { FaqSection } from '@/components/FaqSection';
import { GallerySection } from '@/components/GallerySection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

export const metadata: Metadata = {
  title: 'ADViora Consulting — Transforming Businesses. Empowering People. Enabling Technology.',
  description:
    'ADViora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
  openGraph: {
    title: 'ADViora Consulting — Transforming Businesses. Empowering People. Enabling Technology.',
    description:
      'ADViora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
    url: 'https://www.advioraconsulting.com/',
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <section className="consulting-hero wrap" id="hero">
        <div className="hero-content">
          <span className="eyebrow">ADViora Consulting · ADViora Digital</span>
          <h1 className="hero-headline">
            Transforming Businesses.
            <br />
            Empowering People.
            <br />
            Enabling Technology.
          </h1>
          <p className="hero-lead">
            ADViora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.
          </p>

          <div className="hero-themes" aria-label="Core operational themes">
            <span className="theme-tag">IT Transformation</span>
            <span className="theme-divider">·</span>
            <span className="theme-tag">AI &amp; Digital Solutions</span>
            <span className="theme-divider">·</span>
            <span className="theme-tag">Enterprise Training</span>
          </div>

          <div className="hero-actions">
            <Link href="#services" className="button">
              Explore our services <span>↗</span>
            </Link>
            <EnquiryTrigger variant="button secondary">
              Discuss your requirements <span>↗</span>
            </EnquiryTrigger>
          </div>
        </div>

        <div className="consulting-visual">
          <Image
            src="/images/consulting.webp"
            alt="A professional team collaborating on IT transformation and strategy"
            width={800}
            height={500}
            priority
            className="hero-visual-img"
          />
          <div className="visual-pills">
            <span>Consulting</span>
            <span>Technology</span>
            <span>Academy</span>
          </div>
          <div className="visual-caption">
            <span>Advancing People, Organisations and Performance</span>
            <strong>
              From business challenge
              <br />
              to measurable outcomes.
            </strong>
          </div>
        </div>
      </section>

      {/* 2. Quick Bar */}
      <div className="quick-bar">
        <div className="wrap quick-inner">
          <div>
            <strong>Advancing People, Organisations and Performance.</strong>
            <span>Consulting · Technology Solutions · Professional Academy · Enterprise Capability</span>
          </div>
          <Link href="/digital">ADViora Digital Overview ↗</Link>
        </div>
      </div>

      {/* 3. About ADViora */}
      <AboutSection />

      {/* 4. Four Business Verticals */}
      <VerticalsGrid />

      {/* 5. Our Approach: Assess -> Design -> Implement -> Optimise */}
      <ApproachSection />

      {/* 6. Why Choose ADViora (6 selling points) */}
      <WhyChooseUs />

      {/* 7. Professional Training Catalogue Preview & Delivery Levels */}
      <section className="section wrap training-preview-section" id="academy-preview">
        <div className="section-intro">
          <span className="eyebrow">Professional Academy &amp; Training</span>
          <h2>Industry-relevant learning and professional certification pathways</h2>
          <p>
            Upskill teams in ITIL, ITSM, ServiceNow, ISO standards, Artificial Intelligence, Agile, DevOps, SRE and modern IT management.
          </p>
        </div>

        <DeliveryLevels />

        <div className="training-cta-banner">
          <div className="training-cta-text">
            <h3>Explore the Professional Training Catalogue</h3>
            <p>
              Browse 60+ curated topics across 6 categories, with flexible delivery onsite, virtually or in hybrid cohorts.
            </p>
          </div>
          <div className="training-cta-actions">
            <Link href="/academy-training" className="button">
              View full training catalogue <span>↗</span>
            </Link>
            <EnquiryTrigger
              service="Professional training"
              itemContext="Corporate and customised technology training"
              variant="button secondary"
            >
              Discuss corporate training <span>↗</span>
            </EnquiryTrigger>
          </div>
        </div>
      </section>

      {/* 8. Consulting Engagements Preview */}
      <ConsultingPackages showHeading={true} limit={4} showViewAll={true} />

      {/* 9. Organisations We’ve Worked With */}
      <OrganisationsGrid />

      {/* 10. Contact / Enquiry Section */}
      <ContactSection />

      {/* 11. FAQ Section */}
      <FaqSection />

      {/* 12. Gallery Section */}
      <GallerySection />
    </>
  );
}
