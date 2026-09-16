import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer>
      <div className="wrap footer-top">
        <Link href="/" className="brand-link" aria-label="ADViora Consulting home">
          <Image
            src="/images/adviora-logo.webp"
            alt="ADViora Consulting"
            width={802}
            height={185}
            className="brand-logo-img"
          />
        </Link>
        <div className="footer-links">
          <Link href="/digital">ADViora Digital</Link>
          <Link href="/academy">ADViora Academy</Link>
          <Link href="/#about">Our story</Link>
          <Link href="/#contact">Get in touch</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 ADViora Consulting.</span>
        <span>Turning Potential into Performance.</span>
        <span>
          Photography:{' '}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
            Unsplash
          </a>
        </span>
      </div>
      <div className="preview-label">
        Design preview · Final logo, programme availability and contact details await confirmation.
      </div>
    </footer>
  );
}
