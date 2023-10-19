import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life/life.vue'
import Config from '../components/config/config.vue'
import Login from '../components/login/login.vue'
import Error from '../components/error/error.vue'
import Main from '../components/main/main.vue'
import Picture from '../components/picture/picture.vue'
import Date from '../components/datecard/date.vue'

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
    },
    {
        path: '/picture',
        name: 'picture',
        component: Picture
    },
    {
        path: '/date',
        name: 'date',
        component: Date
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
