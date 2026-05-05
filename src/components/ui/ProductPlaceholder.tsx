import { TONES } from '@/lib/data';

interface ProductPlaceholderProps {
  tone?: string;
  label?: string;
  aspectRatio?: number;
  rounded?: boolean;
}

export default function ProductPlaceholder({
  tone = 'sage',
  label = 'producto',
  aspectRatio = 1,
  rounded = true,
}: ProductPlaceholderProps) {
  const t = TONES[tone] ?? TONES.sage;

  return (
    <div
      className="ph"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        background: t.bg,
        borderRadius: rounded ? 'var(--card-radius, 6px)' : 0,
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, opacity: 0.35 }}
      >
        <defs>
          <pattern
            id={`stripes-${tone}`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke={t.fg} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#stripes-${tone})`} />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 10,
          letterSpacing: '0.08em',
          color: t.fg,
          textTransform: 'uppercase',
          opacity: 0.75,
        }}
      >
        {label}
      </div>
    </div>
  );
}
