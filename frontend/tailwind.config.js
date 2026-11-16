/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        peach: "#EDC69B", cream: "#FCF6D2", sage: "#B3C58B", forest: "#637A60",
        paper: "#FFFDF2", ink: "#2E3B2D", rust: "#B5532F",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "sans-serif"],
        sans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
