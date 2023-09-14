import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life-moment/life.vue'
import Config from '../components/config/config.vue'
import Login from '../components/login/login.vue'
import Error from '../components/error/error.vue'

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
    },
    {
        path: '/life',
        name: 'life',
        component: Life
    },
    {
        path: '/error',
        name: 'error',
        component: Error
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
