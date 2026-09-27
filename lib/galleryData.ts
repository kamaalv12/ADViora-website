export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export const GALLERY_IMAGES: GalleryItem[] = [
  {
    id: 'gallery-1',
    src: '/images/gallery/gallery-1.webp',
    alt: 'Championship podium ceremony and gold medal presentation',
    caption: 'Championship podium ceremony and award presentation',
    width: 1066,
    height: 1600,
  },
  {
    id: 'gallery-2',
    src: '/images/gallery/gallery-2.webp',
    alt: 'Interactive online workshop session with group participants via video conference',
    caption: 'Interactive online session and group workshop',
    width: 1011,
    height: 590,
  },
  {
    id: 'gallery-3',
    src: '/images/gallery/gallery-3.webp',
    alt: 'Virtual coaching session and presentation demonstration',
    caption: 'Virtual training demonstration and coaching',
    width: 1026,
    height: 690,
  },
  {
    id: 'gallery-4',
    src: '/images/gallery/gallery-4.webp',
    alt: 'Workshop session and techniques demonstration with participants',
    caption: 'Workshop demonstration and wellness session',
    width: 904,
    height: 1280,
  },
  {
    id: 'gallery-5',
    src: '/images/gallery/gallery-5.webp',
    alt: 'National championship podium award presentation',
    caption: 'National championship podium presentation',
    width: 373,
    height: 622,
  },
  {
    id: 'gallery-6',
    src: '/images/gallery/gallery-6.webp',
    alt: 'Championship arena stage ceremony and participant presentation',
    caption: 'Championship event presentation ceremony',
    width: 959,
    height: 1280,
  },
];
