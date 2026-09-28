'use client';

import { useEffect } from 'react';
import { captureAndPersistAttribution } from '@/lib/utm';

export function UtmCapture() {
  useEffect(() => {
    captureAndPersistAttribution();
  }, []);

  return null;
}
