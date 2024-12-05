import { defineConfig } from 'vite';

export default defineConfig({
  root: './public', // Path to your HTML and frontend files
  server: {
    port: 3001, // Port where Vite runs
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to the backend
    },
  },
});
