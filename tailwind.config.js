/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./views/*.handlebars','./views/**/*.handlebars', './src/**/*.{js,jsx,ts,tsx,vue,handlebars}', './public/index.html'], 
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

