import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life-moment/life.vue'
import Config from '../components/config/config.vue'
import Login from '../components/login/login.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
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
