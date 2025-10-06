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
        'vm',
        'events',
        'querystring',
        'punycode',
        'tty',
        'readline',
        'zlib',
        'net',
        'tls',
        'child_process',
        'cluster',
        'worker_threads',
        'perf_hooks',
        'async_hooks',
        'timers',
        'string_decoder',
        'assert',
        'constants',
        'domain',
        'http2',
        'inspector',
        'module',
        'repl',
        'trace_events',
        'v8'
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
        require: true,
      },
      // Ensure process is available globally
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add specific aliases for common Node.js modules
      "crypto": "crypto-browserify",
      "stream": "stream-browserify",
      "buffer": "buffer",
      "util": "util",
      "path": "path-browserify",
      "process": "process/browser",
      "os": "os-browserify/browser",
      "fs": false,
      "net": false,
      "tls": false,
      "child_process": false,
    },
  },
  define: {
    global: 'globalThis',
    'process.env': 'process.env',
    'process': 'globalThis.process',
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'crypto-browserify',
      'stream-browserify',
      'util',
      'path-browserify',
      'readable-stream',
      'os-browserify'
    ],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: (id) => {
        // Don't externalize these modules
        if (id.includes('@vechain/')) return false;
        if (id.includes('crypto-browserify')) return false;
        if (id.includes('stream-browserify')) return false;
        if (id.includes('buffer')) return false;
        if (id.includes('util')) return false;
        if (id.includes('path-browserify')) return false;
        if (id.includes('process')) return false;
        return false;
      },
    },
  },
}));