import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const path = require('path');
// export
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/users': 'http://localhost:3000'
    }
  }
});
