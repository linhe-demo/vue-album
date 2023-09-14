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
            'BASE_URL': 'http://life-moment.top:8806'
            // 'REQUEST_URL': 'http://127.0.0.1:8806'
        }
    }
})
