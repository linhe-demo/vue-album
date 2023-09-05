<template>
  <div class="login-page">
    <div class="login-form">
      <div class="title">来将可留姓名</div>
      <el-form ref="loginForm" :model="loginData" @submit.native.prevent>
        <el-form-item label="用户名：" label-width="80px">
          <el-input v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item label="密&nbsp;&nbsp; 码：" label-width="80px">
          <el-input type="password" v-model="loginData.password"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="register">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div style="color:#adadad;text-align: center;margin-top: 5px;font-size: 8px;">
    <a href="https://beian.miit.gov.cn/" target="_blank"
       style="text-decoration: none;color:#adadad">豫ICP备2023017522号-1</a>
    <a href="javascript:" target="_blank"
       style="text-decoration: none;color:#adadad;margin-left: 5px;">沪公安网备2023017522</a>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      userInfo:[]
    };
  },
  methods: {
    login() {
      if (this.loginData.username.length === 0) {
        alert("用户名不能为空");
        return
      }if (this.loginData.password.length === 0) {
        alert("用户密码不能为空");
        return
      }

      axios.post(process.env.REQUEST_URL + '/api/v1/user/login', this.loginData)
          .then(response => {
            this.userInfo = response.data.data
          })
          .catch(error => {
            console.log(error);
          });
    },
    register() {
      // 在这里编写登录逻辑，例如发送登录请求到服务器进行验证
      // ...
    }
  }
};
</script>

<style scoped>
.login-page {
  background-image: url("./public/img/login.jpg");
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
  height: 100%;
}
.title{
  position: absolute;
  /* left: 38%; */
  top: 33%;
  /* font-weight: bold; */
  font-size: 20px;
  width: 100%;
  color: white;
  text-align: center;
}
.login-btn {
  width: 100%;
  text-align: right;
}
</style>
