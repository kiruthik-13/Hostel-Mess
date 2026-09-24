/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Outfit', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Material 3 warm terracotta — values live in CSS vars
           (src/index.css :root = light, .dark = dark). Slash
           modifiers keep working via <alpha-value>. */
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-bright': 'rgb(var(--primary-bright) / <alpha-value>)',
        'on-primary': 'rgb(var(--on-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--on-primary-container) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        'on-secondary': 'rgb(var(--on-secondary) / <alpha-value>)',
        'secondary-container': 'rgb(var(--secondary-container) / <alpha-value>)',
        'on-secondary-container': 'rgb(var(--on-secondary-container) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'error-container': 'rgb(var(--error-container) / <alpha-value>)',
        'on-error-container': 'rgb(var(--on-error-container) / <alpha-value>)',
        outline: 'rgb(var(--outline) / <alpha-value>)',
        'outline-strong': 'rgb(var(--outline-strong) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',

        /* Solid surface ramp */
        'surface-lowest': 'rgb(var(--surface-lowest) / <alpha-value>)',
        'surface-low': 'rgb(var(--surface-low) / <alpha-value>)',
        'surface-default': 'rgb(var(--surface-default) / <alpha-value>)',
        'surface-high': 'rgb(var(--surface-high) / <alpha-value>)',
        'surface-min': 'rgb(var(--surface-min) / <alpha-value>)',

        /* Text */
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',

        /* Baked-alpha tokens (used bare only — never slash-modified) */
        'outline-soft': 'var(--outline-soft)',
        'outline-faint': 'var(--outline-faint)',
        'primary-soft': 'var(--primary-soft)',
        'primary-soft-strong': 'var(--primary-soft-strong)',
        'primary-ring': 'var(--primary-ring)',
        'primary-ring-soft': 'var(--primary-ring-soft)',
        'primary-ring-faint': 'var(--primary-ring-faint)',
        'outline-ring': 'var(--outline-ring)',
      },
      borderRadius: {
        md3: '28px',
        md3sm: '16px',
        md3pill: '999px',
      },
      boxShadow: {
        md3: '0 1px 3px rgba(34,26,21,0.08), 0 4px 16px rgba(34,26,21,0.06)',
        'md3-lg':
          '0 2px 6px rgba(34,26,21,0.10), 0 12px 32px rgba(34,26,21,0.12)',
        'md3-fab': 'var(--md3-fab-shadow)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.06)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,108,74,0.5)' },
          '50%': { boxShadow: '0 0 0 6px rgba(0,108,74,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out both',
        'slide-up': 'slide-up 0.28s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'pop-in': 'pop-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
