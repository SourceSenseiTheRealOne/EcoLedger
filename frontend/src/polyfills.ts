// Polyfills for browser compatibility
// This file provides Node.js polyfills for browser environment

// Polyfill for require function
if (typeof window !== 'undefined' && typeof (window as any).require === 'undefined') {
  (window as any).require = (id: string) => {
    console.warn(`require('${id}') called in browser environment - this is not supported`);
    
    // Return empty objects for common Node.js modules
    const commonModules: Record<string, any> = {
      'crypto': {},
      'stream': {},
      'buffer': {},
      'util': {},
      'events': {},
      'path': {},
      'fs': {},
      'os': {},
      'http': {},
      'https': {},
      'url': {},
      'querystring': {},
      'zlib': {},
      'net': {},
      'tls': {},
      'child_process': {},
      'process': (window as any).process || {},
    };
    
    return commonModules[id] || {};
  };
}

// Polyfill for module.exports
if (typeof window !== 'undefined' && typeof (window as any).module === 'undefined') {
  (window as any).module = { exports: {} };
}

// Polyfill for exports
if (typeof window !== 'undefined' && typeof (window as any).exports === 'undefined') {
  (window as any).exports = {};
}

// Ensure process is available
if (typeof window !== 'undefined' && typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {},
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: (callback: Function) => setTimeout(callback, 0),
  };
}

// Ensure Buffer is available
if (typeof window !== 'undefined' && typeof (window as any).Buffer === 'undefined') {
  // Buffer will be provided by vite-plugin-node-polyfills
  console.log('Buffer polyfill will be provided by vite-plugin-node-polyfills');
}

// Ensure global is available
if (typeof window !== 'undefined' && typeof (window as any).global === 'undefined') {
  (window as any).global = globalThis;
}

// Polyfill for WebRTC and other browser APIs that might be missing
if (typeof window !== 'undefined') {
  // Ensure RTCPeerConnection is available (for wallet connections)
  if (typeof (window as any).RTCPeerConnection === 'undefined') {
    (window as any).RTCPeerConnection = class RTCPeerConnection {
      constructor() {
        console.warn('RTCPeerConnection not available in this environment');
      }
    };
  }
  
  // Ensure WebSocket is available
  if (typeof (window as any).WebSocket === 'undefined') {
    (window as any).WebSocket = class WebSocket {
      constructor() {
        console.warn('WebSocket not available in this environment');
      }
    };
  }
  
  // Ensure navigator.mediaDevices is available
  if (typeof navigator !== 'undefined' && !navigator.mediaDevices) {
    (navigator as any).mediaDevices = {
      getUserMedia: () => Promise.reject(new Error('getUserMedia not available')),
      enumerateDevices: () => Promise.resolve([]),
    };
  }
}

export {};
