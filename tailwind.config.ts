import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed', // Use this for main
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
                heading: ['var(--font-outfit)'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
};
export default config;
