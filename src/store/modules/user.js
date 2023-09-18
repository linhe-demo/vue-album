const user = {
    namespaced: true,
    state() {
        return {
            nickname: "",
            token: ""
        }
    },
    mutations: {
        //   修改用户信息,payload就是用户信息对象
        updateUserToken(state, token) {
            state.token = token
        },
        updateUserNickname(state, nickname) {
            state.nickname = nickname
        }
    }
}

export default user
