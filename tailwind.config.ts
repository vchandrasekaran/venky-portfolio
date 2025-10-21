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
          bg: '#090A0F',
          surface: '#0B0F16',
          primary: '#141A24',
          accent: '#FF3B00',
          glow: '#FF8A00',
          subtle: '#8BA6B8',
          secondary: '#00E5FF'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(255,59,0,0.22), transparent 60%)',
        'grid-lines': 'linear-gradient(90deg, rgba(255,59,0,0.10) 1px, transparent 0), linear-gradient(180deg, rgba(255,59,0,0.08) 1px, transparent 0)'
      },
      boxShadow: {
        soft: '0 8px 32px rgba(5,6,10,0.65)',
        glow: '0 0 40px rgba(255,59,0,0.45)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
