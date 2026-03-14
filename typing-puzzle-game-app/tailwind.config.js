/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			animation: {
				"pulse-once": "pulse-once 0.5s ease-out",
				"swap-bounce": "swap-bounce 0.3s ease-in-out",
			},
			keyframes: {
				"pulse-once": {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.15)" },
				},
				"swap-bounce": {
					"0%": { transform: "scale(1)" },
					"40%": { transform: "scale(0.82)" },
					"70%": { transform: "scale(1.12)" },
					"100%": { transform: "scale(1)" },
				},
			},
		},
	},
	plugins: [],
};
