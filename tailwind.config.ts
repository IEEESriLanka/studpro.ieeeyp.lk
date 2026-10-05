import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@uploadthing/react/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {      
      colors: {
        primary: {
          DEFAULT: "#EE7929",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#065E86",
          foreground: "#000000",
        },
        black: "#000000",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        border: "var(--border)",
      }
    },
  },
  plugins: [],
};

export default config;