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
        'events',
        'os',
        'path',
        'fs',
        'net',
        'tls',
        'child_process',
        'readline',
        'querystring',
        'string_decoder',
        'timers',
        'assert',
        'constants',
        'domain',
        'punycode',
        'vm',
        'zlib'
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
      // Add specific aliases for problematic modules
      "stream": "stream-browserify",
      "buffer": "buffer",
      "util": "util",
      "crypto": "crypto-browserify",
      "process": "process/browser",
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          blockchain: ['ethers', '@vechain/connex', '@vechain/sdk-core', '@vechain/sdk-network'],
        },
        format: 'es',
        generatedCode: {
          constBindings: true,
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      requireReturnsDefault: 'auto',
      esmExternals: (id) => {
        // Don't externalize React and related packages
        if (id.includes('react') || id.includes('@radix-ui')) {
          return false;
        }
        return true;
      },
    },
    target: 'esnext',
    minify: 'terser',
  },
  optimizeDeps: {
    include: [
      'ethers', 
      '@vechain/connex', 
      '@vechain/sdk-core', 
      '@vechain/sdk-network',
      'buffer',
      'stream-browserify',
      'crypto-browserify',
      'util',
      'process'
    ],
  },
}));
