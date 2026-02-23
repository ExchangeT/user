'use client';

import { cn } from '@/lib/utils';
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, forwardRef } from 'react';

// ─────────────────────────────────────────
// CARD
// ─────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = false, style }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--panel)] border border-[var(--line)] rounded-xl',
        hover && 'transition-all duration-200 hover:border-[var(--line-strong)] hover:-translate-y-px hover:shadow-card-hover cursor-pointer',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      'px-5 py-4 border-b border-[var(--line)] flex items-center justify-between',
      className
    )}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

// ─────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const variants = {
      primary:   'bg-[var(--brand)] text-[var(--brand-fg)] hover:bg-[var(--brand-hover)] shadow-sm hover:shadow-brand transition-all',
      secondary: 'bg-[var(--panel-raised)] border border-[var(--line)] text-[var(--ink-1)] hover:border-[var(--line-strong)] hover:bg-[var(--panel-raised)] transition-all',
      ghost:     'bg-transparent text-[var(--ink-2)] hover:bg-[var(--panel-raised)] hover:text-[var(--ink-1)] transition-all',
      outline:   'bg-transparent border border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand-subtle)] transition-all',
      success:   'bg-[var(--positive)] text-white hover:opacity-90 transition-all',
      danger:    'bg-[var(--negative)] text-white hover:opacity-90 transition-all',
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs rounded-lg',
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-sm rounded-xl',
      lg: 'px-5 py-2.5 text-base rounded-xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[var(--ink-2)] uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2.5 bg-[var(--panel-raised)] border border-[var(--line)] rounded-lg',
              'text-[var(--ink-1)] text-sm placeholder:text-[var(--ink-3)]',
              'focus:outline-none focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)]/30',
              'transition-all duration-150',
              icon && 'pl-9',
              suffix && 'pr-10',
              error && 'border-[var(--negative)] focus:ring-[var(--negative)]/30',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-[var(--negative)] font-medium">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-[var(--ink-3)]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────
interface BadgeProps {
  variant?: 'default' | 'gold' | 'green' | 'red' | 'blue' | 'purple' | 'live' | 'outline';
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ variant = 'default', children, className, style }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--panel-raised)] text-[var(--ink-2)] border border-[var(--line)]',
    gold:    'bg-[var(--brand-subtle)] text-[var(--brand)] border border-[var(--brand)]/20',
    green:   'bg-[var(--positive-subtle)] text-[var(--positive)]',
    red:     'bg-[var(--negative-subtle)] text-[var(--negative)]',
    blue:    'bg-[var(--info-subtle)] text-[var(--info)]',
    purple:  'bg-purple-500/10 text-purple-400',
    live:    'bg-[var(--negative)] text-white',
    outline: 'border border-[var(--line)] text-[var(--ink-2)] bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide',
        variant === 'live' && 'animate-pulse',
        variants[variant],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'brand' | 'positive' | 'negative' | 'info';
}

export function ProgressBar({ value, max = 100, className, showLabel, color = 'brand' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorMap = {
    brand:    'bg-[var(--brand)]',
    positive: 'bg-[var(--positive)]',
    negative: 'bg-[var(--negative)]',
    info:     'bg-[var(--info)]',
  };

  return (
    <div className={className}>
      <div className="h-1.5 bg-[var(--panel-raised)] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorMap[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-[var(--ink-3)] mt-1 font-mono">
          {value} / {max}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' };
  iconBg?: string;
  className?: string;
  valueColor?: string;
}

export function StatCard({ icon, label, value, change, iconBg, className, valueColor }: StatCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0',
          iconBg || 'bg-[var(--brand-subtle)]'
        )}>
          {icon}
        </div>
        {change && (
          <span className={cn(
            'text-xs font-semibold tabular',
            change.type === 'increase' ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
          )}>
            {change.type === 'increase' ? '+' : '−'}{change.value}%
          </span>
        )}
      </div>
      <p className={cn(
        'font-mono text-xl font-bold tabular leading-tight',
        valueColor || 'text-[var(--ink-1)]'
      )}>
        {value}
      </p>
      <p className="text-xs text-[var(--ink-3)] mt-0.5 font-medium">{label}</p>
    </Card>
  );
}

// ─────────────────────────────────────────
// TABS
// ─────────────────────────────────────────
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Tabs({ tabs, activeTab, onChange, className, size = 'md' }: TabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-[var(--panel-raised)] rounded-lg border border-[var(--line)]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-1.5 rounded-md font-medium transition-all duration-150',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            activeTab === tab.id
              ? 'bg-[var(--panel)] text-[var(--ink-1)] shadow-sm border border-[var(--line)]'
              : 'text-[var(--ink-3)] hover:text-[var(--ink-2)] hover:bg-[var(--panel)]/50'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded font-semibold tabular min-w-[18px] text-center',
              activeTab === tab.id
                ? 'bg-[var(--brand-subtle)] text-[var(--brand)]'
                : 'bg-[var(--line)] text-[var(--ink-3)]'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs rounded-md',
    sm: 'w-8 h-8 text-sm rounded-lg',
    md: 'w-10 h-10 text-base rounded-xl',
    lg: 'w-14 h-14 text-xl rounded-2xl',
    xl: 'w-20 h-20 text-3xl rounded-2xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || fallback}
        className={cn('object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div className={cn(
      'bg-[var(--brand-subtle)] border border-[var(--brand)]/20 flex items-center justify-center font-bold text-[var(--brand)]',
      sizes[size],
      className
    )}>
      {fallback.charAt(0).toUpperCase()}
    </div>
  );
}

// ─────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[var(--panel-raised)] border border-[var(--line)] flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[var(--ink-1)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--ink-3)] mb-5 max-w-xs leading-relaxed">{description}</p>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────
export function Divider({ className, label }: { className?: string; label?: string }) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-3 my-2', className)}>
        <div className="flex-1 h-px bg-[var(--line)]" />
        <span className="text-xs text-[var(--ink-3)] font-medium px-1">{label}</span>
        <div className="flex-1 h-px bg-[var(--line)]" />
      </div>
    );
  }
  return <hr className={cn('border-[var(--line)]', className)} />;
}

// ─────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────
export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink-1)] tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--ink-3)] mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
