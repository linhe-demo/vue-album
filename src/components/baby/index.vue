<template>
  <div class="baby-container">
    <!-- ===== 顶部欢迎区域 ===== -->
    <header class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-header">
          <div class="welcome-left">
            <h1>欢迎 {{ customer }}</h1>
            <div class="welcome-subtitle">👶 记录宝宝成长的每一刻</div>
          </div>
          <div class="header-actions">
            <el-button class="add-btn" @click="addBabyLife()" round size="small">
              ✏️ 记录
            </el-button>
          </div>
        </div>

        <!-- 孕周信息 -->
        <div class="pregnancy-info" v-if="pregnantWeeks">
          <div class="pregnancy-row">
            <span class="pregnancy-icon">🤰</span>
            <span class="pregnancy-text">孕 {{ pregnantWeeks }}</span>
            <span class="pregnancy-detail" @click="openDetail(pregnantWeeksDetail)">📋 查看详情</span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper" v-if="percentage > 0">
            <el-progress
                type="circle"
                :percentage="percentage"
                :width="50"
                :stroke-width="4"
            />
            <span class="progress-label">孕期进度</span>
          </div>
        </div>

        <!-- 通知跑马灯 -->
        <div class="notice-ticker" @click="noticeDetail(text)">
          <span class="ticker-icon">📢</span>
          <div class="ticker-wrapper">
            <span ref="tickerText" class="ticker-text">{{ text }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== 主要内容区域 ===== -->
    <main class="content-section" v-loading.fullscreen="loadDate" :element-loading-text="loading">
      <!-- 宝宝信息 -->
      <div class="baby-info-wrapper">
        <div class="section-header">
          <span class="section-title">👶 宝宝信息</span>
        </div>
        <div class="baby-info-grid">
          <div class="baby-card" v-for="(item, index) in baby_list" :key="index">
            <div class="baby-avatar">
              {{ item.sexy === '男' ? '👦' : '👧' }}
            </div>
            <div class="baby-details">
              <div class="baby-row">
                <span class="label">小名</span>
                <span class="value nickname">{{ item.nickName }}</span>
              </div>
              <div class="baby-row">
                <span class="label">学名</span>
                <span class="value">{{ item.realName }}</span>
              </div>
              <div class="baby-row">
                <span class="label">性别</span>
                <span class="value">{{ item.sexy }}</span>
              </div>
              <div class="baby-row">
                <span class="label">年龄</span>
                <span class="value">{{ item.age }}</span>
              </div>
              <div class="baby-row">
                <span class="label">生日</span>
                <span class="value">{{ item.birthday }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 成长记录 -->
      <div class="growth-wrapper">
        <div class="section-header">
          <span class="section-title">📖 成长记录</span>
          <span class="record-count">共 {{ babyLife.length }} 条</span>
        </div>
        <div class="growth-timeline">
          <el-timeline>
            <el-timeline-item
                v-for="(item, index) in babyLife"
                :key="index"
                :timestamp="item.date"
                placement="top"
                :type="getTimelineType(index)"
            >
              <div class="growth-card" @click="openBabyLife(item.id, item.title, item.text)">
                <div class="growth-card-header">
                  <span class="growth-title">📌 {{ item.title }}</span>
                  <span class="growth-time">{{ getTimeAgo(item.date) }}</span>
                </div>
                <div class="growth-content">
                  <p>{{ item.text }}</p>
                </div>
                <div class="growth-hover">
                  <span>点击查看详情 👆</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>

          <!-- 空状态 -->
          <div v-if="babyLife.length === 0" class="empty-state">
            <div class="empty-icon">👶</div>
            <div class="empty-text">还没有成长记录</div>
            <el-button class="empty-btn" @click="addBabyLife()" round>
              ✏️ 记录成长
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- ===== 底部导航 ===== -->
    <footer class="bottom-nav">
      <div class="nav-item" @click="footprints">
        <span class="nav-icon">📚</span>
        <span class="nav-label">岁月</span>
      </div>
      <div class="nav-item" @click="feeling">
        <span class="nav-icon">✨</span>
        <span class="nav-label">星闪</span>
      </div>
      <div class="nav-item active" @click="wealth">
        <span class="nav-icon">👶</span>
        <span class="nav-label">宝宝</span>
      </div>
    </footer>

    <!-- ===== 新增记录对话框 ===== -->
    <el-dialog
        title="👶 记录成长瞬间"
        width="92%"
        v-model="dialogFormVisible"
        class="baby-dialog"
        :close-on-click-modal="false"
        @close="onDialogClose"
    >
      <div class="dialog-body" v-loading="uploadLoadingStatus" :element-loading-text="upload_loading">
        <el-form>
          <el-form-item label="标题">
            <el-input
                v-model="babyForm.name"
                placeholder="给这个瞬间起个名字..."
                maxlength="20"
                show-word-limit
                class="form-input"
            />
          </el-form-item>
          <el-form-item label="描述">
            <el-input
                v-model="babyForm.desc"
                type="textarea"
                :rows="4"
                placeholder="记录宝宝成长的点滴..."
                maxlength="500"
                show-word-limit
                class="form-textarea"
                resize="none"
            />
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="babyForm.date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%;"
                class="form-datepicker"
                :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="照片">
            <el-upload
                class="upload-area"
                action="#"
                accept="image/jpeg,image/gif,image/png"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :before-remove="beforeRemove"
                list-type="picture"
                multiple
                :limit="40"
                :on-exceed="handleExceed"
                :auto-upload="false"
                :file-list="fileList"
            >
              <div class="upload-trigger">
                <span class="upload-icon">🖼️</span>
                <span>点击上传照片</span>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="cancelSave">取消</el-button>
          <el-button
              class="submit-btn"
              type="primary"
              @click="saveAlbum"
              :disabled="!babyForm.name || !babyForm.desc || !babyForm.date"
          >
            💾 保存记录
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "BabyIndex",
  data() {
    return {
      customer: "",
      token: "",
      route: null,
      loadDate: false,
      loading: "加载中…",
      uploadLoadingStatus: false,
      upload_loading: "保存中，请稍后…",

      // 数据
      welcome: "",
      dueDate: "",
      btnStatus: false,
      pregnantWeeks: "",
      pregnantWeeksDetail: "",
      percentage: 0,
      week: "",
      text: '人间的美好，源于幸运，来到这的你定好运爆膨！',
      baby_list: [],
      babyLife: [],

      // 表单
      babyForm: {
        name: '',
        desc: '',
        date: ''
      },
      fileList: [],
      dialogFormVisible: false,

      // 导航
      btn1: "岁月",
      btn2: "星闪",
      btn3: "宝宝",

      timer: null,
      pickerOptions: {
        firstDayOfWeek: 1
      }
    }
  },
  mounted() {
    // ✅ 在 mounted 中获取 store 数据
    const store = useStore();
    this.customer = store.state.user.nickname;
    this.token = store.state.user.token;
    this.route = useRouter();

    this.getDateInfo();
    this.getBabyLifeInfo();

    setTimeout(() => {
      this.adjustAnimationDuration();
    }, 500);
    window.addEventListener('resize', this.adjustAnimationDuration);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustAnimationDuration);
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    // ✅ 修复：直接使用 this.token，不再调用 useStore()
    getDateInfo() {
      axios.post(process.env.BASE_URL + '/api/v1/feature/info', {}, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data;
          this.btn1 = data.btn1 || '岁月';
          this.btn2 = data.btn2 || '星闪';
          this.btn3 = data.btn3 || '宝宝';
          this.welcome = data.welcomeStr;
          this.dueDate = data.dueDate;
          this.pregnantWeeksDetail = data.pregnantWeeksDetail;
          this.percentage = data.percentage;
          this.pregnantWeeks = data.pregnantWeeks;
          this.week = data.week;
          this.text = data.noticeValue || '人间的美好，源于幸运，来到这的你定好运爆膨！';
          this.baby_list = data.babyInfo || [];
          this.btnStatus = data.btnStatus;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    // ✅ 修复：直接使用 this.token，不再调用 useStore()
    getBabyLifeInfo() {
      axios.post(process.env.BASE_URL + '/api/v1/baby/life', {}, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          this.babyLife = response.data.data || [];
        }
      }).catch(error => {
        console.log(error);
      });
    },
    adjustAnimationDuration() {
      const tickerText = this.$refs.tickerText;
      if (!tickerText) return;
      const tickerContainer = tickerText.parentNode;
      if (!tickerContainer) return;
      const textWidth = tickerText.scrollWidth;
      const containerWidth = tickerContainer.offsetWidth;
      if (containerWidth > 0) {
        tickerText.style.animationDuration = (textWidth / containerWidth) * 30 + 's';
      }
    },
    getTimelineType(index) {
      const types = ['primary', 'success', 'warning', 'info'];
      return types[index % types.length];
    },
    getTimeAgo(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}月前`;
      return `${Math.floor(diffDays / 365)}年前`;
    },
    footprints() {
      this.route.replace({ path: '/date' });
    },
    feeling() {
      this.route.replace({ path: '/felling' });
    },
    wealth() {
      this.route.replace({ path: '/wealth' });
    },
    openDetail(value) {
      this.$alert(value, "第" + this.week + "周孕周详情", {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true
      });
    },
    noticeDetail(value) {
      this.$alert(value, "第" + this.week + "周孕妇注意事项", {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true
      });
    },
    addBabyLife() {
      this.dialogFormVisible = true;
    },
    cancelSave() {
      this.dialogFormVisible = false;
      this.fileList = [];
      this.babyForm.name = '';
      this.babyForm.date = '';
      this.babyForm.desc = '';
    },
    onDialogClose() {
      // 对话框关闭时清理状态
      if (!this.uploadLoadingStatus) {
        this.fileList = [];
        this.babyForm.name = '';
        this.babyForm.date = '';
        this.babyForm.desc = '';
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 40 个文件，本次选择了 ${files.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    async saveAlbum() {
      if (!this.babyForm.name || !this.babyForm.desc || !this.babyForm.date) {
        this.$message({ type: 'warning', message: '请完整填写标题、描述和时间！' });
        return;
      }

      this.uploadLoadingStatus = true;
      const fd = new FormData();
      this.fileList.forEach(item => {
        if (item.raw) {
          fd.append("files", item.raw);
        }
      });
      fd.append("name", this.babyForm.name);
      fd.append("desc", this.babyForm.desc);
      fd.append("date", this.babyForm.date);

      try {
        const response = await axios.post(process.env.BASE_URL + '/api/v1/baby/upload', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': this.token
          },
        });
        if (response.data.code === 200) {
          this.$message({ type: 'success', message: '🎉 保存成功！' });
          this.dialogFormVisible = false;
          this.fileList = [];
          this.babyForm.name = '';
          this.babyForm.date = '';
          this.babyForm.desc = '';
          this.getBabyLifeInfo();
        } else {
          this.$message({ type: 'error', message: response.data.message });
        }
      } catch (error) {
        this.$message({ type: 'error', message: error.message || '保存失败' });
      } finally {
        this.uploadLoadingStatus = false;
      }
    },
    openBabyLife(id, title, text) {
      this.route.replace({
        path: '/babyLife',
        query: { id, title, text }
      });
    }
  }
}
</script>

<style scoped>
/* ---------- 重置 & 全局 ---------- */
* { box-sizing: border-box; margin: 0; }
.baby-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #f0f2f8 0%, #e4e8f2 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ---------- 顶部（精简风格） ---------- */
.welcome-section {
  background: linear-gradient(135deg, rgba(161,196,253,0.25), rgba(194,233,251,0.15));
  backdrop-filter: blur(8px);
  padding: 10px 16px 8px;
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
.welcome-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.welcome-left h1 {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  color: #1a1a2e;
}
.welcome-subtitle {
  font-size: 0.75rem;
  color: #7f8c8d;
}
.add-btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border: none;
  color: #fff;
  font-weight: 500;
  padding: 6px 16px;
  transition: all 0.25s ease;
}
.add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(108,92,231,0.25);
}

/* 孕周信息 */
.pregnancy-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.4);
  border-radius: 10px;
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.2);
  gap: 8px;
  flex-wrap: wrap;
}
.pregnancy-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}
.pregnancy-icon {
  font-size: 1rem;
}
.pregnancy-text {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c5ce7;
}
.pregnancy-detail {
  font-size: 0.65rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(108,92,231,0.08);
  transition: all 0.2s ease;
}
.pregnancy-detail:hover {
  background: rgba(108,92,231,0.15);
  color: #6c5ce7;
}
.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.progress-label {
  font-size: 0.6rem;
  color: #7f8c8d;
}
::v-deep(.progress-wrapper .el-progress-circle) {
  width: 50px !important;
  height: 50px !important;
}
::v-deep(.progress-wrapper .el-progress__text) {
  font-size: 11px !important;
  color: #6c5ce7;
  font-weight: 700;
}

/* 通知跑马灯 */
.notice-ticker {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 8px;
  padding: 4px 10px;
  border: 1px solid rgba(255,255,255,0.15);
  cursor: pointer;
  overflow: hidden;
}
.ticker-icon {
  font-size: 0.8rem;
  flex-shrink: 0;
}
.ticker-wrapper {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}
.ticker-text {
  display: inline-block;
  padding-left: 100%;
  font-size: 0.7rem;
  color: #2c3e50;
  animation: scroll-ticker 20s linear infinite;
}
@keyframes scroll-ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

/* ---------- 中间内容 ---------- */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 6px 12px 6px;
  min-height: 0;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
}

/* 宝宝信息 */
.baby-info-wrapper {
  flex: 0 0 40%;
  min-height: 80px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 8px 10px;
  margin-bottom: 6px;
  border: 1px solid rgba(255,255,255,0.15);
  overflow: hidden;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a1a2e;
}
.record-count {
  font-size: 0.6rem;
  color: #95a5a6;
}
.baby-info-grid {
  height: calc(100% - 24px);
  overflow-y: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-content: flex-start;
}
.baby-info-grid::-webkit-scrollbar { width: 2px; }
.baby-info-grid::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.15); border-radius: 8px; }

.baby-card {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255,255,255,0.3);
  flex: 1;
  min-width: 200px;
  transition: all 0.2s ease;
}
.baby-card:hover {
  background: rgba(255,255,255,0.8);
  border-color: rgba(108,92,231,0.2);
}
.baby-avatar {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(162,155,254,0.08));
  border-radius: 50%;
  flex-shrink: 0;
}
.baby-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 12px;
  flex: 1;
}
.baby-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
}
.baby-row .label {
  color: #95a5a6;
  font-weight: 400;
  min-width: 28px;
}
.baby-row .value {
  color: #2c3e50;
  font-weight: 500;
}
.baby-row .value.nickname {
  color: #6c5ce7;
}

/* 成长记录 */
.growth-wrapper {
  flex: 1;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 8px 10px;
  border: 1px solid rgba(255,255,255,0.15);
  overflow: hidden;
  min-height: 60px;
}
.growth-timeline {
  height: calc(100% - 24px);
  overflow-y: auto;
  padding-right: 4px;
}
.growth-timeline::-webkit-scrollbar { width: 2px; }
.growth-timeline::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.15); border-radius: 8px; }

.growth-timeline ::v-deep(.el-timeline-item__node) {
  width: 10px;
  height: 10px;
}
.growth-timeline ::v-deep(.el-timeline-item__timestamp) {
  font-size: 0.65rem;
  color: #7f8c8d;
}
.growth-timeline ::v-deep(.el-timeline-item__wrapper) {
  padding-left: 18px;
}
.growth-timeline ::v-deep(.el-timeline-item__tail) {
  border-left: 2px solid rgba(108,92,231,0.12);
}

.growth-card {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}
.growth-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.85);
  border-color: #6c5ce7;
  box-shadow: 0 4px 16px rgba(108,92,231,0.08);
}
.growth-card:active {
  transform: scale(0.98);
}
.growth-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.growth-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a1a2e;
}
.growth-time {
  font-size: 0.55rem;
  color: #95a5a6;
}
.growth-content p {
  font-size: 0.75rem;
  color: #34495e;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.growth-hover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(108,92,231,0.04), rgba(162,155,254,0.04));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #6c5ce7;
  font-size: 0.7rem;
  font-weight: 500;
}
.growth-card:hover .growth-hover {
  opacity: 1;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #95a5a6;
  gap: 10px;
}
.empty-icon {
  font-size: 2.5rem;
  opacity: 0.4;
}
.empty-text {
  font-size: 0.85rem;
}
.empty-btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border: none;
  color: #fff;
  padding: 8px 24px;
  font-weight: 500;
}
.empty-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(108,92,231,0.25);
}

/* ---------- 底部导航 ---------- */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255,255,255,0.5);
  backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255,255,255,0.3);
  padding: 10px 0 16px;
  flex-shrink: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;
  padding: 4px 28px;
  border-radius: 16px;
  position: relative;
}
.nav-item:hover {
  transform: translateY(-3px);
}
.nav-item:active {
  transform: scale(0.9);
}
.nav-item.active .nav-label {
  color: #6c5ce7;
  opacity: 1;
}

.nav-icon {
  font-size: 1.8rem;
  line-height: 1.2;
  transition: transform 0.3s ease;
}
.nav-item:hover .nav-icon {
  transform: scale(1.12);
}

.nav-label {
  font-size: 0.8rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 1.5px;
  margin-top: 2px;
  opacity: 0.5;
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
.nav-item.active::after,
.nav-item:hover::after {
  width: 40px;
}

/* ---------- 对话框 ---------- */
.baby-dialog ::v-deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}
.baby-dialog ::v-deep(.el-dialog__header) {
  padding: 14px 20px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  margin: 0;
}
.baby-dialog ::v-deep(.el-dialog__title) {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}
.baby-dialog ::v-deep(.el-dialog__headerbtn) {
  top: 14px;
  right: 16px;
}
.baby-dialog ::v-deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}
.baby-dialog ::v-deep(.el-dialog__body) {
  padding: 16px 20px 0;
}
.baby-dialog ::v-deep(.el-dialog__footer) {
  padding: 12px 20px 20px;
}

.dialog-body {
  max-height: 55vh;
  overflow-y: auto;
}
.dialog-body::-webkit-scrollbar { width: 3px; }
.dialog-body::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 8px; }

.dialog-body ::v-deep(.el-form-item) {
  margin-bottom: 14px;
}
.dialog-body ::v-deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85rem;
}
.form-input ::v-deep(.el-input__inner) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  height: 44px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.form-input ::v-deep(.el-input__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
}
.form-textarea ::v-deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  padding: 12px 14px;
  font-size: 0.9rem;
  line-height: 1.6;
  transition: all 0.3s ease;
}
.form-textarea ::v-deep(.el-textarea__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
}
.form-datepicker ::v-deep(.el-input__inner) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  height: 44px;
  transition: all 0.3s ease;
}
.form-datepicker ::v-deep(.el-input__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
}

.upload-area {
  width: 100%;
}
.upload-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px dashed #d0d0d0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #7f8c8d;
  font-size: 0.85rem;
  justify-content: center;
}
.upload-trigger:hover {
  border-color: #6c5ce7;
  background: rgba(108,92,231,0.04);
}
.upload-icon {
  font-size: 1.2rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.cancel-btn {
  border-radius: 10px;
  padding: 10px 28px;
  border: 2px solid #e8e8e8;
  color: #7f8c8d;
  font-weight: 500;
}
.submit-btn {
  border-radius: 10px;
  padding: 10px 28px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #fff;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(108,92,231,0.3);
}
.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---------- 响应式 ---------- */
@media (max-width: 480px) {
  .welcome-section {
    padding: 8px 12px 6px;
  }
  .welcome-left h1 {
    font-size: 1rem;
  }
  .welcome-subtitle {
    font-size: 0.65rem;
  }
  .add-btn {
    font-size: 0.7rem;
    padding: 4px 12px;
  }
  .pregnancy-text {
    font-size: 0.7rem;
  }
  .pregnancy-detail {
    font-size: 0.55rem;
  }
  .pregnancy-info {
    padding: 4px 10px;
  }
  .ticker-text {
    font-size: 0.6rem;
  }

  .baby-info-wrapper {
    flex: 0 0 36%;
    padding: 6px 8px;
  }
  .baby-card {
    padding: 8px 10px;
    min-width: 100%;
  }
  .baby-avatar {
    width: 36px;
    height: 36px;
    font-size: 1.4rem;
  }
  .baby-details {
    grid-template-columns: 1fr 1fr;
    gap: 1px 8px;
  }
  .baby-row {
    font-size: 0.6rem;
  }

  .growth-card {
    padding: 8px 12px;
  }
  .growth-title {
    font-size: 0.7rem;
  }
  .growth-content p {
    font-size: 0.65rem;
  }

  .bottom-nav {
    padding: 8px 0 12px;
  }
  .nav-icon {
    font-size: 1.5rem;
  }
  .nav-label {
    font-size: 0.7rem;
    letter-spacing: 1px;
  }
  .nav-item {
    padding: 2px 14px;
  }
  .nav-item::after {
    height: 2px;
  }
  .nav-item.active::after,
  .nav-item:hover::after {
    width: 28px;
  }

  .baby-dialog ::v-deep(.el-dialog) {
    width: 94% !important;
  }
  .dialog-body ::v-deep(.el-form-item__label) {
    font-size: 0.75rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .welcome-left h1 {
    font-size: 1.1rem;
  }
  .baby-info-wrapper {
    flex: 0 0 38%;
  }
  .baby-card {
    min-width: 45%;
  }
  .nav-icon {
    font-size: 1.6rem;
  }
  .nav-label {
    font-size: 0.75rem;
  }
}

@media (min-width: 769px) {
  .baby-info-wrapper {
    flex: 0 0 42%;
  }
  .baby-card {
    min-width: 30%;
  }
  .pregnancy-text {
    font-size: 0.95rem;
  }
  .growth-title {
    font-size: 0.9rem;
  }
  .nav-icon {
    font-size: 2rem;
  }
  .nav-label {
    font-size: 0.9rem;
  }
}
</style>

<style>
/* 弹窗样式 */
.custom-alert {
  max-height: 80%;
  overflow-y: auto !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
}
.custom-alert .el-message-box__header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 16px 20px;
}
.custom-alert .el-message-box__title {
  color: white;
  font-weight: 600;
}
.custom-alert .el-message-box__content {
  padding: 20px 24px;
  font-size: 0.9rem;
  line-height: 1.7;
  color: #34495e;
}
.custom-alert .el-message-box__btns {
  display: none;
}
</style>