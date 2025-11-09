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
          bg: '#E8E6E2',
          surface: '#F4F2EE',
          primary: '#F0F0F0',
          accent: '#1F1F1F',
          glow: '#8A7CFF',
          subtle: '#6F6F6F',
          secondary: '#FF7A9E'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 60%)',
        'grid-lines': 'linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 0), linear-gradient(180deg, rgba(0,0,0,0.06) 1px, transparent 0)'
      },
      boxShadow: {
        soft: '0 8px 32px rgba(5,6,10,0.65)',
        glow: '0 20px 55px rgba(0,0,0,0.25)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
} satisfies Config
