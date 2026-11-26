import React from 'react';
import Link from 'next/link';
import { CONSULTING_PACKAGES } from '@/lib/data';
import { EnquiryTrigger } from './EnquiryTrigger';

interface ConsultingPackagesProps {
  showHeading?: boolean;
  limit?: number;
  showViewAll?: boolean;
}

export function ConsultingPackages({
  showHeading = true,
  limit,
  showViewAll = false,
}: ConsultingPackagesProps) {
  const packages = limit ? CONSULTING_PACKAGES.slice(0, limit) : CONSULTING_PACKAGES;

  return (
    <section className="section wrap consulting-packages-section" id="engagements">
      {showHeading && (
        <div className="section-intro">
          <span className="eyebrow">Structured Engagements</span>
          <h2>Other consulting engagements we offer</h2>
          <p>
            Well-defined consulting interventions, maturity benchmarks and targeted operational roadmaps designed for rapid clarity and measurable outcomes.
          </p>
        </div>
      )}

      <div className="consulting-packages-grid">
        {packages.map((pkg, idx) => (
          <article key={pkg.title} className="consulting-package-card">
            <div className="package-card-header">
              <span className="package-number">0{idx + 1}</span>
              <span className="package-type-tag">Consulting Package</span>
            </div>
            <h3 className="package-title">{pkg.title}</h3>
            <div className="package-deliverables">
              <span className="deliverable-label">Deliverables:</span>
              <p className="deliverable-text">{pkg.deliverables}</p>
            </div>
            <div className="package-action">
              <EnquiryTrigger
                service="Business transformation"
                itemContext={pkg.title}
                variant="button secondary"
                className="package-enquiry-btn"
              >
                Enquire about this engagement <span>↗</span>
              </EnquiryTrigger>
            </div>
          </article>
        ))}
      </div>

      {showViewAll && (
        <div className="packages-view-all">
          <Link href="/consulting-advisory#engagements" className="button">
            View all 7 consulting packages <span>↗</span>
          </Link>
        </div>
      )}
    </section>
  );
}
