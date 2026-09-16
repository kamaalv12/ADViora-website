'use client';

import React from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

interface EnquiryTriggerProps {
  service?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: 'button' | 'button secondary' | 'text-link' | 'raw';
  ariaLabel?: string;
}

export function EnquiryTrigger({
  service,
  className = '',
  children,
  variant = 'button',
  ariaLabel,
}: EnquiryTriggerProps) {
  const { openEnquiryModal, setTriggerElement } = useEnquiryModal();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openEnquiryModal(service, e.currentTarget);
  };

  const baseClass =
    variant === 'button'
      ? 'button'
      : variant === 'button secondary'
      ? 'button secondary'
      : variant === 'text-link'
      ? 'text-link'
      : '';

  const combinedClassName = `${baseClass} ${className}`.trim();

  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={handleClick}
      aria-haspopup="dialog"
      aria-label={ariaLabel}
    >
      {children || (
        <>
          Let’s talk <span>↗</span>
        </>
      )}
    </button>
  );
}
