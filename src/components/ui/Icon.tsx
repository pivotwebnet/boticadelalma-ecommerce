interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
}

export default function Icon({ name, size = 18, stroke = 1.5 }: IconProps) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'search':    return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
    case 'heart':     return <svg {...p}><path d="M12 20s-7-4.5-9-9.5c-1-2.8 1-5.5 4-5.5 2 0 3.5 1.2 4.5 3 1-1.8 2.5-3 4.5-3 3 0 5 2.7 4 5.5-2 5-9 9.5-9 9.5Z" /></svg>;
    case 'heart-fill':return <svg {...p} fill="currentColor" stroke="none"><path d="M12 20s-7-4.5-9-9.5c-1-2.8 1-5.5 4-5.5 2 0 3.5 1.2 4.5 3 1-1.8 2.5-3 4.5-3 3 0 5 2.7 4 5.5-2 5-9 9.5-9 9.5Z" /></svg>;
    case 'bag':       return <svg {...p}><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></svg>;
    case 'user':      return <svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>;
    case 'menu':      return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'close':     return <svg {...p}><path d="M6 6l12 12M6 18L18 6" /></svg>;
    case 'chev-r':    return <svg {...p}><path d="m9 6 6 6-6 6" /></svg>;
    case 'chev-l':    return <svg {...p}><path d="m15 6-6 6 6 6" /></svg>;
    case 'chev-d':    return <svg {...p}><path d="m6 9 6 6 6-6" /></svg>;
    case 'chev-u':    return <svg {...p}><path d="m6 15 6-6 6 6" /></svg>;
    case 'plus':      return <svg {...p}><path d="M12 5v14M5 12h14" /></svg>;
    case 'minus':     return <svg {...p}><path d="M5 12h14" /></svg>;
    case 'star':      return <svg {...p} fill="currentColor" stroke="none"><path d="M12 2.5 14.9 9l6.6.6-5 4.5 1.5 6.5L12 17.3 6 20.6 7.5 14 2.5 9.6 9.1 9 12 2.5Z" /></svg>;
    case 'truck':     return <svg {...p}><rect x="2" y="7" width="12" height="10" rx="1" /><path d="M14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
    case 'shield':    return <svg {...p}><path d="M12 3 4 6v6c0 4 3 7 8 9 5-2 8-5 8-9V6l-8-3Z" /></svg>;
    case 'leaf':      return <svg {...p}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" /><path d="M5 19c4-4 7-7 14-14" /></svg>;
    case 'moon':      return <svg {...p}><path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z" /></svg>;
    case 'filter':    return <svg {...p}><path d="M4 5h16M7 12h10M10 19h4" /></svg>;
    case 'grid':      return <svg {...p}><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg>;
    case 'rows':      return <svg {...p}><rect x="4" y="5" width="16" height="5" /><rect x="4" y="14" width="16" height="5" /></svg>;
    case 'zoom':      return <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M8 11h6M11 8v6" /></svg>;
    case 'arrow-r':   return <svg {...p}><path d="M5 12h14m-5-5 5 5-5 5" /></svg>;
    case 'check':     return <svg {...p}><path d="m5 12 5 5 9-11" /></svg>;
    case 'sparkle':   return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>;
    default: return null;
  }
}
