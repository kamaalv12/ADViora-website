'use client';

import React from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

export function DirectContactButtons() {
  const { openChannelModal } = useEnquiryModal();

  return (
    <div className="direct-contact">
      <button
        type="button"
        className="button whatsapp"
        onClick={() => openChannelModal('whatsapp')}
      >
        Chat on WhatsApp ↗
      </button>
      <button
        type="button"
        className="button email-button"
        onClick={() => openChannelModal('email')}
      >
        Email ADViora ↗
      </button>
      <small>Contact links await ADViora’s number and email.</small>
    </div>
  );
}
