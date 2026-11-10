import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ------------------------------------------------------------
// Vite development server proxy configuration
// ------------------------------------------------------------
// The frontend makes API calls to relative paths like /api/parts.
// During development the Vite dev server runs on port 5173 while the
// Express backend runs on port 5001. Without a proxy the browser tries
// to fetch the API from the Vite server (404). The proxy below forwards
// any request that starts with /api to the backend, preserving the path
// and query string.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        // Optional logging for debugging proxy errors
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
});

