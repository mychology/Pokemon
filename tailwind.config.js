export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#d43b2b",
        panel: "#e6e6e6",
        panel2: "#d7d7d7",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
