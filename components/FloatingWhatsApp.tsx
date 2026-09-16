'use client';

import React from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

export function FloatingWhatsApp() {
  const { openChannelModal } = useEnquiryModal();

  return (
    <button
      type="button"
      className="floating-whatsapp"
      onClick={(e) => openChannelModal('whatsapp', e.currentTarget)}
      aria-label="Contact ADViora on WhatsApp"
      aria-haspopup="dialog"
    >
      <span aria-hidden="true">◉</span> <span>WhatsApp</span>
    </button>
  );
}
