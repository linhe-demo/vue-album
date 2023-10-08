<template>
  <div class="title">
    <div class="welcome">欢迎 {{ customer }} 来小屋 ^_^</div>
    <div class="title-desc">X&nbsp;L&nbsp;X&nbsp;Y</div>
    <div class="text">山气日夕佳，飞鸟相与还。此中有真意，欲辨已忘言</div>
  </div>
  <div class="time-line">
    <div v-for="(item, index) in images" :key="index" class="time-line-item">
      <div class="time-line-content">
        <div class="main-box">
          <div class="left">
            <div class="content">{{ item.date }}</div>
          </div>
          <div :class="item.theme" v-on:click="showPicture(item.id, item.title)">
            <p>{{ item.title }}</p>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {useStore} from 'vuex';
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import router from "../../router";
export default {
  name: "Index",
  data() {
    return {
      customer: "",
      currentYear: "",
      images: [],
      route: {}
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    this.route = useRouter()
    this.getConfig()
  },
  methods: {
    getConfig() {
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/album/list', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.images = response.data.data

        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
      })
          .catch(error => {
            console.log(error);
          });
    },
    showPicture(id, title) {
      this.route.push({
        name: 'picture',
        query: {
          id: id,
          title: title
        }
      })
    }
  }
}
</script>
<style scoped>

.title {
  width: 100%;
  height: 20%;
  vertical-align: middle;
  border-radius: 5px;
  margin: 1px;
  background: transparent url("http://www.life-moment.top/images/static/flower.jpg");
  background-size: cover;
}

.time-line {
  width: 100%;
  height: 80%;
  overflow-y: auto;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
}

.left {
  width: 40%;
  display: flex;
}

.content {
  width: 80%;
  display: flex;
  margin-top: 5px;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 可以根据需要设置div的高度 */
  margin-left: 1px;
  border-right: 2px dashed #b0b0b0;
  font-weight: bold;
  color: #adadad;
  font-size: 13px;
}

.right {
  width: 57%;
  border-radius: 5px;
  height: 80%;
  margin-top: 5px;
  padding-left: 10px;
  color: white;
  margin-right: 10px;
}

.theme-1 {
  background: linear-gradient(#cfd9df, #a18cd1);
}
.theme-2 {
  background: linear-gradient(#a18cd1, #fbc2eb);
}
.theme-3 {
  background: linear-gradient(#fbc2eb, #a6c1ee);
}
.theme-0 {
  background: linear-gradient(#a6c1ee, #cfd9df);
}

.title-desc {
  color: white;
  height: 56%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  font-size: 29px;
}

.main-box {
  display: flex;
  height: 100%;
}

.text {
  color: white;
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}

.time-line-item {
  height: 150px;
}

.time-line-content {
  height: 100%;
}
</style>

