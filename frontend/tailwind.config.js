/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a26',
          700: '#242436',
          600: '#2e2e48',
        },
        gold: {
          400: '#f5c842',
          500: '#e8b930',
          600: '#c99a1a',
        },
        slate: {
          muted: '#6b7280',
        }
      },
      backgroundImage: {
        'radial-ink': 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 70%)',
        'gold-shimmer': 'linear-gradient(135deg, #f5c842 0%, #e8b930 50%, #f5c842 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,200,66,0.3)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(245,200,66,0)' },
        },
      },
    },
  },
  plugins: [],
};
