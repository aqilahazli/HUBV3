import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

/**
 * Plugin to ensure full GitHub Pages SPA compatibility for /SHOPPINGHUB/:
 * 1. In production build (`npm run build`), copies `dist/index.html` to `dist/404.html`
 *    and creates `dist/.nojekyll` so deep links like `/SHOPPINGHUB/shop` and browser
 *    refreshes load the React SPA without a GitHub Pages 404 error.
 * 2. In local development (`npm run dev`), allows accessing either `/` or `/SHOPPINGHUB/`
 *    seamlessly.
 */
function githubPagesSpaPlugin(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (
          req.url &&
          !req.url.startsWith('/SHOPPINGHUB') &&
          !req.url.startsWith('/@') &&
          !req.url.startsWith('/node_modules')
        ) {
          req.url = `/SHOPPINGHUB${req.url === '/' ? '/' : req.url}`;
        }
        next();
      });
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexHtml = path.join(distDir, 'index.html');
      const notFoundHtml = path.join(distDir, '404.html');
      const noJekyll = path.join(distDir, '.nojekyll');

      if (fs.existsSync(indexHtml)) {
        fs.copyFileSync(indexHtml, notFoundHtml);
      }
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(noJekyll, '');
      }
    },
  };
}

export default defineConfig({
  base: '/SHOPPINGHUB/',
  plugins: [react(), tailwindcss(), githubPagesSpaPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    hmr: process.env.DISABLE_HMR !== 'true',
    // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
