// -- IMPORTS

import type { Config } from 'tailwindcss';

// -- STATEMENTS

export default {
    content:
        [
            './pages/**/*.{ts,tsx}',
            './components/**/*.{ts,tsx}',
            './app/**/*.{ts,tsx}',
            './src/**/*.{ts,tsx}'
        ],
    prefix: ''
} satisfies Config;