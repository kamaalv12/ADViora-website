'use client';

import React from 'react';
import { useEnquiryModal } from './modals/ModalProvider';
import { ADVIORA_CONTACT } from '@/lib/data';

export function DirectContactButtons() {
  const { openChannelModal } = useEnquiryModal();

  return (
    <div className="direct-contact">
      <button
        type="button"
        className="button whatsapp"
        onClick={(e) => openChannelModal('whatsapp', e.currentTarget)}
      >
        Chat on WhatsApp ↗
      </button>
      <button
        type="button"
        className="button email-button"
        onClick={(e) => openChannelModal('email', e.currentTarget)}
      >
        Email ADViora ↗
      </button>
      <small>WhatsApp: {ADVIORA_CONTACT.whatsappDisplay} · Email: {ADVIORA_CONTACT.email}</small>
    </div>
  );
}
