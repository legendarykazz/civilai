/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                'eng-blue': {
                    DEFAULT: '#0B1C2D', // Deep Engineering Blue
                    50: '#f0f4f8',
                    100: '#d9e2ec',
                    200: '#bcccdc',
                    300: '#9fb3c8',
                    400: '#829ab1',
                    500: '#627d98',
                    600: '#486581',
                    700: '#334e68',
                    800: '#243b53',
                    900: '#0B1C2D',
                    950: '#050E17',
                },
                'sky-blue': {
                    DEFAULT: '#87CEEB', // Light Sky Blue
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                },
                'cyan-accent': {
                    DEFAULT: '#00E5FF', // Electric Blue / Soft Cyan
                    glow: 'rgba(0, 229, 255, 0.5)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)' },
                    '50%': { opacity: '.8', boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)' },
                }
            }
        },
    },
    plugins: [],
}
