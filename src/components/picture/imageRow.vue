<template>
  <div class="image-grid">
    <div class="grid-item" v-for="(image, index) in images" :key="index" @click="showModal(index)">
      <img v-lazy="image.src" :class="{ 'portrait-image': shouldAddClass(image) }" alt="Image"
           style="width: 100%;height: 100%;object-fit: cover;"/>
    </div>
    <div v-if="$data.isModalOpen" class="modal">
      <div @click="closeModal" class="close-img">X</div>
      <div @click="moveModal" class="move-img">删除</div>
      <div class="modal-content">
        <div class="big-img">
          <el-carousel :autoplay="false" @change="handleChange" style="height: 100%;" arrow="hover">
            <el-carousel-item v-for="(image, index) in bigImages" :key="index">
              <div class="big-img-box">
                <img :src="image.src" :class="{ 'portrait-image': shouldAddClass(image) }" alt="Image"
                     style="width: 100%;height: 100%;object-fit: cover;"/>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import axios from "axios";

export default {
  props: {
    data() {
      return {
        total: 0,
        complete: 0
      }
    },
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
      currentId: 0,
    }
  },
  mounted() {
    this.complete = 0
  },
  methods: {
    showModal(index) {
      this.isModalOpen = true;
      const imgList = []
      for (let i = 0; i < this.images.length; i++) {
        if (index !== i) {
          imgList.push(this.images[i])
        }
      }
      imgList.unshift(this.images[index])
      this.bigImages = imgList
      this.currentId = this.images[index].id
    },
    handleChange(now, prev) {
      this.currentId = this.images[now].id
    },
    shouldAddClass(item) {
      return item.horizontal === 1;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    moveModal() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(process.env.BASE_URL + '/api/v1/remove/image', {id:this.currentId}, {
          headers: {
            'Authorization': this.token
          }
        }).then(response => {
          if (response.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 10px;
}

.grid-item {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 5px;
  overflow: hidden;
}

.portrait-image {
  transform: rotate(90deg); /* 旋转图片90度 */
}

.carousel img {
  width: 100%;
  height: auto;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.close-img {
  background-color: #878282;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
  color: white;
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.move-img {
  background-color: #878282;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
  color: white;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 10;
  opacity: 0;
}

.modal-content {
  background-color: #101010;
  padding: 10px;
  border-radius: 10px;
  width: 90%;
  height: 90%;
}

.big-img {
  width: 100%;
  height: 100%;
  opacity: 1;
}

.big-img-box {
  border-radius: 5px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
}

.carousel-slider img {
  width: 100%;
  height: auto;
}

::v-deep(.el-carousel .el-carousel__container) {
  height: 100%;
  border-radius: 5px;
}

::v-deep(.el-carousel__indicators--horizontal) {
  display: none;
}
</style>
