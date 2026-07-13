<template>
  <div class="album-container">
    <!-- ===== 顶部欢迎区域 ===== -->
    <header class="welcome-section">
      <div class="welcome-content">
        <div class="welcome-header">
          <div class="welcome-left">
            <el-button class="back-btn" @click="back" circle size="small">
              ←
            </el-button>
            <div>
              <h1>{{ date }}</h1>
              <div class="welcome-subtitle">📸 星闪瞬间 · 记忆相册</div>
            </div>
          </div>
          <div class="header-actions">
            <el-button class="add-btn" @click="addAlbum" round size="small">
              ✏️ 创建相册
            </el-button>
          </div>
        </div>

        <div class="stats-row">
          <span class="stat-item">📚 共 {{ images.length }} 个相册</span>
          <span class="stat-item">🌸 {{ getSeason }} 的季节</span>
          <span class="stat-item">📅 {{ getCurrentDate }}</span>
        </div>
      </div>
    </header>

    <!-- ===== 主要内容区域 ===== -->
    <main class="content-section" v-loading.fullscreen="loadAlbum" :element-loading-text="loading">
      <div class="timeline-wrapper">
        <div class="timeline-content">
          <div
              v-for="(item, index) in images"
              :key="index"
              class="timeline-item"
          >
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-line" v-if="index < images.length - 1"></div>
              <div class="marker-date">{{ formatDate(item.date) }}</div>
            </div>

            <div
                class="album-card"
                @click="showPicture(item.id, item.title)"
            >
              <div class="card-header">
                <div class="card-title">
                  <span class="title-icon">📌</span>
                  {{ item.title }}
                </div>
                <span class="card-badge" v-if="isFeatured(index)">⭐ 精选</span>
              </div>

              <div class="card-content">
                <p class="card-desc">{{ item.desc }}</p>
              </div>

              <div class="card-footer">
                <div class="card-meta">
                  <span class="meta-item">📅 {{ formatTime(item.date) }}</span>
                  <span class="meta-item">🕒 {{ getTimeAgo(item.date) }}</span>
                </div>
                <span class="card-arrow">查看相册 →</span>
              </div>

              <div class="card-hover">
                <span>👁️ 查看相册</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="images.length === 0" class="empty-state">
            <div class="empty-icon">📷</div>
            <div class="empty-text">还没有相册记录</div>
            <div class="empty-desc">点击右上角「创建相册」开始记录美好时刻</div>
            <el-button class="empty-btn" @click="addAlbum" round>
              ✨ 创建相册
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- ===== 新增相册对话框 ===== -->
    <el-dialog
        v-model="dialogVisible"
        title="📸 创建新相册"
        :width="dialogWidth"
        class="album-dialog"
        :close-on-click-modal="false"
        :modal-append-to-body="true"
        :append-to-body="true"
        @open="onDialogOpen"
        @close="onDialogClose"
    >
      <div class="dialog-body" ref="dialogBody">
        <el-form :model="albumForm" class="album-form" label-position="top">
          <el-form-item label="相册名称">
            <el-input
                v-model="albumForm.name"
                placeholder="给相册起个温暖的名字..."
                maxlength="20"
                show-word-limit
                class="form-input"
                ref="nameInput"
            />
          </el-form-item>

          <el-form-item label="相册描述">
            <el-input
                v-model="albumForm.desc"
                type="textarea"
                :rows="3"
                placeholder="描述这个相册的故事..."
                maxlength="100"
                show-word-limit
                class="form-textarea"
                resize="none"
            />
          </el-form-item>

          <el-form-item label="记录时间">
            <div class="date-picker-wrapper">
              <el-date-picker
                  v-model="albumForm.date"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY年MM月DD日"
                  value-format="YYYY-MM-DD"
                  class="form-datepicker"
                  :picker-options="pickerOptions"
                  ref="datePicker"
              />
              <div class="date-quick-btns">
                <span class="quick-btn" @click="setDate('today')">今天</span>
                <span class="quick-btn" @click="setDate('yesterday')">昨天</span>
                <span class="quick-btn" @click="setDate('week')">一周前</span>
                <span class="quick-btn" @click="setDate('month')">一月前</span>
              </div>
              <div class="date-tips">💡 点击快捷按钮快速选择</div>
            </div>
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
              :disabled="!albumForm.name || !albumForm.desc || !albumForm.date"
          >
            💾 保存相册
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {useStore} from 'vuex';
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

export default {
  name: "AlbumIndex",
  data() {
    return {
      customer: "",
      images: [],
      route: null,
      token: "",
      dialogVisible: false,
      albumForm: {
        name: "",
        desc: "",
        date: ""
      },
      date: "",
      loadAlbum: false,
      loading: "加载中…",
      isMobile: false,
      pickerOptions: {
        firstDayOfWeek: 1
      }
    }
  },
  computed: {
    getSeason() {
      const month = new Date().getMonth() + 1;
      if (month >= 3 && month <= 5) return '春';
      if (month >= 6 && month <= 8) return '夏';
      if (month >= 9 && month <= 11) return '秋';
      return '冬';
    },
    getCurrentDate() {
      const now = new Date();
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    dialogWidth() {
      return this.isMobile ? '94%' : '520px';
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);

    const store = useStore();
    this.customer = store.state.user.nickname;
    this.token = store.state.user.token;
    this.route = useRouter();
    const route = this.$route.query;
    this.date = route.date || '岁月相册';
    this.getConfig();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 480;
    },
    getConfig() {
      this.loadAlbum = true;
      axios.post(process.env.BASE_URL + '/api/v1/album/list', {date: this.date}, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          this.images = response.data.data || [];
        } else {
          this.$message({ type: 'error', message: response.data.message });
          this.route.replace({ path: '/' });
        }
        this.loadAlbum = false;
      }).catch(() => {
        this.loadAlbum = false;
      });
    },
    refreshAlbumList() {
      this.loadAlbum = true;
      axios.post(process.env.BASE_URL + '/api/v1/album/list', { date: this.date }, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          this.images = response.data.data || [];
        }
        this.loadAlbum = false;
      }).catch(() => {
        this.loadAlbum = false;
      });
    },
    showPicture(id, title) {
      this.route.replace({
        path: '/picture',
        query: { id, title, date: this.date }
      });
    },
    cancelSave() {
      this.dialogVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.albumForm.name = "";
      this.albumForm.desc = "";
      this.albumForm.date = "";
    },
    saveAlbum() {
      if (!this.albumForm.name || !this.albumForm.desc || !this.albumForm.date) {
        this.$message({ type: 'warning', message: '请完整填写相册信息！' });
        return;
      }

      this.loadAlbum = true;
      this.loading = "保存中…";

      axios.post(process.env.BASE_URL + '/api/v1/album/add', this.albumForm, {
        headers: { 'Authorization': this.token }
      }).then(response => {
        if (response.data.code === 200) {
          this.$message({ type: 'success', message: '🎉 相册创建成功！' });
          this.dialogVisible = false;
          this.resetForm();
          this.refreshAlbumList();
        } else {
          this.$message({ type: 'error', message: response.data.message });
        }
        this.loadAlbum = false;
      }).catch(() => {
        this.loadAlbum = false;
        this.$message({ type: 'error', message: '保存失败，请重试' });
      });
    },
    addAlbum() {
      this.dialogVisible = true;
    },
    back() {
      this.route.replace({ path: '/date' });
    },
    setDate(type) {
      const now = new Date();
      let targetDate = new Date();

      switch(type) {
        case 'today':
          targetDate = now;
          break;
        case 'yesterday':
          targetDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          targetDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          targetDate.setMonth(now.getMonth() - 1);
          break;
        default:
          targetDate = now;
      }

      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      this.albumForm.date = `${year}-${month}-${day}`;
    },
    onDialogOpen() {
      setTimeout(() => {
        if (this.$refs.nameInput) {
          this.$refs.nameInput.focus();
        }
      }, 300);
    },
    onDialogClose() {
      if (this.$refs.dialogBody) {
        this.$refs.dialogBody.scrollTop = 0;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      });
    },
    formatTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
    isFeatured(index) {
      return index % 3 === 0;
    }
  }
}
</script>

<style scoped>
/* ---------- 重置 & 全局 ---------- */
* { box-sizing: border-box; margin: 0; }
.album-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #f0f2f8 0%, #e4e8f2 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ---------- 顶部 ---------- */
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
  gap: 10px;
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
.back-btn {
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,255,255,0.3);
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.25s ease;
  width: 36px;
  height: 36px;
}
.back-btn:hover {
  background: rgba(255,255,255,0.8);
  transform: scale(1.05);
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

.stats-row {
  display: flex;
  gap: 16px;
  font-size: 0.65rem;
  color: #7f8c8d;
  padding: 0 4px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.3);
  padding: 2px 10px;
  border-radius: 12px;
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

.timeline-wrapper {
  flex: 1;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  padding: 8px 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.15);
}

.timeline-content {
  height: 100%;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}
.timeline-content::-webkit-scrollbar { width: 3px; }
.timeline-content::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 8px; }

/* ---------- 时间线项目 ---------- */
.timeline-item {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  position: relative;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 44px;
  padding-top: 4px;
  position: relative;
}

.marker-dot {
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.6);
  box-shadow: 0 2px 8px rgba(108,92,231,0.2);
  flex-shrink: 0;
  z-index: 2;
}

.marker-line {
  position: absolute;
  top: 18px;
  bottom: -2px;
  left: 50%;
  width: 2px;
  background: linear-gradient(to bottom, rgba(108,92,231,0.2), rgba(108,92,231,0.05));
  transform: translateX(-50%);
}

.marker-date {
  font-size: 0.55rem;
  color: #95a5a6;
  margin-top: 4px;
  font-weight: 500;
  white-space: nowrap;
}

/* ---------- 相册卡片 ---------- */
.album-card {
  flex: 1;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(4px);
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
  min-height: 90px;
}
.album-card:hover {
  transform: translateY(-3px);
  background: rgba(255,255,255,0.85);
  border-color: #6c5ce7;
  box-shadow: 0 4px 20px rgba(108,92,231,0.08);
}
.album-card:active {
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
.card-badge {
  font-size: 0.55rem;
  background: linear-gradient(135deg, #fdcb6e, #f39c12);
  color: #fff;
  padding: 1px 10px;
  border-radius: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.card-content {
  margin-bottom: 8px;
}
.card-desc {
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
.card-meta {
  display: flex;
  gap: 10px;
}
.meta-item {
  font-size: 0.6rem;
  color: #95a5a6;
  display: flex;
  align-items: center;
  gap: 2px;
}
.card-arrow {
  font-size: 0.65rem;
  color: #6c5ce7;
  font-weight: 500;
  transition: all 0.3s ease;
}
.album-card:hover .card-arrow {
  transform: translateX(4px);
}

.card-hover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(108,92,231,0.06), rgba(162,155,254,0.06));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #6c5ce7;
  font-size: 0.75rem;
  font-weight: 500;
}
.album-card:hover .card-hover {
  opacity: 1;
}

/* ---------- 空状态 ---------- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #95a5a6;
  gap: 8px;
}
.empty-icon {
  font-size: 2.5rem;
  opacity: 0.4;
}
.empty-text {
  font-size: 0.9rem;
  font-weight: 500;
}
.empty-desc {
  font-size: 0.75rem;
}
.empty-btn {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  border: none;
  color: #fff;
  padding: 8px 24px;
  font-weight: 500;
  margin-top: 4px;
}
.empty-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(108,92,231,0.25);
}

/* ---------- 对话框 ---------- */
.album-dialog ::v-deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
}
.album-dialog ::v-deep(.el-dialog__header) {
  padding: 14px 20px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  margin: 0;
  flex-shrink: 0;
}
.album-dialog ::v-deep(.el-dialog__title) {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}
.album-dialog ::v-deep(.el-dialog__headerbtn) {
  top: 14px;
  right: 16px;
}
.album-dialog ::v-deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
}
.album-dialog ::v-deep(.el-dialog__body) {
  padding: 16px 20px 0;
  flex: 1;
  overflow-y: auto;
}
.album-dialog ::v-deep(.el-dialog__footer) {
  padding: 12px 20px 20px;
  flex-shrink: 0;
}

.dialog-body {
  max-height: 55vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.dialog-body::-webkit-scrollbar { width: 3px; }
.dialog-body::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 8px; }

.album-form ::v-deep(.el-form-item) {
  margin-bottom: 14px;
}
.album-form ::v-deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.85rem;
  padding-bottom: 4px;
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
  min-height: 80px;
}
.form-textarea ::v-deep(.el-textarea__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
}

/* 日期选择器优化 */
.date-picker-wrapper {
  width: 100%;
}
.form-datepicker {
  width: 100%;
}
.form-datepicker ::v-deep(.el-input__inner) {
  border-radius: 10px;
  border: 2px solid #e8e8e8;
  height: 44px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
}
.form-datepicker ::v-deep(.el-input__inner):focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.08);
}
.form-datepicker ::v-deep(.el-picker-panel) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 92% !important;
  max-width: 400px !important;
  max-height: 80vh !important;
  z-index: 9999 !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
}
.form-datepicker ::v-deep(.el-picker-panel__body) {
  padding: 12px !important;
}
.form-datepicker ::v-deep(.el-date-picker__header) {
  padding: 8px 12px !important;
}
.form-datepicker ::v-deep(.el-date-table td) {
  padding: 4px 0 !important;
}

.date-quick-btns {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.quick-btn {
  font-size: 0.7rem;
  color: #6c5ce7;
  background: rgba(108,92,231,0.08);
  padding: 4px 14px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(108,92,231,0.1);
  user-select: none;
}
.quick-btn:hover {
  background: rgba(108,92,231,0.15);
  transform: scale(1.05);
}
.quick-btn:active {
  transform: scale(0.95);
}

.date-tips {
  font-size: 0.65rem;
  color: #95a5a6;
  margin-top: 6px;
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
  .stats-row {
    font-size: 0.55rem;
    gap: 8px;
  }
  .stat-item {
    padding: 1px 8px;
  }
  .back-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .content-section {
    padding: 4px 10px 4px;
  }
  .timeline-wrapper {
    padding: 6px 8px;
    border-radius: 10px;
  }

  .timeline-item {
    gap: 10px;
    padding-bottom: 12px;
  }
  .timeline-marker {
    width: 32px;
  }
  .marker-dot {
    width: 10px;
    height: 10px;
  }
  .marker-date {
    font-size: 0.45rem;
  }

  .album-card {
    padding: 10px 12px;
    min-height: 70px;
    border-radius: 10px;
  }
  .card-title {
    font-size: 0.75rem;
  }
  .card-desc {
    font-size: 0.7rem;
  }
  .card-badge {
    font-size: 0.5rem;
    padding: 0 8px;
  }
  .meta-item {
    font-size: 0.5rem;
  }
  .card-arrow {
    font-size: 0.55rem;
  }
  .card-meta {
    gap: 6px;
  }

  .album-dialog ::v-deep(.el-dialog) {
    width: 94% !important;
    max-height: 90vh !important;
    margin: 5vh auto !important;
  }
  .album-form ::v-deep(.el-form-item__label) {
    font-size: 0.75rem;
  }
  .form-input ::v-deep(.el-input__inner) {
    height: 40px;
    font-size: 0.85rem;
  }
  .form-datepicker ::v-deep(.el-input__inner) {
    height: 40px;
    font-size: 0.85rem;
  }
  .date-quick-btns {
    gap: 6px;
  }
  .quick-btn {
    font-size: 0.6rem;
    padding: 3px 10px;
  }
  .dialog-footer {
    flex-direction: column;
    gap: 8px;
  }
  .cancel-btn, .submit-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .welcome-left h1 {
    font-size: 1.1rem;
  }
  .album-card {
    padding: 12px 14px;
  }
  .card-title {
    font-size: 0.8rem;
  }
  .album-dialog ::v-deep(.el-dialog) {
    width: 90% !important;
  }
}
</style>