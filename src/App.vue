<template>
  <div id="app" style="height: 100%;">
    <router-view />
  </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  name: 'App',
  mounted () {

    const router = useRouter()
    // 根据不同路由跳转不同页面
    if (!this._isMobile()) {
      router.push({
        path: '/error',
        query: {
          info: "本站为手机端网站，请使用手机浏览"
        }
      })
    } else {
      this.$router.replace({
        path: '/'
      })
    }
  },
  methods: {
    // 判断是否是手机端，如果是，返回true
    _isMobile () {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    }
  }
}
</script>
