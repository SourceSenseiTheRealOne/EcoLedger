import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    nodePolyfills({
      include: [
        'crypto', 
        'http', 
        'https', 
        'url', 
        'util', 
        'stream', 
        'buffer', 
        'process',
        'os',
        'path',
        'fs',
        'events',
        'querystring',
        'zlib',
        'net',
        'tls',
        'child_process'
      ],
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
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          blockchain: ['@vechain/dapp-kit-react', 'ethers'],
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: [
      '@vechain/dapp-kit-react',
      'ethers',
      'react',
      'react-dom',
    ],
  },
}));
