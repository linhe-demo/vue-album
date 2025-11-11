<template>
  <!-- 烟花效果 -->
  <Fireworks v-if="showFirework" />

  <!-- 主容器 -->
  <div class="main-container">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <!-- 背景装饰元素 -->
      <div class="bg-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>

      <div class="welcome-content">
        <!-- 欢迎文本和风车 -->
        <div class="welcome-header">
          <div class="welcome-texts">
            <h1 class="welcome-title">欢迎 {{ customer }} <span class="emoji">^_^</span></h1>
            <div v-if="dateInfo.anniversary" class="anniversary-badge">
              <span class="anniversary-icon">🎉</span>
              <span class="anniversary-text">{{ dateInfo.anniversary }}</span>
            </div>
          </div>

          <!-- 风车装饰 -->
          <div class="windmill-decoration">
            <img class="windmill rotate-animation" src="http://www.life-moment.top/images/static/fengche.png" alt="风车">
          </div>
        </div>

        <!-- 日期信息 -->
        <div class="date-info-container">
          <!-- 主要日期信息 -->
          <div class="primary-date-info">
            <div v-if="dateInfo.solarDate" class="date-item solar-date">
              <i class="date-icon">📅</i>
              <span>{{ dateInfo.solarDate }}</span>
            </div>
            <div v-if="dateInfo.lunarDate" class="date-item lunar-date">
              <i class="date-icon">🌙</i>
              <span>{{ dateInfo.lunarDate }}</span>
            </div>
          </div>

          <!-- 农历和节日信息 -->
          <div class="secondary-date-info">
            <div v-if="dateInfo.lunarTerm" class="date-tag lunar-term">
              {{ dateInfo.lunarTerm }}
            </div>
            <div v-if="dateInfo.lunarFestival" class="date-tag lunar-festival">
              {{ dateInfo.lunarFestival }}
            </div>
            <div v-if="dateInfo.solarFestival" class="date-tag solar-festival">
              {{ dateInfo.solarFestival }}
            </div>
          </div>

          <!-- 纪念日信息 -->
          <div class="memorial-dates">
            <div v-if="dateInfo.firstMeeting" class="memorial-item">
              <i class="memorial-icon">💑</i>
              <span>{{ dateInfo.firstMeeting }}</span>
            </div>
            <div v-if="dateInfo.certificateDay" class="memorial-item">
              <i class="memorial-icon">📜</i>
              <span>{{ dateInfo.certificateDay }}</span>
            </div>
            <div v-if="dateInfo.marryDay" class="memorial-item">
              <i class="memorial-icon">💍</i>
              <span>{{ dateInfo.marryDay }} <i class="el-icon-loading loading-icon"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间内容区域 -->
    <div class="content-section" v-loading.fullscreen="loadDate" :element-loading-text="loading">
      <!-- 图片轮播 -->
      <transition name="slide-expand">
        <div class="image-carousel-container" :style="{ width: carouselWidth }" v-if="imgList">
          <el-carousel
              :interval="4000"
              height="100%"
              arrow="always"
              indicator-position="outside"
              class="custom-carousel"
          >
            <el-carousel-item v-for="(value, index) in imgList" :key="index">
              <div class="carousel-image-wrapper">
                <img
                    :src="value.src"
                    :alt="'相册图片' + (index + 1)"
                    @load="handleLoad"
                    class="carousel-image"
                >
                <div class="carousel-indicator">{{ index + 1 }} / {{ imgList.length }}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </transition>

      <!-- 日期卡片 -->
      <transition name="fade-slide">
        <div v-if="showDateCards" class="date-cards-container">
          <div class="cards-header">
            <h2 class="cards-title">时光记忆</h2>
          </div>
          <div class="cards-grid">
            <div
                class="date-card"
                v-for="(item, index) in dateList"
                :key="index"
                @click="showTimeLine(item)"
                :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="card-content">
                <div class="card-icon">📅</div>
                <div class="card-text">{{ item }}</div>
              </div>
              <div class="card-hover-effect"></div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-navigation">
      <div class="nav-button" @click="footprints">
        <div class="nav-icon">📚</div>
        <div class="nav-text">岁月</div>
      </div>
      <div class="nav-button" @click="feeling">
        <div class="nav-icon">✨</div>
        <div class="nav-text">星闪</div>
      </div>
      <div class="nav-button" @click="baby">
        <div class="nav-icon">👶</div>
        <div class="nav-text">宝宝</div>
      </div>
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
      carouselWidth: '0%',
      showDateCards: false,
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

    // 动画延迟触发
    setTimeout(() => {
      this.carouselWidth = '95%';
    }, 100);

    setTimeout(() => {
      this.showDateCards = true;
    }, 800)
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
    },
  }
}
</script>

<style scoped>
/* 全局样式 */
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  overflow: hidden;
  position: relative;
}

/* 欢迎区域样式 - 增加高度避免被遮挡 */
.welcome-section {
  height: 28%;
  min-height: 180px;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 提高层级确保在轮播图上方 */
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.circle-1 {
  width: 150px;
  height: 150px;
  top: -50px;
  right: -30px;
}

.circle-2 {
  width: 80px;
  height: 80px;
  bottom: -20px;
  left: 10%;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 30%;
  right: 15%;
}

.welcome-content {
  padding: 15px 20px;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.welcome-texts {
  flex: 1;
}

.welcome-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.emoji {
  margin-left: 8px;
  font-size: 1.5rem;
}

.anniversary-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 5px 12px;
  margin-top: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
}

.anniversary-icon {
  margin-right: 5px;
  font-size: 1rem;
}

.anniversary-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e74c3c;
}

.windmill-decoration {
  width: 50px;
  height: 50px;
}

.windmill {
  width: 100%;
  height: 100%;
}

.rotate-animation {
  animation: spin 8s linear infinite;
}

/* 日期信息样式 */
.date-info-container {
  margin-top: 10px;
}

.primary-date-info {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.date-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  padding: 6px 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;
  font-weight: 500;
  color: #34495e;
  min-width: 120px;
}

.date-icon {
  margin-right: 5px;
  font-size: 1rem;
}

.secondary-date-info {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.date-tag {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.lunar-term {
  background: rgba(52, 152, 219, 0.2);
  color: #2980b9;
}

.lunar-festival {
  background: rgba(231, 76, 60, 0.2);
  color: #c0392b;
}

.solar-festival {
  background: rgba(46, 204, 113, 0.2);
  color: #27ae60;
}

.memorial-dates {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between; /* 项目之间均匀分布，第一行在两端，第二行在左边（如果只有两个） */
  gap: 5px; /* 为了在行之间也有间距，我们使用gap */
}

.memorial-item {
  flex: 0 0 48%; /* 不增长，不收缩，基础宽度48% */
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #2c3e50;
  font-weight: 500;
}

.memorial-icon {
  margin-right: 5px;
  font-size: 0.9rem;
}

.loading-icon {
  margin-left: 5px;
  color: #3498db;
}

/* 内容区域样式 - 调整高度避免与头部重叠 */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 15px;
  background: url("http://www.life-moment.top/images/static/time6.jpg") center/cover no-repeat;
  position: relative;
  overflow: hidden;
  min-height: 0; /* 确保flex布局正常工作 */
}

.content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 0;
}

/* 图片轮播样式 - 调整高度避免遮挡头部 */
.image-carousel-container {
  height: 40%;
  min-height: 180px;
  margin-bottom: 10px;
  transition: width 1s ease-out;
  z-index: 1;
  position: relative;
}

.custom-carousel {
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
}

.carousel-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
}

/* 日期卡片样式 - 修复堆叠问题 */
.date-cards-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  z-index: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 确保flex布局正常工作 */
}

.cards-header {
  margin-bottom: 15px;
  text-align: center;
  flex-shrink: 0; /* 防止标题区域被压缩 */
}

.cards-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.cards-subtitle {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  overflow-y: auto;
  padding: 5px;
  flex: 1; /* 占据剩余空间 */
  min-height: 0; /* 确保grid容器可以滚动 */
}

.date-card {
  background: white;
  border-radius: 10px;
  padding: 15px 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: card-appear 0.5s ease both;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80px; /* 确保卡片有固定最小高度 */
}

.date-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  width: 100%;
}

.card-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.card-text {
  font-size: 0.85rem;
  font-weight: 500;
  color: #3498db;
  line-height: 1.3;
  word-break: break-word; /* 允许长文本换行 */
  width: 100%;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.date-card:hover .card-hover-effect {
  opacity: 1;
}

/* 底部导航样式 */
.bottom-navigation {
  height: 10%;
  min-height: 60px;
  background: white;
  display: flex;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 2;
}

.nav-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.nav-button:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #3498db;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-button:hover:after,
.nav-button.active:after {
  transform: scaleX(1);
}

.nav-button:hover {
  background: rgba(52, 152, 219, 0.05);
}

.nav-icon {
  font-size: 1.3rem;
  margin-bottom: 3px;
}

.nav-text {
  font-size: 0.75rem;
  color: #2c3e50;
  font-weight: 500;
}

/* 动画效果 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes card-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-expand-enter-active, .slide-expand-leave-active {
  transition: all 1s ease;
}

.slide-expand-enter-from {
  transform: scaleX(0);
  opacity: 0;
}

.slide-expand-enter-to {
  transform: scaleX(1);
  opacity: 1;
}

.fade-slide-enter-active {
  transition: all 0.8s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.5rem;
  }

  .primary-date-info {
    flex-direction: column;
    gap: 8px;
  }

  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .date-card {
    padding: 12px 8px;
  }

  .card-text {
    font-size: 0.8rem;
  }

  .welcome-section {
    height: 30%;
  }

  .image-carousel-container {
    height: 35%;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.3rem;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .secondary-date-info {
    flex-direction: column;
    gap: 5px;
  }

  .date-tag {
    width: fit-content;
  }

  .nav-icon {
    font-size: 1.1rem;
  }

  .nav-text {
    font-size: 0.7rem;
  }

  .welcome-section {
    height: 32%;
  }

  .image-carousel-container {
    height: 30%;
  }
}

/* 自定义滚动条 */
.cards-grid::-webkit-scrollbar {
  width: 6px;
}

.cards-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background: rgba(52, 152, 219, 0.5);
  border-radius: 3px;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(52, 152, 219, 0.7);
}
</style>