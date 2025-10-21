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
          bg: '#02050A',
          surface: '#071019',
          primary: '#0B1624',
          accent: '#00E5FF',
          glow: '#FF6A00',
          subtle: '#7AA2B8'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(0,229,255,0.22), transparent 60%)',
        'grid-lines': 'linear-gradient(90deg, rgba(0,229,255,0.10) 1px, transparent 0), linear-gradient(180deg, rgba(0,229,255,0.08) 1px, transparent 0)'
      },
      boxShadow: {
        soft: '0 8px 32px rgba(2,8,15,0.55)',
        glow: '0 0 40px rgba(0,229,255,0.45)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
