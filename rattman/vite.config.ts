import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
    build: {
        outDir: 'build',
    },
    plugins: [
        react(),
        VitePWA(),
        svgrPlugin({
            svgrOptions: {
                icon: true,
            },
        }),
    ],
});
