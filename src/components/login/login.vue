<template>
  <div class="login-page">
    <div class="login-form">
      <div>
        <el-form ref="loginForm" :model="loginData" @submit.native.prevent>
          <el-form-item label="用户名：" label-width="80px">
            <el-input v-model="loginData.userName"></el-input>
          </el-form-item>
          <el-form-item label="密&nbsp;&nbsp; 码：" label-width="80px">
            <el-input type="password" v-model="loginData.passWord"></el-input>
          </el-form-item>
          <el-form-item v-show="registerStatus" label="昵&nbsp;&nbsp; 称：" label-width="80px">
            <el-input v-model="loginData.nickname"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="login-btn">
              <el-button v-show="registerStatus" type="primary" @click="backLogin" class="btn">返回登录页</el-button>
              <el-button v-show="loginStatus" type="primary" @click="login" class="btn">登录</el-button>
              <el-button v-show="loginStatus" type="primary" @click="register" class="btn">注册</el-button>
              <el-button v-show="registerStatus" type="primary" @click="commit" class="btn">提交</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div style="color:white;text-align: center;margin-top: 10px;font-size: 10px;">@Copyright 2021-{{ currentYear }} by
      林鹤
    </div>
    <div style="color:white;text-align: center;margin-top: 3px;font-size: 8px;">
      <a target="_blank" href="https://beian.miit.gov.cn/"
         style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:white;">豫ICP备2023017522号-1</p>
      </a>
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41152502000215"
         style="display:inline-block;text-decoration:none;height:20px;line-height:20px;margin-left: 10px;"><img
          src="http://www.life-moment.top/images/static/batb.png" style="float:left;"/>
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:white;">豫公网安备
          41152502000215号</p></a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

export default {
  data() {
    return {
      store: {},
      commonFunc: {},
      loginData: {
        userName: '',
        passWord: '',
        nickname: ''
      },
      userInfo: [],
      currentYear: '',
      route: {},
      registerStatus: false,
      loginStatus: true
    };
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    this.store = useStore()
    this.route = useRouter()
    this.autoLogin()
  },
  methods: {
    login() {
      this.loginStatus = true

      if (this.loginData.userName.length === 0) {
        alert("用户名不能为空");
        return
      }
      if (this.loginData.passWord.length === 0) {
        alert("用户密码不能为空");
        return
      }

      axios.post(process.env.BASE_URL + '/api/v1/user/login', this.loginData)
          .then(res => {
            if (res.data.code === 200) {
              this.store.commit("user/updateUserToken", res.data.data.token)
              this.store.commit("user/updateUserNickname", res.data.data.nickname)
              this.route.replace({path: '/main'});
            } else {
              alert(res.data.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    autoLogin() {
      let token = useStore().state.user.token
      axios.post(process.env.BASE_URL + '/api/v1/auto/login', this.loginData, {
        headers: {
          'Authorization': token
        }
      })
          .then(res => {
            if (res.data.code === 200) {
              this.route.replace({path: '/main'});
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    register() {
      this.registerStatus = true
      this.loginStatus = false
    },

    commit() {
      if (this.loginData.userName.length === 0) {
        alert("用户名不能为空");
        return
      }
      if (this.loginData.passWord.length === 0) {
        alert("用户密码不能为空");
        return
      }
      if (this.loginData.passWord.length === 0) {
        alert("用户昵称不能为空");
        return
      }

      axios.post(process.env.BASE_URL + '/api/v1/user/register', this.loginData)
          .then(res => {
            if (res.data.code === 200) {
              this.route.push({path: '/'});
            } else {
              alert(res.data.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    backLogin() {
      this.registerStatus = false
      this.loginStatus = true
    }
  }
};
</script>

<style scoped>
.login-page {
  background-image: url("http://www.life-moment.top/images/static/bk.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  height: 100%;
  border-radius: 5px;
}

.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
}

.login-btn {
  width: 100%;
  text-align: right;
}

::v-deep(.el-form-item__label) {
  color: white;
}

::v-deep(.el-form--label-right) {
  margin-top: 120px;
}
</style>
