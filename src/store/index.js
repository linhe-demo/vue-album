import {createStore} from 'vuex'
import createPersistedState from "vuex-persistedstate"
import user from "./modules/user"

const userInfo = createPersistedState({
    key: "info",
    storage: window.localStorage,
    paths: ['user']
})

const store = createStore({
    state() {
        return {}
    },
    // Mutation 修改 state里面数据的唯一方法 只支持同步调用
    mutations: {},
    actions: {},
    modules: {
        user: user
    },
    plugins: [userInfo]
})

export default store
