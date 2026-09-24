import type { ReactNode } from 'react';
import Icon from './Icon';

/* ---------------------------------------------------------------- */
/* Modal shell with backdrop + escape / click-outside                */
/* ---------------------------------------------------------------- */

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  icon?: string;
}

export function Modal({ title, subtitle, onClose, children, wide, icon }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-md3 bg-surface-lowest shadow-md3-lg animate-slide-up sm:rounded-md3 ${
          wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-outline/60 bg-surface-lowest/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container/20 text-on-primary-container">
                <Icon name={icon} size={22} />
              </span>
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
              {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft transition hover:bg-surface-high hover:text-ink"
            aria-label="Close dialog"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Chips & badges                                                    */
/* ---------------------------------------------------------------- */

export function Chip({
  label,
  active = false,
  onClick,
  icon,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: string;
}) {
  const cls = active ? 'md-chip md-chip-active' : 'md-chip border-outline-strong/40 bg-surface-lowest text-ink-soft hover:bg-surface-default';
  const content = (
    <>
      {icon && <Icon name={icon} size={15} weight={600} />}
      {label}
    </>
  );
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={cls}>
        {content}
      </button>
    );
  return <span className={cls}>{content}</span>;
}

export function Badge({
  children,
  color = 'primary',
}: {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'neutral';
}) {
  const palette: Record<string, string> = {
    primary: 'bg-primary-container/15 text-on-primary-container',
    secondary: 'bg-secondary-container/40 text-on-secondary-container',
    error: 'bg-error-container text-on-error-container',
    neutral: 'bg-surface-high text-ink-soft',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${palette[color]}`}>
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Progress bar                                                      */
/* ---------------------------------------------------------------- */

export function ProgressBar({ value, max = 5, color = '#9d4300' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-high">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Stat / KPI bento card                                             */
/* ---------------------------------------------------------------- */

export function KpiCard({
  icon,
  label,
  value,
  sub,
  trend,
  accent = '#9d4300',
}: {
  icon: string;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  trend?: { label: string; up?: boolean } | null;
  accent?: string;
}) {
  return (
    <div className="md-card relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: accent }} />
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          <Icon name={icon} size={22} filled />
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              trend.up ? 'bg-secondary-container/40 text-on-secondary-container' : 'bg-error-container text-on-error-container'
            }`}
          >
            <Icon name={trend.up ? 'trending_up' : 'trending_down'} size={14} />
            {trend.label}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-ink-soft">{label}</p>
        {sub && <p className="mt-2 text-xs text-ink-soft/80">{sub}</p>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Avatar                                                            */
/* ---------------------------------------------------------------- */

export function Avatar({ name, color, size = 40 }: { name: string; color?: string; size?: number }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-on-primary"
      style={{ backgroundColor: color ?? '#9d4300', width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Section heading                                                   */
/* ---------------------------------------------------------------- */

export function SectionTitle({ icon, title, action }: { icon?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h3 className="heading flex items-center gap-2 text-lg">
        {icon && <Icon name={icon} size={20} className="text-primary" />}
        {title}
      </h3>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md3 border border-dashed border-outline-strong/40 bg-surface-low/50 px-6 py-12 text-center">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-surface-high text-outline-strong">
        <Icon name={icon} size={28} />
      </span>
      <p className="font-display font-semibold text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}