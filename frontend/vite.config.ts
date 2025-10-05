import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['crypto', 'buffer', 'process', 'stream', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer",
      "crypto": "crypto-browserify",
      "stream": "stream-browserify",
      "util": "util",
      "process": "process/browser",
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'exports': '{}',
    'module': '{}',
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [
        '@vechain/connex',
        '@vechain/sdk-core',
        '@vechain/sdk-network',
        '@vechain/dapp-kit-react',
        'thor-devkit',
        '@vechain/connex-framework',
        '@walletconnect/core',
        '@walletconnect/types',
        'validator-ts'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
