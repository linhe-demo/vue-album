<template>
  <div class="title">
    <div class="top">
      <div class="top-left">
        <div class="welcome">
          欢迎 {{ customer }} 来小屋 ^_^
        </div>
        <div class="title-desc">X&nbsp;L&nbsp;X&nbsp;Y</div>
      </div>
      <div class="top-right">
        <div style=" height: 80%;">
          <div v-if="dateInfo.solarDate !== ''"> {{ dateInfo.solarDate }}</div>
          <div v-if="dateInfo.lunarDate !== ''"> {{ dateInfo.lunarDate }}</div>
          <div v-if="dateInfo.lunarTerm !== ''"> {{ dateInfo.lunarTerm }}</div>
          <div v-if="dateInfo.lunarFestival !== ''"> {{ dateInfo.lunarFestival }}</div>
          <div v-if="dateInfo.solarFestival !== ''"> {{ dateInfo.solarFestival }}</div>
        </div>
        <div style="font-size: 12px;font-weight: bold;text-align: right; margin-right: 20px" v-if="dateInfo.marryDay !== ''"> {{ dateInfo.marryDay }}</div>
      </div>
    </div>
    <div class="text">山气日夕佳，飞鸟相与还。此中有真意，欲辨已忘言</div>
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
      <el-button circle><span style="font-size: 12px;" @click="wealth">福利</span></el-button>
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
    wealth(){
      this.route.replace({
        path: '/wealth'
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
}

.title-desc {
  color: white;
  height: 80%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  font-size: 29px;
}

.text {
  color: white;
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}

.top {
  height: 80%;
  display: flex;
}

.top-left {
  width: 52%;
  height: 100%;
}

.top-right {
  width: 48%;
  height: 100%;
  color: white;
  font-size: 11px;
  line-height: 22px;
}
</style>

