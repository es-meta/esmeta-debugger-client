/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    fontWeight: {
      "100": "100",
      "200": "200",
      "300": "300",
      "400": "400",
      "500": "500",
      "600": "600",
      "700": "700",
      "800": "800",
      "900": "900",
    },

    extend: {
      colors: {
        es: {
          "50": '#fff6f0',
          "100": '#ffedd9',
          "200": '#ffdcb3',
          "300": '#ffcb8d',
          "400": '#ff9f44',
          "500": '#ffa31a',
          "600": '#ff9900',
          "700": '#ff8a00',
          "800": '#ff7a00',
          "900": '#ff6b00',
        }
      }
    },
  },
  plugins: [],
};
