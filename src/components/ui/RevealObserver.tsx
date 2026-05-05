'use client';

import { useEffect } from 'react';

const DIR_CLASS: Record<string, string> = {
  up:      'reveal',
  left:    'reveal-left',
  right:   'reveal-right',
  stagger: 'reveal-stagger',
};

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      const cls = DIR_CLASS[el.dataset.reveal ?? 'up'] ?? 'reveal';

      // Si ya está en el viewport al cargar → no animar, mostrar directo
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add(cls, 'is-visible');
      } else {
        el.classList.add(cls);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
