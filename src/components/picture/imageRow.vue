<template>
  <div class="image-grid">
    <div class="grid-item" v-for="(image, index) in images" :key="index" @click="showModal(index)">
      <img :src="image" @load="loadComplete" alt="Image" style="width: 100%;height: 150px;" />
    </div>

    <div v-if="$data.isModalOpen" class="modal">
      <div class="modal-content">
        <el-button @click="closeModal" type="info" circle>X</el-button>
        <div class="big-img">
          <el-carousel :autoplay="false" style="height: 100%;" arrow="hover">
            <el-carousel-item v-for="(image, index) in bigImages" :key="index">
              <img :src="image"  alt="Image" style="width: 100%;height: auto;" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

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
  },
  data() {
    return {
      isModalOpen: false,
      bigImages: []
    }
  },
  mounted() {
    this.complete = 0
  },
  methods: {
    loadComplete() {
      this.total = this.images.length
      this.complete += 1
      if (this.complete === this.total) {
        this.$emit('sendValue', 'ok')
      }
    },
    showModal(index) {
      this.isModalOpen = true;
      const imgList = []
      for (let i = 0; i < this.images.length; i++) {
        if (index !== i) {
          imgList.push(this.images[i])
        }
      }
      console.log(imgList, this.images[index])
      imgList.unshift(this.images[index])
      this.bigImages = imgList
    },
    closeModal() {
      this.isModalOpen = false;
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

.modal-content {
  background-color: #101010;
  padding: 20px;
  border-radius: 10px;
  width: 84%;
  height: 76%;
}
.big-img {
  width: 100%;
  height: 100%;
  opacity: 1;
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
