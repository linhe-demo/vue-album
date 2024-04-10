<template>
  <div class="title">
    <div class="top">
      <div class="welcome">
        <div class="welcome-text"> 欢迎 {{ customer }} ^_^</div>
        <div class="container">
          <div class="bar"></div>
        </div>
      </div>
      <div class="info">
        <div class="info-line">
          <div v-if="dateInfo.solarDate !== ''" class="info-item"> {{ dateInfo.solarDate }}</div>
          <div v-if="dateInfo.lunarDate !== ''" class="info-item"> {{ dateInfo.lunarDate }}</div>
        </div>
        <div class="info-line">
          <div v-if="dateInfo.lunarTerm !== ''" class="info-item-lunar"> {{ dateInfo.lunarTerm }}</div>
          <div v-if="dateInfo.lunarFestival !== ''" class="info-item-lunar"> {{ dateInfo.lunarFestival }}</div>
          <div v-if="dateInfo.solarFestival !== ''" class="info-item-lunar"> {{ dateInfo.solarFestival }}</div>
        </div>
        <div class="info-line">
          <div class="info-item" v-if="dateInfo.firstMeeting !== ''"> {{ dateInfo.firstMeeting }}</div>
          <div class="info-item" v-if="dateInfo.certificateDay !== ''"> {{ dateInfo.certificateDay }}</div>
        </div>
        <div class="info-line">
          <div class="info-item" v-if="dateInfo.marryDay !== ''"> {{ dateInfo.marryDay }} <i class="el-icon-loading"></i></div>
        </div>
      </div>
      <div class="windmill">
        <img class="rotate-image" src="http://www.life-moment.top/images/static/fengche.png">
      </div>
    </div>
  </div>
  <div class="date-box" v-loading.fullscreen="loadDate" :element-loading-text="loading">
    <div class="card-list">
      <el-card class="card" v-for="(item, index) in dateList" :key="index" shadow="always" @click="showTimeLine(item)">
        {{ item }}
      </el-card>
    </div>
  </div>
  <div class="foot">
    <div class="box">
      <el-button type="primary" circle><span style="font-size: 12px;" @click="footprints">岁月</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="feeling">星闪</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="baby">宝宝</span></el-button>
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
      dateList: [],
      route: {},
      token: "",
      dialogVisible: false,
      albumForm: {
        name: "",
        desc: "",
        date: ""
      },
      loadDate: false,
      loading: "数据加载中，请稍后！",
      dateInfo: []
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    this.token = store.state.user.token
    this.route = useRouter()
    this.getConfig()
    this.getDateInfo()
  },
  methods: {
    getConfig() {
      this.loadAlbum = true
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/date/list', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.dateList = response.data.data
        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
        this.loadAlbum = false
      }).catch(error => {
        console.log(error);
      });
    },
    getDateInfo() {
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/date/info', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.dateInfo = response.data.data
        }
      }).catch(error => {
        console.log(error);
      });
    },
    showTimeLine(date) {
      this.route.replace({
        path: '/main',
        query: {
          date: date
        }
      })
    },
    footprints() {
      this.route.replace({
        path: '/date'
      })
    },
    feeling(){
      this.route.replace({
        path: '/felling'
      })
    },
    baby(){
      this.route.replace({
        path: '/baby'
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

.foot {
  width: 100%;
  height: 12%;
  display: inline-flex;
}

.box {
  width: 33.3%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.date-box {
  width: 100%;
  height: 68%;
  overflow-y: auto;
  background: transparent url("http://www.life-moment.top/images/static/bk4.jpg") center;
  background-size: cover;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 将容器分为三等分 */
  grid-gap: 1px; /* 卡片之间的间距 */
}

.card {
  margin-left: 10px;
  margin-top: 20px;
  height: 80px;
  width: 84%;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  color: #ababab;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  display: flex;
  height: 15%;
}

.welcome-text {
  width: 30%;
}

.top {
  height: 100%;
}

.info {
  width: 100%;
  color: white;
  font-size: 11px;
  line-height: 18px;
  margin-top: 10px;
}

.info-item{
  width: 48%;
  font-size: 12px;font-weight: bold;
  line-height: 20px;
}

.info-line {
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 5px;
}

.info-item-lunar{
  width: 33%;
}

.container {
  width: 70%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.bar {
  width: 100px;
  height: 10%;
  background-color: white;
  position: absolute;
  border-radius: 5px;
  animation: run 2s linear infinite alternate;
}

/* 创建关键帧动画 */
@keyframes run {
  0% { left: 0; }
  100% { left: calc(100% - 100px); }
}

.windmill{
  position: absolute;
  right: 2%;
  top: 13%;
  width: 40px;
  height: 40px;
  z-index: 100;
}

.windmill img{
  width: 100%;
  height: 100%;
}

.rotate-image {
  /* 定义一个持续的旋转动画 */
  animation: spin 2s linear infinite;
}

/* 定义动画效果 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

