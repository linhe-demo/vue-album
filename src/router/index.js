import { createRouter, createWebHistory } from 'vue-router'
import Life from '../components/life-moment/life.vue'

const routes = [
    {
        path: '/',
        name: 'life',
        component: Life
    },
    // {
    //     path: '/about',
    //     name: 'about',
    //     component: () => import('../views/AboutView.vue')
    // }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
