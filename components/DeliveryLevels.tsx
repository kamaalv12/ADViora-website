import React from 'react';
import { DELIVERY_LEVELS } from '@/lib/data';

export function DeliveryLevels() {
  const levelIcons: Record<string, string> = {
    Awareness: '💡',
    Practitioner: '🛠️',
    'Certification preparation': '🎓',
  };

  return (
    <div className="delivery-levels-block">
      <div className="delivery-levels-intro">
        <span className="eyebrow">Learning Architecture</span>
        <h3>Three Structured Delivery Tiers</h3>
        <p>
          We offer courses across three distinct commercial delivery levels to align with participant roles, practical expectations and organizational objectives.
        </p>
      </div>

      <div className="delivery-levels-grid">
        {DELIVERY_LEVELS.map((item) => (
          <article key={item.level} className="delivery-level-card">
            <div className="delivery-level-header">
              <span className="delivery-level-icon" aria-hidden="true">
                {levelIcons[item.level] || '📘'}
              </span>
              <span className="delivery-level-badge">{item.level}</span>
            </div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      <p className="delivery-levels-footnote">
        * Note: Certification preparation provides structured training and readiness aligned to externally administered examination syllabuses.
      </p>
    </div>
  );
}
