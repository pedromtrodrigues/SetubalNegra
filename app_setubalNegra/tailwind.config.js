// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    // Seus paths de ficheiros aqui, ex:
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Isso define 'Inter' como a fonte primária para a classe 'font-sans'
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Você também pode definir uma nova família se não quiser sobrescrever 'sans'
      // inter: ['Inter', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
}