/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        kemenag: {
          green: '#006838',
          gold: '#FFC72C',
          dark: '#004724',
          light: '#E6F3ED',
        },
      },
    },
  },
  plugins: [],
};
