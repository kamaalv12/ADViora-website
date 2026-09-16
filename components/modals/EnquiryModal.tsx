'use client';

import React, { useEffect, useRef } from 'react';
import { useEnquiryModal } from './ModalProvider';
import { EnquiryForm } from '@/components/forms/EnquiryForm';

export function EnquiryModal() {
  const { isEnquiryOpen, closeEnquiryModal, triggerElement } = useEnquiryModal();
  const modalCardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isEnquiryOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the name input inside modal
    const timer = setTimeout(() => {
      const nameInput = document.getElementById('modal-name');
      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus({ preventScroll: true });
      }
    }, 30);

    const getFocusable = (): HTMLElement[] => {
      if (!modalCardRef.current) return [];
      const focusableElements = modalCardRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(focusableElements).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.tabIndex !== -1
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeEnquiryModal();
        return;
      }

      if (e.key === 'Tab') {
        const visibleFocusable = getFocusable();
        if (visibleFocusable.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = visibleFocusable[0];
        const lastElement = visibleFocusable[visibleFocusable.length - 1];

        if (!modalCardRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          if (e.shiftKey) {
            lastElement.focus();
          } else {
            firstElement.focus();
          }
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (!modalCardRef.current) return;
      if (e.target && !modalCardRef.current.contains(e.target as Node)) {
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

      // Restore focus to trigger button
      if (triggerElement && triggerElement.isConnected) {
        setTimeout(() => {
          if (triggerElement.isConnected) {
            triggerElement.focus({ preventScroll: true });
          }
        }, 10);
      }
    };
  }, [isEnquiryOpen, closeEnquiryModal, triggerElement]);

  if (!isEnquiryOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEnquiryModal();
      }}
      role="presentation"
    >
      <div
        ref={modalCardRef}
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        aria-describedby="enquiry-modal-description"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          onClick={closeEnquiryModal}
          aria-label="Close enquiry form"
        >
          ×
        </button>

        <div className="enquiry-heading">
          <span className="eyebrow">Let’s move forward</span>
          <h2 id="enquiry-modal-title">Your next step starts here.</h2>
          <p id="enquiry-modal-description">
            Tell us about your goals. Explore business, technology, training or sports with ADViora.
          </p>
        </div>

        <EnquiryForm idPrefix="modal" isModal={true} />
      </div>
    </div>
  );
}
