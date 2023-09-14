import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import common from "./common/common";

//注意use要在mount之前
// createApp.prototype.common = common
createApp(App).use(router, store).mount('#app')
