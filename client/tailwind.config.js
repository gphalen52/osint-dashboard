/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#1B1E22",
        panel: "#24282D",
        hairline: "#33383F",
        ink: "#E4E2DD",
        muted: "#8A8F96",
        signal: "#E8A33D",
        info: "#5FA8A0",
        alert: "#C1493D",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
