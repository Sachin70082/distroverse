import { defineConfig } from 'vite';

export default defineConfig({
  // Other Vite configurations
  server: {
    proxy: {
      '/api': {
        target: 'https://lyf-music-dashboard.onrender.com', // Your API server address
        changeOrigin: true,
        // Rewrite the path if necessary
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/another-api': {
        target: 'https://another-api.example.com', // Another API server address
        changeOrigin: true,
        // Rewrite the path if necessary
        rewrite: (path) => path.replace(/^\/another-api/, ''),
      },
      
    },
  },
});
