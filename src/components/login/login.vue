<template>
  <div class="login-page">
    <!-- 背景装饰元素 -->
    <div class="decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- 登录表单卡片 -->
    <div class="login-container">
      <div class="login-card">
        <!-- 表单头部 -->
        <div class="form-header">
          <h2 class="title">{{ registerStatus ? '用户注册' : '用户登录' }}</h2>
          <p class="subtitle">{{ registerStatus ? '创建您的个人账户' : '欢迎回来，请登录您的账户' }}</p>
        </div>

        <!-- 登录/注册表单 -->
        <el-form
            ref="loginForm"
            :model="loginData"
            :rules="formRules"
            @submit.native.prevent
            class="login-form"
        >
          <!-- 用户名输入 -->
          <el-form-item prop="userName">
            <div class="input-with-icon">
              <i class="icon-user"></i>
              <el-input
                  v-model="loginData.userName"
                  placeholder="请输入用户名"
                  size="large"
              ></el-input>
            </div>
          </el-form-item>

          <!-- 密码输入 -->
          <el-form-item prop="passWord">
            <div class="input-with-icon">
              <i class="icon-lock"></i>
              <el-input
                  type="password"
                  v-model="loginData.passWord"
                  placeholder="请输入密码"
                  size="large"
                  show-password
              ></el-input>
            </div>
          </el-form-item>

          <!-- 昵称输入（仅注册时显示） -->
          <el-form-item v-show="registerStatus" prop="nickname">
            <div class="input-with-icon">
              <i class="icon-nickname"></i>
              <el-input
                  v-model="loginData.nickname"
                  placeholder="请输入昵称"
                  size="large"
              ></el-input>
            </div>
          </el-form-item>

          <!-- 按钮区域 -->
          <div class="form-actions">
            <el-button
                v-show="registerStatus"
                type="default"
                @click="backLogin"
                class="btn secondary"
            >
              <i class="icon-back"></i>
              返回登录
            </el-button>

            <el-button
                v-show="loginStatus"
                type="primary"
                @click="login"
                class="btn primary"
                :loading="loading"
            >
              <i class="icon-login"></i>
              登录
            </el-button>

            <el-button
                v-show="loginStatus"
                type="default"
                @click="register"
                class="btn secondary"
            >
              <i class="icon-register"></i>
              注册账户
            </el-button>

            <el-button
                v-show="registerStatus"
                type="primary"
                @click="commit"
                class="btn primary"
                :loading="loading"
            >
              <i class="icon-commit"></i>
              提交注册
            </el-button>
          </div>
        </el-form>

        <!-- 页脚 -->
        <div class="form-footer">
          <div class="copyright">
            <p>© 2021-{{ currentYear }} 林鹤 版权所有</p>
          </div>
          <div class="beian">
            <a target="_blank" href="https://beian.miit.gov.cn/">
              豫ICP备2023017522号-1
            </a>
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
import {useStore} from 'vuex'
import {useRouter} from "vue-router";

export default {
  data() {
    // 表单验证规则
    const validateUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'));
      } else if (value.length < 3) {
        callback(new Error('用户名至少3个字符'));
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('密码至少6个字符'));
      } else {
        callback();
      }
    };

    const validateNickname = (rule, value, callback) => {
      if (this.registerStatus && !value) {
        callback(new Error('请输入昵称'));
      } else {
        callback();
      }
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
      // 表单验证规则
      formRules: {
        userName: [
          { validator: validateUserName, trigger: 'blur' }
        ],
        passWord: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        nickname: [
          { validator: validateNickname, trigger: 'blur' }
        ]
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
          this.$message({
            type: 'warning',
            message: '请正确填写表单'
          });
          return;
        }

        this.loading = true;

        axios.post(process.env.BASE_URL + '/api/v1/user/login', this.loginData)
            .then(res => {
              this.loading = false;
              if (res.data.code === 200) {
                this.store.commit("user/updateUserToken", res.data.data.token)
                this.store.commit("user/updateUserNickname", res.data.data.nickname)
                this.$message({
                  type: 'success',
                  message: '登录成功'
                });
                this.route.replace({path: '/date'});
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.message
                });
              }
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
              this.$message({
                type: 'error',
                message: '网络错误，请稍后重试'
              });
            });
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
              this.route.replace({path: '/date'});
            }
          })
          .catch(error => {
            console.log(error);
          });
    },

    register() {
      this.registerStatus = true
      this.loginStatus = false
      // 重置表单验证状态
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate();
      });
    },

    commit() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'warning',
            message: '请正确填写表单'
          });
          return;
        }

        this.loading = true;

        axios.post(process.env.BASE_URL + '/api/v1/user/register', this.loginData)
            .then(res => {
              this.loading = false;
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: res.data.data.msg || '注册成功'
                });
                this.backLogin()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.data.msg || '注册失败'
                });
              }
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
              this.$message({
                type: 'error',
                message: '网络错误，请稍后重试'
              });
            });
      });
    },

    backLogin() {
      this.registerStatus = false
      this.loginStatus = true
      // 重置表单验证状态
      this.$nextTick(() => {
        this.$refs.loginForm.clearValidate();
      });
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* 背景装饰元素 */
.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 10%;
}

/* 登录容器 */
.login-container {
  width: 100%;
  max-width: 420px;
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px 35px;
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

/* 表单头部 */
.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header .title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.form-header .subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 表单样式 */
.login-form {
  margin-top: 10px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 2;
}

.input-with-icon i::before {
  font-size: 18px;
}

.icon-user::before {
  content: "👤";
}

.icon-lock::before {
  content: "🔒";
}

.icon-nickname::before {
  content: "👋";
}

.icon-back::before {
  content: "←";
  margin-right: 5px;
}

.icon-login::before {
  content: "→";
  margin-right: 5px;
}

.icon-register::before {
  content: "📝";
  margin-right: 5px;
}

.icon-commit::before {
  content: "✓";
  margin-right: 5px;
}

:deep(.el-input__inner) {
  padding-left: 45px !important;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #e1e5e9;
  transition: all 0.3s;
}

:deep(.el-input__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

/* 按钮样式 */
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
}

.btn {
  flex: 1;
  min-width: 120px;
  height: 46px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn.secondary {
  background: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn.secondary:hover {
  background: #e4e7ed;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

/* 页脚样式 */
.form-footer {
  margin-top: 30px;
  text-align: center;
}

.copyright p {
  font-size: 12px;
  color: #999;
  margin: 5px 0;
}

.beian {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
}

.beian a {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
  text-decoration: none;
  transition: color 0.3s;
}

.beian a:hover {
  color: #667eea;
}

.beian img {
  height: 14px;
  margin-right: 5px;
}

/* 响应式设计 */
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