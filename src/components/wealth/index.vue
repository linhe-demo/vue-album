<template>
  <div class="title">
    <div class="top">
      <div class="welcome">{{ welcome }}</div>
      <div class="pregnant-info">{{ dueDate }}</div>
      <div class="pregnant-info">{{ pregnantWeeks }}</div>
      <div class="pregnant-detail" @click="openDetail(pregnantWeeksDetail)">{{ pregnantWeeksDetail }}</div>
    </div>
  </div>
  <div class="date-box" v-loading.fullscreen="loadDate" :element-loading-text="loading">
    <div class="card-list">
    </div>
  </div>
  <div class="foot">
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="footprints">{{ btn1 }}</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="feeling">{{ btn2 }}</span></el-button>
    </div>
    <div class="box">
      <el-button type="primary" circle><span style="font-size: 12px;" @click="wealth">{{ btn3 }}</span></el-button>
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
      btn1: "岁月",
      btn2: "星闪",
      btn3: "未来",
      welcome: "",
      dueDate: "",
      pregnantWeeks: "",
      pregnantWeeksDetail: "",
      week: "",
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
      axios.post(process.env.BASE_URL + '/api/v1/feature/info', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.btn1 = response.data.data.btn1
          this.btn2 = response.data.data.btn2
          this.btn3 = response.data.data.btn3
          this.welcome = response.data.data.welcomeStr
          this.dueDate = response.data.data.dueDate
          this.pregnantWeeksDetail = response.data.data.pregnantWeeksDetail
          this.pregnantWeeks = response.data.data.pregnantWeeks
          this.week = response.data.data.week
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
    wealth() {
      this.route.replace({
        path: '/wealth'
      })
    },
    openDetail(value) {
      this.$alert(value, "第"+this.week+"周孕周详情", {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true
      });
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
  background: transparent url("http://www.life-moment.top/images/static/baby1.jpg") center;
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
  background: transparent url("http://www.life-moment.top/images/static/baby4.jpg") center;
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
  height: 100px;
  width: 84%;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  color: white;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background-color: #b8c8d8;
  padding-bottom: 20px;
}

.welcome {
  color: white;
  font-size: 11px;
  padding-left: 10px;
  padding-top: 10px;
}

.pregnant-info {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 11px;
}

.pregnant-detail {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  font-size: 11px;
  height: 35%;
  line-height: 1.5em; /* 设置行高，确保多行文本垂直居中 */
  overflow: hidden;
  text-overflow: ellipsis; /* 在内容溢出时显示省略号 */
  display: -webkit-box; /* 旧的WebKit浏览器 */
  -webkit-line-clamp: 4; /* 限制显示的行数 */
  -webkit-box-orient: vertical; /* 设置盒子为垂直方向 */
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
  height: 100%;
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
  line-height: 18px;
}
</style>

