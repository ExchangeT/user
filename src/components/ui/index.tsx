'use client';

import { cn } from '@/lib/utils';
import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, forwardRef } from 'react';

// Card Component
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, hover = false, style }: CardProps) {
  return (
    <div className={cn(
      'bg-[#1a2235] border border-white/[0.06] rounded-2xl',
      hover && 'transition-all duration-300 hover:border-white/10 hover:-translate-y-1',
      className
    )} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-white/[0.06]', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

// Button Component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-[#f4c430] to-[#ff6b35] text-[#0f172a] hover:-translate-y-0.5 hover:shadow-lg',
      secondary: 'bg-[#243049] border border-white/10 text-white hover:border-[#f4c430] hover:text-[#f4c430]',
      ghost: 'bg-transparent text-[#94a3b8] hover:bg-[#243049] hover:text-white',
      success: 'bg-gradient-to-r from-[#10b981] to-[#34d399] text-white hover:-translate-y-0.5',
      danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
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

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#94a3b8] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-[#111827] border border-white/10 rounded-xl text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#f4c430] transition-all',
              icon && 'pl-10',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Badge Component
interface BadgeProps {
  variant?: 'gold' | 'green' | 'red' | 'blue' | 'purple' | 'live';
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ variant = 'gold', children, className, style }: BadgeProps) {
  const variants = {
    gold: 'bg-[#f4c430]/15 text-[#f4c430] border border-[#f4c430]/30',
    green: 'bg-[#10b981]/15 text-[#10b981]',
    red: 'bg-[#ef4444]/15 text-[#ef4444]',
    blue: 'bg-[#3b82f6]/15 text-[#3b82f6]',
    purple: 'bg-[#8b5cf6]/15 text-[#8b5cf6]',
    live: 'bg-[#ef4444] text-white animate-pulse',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold',
      variants[variant],
      className
    )} style={style}>
      {children}
    </span>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className, showLabel }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      <div className="h-1.5 bg-[#243049] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#f4c430] to-[#ff6b35] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-[#64748b] mt-1">
          {value} / {max}
        </p>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' };
  iconBg?: string;
  className?: string;
}

export function StatCard({ icon, label, value, change, iconBg, className }: StatCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg', iconBg || 'bg-[#f4c430]/15')}>
          {icon}
        </div>
        {change && (
          <span className={cn(
            'text-xs font-semibold',
            change.type === 'increase' ? 'text-[#10b981]' : 'text-[#ef4444]'
          )}>
            {change.type === 'increase' ? '↑' : '↓'} {change.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="font-mono text-2xl font-bold">{value}</p>
        <p className="text-xs text-[#64748b] mt-0.5">{label}</p>
      </div>
    </Card>
  );
}

// Tab Component
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            activeTab === tab.id
              ? 'bg-[#f4c430]/10 text-[#f4c430] border border-[#f4c430]/30'
              : 'text-[#64748b] hover:text-white hover:bg-[#243049]'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-xs opacity-75">({tab.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

// Avatar Component
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || fallback}
        className={cn('rounded-2xl object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div className={cn(
      'rounded-2xl bg-gradient-to-r from-[#f4c430] to-[#ff6b35] flex items-center justify-center font-bold text-[#0f172a]',
      sizes[size],
      className
    )}>
      {fallback}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#243049] flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#64748b] mb-4 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
