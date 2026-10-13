// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Tailwind setup: https://tailwindcss.com/docs/installation/framework-guides/astro
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
