import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DivisionInfo } from '@/lib/data';

export function DivisionCard({ division }: { division: DivisionInfo }) {
  return (
    <Link
      href={division.route}
      className="division division-card-link division-showcase-card"
      aria-label={`Explore ${division.title}`}
    >
      <div className="division-content">
        <div className="division-top division-badge-row">
          <span className="division-emblem" aria-hidden="true">
            {division.emblem}
          </span>
          <span className="division-label division-badge-text">{division.label}</span>
          {division.number ? <span className="number">{division.number}</span> : null}
        </div>

        <h3 className="division-title">{division.title}</h3>
        <p className="division-desc">{division.description}</p>

        {division.highlights && (
          <ul className="division-highlights">
            {division.highlights.map((item, idx) => (
              <li key={idx}>
                <span className="division-check" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="tags division-tags">
          {division.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <span className="division-cta-btn">
          {division.ctaText} <span className="arrow-icon" aria-hidden="true">↗</span>
        </span>
      </div>

      <div className="division-photo division-visual">
        <Image
          src={division.photo}
          alt={division.photoAlt}
          fill
          sizes="(max-width: 860px) 100vw, 550px"
          className="division-photo-img division-visual-img"
        />
        <span className="division-photo-label">{division.photoLabel}</span>
        <span className="division-photo-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </Link>
  );
}
