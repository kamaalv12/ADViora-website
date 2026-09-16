'use client';

import React, { ReactNode } from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

interface ChannelTriggerProps {
  children: ReactNode;
  channel: 'whatsapp' | 'email';
  className?: string;
  'aria-label'?: string;
}

export function ChannelTrigger({
  children,
  channel,
  className,
  'aria-label': label,
}: ChannelTriggerProps) {
  const { openChannelModal } = useEnquiryModal();

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-haspopup="dialog"
      onClick={(e) => openChannelModal(channel, e.currentTarget)}
    >
      {children}
    </button>
  );
}

export default ChannelTrigger;
