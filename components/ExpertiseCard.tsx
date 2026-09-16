import React from 'react';
import Link from 'next/link';

interface ExpertiseCardProps {
  prefix: string;
  title: string;
  description: string;
  route: string;
  ctaText?: string;
}

export function ExpertiseCard({
  prefix,
  title,
  description,
  route,
  ctaText = 'View details ↗',
}: ExpertiseCardProps) {
  return (
    <Link href={route} className="expertise-card">
      <span>{prefix}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <strong>{ctaText}</strong>
    </Link>
  );
}
