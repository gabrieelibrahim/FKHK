/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5857",
        "primary-dark": "#1e3e3d",
        accent: "#FDBB0B",
        "accent-dark": "#D99B00",
      },
      fontFamily: {
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

