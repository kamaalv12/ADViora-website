import type { Metadata, Viewport } from 'next';
import { josefinSans, roboto, outfit } from '@/lib/fonts';
import '@/app/globals.css';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { EnquiryModal } from '@/components/modals/EnquiryModal';
import { ChannelModal } from '@/components/modals/ChannelModal';

export const metadata: Metadata = {
  title: 'ADViora Consulting — Turning Potential into Performance',
  description:
    'ADViora Consulting brings together business transformation, technology, professional training and athlete development through ADViora Digital and ADViora Academy.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'ADViora Consulting — Turning Potential into Performance',
    description:
      'ADViora Consulting brings together business transformation, technology, professional training and athlete development through ADViora Digital and ADViora Academy.',
    siteName: 'ADViora Consulting',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ADViora Consulting — Turning Potential into Performance',
    description:
      'ADViora Consulting brings together business transformation, technology, professional training and athlete development through ADViora Digital and ADViora Academy.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${roboto.variable} ${outfit.variable}`}
    >
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <ModalProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <EnquiryModal />
          <ChannelModal />
        </ModalProvider>
      </body>
    </html>
  );
}
