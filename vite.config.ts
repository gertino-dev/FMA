import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // server: {
    //   hmr: true,
    //   proxy: {
    //     '/api': {
    //       target: 'http://127.0.0.1:8787',
    //       changeOrigin: true,
    //     },
    //     '/uploads': {
    //       target: 'http://127.0.0.1:8787',
    //       changeOrigin: true,
    //     },
    //   },
    // },
  };
});
