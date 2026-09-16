'use client';

import React, { useEffect, useRef } from 'react';
import { useEnquiryModal } from './ModalProvider';

export function ChannelModal() {
  const { channelModal, closeChannelModal } = useEnquiryModal();
  const cardRef = useRef<HTMLDivElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!channelModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      doneButtonRef.current?.focus({ preventScroll: true });
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeChannelModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [channelModal, closeChannelModal]);

  if (!channelModal) return null;

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
          type="button"
          className="modal-close"
          onClick={closeChannelModal}
          aria-label="Close dialog"
        >
          ×
        </button>

        <span className="eyebrow">ADViora · Connection preview</span>
        <h2 id="channel-dialog-title">{channelModal.title}</h2>
        <p id="channel-dialog-desc">{channelModal.description}</p>

        <button
          ref={doneButtonRef}
          type="button"
          className="button"
          onClick={closeChannelModal}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
