import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn';//中文
import locale from 'element-plus/es/locale/lang/zh-cn';//中文
import ElementPlus from 'element-plus'
import VueLazyload from 'vue-lazyload'

createApp(App).use(VueLazyload, {
    preLoad: 1.3,
    error: 'http://www.life-moment.top/images/static/error.jpg',
    loading: 'http://www.life-moment.top/images/static/loading.gif',
    attempt: 1, // 尝试加载图片的次数
}).use(store).use(router).use(ElementPlus,{ locale }).mount('#app')
