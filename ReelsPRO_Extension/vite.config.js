import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
            }
        },
        rollupOptions: {
            input: "src/content.js",
            output: {
                format: "iife",
                name: "content",
                dir: "dist",
                entryFileNames: "[name].js",
            },
        },
    },
    css: {
        postcss: false, // Disable PostCSS processing
    },
});
