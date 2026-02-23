'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(getInitialTheme());
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    const root = document.documentElement;
    if (next === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={cn(
        'w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--panel)] flex items-center justify-center',
        className
      )}>
        <div className="w-4 h-4 rounded bg-[var(--line)] animate-pulse" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--panel)]',
        'flex items-center justify-center transition-all duration-200',
        'hover:border-[var(--line-strong)] hover:bg-[var(--panel-raised)]',
        'text-[var(--ink-2)] hover:text-[var(--ink-1)]',
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
