'use client';

import React, { useState } from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

const SERVICE_MAPPING: Record<string, string> = {
  'Business transformation': 'Business transformation',
  'ITSM / AI / digital transformation': 'ITSM / AI / digital transformation',
  'Professional training': 'Professional training',
};

export function BookingPanel() {
  const [selectedOption, setSelectedOption] = useState('Business transformation');
  const { openEnquiryModal } = useEnquiryModal();

  const handleEnquire = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const mappedInterest = SERVICE_MAPPING[selectedOption] || 'Business transformation';
    openEnquiryModal(mappedInterest, e.currentTarget);
  };

  return (
    <div className="booking-panel">
      <label htmlFor="booking-service">What would you like to discuss?</label>
      <select
        id="booking-service"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="Business transformation">Business transformation</option>
        <option value="ITSM / AI / digital transformation">ITSM / AI / digital transformation</option>
        <option value="Professional training">Professional training</option>
      </select>

      <div className="booking-summary">
        <span>Schedule &amp; location</span>
        <strong>Tailored to engagement</strong>
        <span>Engagement scope</span>
        <strong>Discussed on enquiry</strong>
      </div>

      <div className="booking-actions">
        <button type="button" className="button" id="booking-enquire" onClick={handleEnquire}>
          Enquire about this service ↗
        </button>
      </div>
    </div>
  );
}
