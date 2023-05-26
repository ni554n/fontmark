/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html}"],
  theme: {},
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
