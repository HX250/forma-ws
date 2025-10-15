const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Use class strategy for dark mode
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        // Neutral palette
        neutral: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
        // Brand/Accent
        accent: {
          50: '#ECFDF5',
          100: '#D1FADF',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        // Text roles
        primary: { DEFAULT: '#FAFAFA', dark: '#18181B' },
        secondary: { DEFAULT: '#52525B', dark: '#D4D4D8' },
        muted: { DEFAULT: '#A1A1AA', dark: '#71717A' },
        inverse: { DEFAULT: '#FAFAFA', dark: '#18181B' },
        // Background roles
        'bg-primary': { DEFAULT: '#FFFFFF', dark: '#18181B' },
        'bg-secondary': { DEFAULT: '#F4F4F5', dark: '#27272A' },
        'bg-muted': { DEFAULT: '#E4E4E7', dark: '#3F3F46' },
        // Alert/feedback roles
        'alert-success-bg': { DEFAULT: '#ECFDF5', dark: '#052E16' },
        'alert-success-border': { DEFAULT: '#22C55E', dark: '#16A34A' },
        'alert-success-text': { DEFAULT: '#15803D', dark: '#BBF7D0' },
        'alert-error-bg': { DEFAULT: '#FEF2F2', dark: '#7F1D1D' },
        'alert-error-border': { DEFAULT: '#EF4444', dark: '#B91C1C' },
        'alert-error-text': { DEFAULT: '#B91C1C', dark: '#FCA5A5' },
        'alert-warning-bg': { DEFAULT: '#FFFBEB', dark: '#78350F' },
        'alert-warning-border': { DEFAULT: '#FACC15', dark: '#CA8A04' },
        'alert-warning-text': { DEFAULT: '#B45309', dark: '#FDE68A' },
        'alert-info-bg': { DEFAULT: '#EFF6FF', dark: '#1E293B' },
        'alert-info-border': { DEFAULT: '#3B82F6', dark: '#2563EB' },
        'alert-info-text': { DEFAULT: '#1D4ED8', dark: '#BFDBFE' },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.2' }],
        '2xl': ['1.5rem', { lineHeight: '1.2' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(16, 24, 40, 0.08)',
        modal: '0 4px 32px 0 rgba(16, 24, 40, 0.16)',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
};
