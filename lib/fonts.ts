import localFont from 'next/font/local';

export const josefinSans = localFont({
  src: [
    {
      path: '../public/fonts/josefin-sans-1.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/josefin-sans-2.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-josefin',
  display: 'swap',
});

export const roboto = localFont({
  src: [
    {
      path: '../public/fonts/roboto-0.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/roboto-1.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/roboto-2.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

export const outfit = localFont({
  src: [
    {
      path: '../public/fonts/outfit-0.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/outfit-1.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/outfit-3.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-outfit',
  display: 'swap',
});
