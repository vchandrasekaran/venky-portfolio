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
          bg: '#060814',
          surface: '#0B1020',
          primary: '#131C33',
          accent: '#FF6DAE',
          glow: '#7F5DFF',
          subtle: '#B8C6F5',
          secondary: '#3DE5C4'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(255,109,174,0.24), transparent 60%)',
        'grid-lines': 'linear-gradient(90deg, rgba(127,93,255,0.12) 1px, transparent 0), linear-gradient(180deg, rgba(127,93,255,0.08) 1px, transparent 0)'
      },
      boxShadow: {
        soft: '0 8px 32px rgba(5,6,10,0.65)',
        glow: '0 0 40px rgba(127,93,255,0.45)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
