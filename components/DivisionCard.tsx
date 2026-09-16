import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DivisionInfo } from '@/lib/data';

export function DivisionCard({ division }: { division: DivisionInfo }) {
  const isAcademy = division.id === 'academy';

  return (
    <Link
      href={division.route}
      className={`division division-card-link ${isAcademy ? 'academy' : ''}`}
      aria-label={`Visit ${division.title}`}
    >
      <div className="division-photo">
        <Image
          src={division.photo}
          alt={division.photoAlt}
          width={600}
          height={300}
          className="division-photo-img"
        />
        <span className="division-photo-label">{division.photoLabel}</span>
        <span className="division-photo-arrow" aria-hidden="true">
          ↗
        </span>
      </div>

      <div className="division-top">
        <span className="division-emblem" aria-hidden="true">
          {division.emblem}
        </span>
        <span className="division-label">{division.label}</span>
        <span className="number">{division.number}</span>
      </div>

      <h3>{division.title}</h3>
      <p>{division.description}</p>

      <div className="tags">
        {division.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <span className="text-link">
        {division.ctaText} <span aria-hidden="true">↗</span>
      </span>
    </Link>
  );
}
