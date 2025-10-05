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
        'crypto', 'http', 'https', 'url', 'util', 'stream', 'buffer', 
        'fs', 'path', 'os', 'vm', 'child_process', 'events', 'assert',
        'timers', 'tty', 'readline', 'querystring', 'punycode'
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
      // Polyfill problematic modules
      "vm": "vm-browserify",
      "stream": "stream-browserify",
      "crypto": "crypto-browserify",
      "buffer": "buffer",
      "process": "process/browser",
      "util": "util",
      "assert": "assert",
      "events": "events",
      "timers": "timers-browserify",
      "tty": "tty-browserify",
      "readline": "readline-browserify",
      "querystring": "querystring-es3",
      "punycode": "punycode",
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.NODE_DEBUG': 'false',
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          blockchain: ['@vechain/dapp-kit-react', '@vechain/connex'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: [
      '@vechain/dapp-kit-react', 
      '@vechain/connex',
      'buffer',
      'process',
      'util',
      'events',
      'assert',
      'stream-browserify',
      'crypto-browserify',
      'vm-browserify',
      'timers-browserify',
      'tty-browserify',
      'readline-browserify',
      'querystring-es3',
      'punycode',
    ],
  },
}));
