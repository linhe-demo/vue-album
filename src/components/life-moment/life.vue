<template>
  <div style="z-index: 200;">
    <audio ref="audio" :src="audioSrc"></audio>
    <button @click="togglePlay" :class="{ 'isPlaying': isPlaying }" class="music-btn">
    </button>
  </div>
  <div>
    <el-carousel :interval="5000" class="custom-carousel" height="35rem" @change="changeImg"
                 indicator-position="outside">
      <el-carousel-item v-show="showCarousel" v-for="(item,index) in images" :key="index" @change="showText(index)">
        <el-image
            :class="className"
            style="width:100%; height:100%; object-fit: cover;"
            :src="item.imgUrl"
            @load="onloadImg()"></el-image>
      </el-carousel-item>
    </el-carousel>
    <div style="text-align: center;font-weight: bold;color: #409eff">{{ textInfo }}</div>
  </div>
<!--  <div style="color:#adadad;text-align: center;margin-top: 10px;font-size: 10px;">@Copyright 2021-{{ currentYear }} by-->
<!--    林鹤-->
<!--  </div>-->
  <div style="color:#adadad;text-align: center;margin-top: 3px;font-size: 8px;">
    <a href="https://beian.miit.gov.cn/" target="_blank"
       style="text-decoration: none;color:#adadad">豫ICP备2023017522号-1</a>
<!--    <a href="javascript:" target="_blank"-->
<!--       style="text-decoration: none;color:#adadad;margin-left: 5px;">沪公安网备2023017522</a>-->
  </div>
</template>
<script>
// import instance from "../js/request";
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
      axios.post(process.env.REQUEST_URL + '/api/v1/life/moment', {"num": 8})
          .then(response => {
            if (response.data.code !== 200) {
              this.$router.push({ path: '/' });
            } else {
              this.images = response.data.data
            }
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
  background-image: url("http://150.158.82.218/images/play.png");
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
