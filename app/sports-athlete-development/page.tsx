import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SERVICES_DATA } from '@/lib/data';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

const service = SERVICES_DATA['sports-athlete-development'];

export const metadata: Metadata = {
  title: 'Sports & Athlete Development — ADViora Consulting',
  description: service.description,
  openGraph: {
    title: 'Sports & Athlete Development — ADViora Consulting',
    description: service.description,
  },
};

export default function SportsAthleteDevelopmentPage() {
  return (
    <>
      <section className="wrap detail-hero">
        <Link className="breadcrumb" href="/#divisions">
          ← All services &amp; programmes
        </Link>
        <span className="eyebrow">{service.eyebrow}</span>
        <h1>{service.title}</h1>
        <p>{service.description}</p>
        <figure className="detail-cover">
          <Image
            src={service.coverImage}
            alt={service.coverAlt}
            width={1200}
            height={380}
            priority
          />
          <figcaption>{service.caption}</figcaption>
        </figure>
      </section>

      <section className="section service-descriptions detail-page-body">
        <div className="wrap">
          <article className="service-detail" id="sports-description">
            <div>
              <span className="eyebrow">{service.badge}</span>
              <h2>{service.title}</h2>
            </div>
            <div>
              <p>{service.description}</p>
              <ul>
                {service.bulletPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <EnquiryTrigger service={service.servicePrefill} variant="text-link">
                {service.ctaText} ↗
              </EnquiryTrigger>
              {service.note && <p className="detail-note">{service.note}</p>}
            </div>
          </article>
        </div>
      </section>

      <section className="section wrap">
        <span className="eyebrow">Explore further</span>
        <h2>Other services &amp; programmes</h2>
        <div className="related-links">
          <Link href="/business-transformation">Business transformation ↗</Link>
          <Link href="/technology-digital">Technology &amp; digital transformation ↗</Link>
          <Link href="/professional-training">Professional training &amp; development ↗</Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
