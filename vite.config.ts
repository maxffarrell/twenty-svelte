import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
export default defineConfig({ plugins: [tailwindcss(), sveltekit({ adapter: adapter(), alias: { '$lib': 'src/lib' } })], resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined, test: { environment: 'jsdom', include: ['tests/**/*.test.ts'] } });
