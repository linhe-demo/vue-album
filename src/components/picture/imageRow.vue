<template>
  <div class="image-grid">
    <div class="grid-item" v-for="(image, index) in images" :key="index">
      <img :src="image" @load="loadComplete" alt="Image" style="width: 100%;height: 150px;"/>
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
  mounted() {
    this.total = this.images.length
    this.complete = 0
  },
  methods: {
    loadComplete() {
      this.complete += 1
      console.log(this.complete, this.total)
      if (this.complete === this.total) {
        this.$emit('sendValue', 'ok')
      }
    }
  }
};
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
</style>
