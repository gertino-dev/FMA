import { useMemo, useState } from 'react';
import { PersonStanding } from 'lucide-react';

type Props = {
  name: string;
  alt?: string;
  className?: string;
};

function candidates(name: string): string[] {
  const base = name.trim();
  return [
    `/image-athlete/${base}.jpg`,
    `/image-athlete/${base}.png`,
    `/image-athlete/${encodeURIComponent(base)}.jpg`,
    `/image-athlete/${encodeURIComponent(base)}.png`,
    '/image-athlete/unknow.png',
    '/image-athlete/unknow.jpg',
  ];
}

export function AthleteAvatar({ name, alt, className }: Props) {
  const urls = useMemo(() => candidates(name), [name]);
  const [idx, setIdx] = useState(0);

  if (idx >= urls.length) {
    return (
      <div className={`bg-bg-surface border border-border-main flex items-center justify-center ${className ?? ''}`}>
        <PersonStanding className="text-brand-primary" size={20} />
      </div>
    );
  }

  return (
    <img
      src={urls[idx]}
      alt={alt ?? name}
      className={className}
      onError={() => setIdx((i) => i + 1)}
      referrerPolicy="no-referrer"
    />
  );
}

