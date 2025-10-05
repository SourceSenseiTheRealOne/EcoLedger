import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Custom plugin to handle exports issue
const fixExportsPlugin = () => ({
  name: 'fix-exports',
  generateBundle(options, bundle) {
    Object.keys(bundle).forEach(fileName => {
      const file = bundle[fileName];
      if (file.type === 'chunk' && file.code) {
        // Replace problematic exports references
        file.code = file.code
          .replace(/typeof exports !== 'undefined' \? exports : \{\}/g, '{}')
          .replace(/typeof module !== 'undefined' \? module : \{\}/g, '{}')
          .replace(/exports\./g, '{}')
          .replace(/module\.exports/g, '{}');
      }
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    fixExportsPlugin(),
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
    'exports': '{}',
    'module': '{}',
    'require': 'undefined',
    'globalThis.exports': '{}',
    'globalThis.module': '{}',
    'globalThis.require': 'undefined',
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
      strictRequires: false,
      ignore: ['conditional-runtime-dependency'],
      esmExternals: false,
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
