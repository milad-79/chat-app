/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        app: ['"Roboto"', "sans-serif"],
      },
      colors: {
        header: "#128c7e",
        button: "#25d366",
        "gray-bg": "#bbbbbb",
      },
    },
  },
  plugins: [],
};
