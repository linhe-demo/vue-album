import {createStore} from 'vuex'
import * as Module from "module";

const store = new createStore({
    // 存储全局数据
    state: {

    },
    // 需要通过计算获取state里的内容获取数据（只能获取不能修改）
    getters: {
        // getToken(state) {
        //     return state.token
        // }
    },
    // 定义对state的各种操作（不支持异步操作）
    mutations: {
        updateUser(state, user) {
            state.user.token = user.token;
        }
    },
    //定义对state的各种操作（支持异步操作）
    actions: {
        // actToken(state, user) {
        //     state.commit('updateToken', token)
        // }
    },
    modules: {
        user: ModuleUser,
    }

})
export default store
