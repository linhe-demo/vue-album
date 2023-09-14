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
    },
    {
        path: '/life',
        name: 'life',
        component: Life
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
