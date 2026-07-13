<template>
  <div class="image-gallery">
    <!-- 照片墙网格布局 -->
    <div class="photo-wall" v-if="!isModalOpen">
      <div
          v-for="(image, index) in images"
          :key="image.id"
          class="photo-item"
          :class="getPhotoClass(image)"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="showModal(index)"
      >
        <div class="photo-frame">
          <img
              :src="image.src"
              :class="{ 'portrait-photo': image.horizontal === 1 }"
              alt="照片"
              class="photo-image"
              @load="handleThumbnailLoad"
          />
          <div class="photo-overlay">
            <div class="overlay-content">
              <i class="overlay-icon">👁️</i>
              <span class="overlay-text">查看大图</span>
            </div>
          </div>
          <div class="photo-badge" v-if="image.horizontal === 1">
            <i class="badge-icon">🔄</i>
            <span>横版</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 大图预览模态框 -->
    <div v-if="isModalOpen" class="image-modal">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <div class="modal-title">
          图片预览 ({{ currentIndex + 1 }} / {{ bigImages.length }})
        </div>
        <div class="modal-actions">
          <el-button class="action-btn delete-btn" @click="moveModal" circle>
            <i class="btn-icon">🗑️</i>
          </el-button>
          <el-button class="action-btn close-btn" @click="closeModal" circle>
            <i class="btn-icon">✕</i>
          </el-button>
        </div>
      </div>

      <!-- 轮播图内容 -->
      <div class="modal-content">
        <el-carousel
            :autoplay="false"
            @change="handleChange"
            ref="carousel"
            :initial-index="currentIndex"
            arrow="always"
            class="image-carousel"
            indicator-position="outside"
        >
          <el-carousel-item v-for="(image, index) in bigImages" :key="index">
            <div class="carousel-item">
              <img
                  :src="image.src"
                  :class="{ 'portrait-image': shouldAddClass(image) }"
                  alt="预览图片"
                  class="preview-image"
                  @load="handleImageLoad"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 底部信息 -->
      <div class="modal-footer">
        <div class="image-info">
          <span class="info-item">
            <i class="info-icon">🖼️</i>
            图片 {{ currentIndex + 1 }} / {{ bigImages.length }}
          </span>
          <span class="info-item" v-if="shouldAddClass(currentImage)">
            <i class="info-icon">🔄</i>
            横版照片
          </span>
        </div>
        <div class="navigation-hint">
          <i class="hint-icon">↔️</i>
          左右滑动浏览图片
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ImageGallery",
  props: {
    images: {
      type: Array,
      required: true,
      default: () => [],
    },
    token: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  data() {
    return {
      isModalOpen: false,
      bigImages: [],
      currentIndex: 0,
      imageLoaded: false
    }
  },
  computed: {
    currentImage() {
      return this.bigImages[this.currentIndex] || {};
    }
  },
  methods: {
    showModal(index) {
      this.isModalOpen = true;
      this.currentIndex = index;
      this.bigImages = [...this.images];
      this.imageLoaded = false;
    },
    handleChange(nowIndex) {
      this.currentIndex = nowIndex;
      this.imageLoaded = false;
    },
    handleImageLoad() {
      this.imageLoaded = true;
    },
    handleThumbnailLoad() {
      // 缩略图加载完成
    },
    shouldAddClass(item) {
      return item && item.horizontal === 1;
    },
    closeModal() {
      this.isModalOpen = false;
      this.bigImages = [];
      this.currentIndex = 0;
      this.imageLoaded = false;
    },
    getPhotoClass(image) {
      // 根据图片方向返回不同的类名
      return image.horizontal === 1 ? 'photo-horizontal' : 'photo-vertical';
    },
    moveModal() {
      // 创建自定义的确认对话框，避免被模态框遮挡
      this.$confirm('确定要删除这张照片吗？', '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-modal',
        zIndex: 10000 // 设置更高的 z-index
      }).then(() => {
        axios.post(process.env.BASE_URL + '/api/v1/remove/image', {id: this.currentImage.id}, {
          headers: {
            'Authorization': this.token
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$message.success('照片删除成功！');
            // 从数组中移除已删除的图片
            const deletedIndex = this.images.findIndex(img => img.id === this.currentImage.id);
            if (deletedIndex !== -1) {
              this.images.splice(deletedIndex, 1);
            }

            this.bigImages.splice(this.currentIndex, 1);

            if (this.bigImages.length === 0) {
              this.closeModal();
            } else {
              // 调整当前索引
              if (this.currentIndex >= this.bigImages.length) {
                this.currentIndex = this.bigImages.length - 1;
              }
              // 更新轮播图
              if (this.$refs.carousel) {
                this.$refs.carousel.setActiveItem(this.currentIndex);
              }
            }

            // 通知父组件更新
            this.$emit('sendValue', true);
          } else {
            this.$message.error(response.data.message || '删除失败');
          }
        }).catch(error => {
          console.log(error);
          this.$message.error('删除过程中出现错误');
        });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
}
</script>

<style scoped>
.image-gallery {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

/* 照片墙网格布局 - 优化后的比例 */
.photo-wall {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px !important;
  padding: 12px !important;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  align-content: start;
  box-sizing: border-box;
}

.photo-item {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: photoAppear 0.6s ease both;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  position: relative;
  aspect-ratio: 4/3; /* 添加宽高比，让图片更协调 */
  min-height: 180px; /* 设置最小高度 */
  margin-bottom: 20px;
}

.photo-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.photo-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.photo-item:hover .photo-image {
  transform: scale(1.08);
}

.portrait-photo {
  transform: rotate(90deg);
  transform-origin: center;
}

.photo-overlay {
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

.photo-item:hover .photo-overlay {
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
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.photo-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(5px);
  font-weight: 500;
}

.badge-icon {
  font-size: 0.75rem;
}

/* 模态框样式 */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes photoAppear {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 模态框头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  z-index: 10;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 42px;
  height: 42px;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.3);
  border-color: rgba(231, 76, 60, 0.5);
}

.close-btn:hover {
  background: rgba(149, 165, 166, 0.3);
  border-color: rgba(149, 165, 166, 0.5);
}

.btn-icon {
  font-size: 1.1rem;
  color: white;
}

/* 模态框内容 */
.modal-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  min-height: 0;
  position: relative;
}

.image-carousel {
  width: 100%;
  height: 100%;
  max-width: 1200px;
  position: relative;
}

.image-carousel ::v-deep(.el-carousel__container) {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.image-carousel ::v-deep(.el-carousel__arrow) {
  width: 55px;
  height: 55px;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
}

.image-carousel ::v-deep(.el-carousel__arrow):hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.15);
}

.image-carousel ::v-deep(.el-carousel__indicators) {
  bottom: 20px;
}

.image-carousel ::v-deep(.el-carousel__indicator) {
  padding: 8px;
}

.image-carousel ::v-deep(.el-carousel__button) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.image-carousel ::v-deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background: #667eea;
  width: 20px;
  border-radius: 10px;
}

.carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 8px;
}

.portrait-image {
  transform: rotate(90deg);
  transform-origin: center;
}

/* 模态框底部 */
.modal-footer {
  padding: 18px 24px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.image-info {
  display: flex;
  gap: 20px;
  color: rgba(255, 255, 255, 0.9);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-icon {
  font-size: 1rem;
}

.navigation-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.hint-icon {
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .photo-wall {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .photo-item {
    min-height: 150px;
  }

  .modal-header {
    padding: 14px 18px;
  }

  .modal-content {
    padding: 18px;
  }

  .image-carousel ::v-deep(.el-carousel__arrow) {
    width: 45px;
    height: 45px;
  }

  .modal-footer {
    padding: 14px 18px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }

  .image-info {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .photo-wall {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 12px;
  }

  .photo-item {
    min-height: 160px;
    aspect-ratio: 1/1; /* 在小屏幕上使用正方形 */
  }

  .modal-title {
    font-size: 1rem;
  }

  .action-btn {
    width: 38px;
    height: 38px;
  }

  .image-info {
    flex-direction: column;
    gap: 8px;
  }

  .overlay-icon {
    font-size: 1.5rem;
  }

  .overlay-text {
    font-size: 0.8rem;
  }
}

/* 自定义滚动条 */
.photo-wall::-webkit-scrollbar {
  width: 6px;
}

.photo-wall::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.photo-wall::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.6);
  border-radius: 3px;
}

.photo-wall::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.8);
}
</style>

<style>
/* 删除确认对话框样式 - 修复 z-index 问题 */
.delete-confirm-modal {
  z-index: 10000 !important;
}

.delete-confirm-modal .el-message-box {
  z-index: 10001 !important;
  position: relative;
}

/* 确保遮罩层在模态框之上 */
.el-message-box__wrapper {
  z-index: 10000 !important;
}

.delete-confirm-modal .el-message-box__header {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 16px;
}

.delete-confirm-modal .el-message-box__title {
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.delete-confirm-modal .el-message-box__content {
  padding: 20px;
  font-size: 0.9rem;
}

.delete-confirm-modal .el-message-box__btns {
  padding: 12px 20px 20px;
  text-align: center;
}

.delete-confirm-modal .el-button {
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 0.9rem;
}

.delete-confirm-modal .el-button--primary {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border: none;
}
.is-message-box {
  z-index: 10001 !important;
}
</style>