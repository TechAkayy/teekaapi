// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Tailwind setup: https://tailwindcss.com/docs/installation/framework-guides/astro
// Fonts: https://docs.astro.build/en/guides/fonts/
// Astro downloads the font files at build time and serves them from the site.
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Space Grotesk',
      cssVariable: '--font-space-grotesk',
      weights: ['300 700'],
      styles: ['normal'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'DM Sans',
      cssVariable: '--font-dm-sans',
      weights: ['400 700'],
      styles: ['normal'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Pacifico',
      cssVariable: '--font-pacifico',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['cursive'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
