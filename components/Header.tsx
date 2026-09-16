'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEnquiryModal } from './modals/ModalProvider';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openEnquiryModal, setTriggerElement } = useEnquiryModal();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    closeMenu();
    openEnquiryModal(undefined, e.currentTarget);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <header>
      <div className="wrap header-inner">
        <Link href="/" className="brand-link" aria-label="ADViora Consulting home" onClick={closeMenu}>
          <Image
            src="/images/adviora-logo.webp"
            alt="ADViora Consulting"
            width={802}
            height={185}
            priority
            className="brand-logo-img"
          />
        </Link>

        <button
          ref={menuButtonRef}
          className="menu"
          aria-expanded={isMenuOpen}
          aria-controls="navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={toggleMenu}
        >
          {isMenuOpen ? 'Close ✕' : 'Menu ☰'}
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`} id="navigation" aria-label="Main navigation">
          <Link href="/#divisions" onClick={closeMenu}>
            Our divisions
          </Link>
          <Link href="/#about" onClick={closeMenu}>
            Our story
          </Link>
          <Link href="/#booking" onClick={closeMenu}>
            Engagements
          </Link>
          <button
            ref={ctaButtonRef}
            type="button"
            className="button"
            onClick={handleCtaClick}
            aria-haspopup="dialog"
          >
            Let’s talk <span>↗</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
