/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html}"],
  theme: {
    colors: {
      transparent: "transparent",
      base: "rgb(var(--color-base) / <alpha-value>)",
      "base-content": "rgb(var(--color-base-content) / <alpha-value>)",
      neutral: "rgb(var(--color-neutral) / <alpha-value>)",
      "neutral-content": "rgb(var(--color-neutral-content) / <alpha-value>)",
      accent: "rgb(var(--color-accent) / <alpha-value>)",
    },
    extend: {
      animation: {
        ripple: "450ms linear ripple",
      },

      keyframes: {
        ripple: {
          to: {
            transform: "scale(4)",
            opacity: "0",
          },
        },
      },
    },
  },
};
