import React from 'react';
import { BRAND_MEANINGS } from '@/lib/data';

export function BrandMeaning() {
  return (
    <section className="section wrap story" id="about">
      <div>
        <span className="eyebrow">The meaning behind ADViora</span>
        <h2>
          A name with
          <br />
          forward momentum.
        </h2>
        <blockquote>
          “Advancing People,
          <br />
          Organizations &amp;
          <br />
          Performance.”
        </blockquote>
        <p>
          ADViora is a coined name inspired conceptually by Advance, Vision and Aura. It is a brand
          meaning, not an acronym—a shared belief in progress, strategic thinking and excellence.
        </p>
      </div>
      <div className="meaning">
        {BRAND_MEANINGS.map((item) => (
          <div key={item.word} className="meaning-item">
            <strong>{item.word}</strong>
            <p>
              {item.subtitle}
              <br />
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
