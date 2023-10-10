import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn';//中文
import locale from 'element-plus/lib/locale/lang/zh-cn';//中文
import ElementPlus from 'element-plus'

createApp(App).use(store).use(router).use(ElementPlus,{ locale }).mount('#app')
