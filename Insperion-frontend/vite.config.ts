import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      'motion/react': 'framer-motion',
      '@zama-fhe/relayer-sdk': path.resolve(__dirname, 'node_modules/@zama-fhe/relayer-sdk/dist/browser'),
            "@": path.resolve(__dirname, "./src"),
    }
  }
});
