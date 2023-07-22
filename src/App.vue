<template>
  <div style="z-index: 200;">
    <audio ref="audio" :src="audioSrc"></audio>
    <button @click="togglePlay" :class="{ 'isPlaying': isPlaying }" class="music-btn">
    </button>
  </div>
  <div>
    <el-carousel :interval="5000" class="custom-carousel" height="35rem" @change="changeImg" indicator-position="outside">
      <el-carousel-item v-show="showCarousel" v-for="(item,index) in images" :key="index" @change="showText(index)">
        <el-image
            :class="className"
            style="width:100%; height:100%; object-fit: cover;"
            :src="item.imgUrl"
            @load="onloadImg()"></el-image>
      </el-carousel-item>
    </el-carousel>
    <div style="text-align: center">{{textInfo}}</div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Index",
  data() {
    return {
      onloadNum: 10,
      images: [],
      className: "",
      textInfo: "网络不好，请耐心等待哦！",
      showCarousel: false,
      audioSrc: "music/jcldxt.mp3",
      isPlaying: false,

    }
  },
  mounted() {
    this.className = "lun-img-two";
    setTimeout(() => {
      this.className = "lun-img";
    }, 300);
    this.getConfig()
  },
  methods: {
    changeImg: function (e) {
      this.className = "lun-img-two";
      setTimeout(() => {
        this.className = "lun-img";
      }, 300);
      this.showText(e)
    },
    showText(id){
      this.textInfo = this.images[id].text
    },
    getConfig() {
      axios.post('http://150.158.82.218:8806/api/v1/life/moment', {"num": 10})
          .then(response => {
            this.images = response.data.data
          })
          .catch(error => {
            console.log(error);
          });
    },
    onloadImg() {
      this.onloadNum -= 1
      if (this.onloadNum === 0) {
        this.showCarousel = true
      }
    },
    togglePlay() {
      const audio = this.$refs.audio;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      this.isPlaying = !this.isPlaying;
    }
  }
}
</script>
<style scoped>
.lun-img {
  transition: all 4s;
  transform: scale(1.5);
}
.lun-img-two {
  transform: scale(1);
}
.el-carousel__item.is-animating {
  transition: transform 1s ease-in-out;
}
#app{
  padding: 1rem!important;
}
.music-btn {
  position: fixed;
  border-color: white;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: middle;
  background-image: url("../public/img/music-icon.jpg");
  background-size: cover;
}

.isPlaying {
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.custom-carousel {
  border-radius: 10px;
}
</style>
