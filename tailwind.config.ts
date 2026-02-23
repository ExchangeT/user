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
        // Primary backgrounds
        'cc-bg': {
          primary: '#0a0e17',
          secondary: '#111827',
          card: '#1a2235',
          'card-hover': '#212d45',
          elevated: '#243049',
        },
        // Accent colors
        'cc-gold': {
          DEFAULT: '#f4c430',
          light: '#ffd966',
          dark: '#d4a600',
        },
        'cc-orange': '#ff6b35',
        'cc-green': {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        'cc-red': {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        'cc-blue': {
          DEFAULT: '#3b82f6',
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
        // Text colors
        'cc-text': {
          primary: '#ffffff',
          secondary: '#94a3b8',
          muted: '#64748b',
          dark: '#0f172a',
        },
        // Border colors
        'cc-border': {
          subtle: 'rgba(255, 255, 255, 0.06)',
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #f4c430 0%, #ff6b35 100%)',
        'gradient-green': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1a2235 0%, #0a0e17 100%)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'gold': '0 10px 40px rgba(244, 196, 48, 0.3)',
        'gold-lg': '0 20px 60px rgba(244, 196, 48, 0.4)',
        'green': '0 10px 30px rgba(16, 185, 129, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        'sidebar': '260px',
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

export default config;
