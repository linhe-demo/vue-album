<template>
  <Fireworks v-if="showFirework" />

  <div class="main-container">
    <!-- ===== 顶部欢迎区域（间距宽松） ===== -->
    <header class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-header">
          <div class="welcome-texts">
            <h1>欢迎 {{ customer }}</h1>
            <div v-if="dateInfo.anniversary" class="anniversary-badge">
              🎉 {{ dateInfo.anniversary }}
            </div>
          </div>
          <img
              class="windmill"
              src="http://www.life-moment.top/images/static/fengche.png"
              alt="风车"
          />
        </div>

        <div class="date-info">
          <div class="info-row">
            <span class="info-item">📅 {{ dateInfo.solarDate }}</span>
            <span class="info-item">🌙 {{ dateInfo.lunarDate }}</span>
          </div>
          <div class="info-row">
            <span v-if="dateInfo.lunarTerm" class="info-item term">{{ dateInfo.lunarTerm }}</span>
            <span v-if="dateInfo.lunarFestival" class="info-item festival lunar">{{ dateInfo.lunarFestival }}</span>
            <span v-if="dateInfo.solarFestival" class="info-item festival solar">{{ dateInfo.solarFestival }}</span>
          </div>
          <div class="info-row memorial">
            <span v-if="dateInfo.firstMeeting" class="info-item">💑 {{ dateInfo.firstMeeting }}</span>
            <span v-if="dateInfo.certificateDay" class="info-item">📜 {{ dateInfo.certificateDay }}</span>
            <span v-if="dateInfo.marryDay" class="info-item">💍 {{ dateInfo.marryDay }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== 中间内容 ===== -->
    <main class="content-section" v-loading.fullscreen="loadDate" :element-loading-text="loading">
      <!-- 轮播 -->
      <div class="carousel-wrapper" v-if="imgList && imgList.length">
        <el-carousel :interval="4000" height="100%" arrow="always" indicator-position="none">
          <el-carousel-item v-for="(img, idx) in imgList" :key="idx">
            <img :src="img.src" class="carousel-img" />
            <div class="indicator">{{ idx+1 }} / {{ imgList.length }}</div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div v-else class="carousel-placeholder">
        <span>🖼️</span>
        <span>暂无图片</span>
      </div>

      <!-- 年份卡片 - 不占半屏，但卡片大、间距大 -->
      <div class="cards-wrapper">
        <div class="cards-grid">
          <div
              class="date-card"
              v-for="(year, idx) in dateList"
              :key="idx"
              @click="showTimeLine(year)"
          >
            <div class="year">{{ year }}</div>
            <div class="day">{{ currentDay }}</div>
            <div class="month">{{ currentMonth }}月</div>
            <div class="week">{{ currentWeek }}</div>
          </div>
        </div>
      </div>
    </main>

    <!-- ===== 底部导航 ===== -->
    <footer class="bottom-nav">
      <div class="nav-item" @click="footprints">
        <span class="nav-icon">📖</span>
        <span class="nav-label">岁月</span>
      </div>
      <div class="nav-item" @click="feeling">
        <span class="nav-icon">✨</span>
        <span class="nav-label">星闪</span>
      </div>
      <div class="nav-item" @click="baby">
        <span class="nav-icon">👶</span>
        <span class="nav-label">宝宝</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import axios from "axios";
import { useRouter } from "vue-router";
import Fireworks from '/src/components/firework/index.vue';

export default {
  name: "Index",
  components: { Fireworks },
  data() {
    return {
      customer: '',
      dateList: [],
      token: '',
      loadDate: false,
      loading: '加载中…',
      dateInfo: {},
      imgList: [],
      currentMonth: '',
      currentDay: '',
      currentWeek: '',
      dateTimer: null,
      showFirework: false,
      route: null,
    };
  },
  mounted() {
    const store = useStore();
    this.customer = store.state.user.nickname;
    this.token = store.state.user.token;
    this.route = useRouter();
    this.getConfig();
    this.getImgList();
    this.getDateInfo();
    this.updateRealTimeDate();
    this.dateTimer = setInterval(this.updateRealTimeDate, 1000);
  },
  beforeUnmount() {
    clearInterval(this.dateTimer);
  },
  methods: {
    getConfig() {
      this.loadDate = true;
      axios.post(process.env.BASE_URL + '/api/v1/date/list', {}, {
        headers: { Authorization: this.token }
      }).then(res => {
        if (res.data.code === 200) this.dateList = res.data.data || [];
        else alert(res.data.message);
        this.loadDate = false;
      }).catch(() => { this.loadDate = false; });
    },
    getImgList() {
      axios.post(process.env.BASE_URL + '/api/v1/image/list', {}, {
        headers: { Authorization: this.token }
      }).then(res => {
        if (res.data.code === 200) this.imgList = res.data.data || [];
        else alert(res.data.message);
      });
    },
    getDateInfo() {
      axios.post(process.env.BASE_URL + '/api/v1/date/info', {}, {
        headers: { Authorization: this.token }
      }).then(res => {
        if (res.data.code === 200) {
          this.dateInfo = res.data.data;
          this.showFirework = res.data.data.firework;
        }
      });
    },
    showTimeLine(year) {
      this.route.replace({ path: '/main', query: { date: year } });
    },
    footprints() { this.route.replace('/date'); },
    feeling() { this.route.replace('/felling'); },
    baby() { this.route.replace('/baby'); },
    updateRealTimeDate() {
      const now = new Date();
      this.currentMonth = now.getMonth() + 1;
      this.currentDay = now.getDate();
      const weekDays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
      this.currentWeek = weekDays[now.getDay()];
    }
  }
}
</script>

<style scoped>
/* ---------- 重置 & 全局 ---------- */
* { box-sizing: border-box; margin: 0; }
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #f0f2f8 0%, #e4e8f2 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ---------- 顶部（间距宽松） ---------- */
.welcome-section {
  background: linear-gradient(135deg, rgba(161,196,253,0.2), rgba(194,233,251,0.12));
  backdrop-filter: blur(8px);
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.3);
  flex-shrink: 0;
}
.welcome-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.welcome-texts {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.welcome-header h1 {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0;
  color: #1a1a2e;
}
.anniversary-badge {
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  padding: 2px 14px;
  font-size: 0.75rem;
  color: #c0392b;
}

.windmill {
  width: 28px;
  height: 28px;
  animation: spin 10s linear infinite;
  opacity: 0.6;
}
@keyframes spin { to { transform: rotate(360deg); } }

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8rem;
  color: #2c3e50;
}
.info-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.info-item {
  padding: 1px 0;
}
.tags .info-item {
  background: rgba(255,255,255,0.4);
  padding: 0 10px;
  border-radius: 12px;
  font-size: 0.7rem;
}
.term { color: #2980b9; }
.festival.lunar { color: #c0392b; }
.festival.solar { color: #27ae60; }
.memorial .info-item {
  font-size: 0.7rem;
}

/* ---------- 中间内容 ---------- */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 6px 14px 6px;
  min-height: 0;
  overflow: hidden;
}

/* 轮播 - 占 55%，展示更充分 */
.carousel-wrapper {
  flex: 0 0 55%;
  min-height: 80px;
  max-height: 320px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255,255,255,0.1);
  margin-bottom: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.carousel-wrapper .el-carousel { height: 100%; }
.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.indicator {
  position: absolute;
  bottom: 8px;
  right: 12px;
  background: rgba(0,0,0,0.3);
  color: #fff;
  padding: 0 12px;
  border-radius: 12px;
  font-size: 0.6rem;
  backdrop-filter: blur(4px);
}
.carousel-placeholder {
  flex: 0 0 55%;
  min-height: 80px;
  max-height: 320px;
  border-radius: 14px;
  background: rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #95a5a6;
  border: 2px dashed rgba(108,92,231,0.06);
  margin-bottom: 6px;
}
.carousel-placeholder span:first-child { font-size: 2.2rem; opacity: 0.3; }
.carousel-placeholder span:last-child { font-size: 0.75rem; margin-top: 2px; }

/* 日历卡片 - 不占半屏，但卡片大、间距大 */
.cards-wrapper {
  flex: 0 0 72%!important;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 8px 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 1px 8px rgba(0,0,0,0.02);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  height: 100%;
  overflow-y: auto;
  padding: 4px;
  scrollbar-width: thin;
  align-content: start;
}
.cards-grid::-webkit-scrollbar { width: 3px; }
.cards-grid::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.15); border-radius: 8px; }

.date-card {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(4px);
  border-radius: 14px;
  padding: 10px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(255,255,255,0.3);
  min-height: 72px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.date-card:hover {
  transform: scale(1.05);
  background: rgba(255,255,255,0.85);
  border-color: #6c5ce7;
  box-shadow: 0 4px 16px rgba(108,92,231,0.12);
}
.date-card:active {
  transform: scale(0.95);
}
.date-card .year {
  font-weight: 700;
  color: #6c5ce7;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}
.date-card .day {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
}
.date-card .month {
  font-size: 0.55rem;
  color: #7f8c8d;
  font-weight: 500;
}
.date-card .week {
  font-size: 0.45rem;
  color: #95a5a6;
}

/* ---------- 底部导航（放大） ---------- */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255,255,255,0.3);
  padding: 14px 0 20px;
  flex-shrink: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 4px 32px;
  border-radius: 16px;
  position: relative;
}
.nav-item:hover {
  transform: translateY(-3px);
}
.nav-item:active {
  transform: scale(0.9);
}

.nav-icon {
  font-size: 2rem;
  line-height: 1.2;
  transition: transform 0.3s ease;
}
.nav-item:hover .nav-icon {
  transform: scale(1.15);
}

.nav-label {
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: 2px;
  opacity: 0.6;
  transition: all 0.3s ease;
}
.nav-item:hover .nav-label {
  opacity: 1;
  color: #6c5ce7;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c5ce7, #a29bfe);
  border-radius: 4px;
  transition: width 0.3s ease;
}
.nav-item:hover::after {
  width: 50px;
}

/* ---------- 响应式 ---------- */
@media (max-width: 480px) {
  .welcome-section {
    padding: 8px 12px 6px;
  }
  .welcome-header h1 { font-size: 1.1rem; }
  .date-info { font-size: 0.65rem; gap: 2px; }
  .info-row { gap: 8px; }
  .tags .info-item { font-size: 0.55rem; padding: 0 6px; }
  .memorial .info-item { font-size: 0.6rem; }

  .carousel-wrapper {
    flex: 0 0 50%;
    min-height: 60px;
    max-height: 180px;
  }
  .carousel-placeholder {
    flex: 0 0 50%;
    min-height: 60px;
    max-height: 180px;
  }

  .cards-wrapper {
    flex: 0 0 42%;
    padding: 6px 6px;
  }
  .cards-grid {
    gap: 6px;
    padding: 2px;
  }
  .date-card {
    min-height: 56px;
    padding: 6px 2px;
    border-radius: 10px;
  }
  .date-card .year { font-size: 0.6rem; }
  .date-card .day { font-size: 1.1rem; }
  .date-card .month { font-size: 0.45rem; }
  .date-card .week { font-size: 0.35rem; }

  .bottom-nav {
    padding: 10px 0 14px;
  }
  .nav-icon { font-size: 1.6rem; }
  .nav-label { font-size: 0.75rem; letter-spacing: 1px; }
  .nav-item { padding: 2px 16px; }
  .nav-item::after { height: 2px; }
  .nav-item:hover::after { width: 30px; }
}

@media (min-width: 481px) and (max-width: 768px) {
  .carousel-wrapper {
    flex: 0 0 52%;
    max-height: 240px;
  }
  .carousel-placeholder {
    flex: 0 0 52%;
    max-height: 240px;
  }
  .cards-wrapper {
    flex: 0 0 40%;
  }
  .date-card {
    min-height: 64px;
  }
  .date-card .day { font-size: 1.2rem; }
}

@media (min-width: 769px) {
  .carousel-wrapper {
    flex: 0 0 58%;
    max-height: 380px;
  }
  .cards-wrapper {
    flex: 0 0 35%;
    padding: 10px 14px;
  }
  .cards-grid {
    gap: 14px;
  }
  .date-card {
    min-height: 84px;
    padding: 12px 6px;
    border-radius: 16px;
  }
  .date-card .day { font-size: 1.6rem; }
  .date-card .year { font-size: 0.85rem; }
  .date-card .month { font-size: 0.6rem; }
  .date-card .week { font-size: 0.5rem; }
  .nav-icon { font-size: 2.2rem; }
  .nav-label { font-size: 1rem; }
}
</style>