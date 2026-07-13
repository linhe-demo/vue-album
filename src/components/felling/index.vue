<template>
  <div class="feeling-container">
    <!-- ===== 顶部欢迎区域（精简） ===== -->
    <header class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-header">
          <div class="welcome-left">
            <h1>欢迎 {{ customer }}</h1>
            <div class="welcome-subtitle">✨ 记录生活中的每一刻星闪</div>
          </div>
          <div class="header-actions">
            <el-button class="add-btn" @click="addFeeling" round size="small">
              ✏️ 记录
            </el-button>
          </div>
        </div>

        <div class="poetry-section">
          <span class="poetry-icon">📜</span>
          <span class="poetry-text">{{ textToShow }}</span>
        </div>

        <div class="stats-row">
          <span class="stat-item">📖 共 {{ timelineItems.length }} 条记录</span>
          <span class="stat-item">⭐ {{ getTodayCount() }} 条今日</span>
        </div>
      </div>
    </header>

    <!-- ===== 主要内容区域 ===== -->
    <main class="content-section" v-loading.fullscreen="loadDate" :element-loading-text="loading">
      <!-- 时间线 -->
      <div class="timeline-wrapper">
        <div class="timeline-container">
          <el-timeline class="custom-timeline">
            <el-timeline-item
                v-for="(item, index) in timelineItems"
                :key="index"
                :timestamp="formatDate(item.date)"
                placement="top"
                :type="getTimelineType(index)"
                :color="getTimelineColor(index)"
            >
              <div class="timeline-card" @click="open(item.title, item.text)">
                <div class="card-header">
                  <div class="card-title">
                    <span class="title-icon">📌</span>
                    {{ item.title }}
                  </div>
                  <span class="card-time">{{ getTimeAgo(item.date) }}</span>
                </div>
                <div class="card-content">
                  <p class="card-text">{{ item.text }}</p>
                </div>
                <div class="card-footer">
                  <span class="card-stats">📝 {{ getTextLength(item.text) }} 字</span>
                  <span class="mood-tag">{{ getMoodTag(item.text) }}</span>
                </div>
                <div class="card-hover-effect">
                  <span>点击查看详情 ✨</span>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>

          <!-- 空状态 -->
          <div v-if="timelineItems.length === 0" class="empty-state">
            <div class="empty-icon">🌟</div>
            <div class="empty-text">还没有记录任何星闪瞬间</div>
            <el-button class="empty-btn" @click="addFeeling" round>
              ✨ 开始记录
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- ===== 底部导航 ===== -->
    <footer class="bottom-nav">
      <div class="nav-item" @click="handleNavigation('date')">
        <span class="nav-icon">📚</span>
        <span class="nav-label">岁月</span>
      </div>
      <div class="nav-item active" @click="handleNavigation('felling')">
        <span class="nav-icon">✨</span>
        <span class="nav-label">星闪</span>
      </div>
      <div class="nav-item" @click="handleNavigation('baby')">
        <span class="nav-icon">👶</span>
        <span class="nav-label">宝宝</span>
      </div>
    </footer>

    <!-- ===== 记录对话框 ===== -->
    <el-dialog
        v-loading="fellingLoading"
        title="✨ 记录星闪瞬间"
        width="92%"
        v-model="dialogVisible"
        class="feeling-dialog"
        :close-on-click-modal="false"
        @close="onDialogClose"
    >
      <div class="dialog-body">
        <el-form :model="form" class="feeling-form">
          <el-form-item label="标题">
            <el-input
                placeholder="给这个瞬间起个名字..."
                v-model="form.title"
                maxlength="20"
                show-word-limit
                class="title-input"
                ref="titleInput"
            />
          </el-form-item>

          <el-form-item label="内容">
            <el-input
                type="textarea"
                :rows="6"
                placeholder="这一刻的心情，这一瞬的感悟..."
                v-model="form.fellingText"
                maxlength="500"
                show-word-limit
                class="content-textarea"
                resize="none"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button class="cancel-btn" @click="cancel">取消</el-button>
          <el-button
              class="submit-btn"
              type="primary"
              @click="submit"
              :disabled="!form.title || !form.fellingText"
          >
            💫 保存记录
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {useStore} from 'vuex';
import axios from "axios";
import {useRouter} from "vue-router";

export default {
  name: "FeelingIndex",
  data() {
    return {
      customer: "",
      token: "",
      dialogVisible: false,
      fellingLoading: false,
      loadDate: false,
      loading: "加载中…",
      timelineItems: [],
      textToShow: "",
      form: {
        title: '',
        fellingText: ''
      },
      route: null,
      typingTimer: null,
    }
  },
  mounted() {
    // ✅ 在 mounted 中获取 store 数据
    const store = useStore();
    this.customer = store.state.user.nickname;
    this.token = store.state.user.token;
    this.route = useRouter();
    this.getConfig();
    this.showTitle();
  },
  beforeUnmount() {
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
    }
  },
  methods: {
    showTitle() {
      const fullText = "时光如流水，似静悄无声。岁月如涟漪，起伏波未行。浮生如沙粒，刹那即永恒。愿卿多留迹，夜半或黄昏。晨钟与暮鼓，明月伴星辰。流水虽无意，望卿加墨痕。待到耄耋纪，聚亲叙旧情。"
      let idx = 0;
      this.typingTimer = setInterval(() => {
        if (idx < fullText.length) {
          this.textToShow += fullText[idx];
          idx += 1;
        } else {
          clearInterval(this.typingTimer);
        }
      }, 50);
    },
    // ✅ 修复：直接使用 this.token，不再调用 useStore()
    getConfig() {
      this.loadDate = true;
      axios.post(process.env.BASE_URL + '/api/v1/life/felling', {}, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          this.timelineItems = response.data.data || [];
        } else {
          this.$message({ type: 'error', message: response.data.message });
        }
        this.loadDate = false;
      }).catch(() => {
        this.loadDate = false;
      });
    },
    handleNavigation(path) {
      const map = {
        'date': '/date',
        'felling': '/felling',
        'baby': '/baby'
      };
      this.route.replace(map[path]);
    },
    open(title, value) {
      this.$alert(value, title, {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true,
        closeOnClickModal: true
      });
    },
    addFeeling() {
      this.dialogVisible = true;
      // 对话框打开后聚焦到标题输入框
      this.$nextTick(() => {
        if (this.$refs.titleInput) {
          this.$refs.titleInput.focus();
        }
      });
    },
    cancel() {
      this.form.fellingText = '';
      this.form.title = '';
      this.dialogVisible = false;
    },
    onDialogClose() {
      // 对话框关闭时清理加载状态
      this.fellingLoading = false;
    },
    submit() {
      if (!this.form.title || !this.form.fellingText) {
        this.$message({ type: 'warning', message: '标题和内容都不能为空！' });
        return;
      }
      this.fellingLoading = true;
      axios.post(process.env.BASE_URL + '/api/v1/felling/save', this.form, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          this.$message({ type: 'success', message: '✨ 保存成功！' });
          this.dialogVisible = false;
          this.form.title = '';
          this.form.fellingText = '';
          this.getConfig();
        } else {
          this.$message({ type: 'error', message: response.data.message });
        }
        this.fellingLoading = false;
      }).catch(() => {
        this.fellingLoading = false;
        this.$message({ type: 'error', message: '保存失败，请重试' });
      });
    },
    getTimelineType(index) {
      const types = ['primary', 'success', 'warning', 'info'];
      return types[index % types.length];
    },
    getTimelineColor(index) {
      const colors = ['#6c5ce7', '#00b894', '#e17055', '#fdcb6e'];
      return colors[index % colors.length];
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getTextLength(text) {
      return text ? text.length : 0;
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
    getMoodTag(text) {
      const moods = {
        '😊 开心': ['开心', '高兴', '快乐', '幸福', '笑', '哈哈'],
        '🤔 思考': ['思考', '感悟', '想法', '体会', '觉得'],
        '❤️ 感动': ['感动', '温暖', '感恩', '感谢', '谢谢'],
        '📝 日常': ['日常', '今天', '现在', '此刻', '今天']
      };
      for (const [mood, keywords] of Object.entries(moods)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          return mood;
        }
      }
      return '✨ 瞬间';
    },
    getTodayCount() {
      const today = new Date().toDateString();
      return this.timelineItems.filter(item => {
        return new Date(item.date).toDateString() === today;
      }).length;
    }
  }
}
</script>

<style scoped>
/* ---------- 重置 & 全局 ---------- */
* { box-sizing: border-box; margin: 0; }
.feeling-container {
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

.poetry-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(255,255,255,0.4);
  border-radius: 10px;
  padding: 6px 12px;
  border: 1px solid rgba(255,255,255,0.2);
}
.poetry-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-top: 1px;
}
.poetry-text {
  font-size: 0.75rem;
  color: #2c3e50;
  line-height: 1.5;
  word-break: break-all;
}

.stats-row {
  display: flex;
  gap: 16px;
  font-size: 0.65rem;
  color: #7f8c8d;
  padding: 0 4px;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ---------- 中间内容 ---------- */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 6px 12px 6px;
  min-height: 0;
  overflow: hidden;
  background: rgba(255,255,255,0.1);
}

.timeline-wrapper {
  flex: 1;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 8px 10px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
}

.timeline-container {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}
.timeline-container::-webkit-scrollbar { width: 3px; }
.timeline-container::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 8px; }

.custom-timeline {
  padding-left: 0;
}
.custom-timeline ::v-deep(.el-timeline-item__node) {
  width: 10px;
  height: 10px;
}
.custom-timeline ::v-deep(.el-timeline-item__timestamp) {
  font-size: 0.7rem;
  color: #7f8c8d;
  font-weight: 500;
}
.custom-timeline ::v-deep(.el-timeline-item__wrapper) {
  padding-left: 18px;
}
.custom-timeline ::v-deep(.el-timeline-item__tail) {
  border-left: 2px solid rgba(108,92,231,0.15);
}

.timeline-card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(255,255,255,0.3);
  position: relative;
  overflow: hidden;
}
.timeline-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.9);
  border-color: #6c5ce7;
  box-shadow: 0 4px 16px rgba(108,92,231,0.08);
}
.timeline-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a1a2e;
}
.title-icon {
  font-size: 0.8rem;
}
.card-time {
  font-size: 0.6rem;
  color: #95a5a6;
  flex-shrink: 0;
}

.card-content {
  margin-bottom: 6px;
}
.card-text {
  font-size: 0.8rem;
  color: #34495e;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-stats {
  font-size: 0.6rem;
  color: #95a5a6;
}
.mood-tag {
  font-size: 0.55rem;
  background: rgba(108,92,231,0.08);
  color: #6c5ce7;
  padding: 1px 10px;
  border-radius: 12px;
  border: 1px solid rgba(108,92,231,0.1);
}

.card-hover-effect {
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
  font-size: 0.75rem;
  font-weight: 500;
}
.timeline-card:hover .card-hover-effect {
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
  gap: 12px;
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
.feeling-dialog ::v-deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}
.feeling-dialog ::v-deep(.el-dialog__header) {
  padding: 14px 20px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  margin: 0;
}
.feeling-dialog ::v-deep(.el-dialog__title) {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}
.feeling-dialog ::v-deep(.el-dialog__headerbtn) {
  top: 14px;
  right: 16px;
}
.feeling-dialog ::v-deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}
.feeling-dialog ::v-deep(.el-dialog__body) {
  padding: 16px 20px 0;
}
.feeling-dialog ::v-deep(.el-dialog__footer) {
  padding: 12px 20px 20px;
}

.dialog-body {
  max-height: 50vh;
  overflow-y: auto;
}
.dialog-body::-webkit-scrollbar { width: 3px; }
.dialog-body::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 8px; }

.feeling-form ::v-deep(.el-form-item) {
  margin-bottom: 14px;
}
.feeling-form ::v-deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85rem;
}
.title-input ::v-deep(.el-input__inner) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  height: 44px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.title-input ::v-deep(.el-input__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
}
.content-textarea ::v-deep(.el-textarea__inner) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  padding: 12px 14px;
  font-size: 0.9rem;
  line-height: 1.6;
  transition: all 0.3s ease;
}
.content-textarea ::v-deep(.el-textarea__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
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
  .poetry-text {
    font-size: 0.65rem;
  }
  .stats-row {
    font-size: 0.55rem;
    gap: 10px;
  }
  .content-section {
    padding: 4px 10px 4px;
  }
  .timeline-wrapper {
    padding: 6px 6px;
    border-radius: 10px;
  }
  .timeline-card {
    padding: 10px 12px;
    border-radius: 10px;
  }
  .card-title {
    font-size: 0.75rem;
  }
  .card-text {
    font-size: 0.7rem;
  }
  .card-time {
    font-size: 0.5rem;
  }
  .card-stats {
    font-size: 0.5rem;
  }
  .mood-tag {
    font-size: 0.5rem;
    padding: 0 8px;
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
  .feeling-dialog ::v-deep(.el-dialog) {
    width: 94% !important;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .welcome-left h1 {
    font-size: 1.1rem;
  }
  .nav-icon {
    font-size: 1.6rem;
  }
  .nav-label {
    font-size: 0.75rem;
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