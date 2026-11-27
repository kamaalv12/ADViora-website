import type { Metadata, Viewport } from 'next';
import { josefinSans, roboto, outfit } from '@/lib/fonts';
import '@/app/globals.css';
import { ModalProvider } from '@/components/modals/ModalProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { EnquiryModal } from '@/components/modals/EnquiryModal';
import { ChannelModal } from '@/components/modals/ChannelModal';
import { UtmCapture } from '@/components/UtmCapture';

export const metadata: Metadata = {
  title: 'Adviora Consulting — Transforming Businesses. Empowering People. Enabling Technology.',
  description:
    'Adviora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Adviora Consulting — Transforming Businesses. Empowering People. Enabling Technology.',
    description:
      'Adviora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
    siteName: 'Adviora Consulting',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adviora Consulting — Transforming Businesses. Empowering People. Enabling Technology.',
    description:
      'Adviora helps organisations improve performance, modernise technology, optimise IT operations and build future-ready capabilities through consulting, technology solutions and professional training.',
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
          <UtmCapture />
        </ModalProvider>
      </body>
    </html>
  );
}
