/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4CAF50',
          dark: '#66BB6A',
          deep: '#2E7D32',
        },
        accent: '#FFC107',
        bg: {
          light: '#F7F8FA',
          dark: '#121212',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        text: {
          primary: {
            light: '#1C1C1E',
            dark: '#FFFFFF',
          },
          secondary: {
            light: '#6B7280',
            dark: '#A1A1AA',
          },
        },
        border: {
          light: '#E5E7EB',
          dark: '#2A2A2A',
        },
        error: '#EF4444',
        mood: {
          positive: '#4CAF50',
          neutral: '#6B7280',
          negative: '#EF4444',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['32px', '36px'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.08)',
        card: '0 4px 12px rgba(15, 23, 42, 0.10)',
        elevated: '0 8px 24px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
