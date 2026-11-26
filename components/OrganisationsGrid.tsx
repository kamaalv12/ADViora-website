import React from 'react';
import Image from 'next/image';
import { CLIENT_LOGOS } from '@/lib/data';

export function OrganisationsGrid() {
  return (
    <section className="section wrap organisations-section" id="organisations">
      <div className="section-intro">
        <span className="eyebrow">Track Record &amp; Trust</span>
        <h2>Organisations We’ve Worked With</h2>
        <p>
          We bring proven experience across global enterprises, multinational technology companies, financial institutions and public sector organisations.
        </p>
      </div>

      <div className="client-logos-grid" role="list" aria-label="Organisations we have worked with">
        {CLIENT_LOGOS.map((client) => (
          <div key={client.name} className="client-logo-card" role="listitem">
            <div className="client-logo-wrapper">
              <Image
                src={client.src}
                alt={client.alt}
                width={client.width}
                height={client.height}
                className="client-logo-img"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <span className="client-logo-caption">{client.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
