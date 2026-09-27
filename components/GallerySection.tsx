'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { GALLERY_IMAGES, GalleryItem } from '@/lib/galleryData';

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const isLightboxOpen = selectedIndex !== null;
  const currentItem: GalleryItem | null =
    selectedIndex !== null ? GALLERY_IMAGES[selectedIndex] : null;

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = useCallback(() => {
    const prevIndex = selectedIndex;
    setSelectedIndex(null);
    if (prevIndex !== null && triggerRefs.current[prevIndex]) {
      setTimeout(() => {
        triggerRefs.current[prevIndex]?.focus({ preventScroll: true });
      }, 10);
    }
  }, [selectedIndex]);

  const showPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : GALLERY_IMAGES.length - 1));
  }, [selectedIndex]);

  const showNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < GALLERY_IMAGES.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex]);

  // Keyboard navigation & scroll lock
  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto focus close button or lightbox
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 40);

    const getFocusable = (): HTMLElement[] => {
      if (!modalRef.current) return [];
      const elements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(elements).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (GALLERY_IMAGES.length > 1) showPrevious();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (GALLERY_IMAGES.length > 1) showNext();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (!modalRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          if (e.shiftKey) {
            lastEl.focus();
          } else {
            firstEl.focus();
          }
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (!modalRef.current) return;
      if (e.target && !modalRef.current.contains(e.target as Node)) {
        const focusable = getFocusable();
        if (focusable.length > 0) {
          focusable[0].focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [isLightboxOpen, closeLightbox, showPrevious, showNext]);

  // If no images exist, keep section completely hidden from public rendering
  if (GALLERY_IMAGES.length === 0) {
    return null;
  }

  return (
    <section className="section gallery-section" id="gallery">
      <div className="wrap">
        <div className="section-intro">
          <span className="eyebrow">Moments & Milestones</span>
          <h2>Our Gallery</h2>
          <p>Highlights from our sessions, engagements and achievements.</p>
        </div>

        <div className="gallery-grid">
          {GALLERY_IMAGES.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              type="button"
              className="gallery-card"
              onClick={() => openLightbox(index)}
              aria-haspopup="dialog"
              aria-label={`View image: ${item.caption} (${index + 1} of ${GALLERY_IMAGES.length})`}
            >
              <div className="gallery-thumbnail">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="gallery-img"
                />
                <span className="gallery-overlay" aria-hidden="true">
                  <span className="gallery-expand-icon">⤢</span>
                </span>
              </div>
              <span className="gallery-card-caption">{item.caption}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {isLightboxOpen && currentItem && (
        <div
          className="modal-overlay gallery-lightbox-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          role="presentation"
        >
          <div
            ref={modalRef}
            className="gallery-lightbox-card"
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery photo: ${currentItem.caption}`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="modal-close gallery-close-btn"
              onClick={closeLightbox}
              aria-label="Close gallery lightbox"
            >
              ×
            </button>

            {GALLERY_IMAGES.length > 1 && (
              <button
                type="button"
                className="gallery-nav-btn prev"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            <div className="gallery-lightbox-view">
              <div className="gallery-lightbox-img-wrapper">
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt}
                  width={currentItem.width}
                  height={currentItem.height}
                  className="gallery-lightbox-img"
                  priority
                />
              </div>
              <div className="gallery-lightbox-meta">
                <p className="gallery-lightbox-caption">{currentItem.caption}</p>
                <span className="gallery-lightbox-counter">
                  {selectedIndex + 1} of {GALLERY_IMAGES.length}
                </span>
              </div>
            </div>

            {GALLERY_IMAGES.length > 1 && (
              <button
                type="button"
                className="gallery-nav-btn next"
                onClick={showNext}
                aria-label="Next image"
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
