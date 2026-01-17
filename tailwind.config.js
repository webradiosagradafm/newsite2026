/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    fontWeight: {
      normal: "400",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  corePlugins: {
    fontWeight: false, // 🚨 desativa font-bold, font-medium etc
  },
  plugins: [],
};
