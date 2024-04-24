<template>
  <Fireworks v-if="showFirework" />
  <div class="title">
    <div class="top">
      <div class="welcome">
        <div class="welcome-text"> 欢迎 {{ customer }} ^_^</div>
        <div v-if="dateInfo.anniversary" class="anniversary">{{ dateInfo.anniversary }}</div>
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
          <div class="info-item" v-if="dateInfo.marryDay !== ''"> {{ dateInfo.marryDay }} <i
              class="el-icon-loading"></i></div>
        </div>
      </div>
      <div class="windmill">
        <img class="rotate-image" src="http://www.life-moment.top/images/static/fengche.png" alt="">
      </div>
    </div>
  </div>
  <div class="date-box" v-loading.fullscreen="loadDate" :element-loading-text="loading">
    <transition name="stretch">
      <div class="user-img" :style="{ width: width}" v-if="imgList">
        <el-carousel :interval="3000" style="height: 100%;width:100%;border-radius: 5px;" arrow="hover">
          <el-carousel-item v-for="(value, index) in imgList" :key="index">
            <img :src="value.src" alt="" height="100%" width="100%" style="object-fit: cover;width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="show" class="daily">
        <div class="card-list">
          <el-card class="card" v-for="(item, index) in dateList" :key="index" shadow="always"
                   @click="showTimeLine(item)">
            {{ item }}
          </el-card>
        </div>
      </div>
    </transition>
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
import Fireworks from '/src/components/firework/index.vue';

export default {
  name: "Index",
  components: {
    Fireworks,
  },
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
      dateInfo: [],
      imgList: false,
      imageLoaded: false,
      width: '0%',
      show: false,
      showFirework: false
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    this.token = store.state.user.token
    this.route = useRouter()
    this.getImgList()
    this.getConfig()
    this.getDateInfo()
    setTimeout(() => {
      this.width = '95%'; // 或者你想要的任何宽度
    }, 50); // 触发渲染后稍微延迟改变宽度，以导致动画npm
    setTimeout(() => {
      this.show = true;
    }, 1000)
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
    getImgList() {
      this.loadAlbum = true
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/image/list', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.imgList = response.data.data
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
          this.showFirework = response.data.data.firework
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
    feeling() {
      this.route.replace({
        path: '/felling'
      })
    },
    baby() {
      this.route.replace({
        path: '/baby'
      })
    },
    handleLoad() {
      this.imageLoaded = true
      console.log("111")
    },
  }
}
</script>
<style scoped>

.title {
  width: 100%;
  height: 20%;
  vertical-align: middle;
  padding: 1px;
  background: transparent url("http://www.life-moment.top/images/static/time4.jpg");
  background-size: auto;
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
  background: transparent url("http://www.life-moment.top/images/static/time6.jpg") center;
  background-size: cover;
}

.daily {
  height: 54%;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.5);
  margin: 10px;
  border-radius: 5px;
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

.info-item {
  width: 48%;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
}

.user-img {
  padding-top: 10px;
  padding-right: 10px;
  padding-left: 10px;
  height: 40%;
  transition: transform 1s linear;
  transform-origin: center;
}

.info-line {
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 5px;
}

.info-item-lunar {
  width: 33%;
}

.windmill {
  position: absolute;
  right: 2%;
  top: 1%;
  width: 40px;
  height: 40px;
  z-index: 100;
}

.windmill img {
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

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.1;
  line-height: 100px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.stretch-enter-active, .stretch-leave-active {
  transition: transform 1s linear;
}

.stretch-enter-from, .stretch-leave-to {
  transform: scaleX(0);
}

.fade-enter-active {
  transition: opacity 2s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 0.88;
}


@keyframes flicker {
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
}

.anniversary {
  animation: flicker 2s linear infinite;
  padding-left: 20%;
  font-size: 13px;
  color: #BF00FF;
  font-weight: bolder;
}

::v-deep(.el-carousel__indicators) {
  display: none;
}

::v-deep(.el-carousel__container) {
  height: 100%;
}

::v-deep(.is-always-shadow) {
  opacity: 0.8;
}

::v-deep(.el-card__body) {
  color: #529b8b;
  border-radius: 5px;
}
</style>

