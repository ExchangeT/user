import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === SEMANTIC THEME TOKENS (CSS variables) ===
        canvas: 'var(--canvas)',
        panel: 'var(--panel)',
        'panel-raised': 'var(--panel-raised)',
        'panel-overlay': 'var(--panel-overlay)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        'ink-1': 'var(--ink-1)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
          fg: 'var(--brand-fg)',
          subtle: 'var(--brand-subtle)',
        },
        positive: {
          DEFAULT: 'var(--positive)',
          subtle: 'var(--positive-subtle)',
        },
        negative: {
          DEFAULT: 'var(--negative)',
          subtle: 'var(--negative-subtle)',
        },
        info: {
          DEFAULT: 'var(--info)',
          subtle: 'var(--info-subtle)',
        },
        caution: {
          DEFAULT: 'var(--caution)',
          subtle: 'var(--caution-subtle)',
        },

        // === LEGACY cc-* PALETTE (mapped to CSS vars for theme support) ===
        'cc-bg': {
          primary: 'var(--canvas)',
          secondary: 'var(--panel)',
          card: 'var(--panel)',
          'card-hover': 'var(--panel-raised)',
          elevated: 'var(--panel-raised)',
        },
        'cc-gold': {
          DEFAULT: 'var(--brand)',
          light: 'var(--brand-hover)',
          dark: '#d97706',
        },
        'cc-orange': '#f97316',
        'cc-green': {
          DEFAULT: 'var(--positive)',
          light: '#34d399',
          dark: '#059669',
        },
        'cc-red': {
          DEFAULT: 'var(--negative)',
          light: '#f87171',
          dark: '#dc2626',
        },
        'cc-blue': {
          DEFAULT: 'var(--info)',
          light: '#60a5fa',
          dark: '#2563eb',
        },
        'cc-purple': {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        'cc-cyan': {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2',
        },
        'cc-text': {
          primary: 'var(--ink-1)',
          secondary: 'var(--ink-2)',
          muted: 'var(--ink-3)',
          subtle: 'var(--ink-3)',
          dark: '#0f172a',
        },
        'cc-border': {
          subtle: 'var(--line)',
          light: 'var(--line)',
          medium: 'var(--line-strong)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-light': 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'brand': '0 4px 16px rgba(217, 119, 6, 0.20)',
        'brand-lg': '0 8px 28px rgba(217, 119, 6, 0.25)',
        'gold': '0 4px 16px rgba(217, 119, 6, 0.20)',
        'gold-lg': '0 8px 28px rgba(217, 119, 6, 0.25)',
        'green': '0 4px 14px rgba(5, 150, 105, 0.18)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.07), 0 1px 2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 30px rgba(0, 0, 0, 0.12)',
        'dropdown': '0 8px 24px rgba(0, 0, 0, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        'sidebar': '256px',
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'ticker': 'ticker 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
