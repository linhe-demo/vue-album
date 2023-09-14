import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import commonFunc from "./common/common";
import {nextTick} from "process";

const app = createApp(App)
nextTick(() => {
    app.config.globalProperties.$commonFunc = commonFunc
})
app.use(store).use(router).mount('#app')

export default app
