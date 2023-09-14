import {createStore} from 'vuex'

const store = createStore({
    state() {
        return {
            nickname: "",
            token: ""
        }
    },
    // Mutation 修改 state里面数据的唯一方法 只支持同步调用
    mutations: {
        updateUserToken(state, token) {
            state.token = token
        },
        updateUserNickname(state, nickname) {
            state.nickname = nickname
        }
    },
    actions: {},
    modules: {}
})

export default store
