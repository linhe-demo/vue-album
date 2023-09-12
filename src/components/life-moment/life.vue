<template>
  <div style="z-index: 200;">
    <audio ref="audio" :src="audioSrc"></audio>
    <button @click="togglePlay" :class="{ 'isPlaying': isPlaying }" class="music-btn">
    </button>
  </div>
  <div style="height: 90%;">
    <el-carousel :interval="5000" class="custom-carousel" style="height: 94%" @change="changeImg"
                 indicator-position="outside">
      <el-carousel-item v-show="showCarousel" v-for="(item,index) in images" :key="index" @change="showText(index)">
        <el-image
            :class="className"
            style="width:100%; height:100%; object-fit: cover;"
            :src="item.imgUrl"
            @load="onloadImg()"></el-image>
      </el-carousel-item>
    </el-carousel>
    <div style="text-align: center;font-weight: bold;color: #409eff;margin-top: 10px;">{{ textInfo }}</div>
  </div>
  <div style="color:#adadad;text-align: center;margin-top: 10px;font-size: 10px;">@Copyright 2021-{{ currentYear }} by
    林鹤
  </div>
  <div style="color:#adadad;text-align: center;margin-top: 3px;font-size: 8px;">
    <a target="_blank" href="https://beian.miit.gov.cn/"
       style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
      <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">豫ICP备2023017522号-1</p>
    </a>
    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41152502000215"
       style="display:inline-block;text-decoration:none;height:20px;line-height:20px;margin-left: 10px;"><img
        src="http://www.life-moment.top/images/static/batb.png" style="float:left;"/>
      <p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">豫公网安备
        41152502000215号</p></a>
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
      audioSrc: process.env.MUSIC_URL + "/jcldxt.mp3",
      isPlaying: false,
      currentYear: ""
    }
  },
  mounted() {
    this.className = "lun-img-two";
    setTimeout(() => {
      this.className = "lun-img";
    }, 300);
    this.getConfig()
    // Set the currentYear data property
    this.currentYear = new Date().getFullYear()
  },
  methods: {
    changeImg: function (e) {
      this.className = "lun-img-two";
      setTimeout(() => {
        this.className = "lun-img";
      }, 300);
      this.showText(e)
    },
    showText(id) {
      this.textInfo = this.images[id].text
    },
    getConfig() {
      axios.post(process.env.BASE_URL + '/api/v1/life/moment', {"num": 8})
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
        audio.loop = true
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

.el-carousel__indicator.is-vertical {
  display: none;
}

#app {
  padding: 1rem !important;
}

.music-btn {
  position: fixed;
  z-index: 100;
  border-color: white;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: middle;
  background: transparent;
  background-image: url("http://www.life-moment.top/images/static/play.png");
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

::v-deep .el-carousel {
  height: 90%;
}
::v-deep .el-carousel .el-carousel__container {
  height: 100%;
}

.custom-carousel {
  border-radius: 10px;
}
</style>

