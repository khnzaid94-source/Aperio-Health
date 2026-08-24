import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (!id.includes('node_modules')) return undefined;
                    if (
                        id.includes('recharts') ||
                        id.includes('d3-') ||
                        id.includes('victory-vendor') ||
                        id.includes('decimal.js') ||
                        id.includes('internmap')
                    ) {
                        return 'charts';
                    }
                    return 'vendor';
                }
            }
        }
    },
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true
            }
        }
    }
})

