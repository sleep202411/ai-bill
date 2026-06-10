/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9AA2',
          dark: '#FF7E8A',
          light: '#FFB7C0',
        },
        accent: '#FF8FAB',
        surface: {
          DEFAULT: '#FFFFFF',
          border: '#FFD6E4',
        },
        bg: {
          top: '#FFE4EC',
          bottom: '#FFF5F8',
        },
        text: {
          primary: '#4A3F47',
          secondary: '#8E7A85',
          muted: '#B8A8B0',
          placeholder: '#C9B8C0',
        },
        border: {
          DEFAULT: '#FFC8DD',
          light: '#FFE8F0',
        },
        divider: '#F5E6EC',
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
