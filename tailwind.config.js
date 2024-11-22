/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: ['Poppins', 'sans-serif']
    },
    // gridTemplateColumns:{
    //   '70/30':'70% 28%',
    // },
  },
  variants: {
    extends: {},
  },
  plugins: [],
}

