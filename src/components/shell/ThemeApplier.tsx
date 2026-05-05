'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function ThemeApplier() {
  const theme = useStore(s => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.dark ? 'dark' : 'light');
    root.setAttribute('data-palette', theme.palette);
    root.setAttribute('data-card-style', theme.cardStyle);
    root.setAttribute('data-type', theme.typography);
  }, [theme]);

  return null;
}
