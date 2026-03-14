/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			animation: {
				"pulse-once": "pulse-once 0.5s ease-out",
			},
			keyframes: {
				"pulse-once": {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.15)" },
				},
			},
		},
	},
	plugins: [],
};
