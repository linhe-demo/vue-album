import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life-moment/life.vue'
import Config from '../components/config/config.vue'
import Login from '../components/login/login.vue'

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
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
