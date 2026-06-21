import { useMemo, useState } from 'react';

type Props = {
  name: string;
  alt?: string;
  className?: string;
  image?: string;
};

const FEMALE_MARKERS = [
  'sidonie', 'claudine', 'lorrie', 'eliane', 'vanessa', 'rosa', 'doris', 'marie', 'sarah',
  'hanta', 'noro', 'angela', 'anna', 'patricia', 'annah', 'esperance', 'florentine', 'fazia',
  'andrianjafy', 'razanamandroso', 'rasoanirina', 'hendritiana', 'ramiaramanitra',
  'rasoamanambina', 'vonjnaina', 'rafenomanga', 'ny aina', 'aina',
];

function initials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function isFemale(name: string): boolean {
  const lower = name.toLowerCase();
  return FEMALE_MARKERS.some((m) => lower.includes(m));
}

function candidates(name: string, image?: string): string[] {
  const base = name.trim();
  const urls: string[] = [];

  if (image && image.startsWith('/') && !image.includes('WhatsApp')) {
    urls.push(image);
  }

  urls.push(
    `/image-athlete/${base}.jpg`,
    `/image-athlete/${base}.png`,
    `/image-athlete/${encodeURIComponent(base)}.jpg`,
    `/image-athlete/${encodeURIComponent(base)}.png`,
  );

  const parts = base.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    const lastFirst = `${parts[parts.length - 1]} ${parts[0]}`;
    urls.push(`/image-athlete/${lastFirst}.jpg`, `/image-athlete/${lastFirst}.png`);
  }

  return [...new Set(urls), '/image-athlete/unknow.png'];
}

export function AthleteAvatar({ name, alt, className, image }: Props) {
  const urls = useMemo(() => candidates(name, image), [name, image]);
  const [idx, setIdx] = useState(0);
  const female = isFemale(name);

  if (idx >= urls.length) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-brand-primary/10 via-bg-surface to-brand-secondary/5 ${className ?? ''}`}
        role="img"
        aria-label={alt ?? name}
      >
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-1.5 ${
            female ? 'bg-brand-primary/15 ring-2 ring-brand-primary/25' : 'bg-brand-secondary/15 ring-2 ring-brand-secondary/25'
          }`}
        >
          <span className={`text-xl font-display font-bold ${female ? 'text-brand-primary' : 'text-brand-secondary'}`}>
            {initials(name)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={urls[idx]}
      alt={alt ?? name}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
      referrerPolicy="no-referrer"
    />
  );
}
