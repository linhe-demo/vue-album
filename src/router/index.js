import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life/life.vue'
import Config from '../components/config/config.vue'
import Login from '../components/login/login.vue'
import Error from '../components/error/error.vue'
import Main from '../components/main/main.vue'

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
    },
    {
        path: '/main',
        name: 'main',
        component: Main
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
