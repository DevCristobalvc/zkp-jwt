import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  // @ts-ignore - vite plugin types mismatch
  plugins: [
    react(),
    nodePolyfills({
      // Include specific polyfills
      include: ['buffer', 'events', 'assert', 'stream'],
      // Enable global shims
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
