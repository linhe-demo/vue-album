<template>
  <div class="gallery-container">
    <!-- 顶部导航栏 -->
    <div class="header-section">
      <div class="header-bg">
        <div class="bg-overlay"></div>
        <div class="floating-elements">
          <div class="floating-element element-1">📸</div>
          <div class="floating-element element-2">🖼️</div>
          <div class="floating-element element-3">✨</div>
        </div>
      </div>

      <div class="header-content">
        <div class="nav-actions">
          <el-button class="back-btn" @click="back" circle>
            <i class="btn-icon">←</i>
          </el-button>

          <div class="title-section">
            <div class="main-title">
              <i class="title-icon">📷</i>
              {{ title }}
            </div>
            <div class="sub-title">{{ arr.length }} 张珍贵照片</div>
          </div>

          <el-button class="add-btn" type="primary" @click="add" circle>
            <i class="btn-icon">+</i>
          </el-button>
        </div>

        <div class="gallery-stats">
          <div class="stat-item">
            <div class="stat-icon">🖼️</div>
            <div class="stat-info">
              <div class="stat-number">{{ arr.length }}</div>
              <div class="stat-label">照片数量</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📏</div>
            <div class="stat-info">
              <div class="stat-number">{{ getHorizontalCount }}</div>
              <div class="stat-label">横版照片</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🕒</div>
            <div class="stat-info">
              <div class="stat-number">{{ getUploadTime }}</div>
              <div class="stat-label">最近更新</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片展示区域 -->
    <div class="gallery-section" v-loading.fullscreen="loadPicture" :element-loading-text="loading">
      <!-- 空状态 -->
      <div v-if="arr.length === 0" class="empty-gallery">
        <div class="empty-icon">📷</div>
        <div class="empty-title">相册还是空的</div>
        <div class="empty-desc">添加一些照片来记录美好瞬间</div>
        <el-button type="primary" @click="add" class="empty-btn">
          <i class="btn-icon">+</i>
          添加第一张照片
        </el-button>
      </div>

      <!-- 图片网格 -->
      <div v-else class="gallery-grid">
        <div
            v-for="(image, index) in arr"
            :key="image.id"
            class="gallery-item"
            :style="{ animationDelay: `${index * 0.05}s` }"
            @click="showModal(index)"
        >
          <div class="image-container">
            <img
                v-lazy="image.src"
                :class="{ 'portrait-image': image.horizontal === 1 }"
                alt="照片"
                class="gallery-image"
                @load="handleImageLoad"
            />
            <div class="image-overlay">
              <div class="overlay-content">
                <i class="overlay-icon">👁️</i>
                <span class="overlay-text">查看大图</span>
              </div>
            </div>
            <div class="image-badge" v-if="image.horizontal === 1">
              <i class="badge-icon">🔄</i>
              <span>横版</span>
            </div>
          </div>
        </div>

        <!-- 添加照片的入口 -->
        <div class="add-item" @click="add">
          <div class="add-content">
            <i class="add-icon">+</i>
            <div class="add-text">添加照片</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 上传照片对话框 -->
    <el-dialog
        v-model="dialogVisible"
        title="添加照片"
        width="95%"
        class="upload-dialog"
        :close-on-click-modal="false"
        @close="onDialogClose"
    >
      <div class="dialog-header">
        <div class="dialog-title">
          <i class="dialog-icon">📤</i>
          <span>上传照片到相册</span>
        </div>
        <div class="dialog-subtitle">选择要添加到 "{{ title }}" 的照片</div>
      </div>

      <div v-loading="uploadLoadingStatus" :element-loading-text="upload_loading" class="upload-content">
        <el-upload
            class="upload-area"
            action="#"
            accept='image/jpeg,image/gif,image/png,image/webp'
            :on-remove="handleRemove"
            :on-change="handleChange"
            :before-remove="beforeRemove"
            list-type="picture-card"
            multiple
            :limit="40"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :file-list="fileList"
            :class="{ 'has-files': fileList.length > 0 }"
        >
          <div class="upload-placeholder">
            <i class="upload-icon">📁</i>
            <div class="upload-text">点击选择照片</div>
            <div class="upload-tips">或拖拽文件到这里</div>
            <div class="upload-limits">支持 JPG、PNG、GIF、WEBP 格式，最多 40 张</div>
          </div>
        </el-upload>

        <!-- 文件统计 -->
        <div v-if="fileList.length > 0" class="file-stats">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ fileNum }}</div>
              <div class="stat-label">文件数量</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ totalSize }} MB</div>
              <div class="stat-label">总大小</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ getAverageSize }} MB</div>
              <div class="stat-label">平均大小</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 上传进度 -->
      <div v-if="percentageStatus" class="upload-progress">
        <div class="progress-header">
          <span class="progress-title">上传进度</span>
          <span class="progress-tip">上传过程中可关闭此窗口</span>
        </div>
        <div class="progress-container">
          <el-progress
              :percentage="percentage"
              :stroke-width="12"
              :show-text="false"
              class="progress-bar"
          />
          <div class="progress-info">
            <span class="progress-percentage">{{ percentage }}%</span>
            <span class="progress-status" v-if="percentage < 100">上传中...</span>
            <span class="progress-status success" v-else>上传完成!</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelUpload" class="cancel-btn">
            <i class="btn-icon">✕</i>
            取消
          </el-button>
          <el-button
              type="primary"
              @click="handlePush"
              class="upload-btn"
              :disabled="fileList.length === 0 || uploadLoadingStatus"
              :loading="uploadLoadingStatus"
          >
            <i class="btn-icon">📤</i>
            {{ uploadLoadingStatus ? '上传中...' : '开始上传' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览模态框 -->
    <el-dialog
        :visible.sync="diaPreviewVisible"
        title="图片预览"
        width="90%"
        class="preview-dialog"
        :close-on-click-modal="true"
    >
      <div class="preview-content">
        <img :src="dialogImageUrl" alt="预览图片" class="preview-image" />
      </div>
    </el-dialog>

    <!-- 大图预览模态框 -->
    <ImageRow
        :images="arr"
        :token="token"
        @sendValue="handleChildValue"
        class="image-row-component"
    />
  </div>
</template>

<script>
import {useStore} from 'vuex';
import axios from "axios";
import router from "../../router";
import ImageRow from "/src/components/picture/imageRow.vue";
import NP from 'number-precision';

export default {
  name: "GalleryIndex",
  components: {
    ImageRow,
  },
  data() {
    return {
      id: 0,
      customer: "",
      title: '',
      websocket: '',
      percentageStatus: false,
      percentage: 0,
      imgList: [],
      loading: "正在加载照片，请稍候...",
      upload_loading: "文件上传中，请耐心等待...",
      dialogVisible: false,
      loadPicture: false,
      uploadLoadingStatus: false,
      arr: [],
      lineNum: 3,
      spacingNumber: 5,
      token: '',
      fileList: [],
      diaPreviewVisible: false,
      dialogImageUrl: "",
      date: '',
      timer: '',
      fileNum: 0,
      totalSize: 0
    }
  },
  computed: {
    getHorizontalCount() {
      return this.arr.filter(item => item.horizontal === 1).length;
    },
    getUploadTime() {
      if (this.arr.length === 0) return '暂无';
      const lastItem = this.arr[this.arr.length - 1];
      return this.getTimeAgo(lastItem.createTime) || '刚刚';
    },
    getAverageSize() {
      return this.fileNum > 0 ? (this.totalSize / this.fileNum).toFixed(2) : '0.00';
    }
  },
  mounted() {
    // ✅ 在 mounted 中获取 store 数据并保存到 data
    const store = useStore()
    this.customer = store.state.user.nickname
    this.token = store.state.user.token

    const route = this.$route.query
    this.id = route.id
    this.title = route.title
    this.date = route.date
    this.getDetail()
  },
  beforeUnmount() {
    this.cleanSetTime()
  },
  methods: {
    async handlePush() {
      if (this.fileList.length === 0) {
        this.$message.warning('请先选择照片')
        return
      }

      this.percentageStatus = true
      this.uploadLoadingStatus = true
      this.setTime()

      let fd = new FormData();
      this.fileList.forEach(item => {
        fd.append("files", item.raw);
      })
      fd.append("id", this.id);

      try {
        const response = await axios.post(process.env.BASE_URL + '/api/v1/image/upload', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': this.token
          },
        })

        if (response.data.code === 200) {
          this.percentageStatus = false
          this.uploadLoadingStatus = false
          this.cleanSetTime()

          this.$message.success('🎉 照片上传成功！')

          // 清理 Redis（独立调用，不阻塞主流程）
          this.noticeCleanRedis()

          this.dialogVisible = false
          this.fileList = []
          this.totalSize = 0
          this.fileNum = 0
          this.percentage = 0
          this.getDetail()
        } else {
          this.$message.error(response.data.message || '上传失败')
          this.percentageStatus = false
          this.uploadLoadingStatus = false
          this.cleanSetTime()
        }
      } catch (error) {
        console.error('上传错误:', error)
        this.$message.error('上传过程中出现错误，请重试')
        this.percentageStatus = false
        this.uploadLoadingStatus = false
        this.cleanSetTime()
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.fileNum = fileList.length
      this.totalSize = NP.minus(this.totalSize, Number((file.size / (1024 * 1024)).toFixed(2)))
      if (this.totalSize < 0) this.totalSize = 0
      this.totalSize = Number(this.totalSize.toFixed(2))
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.fileNum = fileList.length
      this.totalSize = NP.plus(Number(this.totalSize), Number((file.size / (1024 * 1024)).toFixed(2)))
      this.totalSize = Number(this.totalSize.toFixed(2))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能选择 40 个文件，您已选择了 ${fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定要移除 ${file.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
    },
    setTime() {
      this.cleanSetTime()
      this.timer = setInterval(() => {
        this.getProgress();
      }, 1000)
    },
    cleanSetTime() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    noticeCleanRedis() {
      axios.post(process.env.BASE_URL + '/api/v1/clean/redis', {}, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {
        console.log('Redis 缓存清理成功')
      }).catch(error => {
        // 只打印日志，不抛出错误，不影响主流程
        console.warn('Redis 缓存清理失败（不影响上传）:', error)
      })
    },
    getProgress() {
      axios.post(process.env.BASE_URL + '/api/v1/upload/progress', {}, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.percentage = response.data.data
          if (this.percentage >= 100) {
            this.cleanSetTime()
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    // ✅ 修复：使用 this.token 而不是调用 useStore()
    getDetail() {
      this.loadPicture = true
      axios.post(process.env.BASE_URL + '/api/v1/life/moment', {id: this.id}, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data
          this.arr = data.map(item => ({
            'id': item.id,
            'src': item.imgUrl,
            'horizontal': item.horizontalVersion,
            'createTime': item.createTime
          }))
        } else {
          this.$message.error(response.data.message);
        }
        this.loadPicture = false
      }).catch(error => {
        console.log(error);
        this.loadPicture = false
      });
    },
    getTimeAgo(dateString) {
      if (!dateString) return '刚刚';
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
    handleChildValue(value) {
      this.loadPicture = false;
    },
    handleImageLoad() {
      // 图片加载完成后的处理
    },
    cancelUpload() {
      this.fileList = []
      this.dialogVisible = false
      this.totalSize = 0
      this.fileNum = 0
      this.percentage = 0
      this.percentageStatus = false
      this.uploadLoadingStatus = false
      this.cleanSetTime()
    },
    onDialogClose() {
      if (!this.uploadLoadingStatus) {
        this.fileList = []
        this.totalSize = 0
        this.fileNum = 0
        this.percentage = 0
        this.percentageStatus = false
        this.cleanSetTime()
      }
    },
    back() {
      router.replace({
        path: '/main',
        query: {
          date: this.date
        }
      })
    },
    add() {
      this.dialogVisible = true
    },
    showModal(index) {
      // 通过 ImageRow 组件处理
    }
  }
}
</script>

<style scoped>
.gallery-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

/* 头部区域 */
.header-section {
  height: 25%;
  min-height: 180px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(120deg, #1a1a2e 0%, #16213e 100%);
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.6;
  animation: float 8s ease-in-out infinite;
}

.element-1 { top: 20%; left: 10%; animation-delay: 0s; }
.element-2 { top: 60%; left: 80%; animation-delay: 2s; }
.element-3 { top: 40%; left: 20%; animation-delay: 4s; }

.header-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-sizing: border-box;
}

.nav-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
}

.back-btn, .add-btn {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.back-btn:hover, .add-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-section {
  text-align: center;
  flex: 1;
  min-width: 0;
  padding: 0 15px;
}

.main-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.sub-title {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gallery-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: auto;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.stat-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  white-space: nowrap;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
  white-space: nowrap;
}

/* 图片展示区域 */
.gallery-section {
  flex: 1;
  background: url("http://www.life-moment.top/images/static/bk13.jpg") center/cover no-repeat;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.gallery-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 0;
}

/* 空状态 */
.empty-gallery {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #7f8c8d;
  z-index: 1;
  width: 90%;
  max-width: 400px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.3rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.empty-desc {
  font-size: 0.9rem;
  margin-bottom: 25px;
  line-height: 1.4;
}

.empty-btn {
  border-radius: 20px;
  padding: 12px 28px;
  font-weight: 500;
}

/* 图片网格 */
.gallery-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  position: relative;
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  align-content: start;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: slideUp 0.6s ease both;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex: 1;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.portrait-image {
  transform: rotate(90deg);
  transform-origin: center;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
}

.overlay-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
  display: block;
}

.overlay-text {
  font-weight: 500;
  font-size: 0.9rem;
}

.image-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(5px);
}

.badge-icon {
  font-size: 0.8rem;
}

/* 添加照片入口 */
.add-item {
  aspect-ratio: 1;
  border: 2px dashed #ddd;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.add-item:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.add-content {
  text-align: center;
  color: #7f8c8d;
}

.add-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  display: block;
}

.add-text {
  font-weight: 500;
  font-size: 0.9rem;
}

/* 上传对话框 */
.upload-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.upload-dialog ::v-deep(.el-dialog__header) {
  padding: 0;
}

.upload-dialog ::v-deep(.el-dialog__body) {
  padding: 0;
}

.dialog-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 24px 24px 16px;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.dialog-icon {
  font-size: 1.4rem;
}

.dialog-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.upload-content {
  padding: 20px 24px;
}

/* 上传区域样式 */
.upload-area ::v-deep(.el-upload) {
  width: 100%;
}

.upload-area ::v-deep(.el-upload--picture-card) {
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.upload-area ::v-deep(.el-upload--picture-card):hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.upload-area.has-files ::v-deep(.el-upload--picture-card) {
  height: 120px;
}

.upload-placeholder {
  text-align: center;
  color: #7f8c8d;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  display: block;
  opacity: 0.7;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.upload-tips {
  font-size: 0.9rem;
  margin-bottom: 8px;
  opacity: 0.8;
}

.upload-limits {
  font-size: 0.8rem;
  opacity: 0.6;
}

/* 文件列表样式 */
.upload-area ::v-deep(.el-upload-list--picture-card) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 15px;
}

.upload-area ::v-deep(.el-upload-list__item) {
  width: 100%;
  height: 120px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.upload-area ::v-deep(.el-upload-list__item:hover) {
  transform: scale(1.05);
}

/* 文件统计 */
.file-stats {
  margin-top: 20px;
  padding: 15px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #7f8c8d;
}

/* 上传进度 */
.upload-progress {
  padding: 0 24px 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-title {
  font-weight: 600;
  color: #2c3e50;
}

.progress-tip {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.progress-container {
  background: rgba(102, 126, 234, 0.05);
  padding: 15px;
  border-radius: 12px;
}

.progress-bar {
  margin-bottom: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-percentage {
  font-weight: 600;
  color: #667eea;
}

.progress-status {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.progress-status.success {
  color: #67c23a;
  font-weight: 500;
}

/* 对话框底部 */
.dialog-footer {
  padding: 16px 24px 24px;
  text-align: center;
}

.cancel-btn {
  border-radius: 12px;
  padding: 10px 24px;
  border: 2px solid #e8e8e8;
  color: #7f8c8d;
  font-weight: 500;
}

.upload-btn {
  border-radius: 12px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 预览对话框 */
.preview-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.preview-content {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 15px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 15px;
  }

  .gallery-stats {
    gap: 15px;
  }

  .stat-item {
    padding: 8px 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .nav-actions {
    flex-direction: row;
    align-items: center;
  }

  .main-title {
    font-size: 1.2rem;
  }

  .title-section {
    padding: 0 10px;
  }
}

@media (max-width: 480px) {
  .header-section {
    height: 30%;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .nav-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .back-btn, .add-btn {
    width: 44px;
    height: 44px;
  }

  .main-title {
    font-size: 1.1rem;
  }

  .title-icon {
    font-size: 1.3rem;
  }

  .sub-title {
    font-size: 0.8rem;
  }

  .gallery-stats {
    flex-direction: row;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-item {
    padding: 6px 10px;
    gap: 8px;
  }

  .stat-icon {
    font-size: 1.3rem;
  }

  .stat-number {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}

/* 自定义滚动条 */
.gallery-grid::-webkit-scrollbar {
  width: 6px;
}

.gallery-grid::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.gallery-grid::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 3px;
}

.gallery-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}
</style>