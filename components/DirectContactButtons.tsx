'use client';

import React from 'react';
import { useEnquiryModal } from './modals/ModalProvider';
import { ADVIORA_CONTACT } from '@/lib/data';

export function DirectContactButtons() {
  const { openChannelModal } = useEnquiryModal();

  return (
    <div className="direct-contact">
      <div className="direct-buttons-row">
        <a href={ADVIORA_CONTACT.phoneHref} className="button phone-button" aria-label={`Call Adviora at ${ADVIORA_CONTACT.phone}`}>
          Call {ADVIORA_CONTACT.phone} ↗
        </a>
        <button
          type="button"
          className="button whatsapp"
          onClick={(e) => openChannelModal('whatsapp', e.currentTarget)}
          aria-label="Chat with Adviora on WhatsApp"
        >
          Chat on WhatsApp ↗
        </button>
        <button
          type="button"
          className="button email-button"
          onClick={(e) => openChannelModal('email', e.currentTarget)}
          aria-label="Email Adviora Consulting"
        >
          Email Adviora ↗
        </button>
      </div>
      <div className="direct-contact-meta">
        <span>
          Phone: <a href={ADVIORA_CONTACT.phoneHref}><strong>{ADVIORA_CONTACT.phone}</strong></a>
        </span>
        <span className="meta-separator">·</span>
        <span>
          Email: <a href={ADVIORA_CONTACT.emailHref}><strong>{ADVIORA_CONTACT.email}</strong></a>
        </span>
        <span className="meta-separator">·</span>
        <span>
          WhatsApp: <a href={ADVIORA_CONTACT.whatsappBaseUrl} target="_blank" rel="noopener noreferrer"><strong>{ADVIORA_CONTACT.whatsappDisplay}</strong></a>
        </span>
      </div>
    </div>
  );
}
