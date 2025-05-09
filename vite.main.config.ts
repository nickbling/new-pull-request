import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react(), svgr()],
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        target: 'esnext',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/pages/main.tsx'),
            },
            output: {
                format: 'iife',
                inlineDynamicImports: true,
                entryFileNames: 'main.js',
            },
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '.'),
        },
    },
});