/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html}"],
  theme: {
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
