import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://felipe4992.github.io',
  base: '/mi-portafolio',
  vite: {
    plugins: [tailwindcss()],
  },
});
