import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // @ts-expect-error - Plugin type mismatch between workspace and local vite versions
    react(),
    // @ts-expect-error - Plugin type mismatch between workspace and local vite versions
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
