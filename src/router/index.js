import {createRouter, createWebHistory} from 'vue-router'
import Life from '../components/life/life.vue'
import Config from '../components/config/config.vue'
import Login from '../components/login/login.vue'
import Error from '../components/error/error.vue'
import Main from '../components/main/main.vue'
import Picture from '../components/picture/picture.vue'
import Date from '../components/date/date.vue'
import Felling from '../components/felling/index.vue'
import Baby from '../components/baby/index.vue'
import Food from '../components/food/index.vue'
import BabyLife from '../components/babyLife/index.vue'

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
    },
    {
        path: '/felling',
        name: 'felling',
        component: Felling
    },
    {
        path: "/baby",
        name: 'baby',
        component: Baby
    },
    {
        path: "/food",
        name: 'food',
        component: Food
    },
    {
        path: "/babyLife",
        name: 'babyLife',
        component: BabyLife
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
