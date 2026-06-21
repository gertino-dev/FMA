import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  label?: string;
  title: React.ReactNode;
  sub?: string;
  action?: string;
  onAction?: () => void;
  dark?: boolean;
}

export const SectionHeader = ({ label, title, sub, action, onAction, dark }: SectionHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 md:mb-12">
    <div>
      {label && <span className="eyebrow">{label}</span>}
      <h2 className={`page-title ${dark ? 'text-white' : ''}`}>{title}</h2>
      {sub && <p className={`mt-3 text-sm leading-relaxed max-w-xl ${dark ? 'text-white/55' : 'text-text-muted'}`}>{sub}</p>}
    </div>
    {action && onAction && (
      <button type="button" onClick={onAction} className="link-action group shrink-0">
        {action}
        <ArrowRight size={15} />
      </button>
    )}
  </div>
);

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, meta }: PageHeaderProps) => (
  <div className="page-header-wrap">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3">
      <h1 className="page-title-lg">{title}</h1>
      {meta && <div className="text-sm text-text-muted">{meta}</div>}
    </div>
    {description && <p className="text-text-muted text-sm md:text-base leading-relaxed max-w-2xl">{description}</p>}
  </div>
);
