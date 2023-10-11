<template>
  <div class="title">
    <div class="welcome">
      欢迎 {{ customer }} 来小屋 ^_^
      <el-button type="primary" @click="addAlbum" class="add-album">新增</el-button>
    </div>
    <div class="title-desc">X&nbsp;L&nbsp;X&nbsp;Y</div>
    <div class="text">山气日夕佳，飞鸟相与还。此中有真意，欲辨已忘言</div>
  </div>
  <div class="time-line" v-loading.fullscreen="loadAlbum" :element-loading-text="loading">
    <div v-for="(item, index) in images" :key="index" class="time-line-item">
      <div class="time-line-content">
        <div class="main-box">
          <div class="left">
            <div class="content">{{ item.date }}</div>
          </div>
          <div :class="item.theme" v-on:click="showPicture(item.id, item.title)">
            <p>{{ item.title }}</p>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="foot">
    <div class="box">
      <el-button type="primary" circle><span style="font-size: 12px;" @click="footprints">足迹</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;">心情</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;">财富</span></el-button>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="新增相册" width="80%">
    <div>
      <el-form>
        <el-form-item label="相册名称">
          <el-input v-model="albumForm.name"></el-input>
        </el-form-item>
        <el-form-item label="相册描述">
          <el-input v-model="albumForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="相册时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="albumForm.date" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="cancelSave">取消</el-button>
          <el-button type="primary" @click="saveAlbum">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import {useStore} from 'vuex';
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import router from "../../router";

export default {
  name: "Index",
  data() {
    return {
      customer: "",
      currentYear: "",
      images: [],
      route: {},
      token: "",
      dialogVisible: false,
      albumForm: {
        name: "",
        desc: "",
        date: ""
      },
      loadAlbum: false,
      loading: "相册数据加载中，请稍后！"
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    this.token = store.state.user.token
    this.route = useRouter()
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.loadAlbum = true
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/album/list', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.images = response.data.data
        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
        this.loadAlbum = false
      }).catch(error => {
        console.log(error);
      });
    },
    showPicture(id, title) {
      this.route.replace({
        path: '/picture',
        query: {
          id: id,
          title: title
        }
      })
    },
    cancelSave() {
      this.dialogVisible = false;
      this.albumForm.name = ""
      this.albumForm.desc = ""
      this.albumForm.date = ""
    },
    saveAlbum() {
      if (this.albumForm.name.length === 0) {
        alert("请填写相册名");
        return
      }
      if (this.albumForm.desc.length === 0) {
        alert("请填写相册描述");
        return
      }
      if (this.albumForm.date.length === 0){
        alert("请选择相册时间");
        return
      }
      this.loadAlbum = true
      this.loading = "相册数据保存中，请稍等..."
      axios.post(process.env.BASE_URL + '/api/v1/album/add', this.albumForm, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.$router.go(0)
          this.dialogVisible = false;
        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
        this.loadAlbum = false
      }).catch(error => {
        console.log(error);
      });
    },
    addAlbum() {
      this.dialogVisible = true
    },
    footprints() {
      router.replace({
        path: '/main'
      })
    }
  }
}
</script>
<style scoped>

.title {
  width: 100%;
  height: 20%;
  vertical-align: middle;
  border-radius: 5px;
  margin: 1px;
  background: transparent url("http://www.life-moment.top/images/static/flower.jpg");
  background-size: cover;
}

.foot {
  width: 100%;
  height: 12%;
  display: inline-flex;
}

.box {
  width: 33.3%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.time-line {
  width: 100%;
  height: 68%;
  overflow-y: auto;
}

.add-album {
  float: right;
  margin-right: 10px;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
}

.left {
  width: 40%;
  display: flex;
}

.content {
  width: 80%;
  display: flex;
  margin-top: 5px;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 可以根据需要设置div的高度 */
  margin-left: 1px;
  border-right: 2px dashed #b0b0b0;
  font-weight: bold;
  color: #adadad;
  font-size: 13px;
}

.right {
  width: 57%;
  border-radius: 5px;
  height: 80%;
  margin-top: 5px;
  padding-left: 10px;
  color: white;
  margin-right: 10px;
}

.theme-1 {
  background: linear-gradient(#cfd9df, #a18cd1);
}

.theme-2 {
  background: linear-gradient(#a18cd1, #fbc2eb);
}

.theme-3 {
  background: linear-gradient(#fbc2eb, #a6c1ee);
}

.theme-0 {
  background: linear-gradient(#a6c1ee, #cfd9df);
}

.title-desc {
  color: white;
  height: 56%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  font-size: 29px;
}

.main-box {
  display: flex;
  height: 100%;
}

.text {
  color: white;
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}

.time-line-item {
  height: 150px;
}

.time-line-content {
  height: 100%;
}
</style>

