import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SERVICES_DATA } from '@/lib/data';
import { ContactSection } from '@/components/ContactSection';
import { EnquiryTrigger } from '@/components/EnquiryTrigger';

const service = SERVICES_DATA['business-transformation'];

export const metadata: Metadata = {
  title: 'Business Transformation — ADViora Consulting',
  description: service.description,
  openGraph: {
    title: 'Business Transformation — ADViora Consulting',
    description: service.description,
  },
};

export default function BusinessTransformationPage() {
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
          <article className="service-detail" id="business-description">
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
            </div>
          </article>
        </div>
      </section>

      <section className="section wrap">
        <span className="eyebrow">Explore further</span>
        <h2>Other services &amp; programmes</h2>
        <div className="related-links">
          <Link href="/technology-digital">Technology &amp; digital transformation ↗</Link>
          <Link href="/professional-training">Professional training &amp; development ↗</Link>
          <Link href="/sports-athlete-development">Sports &amp; athlete development ↗</Link>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
