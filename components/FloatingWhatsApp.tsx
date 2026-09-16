'use client';

import React from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

export function FloatingWhatsApp() {
  const { openChannelModal } = useEnquiryModal();

  return (
    <button
      type="button"
      className="floating-whatsapp"
      onClick={() => openChannelModal('whatsapp')}
      aria-label="Contact ADViora on WhatsApp"
    >
      <span aria-hidden="true">◉</span> <span>WhatsApp</span>
    </button>
  );
}
