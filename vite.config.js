import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    define: {
        'process.env': {
            "MUSIC_URL": "http://www.life-moment.top/music",
            "RESOURCE_URL": "http://www.life-moment.top/images/static",
            'BASE_URL': 'http://139.196.50.102:8080'
            // 'REQUEST_URL': 'http://127.0.0.1:8080'
        }
    },
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {// 分包
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0].toString();
                    }
                },
            },
        },
    },
})
