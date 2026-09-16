'use client';

import React, { useEffect, useRef } from 'react';
import { useEnquiryModal } from './ModalProvider';
import { getWhatsAppUrl, getEmailUrl } from '@/lib/data';

export function ChannelModal() {
  const { channelModal, closeChannelModal, triggerElement } = useEnquiryModal();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const actionButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!channelModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus action button on mount
    const timer = setTimeout(() => {
      if (actionButtonRef.current) {
        actionButtonRef.current.focus({ preventScroll: true });
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus({ preventScroll: true });
      }
    }, 30);

    const getFocusable = (): HTMLElement[] => {
      if (!cardRef.current) return [];
      const focusableElements = cardRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(focusableElements).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true' && el.tabIndex !== -1
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChannelModal();
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

        if (!cardRef.current?.contains(document.activeElement)) {
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
      if (!cardRef.current) return;
      if (e.target && !cardRef.current.contains(e.target as Node)) {
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

      // Restore focus to original triggering button
      if (triggerElement && triggerElement.isConnected) {
        setTimeout(() => {
          if (triggerElement.isConnected) {
            triggerElement.focus({ preventScroll: true });
          }
        }, 10);
      }
    };
  }, [channelModal, closeChannelModal, triggerElement]);

  if (!channelModal) return null;

  const isWhatsApp = channelModal.channel === 'whatsapp';
  const actionHref = isWhatsApp ? getWhatsAppUrl() : getEmailUrl();
  const actionLabel = isWhatsApp ? 'Open WhatsApp ↗' : 'Open Email App ↗';

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeChannelModal();
      }}
      role="presentation"
    >
      <div
        ref={cardRef}
        className="modal-card channel-dialog-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="channel-dialog-title"
        aria-describedby="channel-dialog-desc"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          onClick={closeChannelModal}
          aria-label="Close connection preview dialog"
        >
          ×
        </button>

        <span className="eyebrow">ADViora · Direct contact</span>
        <h2 id="channel-dialog-title">{channelModal.title}</h2>
        <p id="channel-dialog-desc">{channelModal.description}</p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
          <a
            ref={actionButtonRef}
            href={actionHref}
            target={isWhatsApp ? '_blank' : undefined}
            rel={isWhatsApp ? 'noopener noreferrer' : undefined}
            className="button"
            onClick={closeChannelModal}
          >
            {actionLabel}
          </a>
          <button
            type="button"
            className="button secondary"
            onClick={closeChannelModal}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
