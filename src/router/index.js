import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life-moment/life.vue'
import Config from '../components/config/config.vue'

const routes = [
    {
        path: '/',
        name: 'life',
        component: Life
    },
    {
        path: '/config',
        name: 'config',
        component: Config
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
