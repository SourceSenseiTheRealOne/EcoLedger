import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Custom plugin to handle exports issue
function exportsPolyfill() {
  return {
    name: 'exports-polyfill',
    generateBundle(options, bundle) {
      // Add exports polyfill to the main bundle
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.isEntry) {
          chunk.code = `(function() { if (typeof exports === 'undefined') { window.exports = {}; } if (typeof module === 'undefined') { window.module = {}; } })();\n${chunk.code}`;
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    exportsPolyfill(),
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
      // Fix VeChain SDK imports
      "@vechain/ethers/utils/abi-coder": "@vechain/ethers/utils/abi-coder.js",
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.browser': true,
    'process.version': '"v16.0.0"',
    'exports': '{}',
    'module': '{}',
    'require': 'undefined',
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
      strictRequires: true,
      ignore: ['conditional-runtime-dependency'],
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
      '@vechain/ethers',
      'thor-devkit',
      'buffer',
      'stream-browserify',
      'crypto-browserify',
      'util',
      'process'
    ],
  },
}));
