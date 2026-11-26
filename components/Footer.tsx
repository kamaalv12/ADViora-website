import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ADVIORA_CONTACT } from '@/lib/data';

export function Footer() {
  return (
    <footer>
      <div className="wrap footer-top">
        <div className="footer-brand-col">
          <Link href="/" className="brand-link" aria-label="ADViora Consulting home">
            <Image
              src="/images/adviora-logo.webp"
              alt="ADViora Consulting"
              width={802}
              height={185}
              className="brand-logo-img"
            />
          </Link>
          <p className="footer-tagline">
            Transforming Businesses. Empowering People. Enabling Technology.
          </p>
          <div className="footer-contact-info">
            <a href={ADVIORA_CONTACT.phoneHref} className="footer-contact-link">
              <span>📞</span> {ADVIORA_CONTACT.phone}
            </a>
            <a href={ADVIORA_CONTACT.emailHref} className="footer-contact-link">
              <span>✉️</span> {ADVIORA_CONTACT.email}
            </a>
            <a
              href={ADVIORA_CONTACT.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-contact-link"
            >
              <span>💬</span> WhatsApp: {ADVIORA_CONTACT.whatsappDisplay}
            </a>
          </div>
        </div>

        <div className="footer-nav-groups">
          <div className="footer-group">
            <span className="footer-group-title">Offerings</span>
            <div className="footer-links">
              <Link href="/consulting-advisory">Consulting &amp; Advisory</Link>
              <Link href="/technology-solutions">Technology Solutions</Link>
              <Link href="/academy-training">Academy &amp; Training</Link>
              <Link href="/enterprise-solutions">Enterprise Solutions</Link>
            </div>
          </div>

          <div className="footer-group">
            <span className="footer-group-title">Company &amp; Connect</span>
            <div className="footer-links">
              <Link href="/digital">ADViora Digital Overview</Link>
              <Link href="/#about">About ADViora</Link>
              <Link href="/#approach">Our Approach</Link>
              <Link href="/#engagements">Consulting Packages</Link>
              <Link href="/#contact">Get in Touch</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© 2026 ADViora Consulting. All rights reserved.</span>
        <span>Advancing People, Organisations and Performance.</span>
      </div>
    </footer>
  );
}
