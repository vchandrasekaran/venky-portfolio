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
          bg: '#020617',
          surface: '#0B1220',
          primary: '#16213A',
          accent: '#38BDF8',
          glow: '#8B5CF6',
          subtle: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(139,92,246,0.25), transparent 55%)',
        'grid-lines': 'linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 0), linear-gradient(180deg, rgba(148,163,184,0.06) 1px, transparent 0)'
      },
      boxShadow: {
        soft: '0 8px 32px rgba(15,23,42,0.45)',
        glow: '0 0 40px rgba(56,189,248,0.35)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
