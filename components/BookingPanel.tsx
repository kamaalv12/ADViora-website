'use client';

import React, { useState } from 'react';
import { useEnquiryModal } from './modals/ModalProvider';

const SERVICE_MAPPING: Record<string, string> = {
  'Digital consulting': 'Business transformation',
  'Professional training': 'Professional training',
  'School programme': 'School & community programmes',
  'Sports coaching': 'Sports & athlete development',
  'Athlete development': 'Sports & athlete development',
};

export function BookingPanel() {
  const [selectedOption, setSelectedOption] = useState('Digital consulting');
  const { openEnquiryModal, setTriggerElement } = useEnquiryModal();

  const handleEnquire = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTriggerElement(e.currentTarget);
    const mappedInterest = SERVICE_MAPPING[selectedOption] || 'Business transformation';
    openEnquiryModal(mappedInterest);
  };

  return (
    <div className="booking-panel">
      <label htmlFor="booking-service">What would you like to book?</label>
      <select
        id="booking-service"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        <option value="Digital consulting">Digital consulting</option>
        <option value="Professional training">Professional training</option>
        <option value="School programme">School programme</option>
        <option value="Sports coaching">Sports coaching</option>
        <option value="Athlete development">Athlete development</option>
      </select>

      <div className="booking-summary">
        <span>Schedule &amp; location</span>
        <strong>To be confirmed</strong>
        <span>Programme fee</span>
        <strong>Quote on enquiry</strong>
      </div>

      <div className="booking-actions">
        <button type="button" className="button" id="booking-enquire" onClick={handleEnquire}>
          Enquire about this service ↗
        </button>
      </div>
    </div>
  );
}
