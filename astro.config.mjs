import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://2felipec.github.io',
  base: '/mi-portafolio',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
