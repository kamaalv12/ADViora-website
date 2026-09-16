import React from 'react';
import { FAQ_ITEMS } from '@/lib/data';

export function FaqSection() {
  return (
    <section className="section wrap faq">
      <div className="section-intro">
        <span className="eyebrow">A little more clarity</span>
        <h2>Frequently asked questions</h2>
      </div>
      {FAQ_ITEMS.map((item, idx) => (
        <details key={idx}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
