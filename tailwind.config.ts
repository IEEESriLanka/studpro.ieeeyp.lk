import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				destructive: "var(--destructive)",
			},
			fontFamily: {
				sans: ["var(--font-inter)", "system-ui", "sans-serif"],
				display: ["var(--font-bebas)", "Impact", "Arial Narrow", "sans-serif"],
				serif: ["var(--font-fraunces)", "Georgia", "serif"],
			},
			borderRadius: {
				sm: "calc(var(--radius) - 2px)",
				md: "var(--radius)",
				lg: "calc(var(--radius) + 4px)",
				xl: "calc(var(--radius) + 8px)",
			},
			boxShadow: {
				soft: "var(--shadow-soft)",
			},
			maxWidth: {
				prose: "65ch",
				container: "1200px",
			},
		},
	},
	plugins: [],
};

export default config;
