<template>
  <div class="login-page">
    <div class="login-form">
      <div style="color: #adadad; font-size: 30px;">
          {{ info }}
      </div>
    </div>
    <div style="color:#adadad;text-align: center;margin-top: 10px;font-size: 10px;">@Copyright 2021-{{ currentYear }} by
      林鹤
    </div>
    <div style="color:#adadad;text-align: center;margin-top: 3px;font-size: 8px;">
      <a target="_blank" href="https://beian.miit.gov.cn/"
         style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">豫ICP备2023017522号-1</p>
      </a>
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41152502000215"
         style="display:inline-block;text-decoration:none;height:20px;line-height:20px;margin-left: 10px;"><img
          src="http://www.life-moment.top/images/static/batb.png" style="float:left;"/>
        <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">豫公网安备
          41152502000215号</p></a>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      info: '',
      currentYear: {}
    }
  },
  mounted() {
    this.info = this.$route.query.info
    this.currentYear = new Date().getFullYear()
  },
  methods: {

  }
};
</script>

<style scoped>
.login-page {
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



::v-deep(.el-form-item__label) {
  color: white;
}
::v-deep(.el-form--label-right) {
  margin-top: 120px;
}
</style>
