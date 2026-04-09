import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';

type Props = {
  title: string;
  alt?: string;
  className?: string;
};

function buildCandidates(title: string): string[] {
  const base = title.trim();
  const encoded = encodeURIComponent(base);
  return [
    `/compétition/${base}.jpg`,
    `/compétition/${base}.png`,
    `/compétition/${base}.jpeg`,
    `/compétition/${encoded}.jpg`,
    `/compétition/${encoded}.png`,
    `/compétition/${encoded}.jpeg`,
    '/compétition/unknow.jpg',
    '/compétition/unknow.png',
  ];
}

export function CompetitionImage({ title, alt, className }: Props) {
  const urls = useMemo(() => buildCandidates(title), [title]);
  const [index, setIndex] = useState(0);

  if (index >= urls.length) {
    return (
      <div className={`bg-bg-surface border border-border-main flex items-center justify-center ${className ?? ''}`}>
        <CalendarDays className="text-brand-primary" size={20} />
      </div>
    );
  }

  return (
    <img
      src={urls[index]}
      alt={alt ?? title}
      className={className}
      onError={() => setIndex((i) => i + 1)}
      referrerPolicy="no-referrer"
    />
  );
}

