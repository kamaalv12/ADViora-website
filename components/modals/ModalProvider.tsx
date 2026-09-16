'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FormFields } from '@/lib/validation';

interface ChannelModalInfo {
  title: string;
  description: string;
}

interface ModalContextType {
  isEnquiryOpen: boolean;
  enquiryService: string;
  openEnquiryModal: (service?: string) => void;
  closeEnquiryModal: () => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (el: HTMLElement | null) => void;
  channelModal: ChannelModalInfo | null;
  openChannelModal: (channel: 'whatsapp' | 'email') => void;
  closeChannelModal: () => void;
  sharedFormValues: FormFields;
  setSharedFormValues: React.Dispatch<React.SetStateAction<FormFields>>;
}

const initialFormValues: FormFields = {
  name: '',
  email: '',
  interest: '',
  message: '',
  website: '',
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryService, setEnquiryService] = useState('');
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const [channelModal, setChannelModal] = useState<ChannelModalInfo | null>(null);
  const [sharedFormValues, setSharedFormValues] = useState<FormFields>(initialFormValues);

  const openEnquiryModal = useCallback((service?: string) => {
    if (service) {
      setEnquiryService(service);
      setSharedFormValues((prev) => ({
        ...prev,
        interest: service,
        message: prev.message || `I would like to enquire about ${service.toLowerCase()}. Please share availability and fees.`,
      }));
    }
    setIsEnquiryOpen(true);
  }, []);

  const closeEnquiryModal = useCallback(() => {
    setIsEnquiryOpen(false);
  }, []);

  const openChannelModal = useCallback((channel: 'whatsapp' | 'email') => {
    if (channel === 'whatsapp') {
      setChannelModal({
        title: 'Chat on WhatsApp',
        description:
          'ADViora’s WhatsApp number is awaiting confirmation. This preview does not send a message. Please use the service enquiry preview to explore the form.',
      });
    } else {
      setChannelModal({
        title: 'Email ADViora',
        description:
          'ADViora’s enquiry email address is awaiting confirmation. Direct email delivery also needs a connected form service or backend. No email is sent from this preview.',
      });
    }
  }, []);

  const closeChannelModal = useCallback(() => {
    setChannelModal(null);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isEnquiryOpen,
        enquiryService,
        openEnquiryModal,
        closeEnquiryModal,
        triggerElement,
        setTriggerElement,
        channelModal,
        openChannelModal,
        closeChannelModal,
        sharedFormValues,
        setSharedFormValues,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useEnquiryModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within a ModalProvider');
  }
  return context;
}
