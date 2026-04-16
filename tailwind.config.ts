import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#FFF8ED',
          100: '#FFEFD3',
          200: '#FFDBA5',
          300: '#FFC06D',
          400: '#FF9A32',
          500: '#FF7A00',
          600: '#E85F00',
          700: '#C04500',
          800: '#9A3700',
          900: '#7A2D00',
        },
        forest: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        earth: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'blink': 'blink 0.8s step-end infinite',
        'float-up': 'floatUp 20s linear infinite',
        'count-up': 'countUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-out-right': 'slideOutRight 0.3s ease-in forwards',
        'fade-overlay': 'fadeOverlay 0.2s ease-out forwards',
        'mega-menu-in': 'megaMenuIn 0.2s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer-slide': 'shimmerSlide 1.5s infinite',
        'spring-in': 'springIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'spring-out': 'springOut 0.25s ease-in forwards',
        'typing-bounce': 'typingBounce 1.2s ease-in-out infinite',
        'heat-pop': 'heatPop 0.3s ease-out forwards',
        'notif-slide-in': 'notifSlideIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        floatUp: {
          '0%': { transform: 'translateY(100%) scale(0.9)', opacity: '0' },
          '5%': { opacity: '0.6' },
          '50%': { opacity: '0.4' },
          '95%': { opacity: '0' },
          '100%': { transform: 'translateY(-120vh) scale(0.95)', opacity: '0' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        fadeOverlay: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        megaMenuIn: {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 122, 0, 0)' },
          '50%': { boxShadow: '0 0 20px 2px rgba(255, 122, 0, 0.15)' },
        },
        shimmerSlide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        springIn: {
          '0%': { transform: 'scale(0.6) translateY(20px)', opacity: '0' },
          '60%': { transform: 'scale(1.03) translateY(-3px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        springOut: {
          '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
          '100%': { transform: 'scale(0.6) translateY(20px)', opacity: '0' },
        },
        typingBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-4px)' },
        },
        heatPop: {
          '0%': { transform: 'scale(0)' },
          '70%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        notifSlideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
export default config
