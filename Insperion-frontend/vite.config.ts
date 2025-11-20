import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'motion/react': 'framer-motion',
      '@zama-fhe/relayer-sdk': path.resolve(__dirname, 'node_modules/@zama-fhe/relayer-sdk/dist/browser')
    }
  }
});
