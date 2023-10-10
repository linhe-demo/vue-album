<template>
  <div id="app" style="height: 100%;">
    <router-view/>
  </div>
</template>

<script>
import {useRouter} from "vue-router";
import {useStore} from 'vuex'

export default {
  name: 'App',
  // 禁止web端屏幕缩放
  created() {
    window.addEventListener("mousewheel", function (event) {
      if (event.ctrlKey === true || event.metaKey) {
        event.preventDefault();
      }
    }, {passive: false});
    /*禁止ios缩放，双击和双指*/
    window.onload = function () {
      document.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });
      var lastTouchEnd = 0;
      document.addEventListener(
          "touchend",
          function (event) {
            var now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
              event.preventDefault();
            }
            lastTouchEnd = now;
          },
          false
      );
      document.addEventListener("gesturestart", function (event) {
        event.preventDefault();
      });
    };
  },
  mounted() {
    const router = useRouter()
    // 根据不同路由跳转不同页面
    if (!this._isMobile()) {
      router.replace({
        path: '/error',
        query: {
          info: "本站为手机端网站，请使用手机浏览"
        }
      })
    } else {
      //检查用户本地是否有登录token
      let store = useStore()
      if (store.state.user.token.length === 0) {
        router.replace({
          path: '/'
        })
      }
    }
  },
  methods: {
    // 判断是否是手机端，如果是，返回true
    _isMobile() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    }
  }
}
</script>
