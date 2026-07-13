<template>
  <div class="login-page">
    <!-- 动态背景光晕 -->
    <div class="bg-glow"></div>

    <div class="login-container">
      <div class="login-card">
        <div class="form-header">
          <h2 class="title">{{ registerStatus ? '创建账号' : '欢迎回来' }}</h2>
          <p class="subtitle">{{ registerStatus ? '填写信息，加入我们' : '登录以继续你的旅程' }}</p>
        </div>

        <el-form
            ref="loginForm"
            :model="loginData"
            :rules="formRules"
            @submit.native.prevent
            class="login-form"
        >
          <el-form-item prop="userName">
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <el-input
                  v-model="loginData.userName"
                  placeholder="用户名"
                  size="large"
                  class="fancy-input"
              />
            </div>
          </el-form-item>

          <el-form-item prop="passWord">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <el-input
                  type="password"
                  v-model="loginData.passWord"
                  placeholder="密码"
                  size="large"
                  show-password
                  class="fancy-input"
              />
            </div>
          </el-form-item>

          <el-form-item v-show="registerStatus" prop="nickname">
            <div class="input-wrapper">
              <span class="input-icon">✏️</span>
              <el-input
                  v-model="loginData.nickname"
                  placeholder="昵称"
                  size="large"
                  class="fancy-input"
              />
            </div>
          </el-form-item>

          <div class="form-actions">
            <el-button
                v-show="registerStatus"
                type="default"
                @click="backLogin"
                class="btn btn-outline"
            >
              返回
            </el-button>
            <el-button
                v-show="loginStatus"
                type="primary"
                @click="login"
                class="btn btn-primary"
                :loading="loading"
            >
              登录
            </el-button>
            <el-button
                v-show="loginStatus"
                type="default"
                @click="register"
                class="btn btn-outline"
            >
              注册
            </el-button>
            <el-button
                v-show="registerStatus"
                type="primary"
                @click="commit"
                class="btn btn-primary"
                :loading="loading"
            >
              提交注册
            </el-button>
          </div>
        </el-form>

        <div class="form-footer">
          <p class="copyright">© 2021-{{ currentYear }} 林鹤 版权所有</p>
          <div class="beian">
            <a target="_blank" href="https://beian.miit.gov.cn/">豫ICP备2023017522号-1</a>
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41152502000215">
              <img src="http://www.life-moment.top/images/static/batb.png" alt="备案图标"/>
              豫公网安备 41152502000215号
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useStore } from 'vuex'
import { useRouter } from "vue-router";

export default {
  data() {
    const validateUserName = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入用户名'));
      if (value.length < 3) return callback(new Error('用户名至少3个字符'));
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入密码'));
      if (value.length < 6) return callback(new Error('密码至少6个字符'));
      callback();
    };
    const validateNickname = (rule, value, callback) => {
      if (this.registerStatus && !value) return callback(new Error('请输入昵称'));
      callback();
    };

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
      loginStatus: true,
      loading: false,
      formRules: {
        userName: [{ validator: validateUserName, trigger: 'blur' }],
        passWord: [{ validator: validatePassword, trigger: 'blur' }],
        nickname: [{ validator: validateNickname, trigger: 'blur' }]
      }
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
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.$message({ type: 'warning', message: '请正确填写表单' });
          return;
        }
        this.loading = true;
        axios.post(process.env.BASE_URL + '/api/v1/user/login', this.loginData)
            .then(res => {
              this.loading = false;
              if (res.data.code === 200) {
                this.store.commit("user/updateUserToken", res.data.data.token)
                this.store.commit("user/updateUserNickname", res.data.data.nickname)
                this.$message({ type: 'success', message: '登录成功' });
                this.route.replace({ path: '/date' });
              } else {
                this.$message({ type: 'error', message: res.data.message });
              }
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
              this.$message({ type: 'error', message: '网络错误，请稍后重试' });
            });
      });
    },
    autoLogin() {
      let token = useStore().state.user.token
      axios.post(process.env.BASE_URL + '/api/v1/auto/login', this.loginData, {
        headers: { 'Authorization': token }
      })
          .then(res => {
            if (res.data.code === 200) {
              this.route.replace({ path: '/date' });
            }
          })
          .catch(error => { console.log(error); });
    },
    register() {
      this.registerStatus = true
      this.loginStatus = false
      this.$nextTick(() => { this.$refs.loginForm.clearValidate(); });
    },
    commit() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.$message({ type: 'warning', message: '请正确填写表单' });
          return;
        }
        this.loading = true;
        axios.post(process.env.BASE_URL + '/api/v1/user/register', this.loginData)
            .then(res => {
              this.loading = false;
              if (res.data.code === 200) {
                this.$message({ type: 'success', message: res.data.data.msg || '注册成功' });
                this.backLogin()
              } else {
                this.$message({ type: 'error', message: res.data.data.msg || '注册失败' });
              }
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
              this.$message({ type: 'error', message: '网络错误，请稍后重试' });
            });
      });
    },
    backLogin() {
      this.registerStatus = false
      this.loginStatus = true
      this.$nextTick(() => { this.$refs.loginForm.clearValidate(); });
    }
  }
};
</script>

<style scoped>
/* ----- 全局重置 & 背景 ----- */
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(145deg, #f5f0ff 0%, #e8f0fe 100%);
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

/* 动态光晕 */
.bg-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 40%, rgba(167, 139, 250, 0.25) 0%, transparent 70%);
  top: -100px;
  right: -100px;
  animation: floatGlow 12s ease-in-out infinite alternate;
}
@keyframes floatGlow {
  0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  100% { transform: translate(-60px, 80px) scale(1.2); opacity: 1; }
}
.bg-glow::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle at 70% 60%, rgba(196, 181, 253, 0.2) 0%, transparent 70%);
  bottom: -150px;
  left: -150px;
  animation: floatGlow2 15s ease-in-out infinite alternate;
}
@keyframes floatGlow2 {
  0% { transform: translate(0, 0) scale(0.8); }
  100% { transform: translate(80px, -60px) scale(1.3); }
}

/* ----- 卡片（毛玻璃） ----- */
.login-container {
  width: 100%;
  max-width: 400px;
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 32px;
  padding: 40px 36px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.login-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.08);
}

/* ----- 头部 ----- */
.form-header {
  text-align: left;
  margin-bottom: 28px;
}
.form-header .title {
  font-size: 26px;
  font-weight: 300;
  color: #1a1a2e;
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}
.form-header .subtitle {
  font-size: 14px;
  font-weight: 300;
  color: rgba(26, 26, 46, 0.5);
  margin: 0;
  letter-spacing: 0.2px;
}

/* ----- 表单输入（极简下划线风格） ----- */
.login-form {
  margin-top: 6px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
}
.input-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: rgba(26, 26, 46, 0.3);
  z-index: 2;
  line-height: 1;
  pointer-events: none;
}

:deep(.fancy-input .el-input__wrapper) {
  border: none;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 0;
  background: transparent;
  padding: 0 0 0 30px;
  box-shadow: none !important;
  transition: border-color 0.3s;
}
:deep(.fancy-input .el-input__wrapper:hover) {
  border-bottom-color: rgba(0, 0, 0, 0.2);
}
:deep(.fancy-input .el-input__wrapper.is-focus) {
  border-bottom-color: #6c5ce7;
}
:deep(.fancy-input .el-input__inner) {
  height: 44px;
  font-size: 15px;
  color: #1a1a2e;
  background: transparent;
  padding: 0;
}
:deep(.fancy-input .el-input__inner::placeholder) {
  color: rgba(26, 26, 46, 0.3);
  font-weight: 300;
}

/* 密码框后缀图标 */
:deep(.fancy-input .el-input__suffix) {
  color: rgba(26, 26, 46, 0.3);
}

/* ----- 按钮（胶囊式） ----- */
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  flex: 1;
  min-width: 100px;
  height: 48px;
  border-radius: 40px;
  font-weight: 400;
  font-size: 15px;
  letter-spacing: 0.3px;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: #6c5ce7;
  color: #fff;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.25);
}
.btn-primary:hover {
  background: #5a4bd1;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}

.btn-outline {
  background: transparent;
  color: #6c5ce7;
  border: 1.5px solid rgba(108, 92, 231, 0.2);
}
.btn-outline:hover {
  background: rgba(108, 92, 231, 0.04);
  border-color: #6c5ce7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.08);
}
.btn-outline:active {
  transform: translateY(0);
}

/* 加载状态保留原有样式 */
.btn-primary.is-loading {
  background: #6c5ce7;
}

/* ----- 页脚 ----- */
.form-footer {
  margin-top: 28px;
  text-align: center;
}
.copyright p {
  font-size: 12px;
  color: rgba(26, 26, 46, 0.3);
  margin: 0 0 8px;
  font-weight: 300;
}
.beian {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.beian a {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: rgba(26, 26, 46, 0.3);
  text-decoration: none;
  transition: color 0.2s;
}
.beian a:hover {
  color: #6c5ce7;
}
.beian img {
  height: 14px;
  margin-right: 4px;
}

/* 响应式 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  .form-actions {
    flex-direction: column;
  }
  .btn {
    width: 100%;
  }
}
</style>