import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F4F7FB',
          surface: '#FFFFFF',
          primary: '#132238',
          accent: '#2563EB',
          glow: '#0EA5E9',
          subtle: '#64748B',
          secondary: '#14B8A6'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 60%)',
        'grid-lines': 'linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 0), linear-gradient(180deg, rgba(0,0,0,0.06) 1px, transparent 0)'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
        glow: '0 28px 60px rgba(37, 99, 235, 0.12)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
