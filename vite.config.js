// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // so we have document, window, etc.
    setupFiles: ['./src/setupTests.js'], // we’ll create this file next
    // you can also configure coverage, reporters, etc. here
  },
});
