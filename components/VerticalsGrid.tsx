import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BUSINESS_VERTICALS } from '@/lib/data';

export function VerticalsGrid() {
  return (
    <section className="section wrap verticals-section" id="services">
      <div className="section-intro">
        <span className="eyebrow">Core Capabilities</span>
        <h2>Our Four Business Verticals</h2>
        <p>
          We unite strategic consulting, modern technology solutions, professional training and enterprise capability development under one roof.
        </p>
      </div>

      <div className="verticals-grid">
        {BUSINESS_VERTICALS.map((vertical) => (
          <article key={vertical.id} className="vertical-card">
            <div className="vertical-card-media">
              <Image
                src={vertical.photo}
                alt={vertical.photoAlt}
                width={600}
                height={340}
                className="vertical-card-img"
              />
              <span className="vertical-emblem-badge" aria-hidden="true">
                {vertical.emblem}
              </span>
            </div>

            <div className="vertical-card-body">
              <div className="vertical-meta">
                <span className="vertical-number">{vertical.number}</span>
                <span className="vertical-tag">{vertical.navLabel}</span>
              </div>

              <h3 className="vertical-title">{vertical.title}</h3>
              <p className="vertical-summary">{vertical.summary}</p>

              <ul className="vertical-capabilities-list">
                {vertical.services.slice(0, 4).map((item, idx) => (
                  <li key={idx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="vertical-card-footer">
                <Link href={vertical.route} className="button secondary">
                  Explore {vertical.navLabel} <span>↗</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
