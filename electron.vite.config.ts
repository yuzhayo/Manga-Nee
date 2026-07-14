import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()],
        build: {
            outDir: 'out/main',
            lib: {
                entry: path.resolve(currentDirectory, 'src/main.ts'),
            },
        },
    },
    preload: {
        plugins: [externalizeDepsPlugin()],
        build: {
            outDir: 'out/preload',
            lib: {
                entry: path.resolve(currentDirectory, 'src/preload.ts'),
            },
        },
    },
    renderer: {
        root: path.resolve(currentDirectory, 'src'),
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(currentDirectory, 'src'),
            },
        },
        build: {
            outDir: path.resolve(currentDirectory, 'out/renderer'),
            rollupOptions: {
                input: path.resolve(currentDirectory, 'src/index.html'),
            },
        },
    },
});
