<template>
  <div class="title">
    <div class="top">
      <div class="welcome">{{ welcome }}</div>
      <div class="pregnant-info">{{ dueDate }}</div>
      <div class="pregnant-info">{{ pregnantWeeks }}</div>
      <div class="pregnant-detail" @click="openDetail(pregnantWeeksDetail)">{{ pregnantWeeksDetail }}</div>
      <div class="top-btn" v-if="btnStatus">
        <el-button type="default" @click="checkFood()" round>吃否</el-button>
      </div>
      <div v-if="percentage > 0" class="baby-percentage">
        <el-progress :percentage="percentage"></el-progress>
      </div>
    </div>
  </div>
  <div class="date-box" v-loading.fullscreen="loadDate" :element-loading-text="loading">
    <div class="news-ticker">
      <span ref="tickerText" @click="noticeDetail(text)" class="ticker-text">{{ text }}</span>
    </div>
    <div class="baby-info">
      <div class="baby-title"><span>宝宝信息</span></div>
      <div class="baby-box">
        <div class="baby-detail" v-for="(item, index) in baby_list" :key="index">
          <div class="baby-item">
            <div class="baby-item-left"><span class="baby-item-title">小名：</span><span
                class="baby-item-value">{{
                item.nickName
              }}</span>
            </div>
            <div class="baby-item-right"><span class="baby-item-title">学名：</span><span
                class="baby-item-value">{{ item.realName }}</span></div>
          </div>
          <div class="baby-item">
            <div class="baby-item-left"><span class="baby-item-title">性别：</span><span
                class="baby-item-value">{{
                item.sexy
              }}</span>
            </div>
            <div class="baby-item-right"><span class="baby-item-title">年龄：</span><span
                class="baby-item-value">{{ item.age }}</span></div>
          </div>
          <div class="baby-item">
            <div class="baby-item-left"><span class="baby-item-title">生日：</span><span
                class="baby-item-value">{{
                item.birthday
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="baby-life">
      <div class="baby-title">
        <div><span>宝宝成长记录</span></div>
        <div style="float: right">
          <el-button type="default" @click="addBabyLife()" round>新增</el-button>
        </div>
      </div>
      <div class="baby-life-detail">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in babyLife" :timestamp="item.date"  placement="top">
            <el-card @click="openBabyLife(item.id, item.title, item.text)">
              <p style="font-weight: bold; text-align: left; line-height: 12px; color: #9f9f9f">{{ item.title }}</p>
              <div style=" color: #9f9f9f;">{{ item.text }}</div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
  <div class="foot">
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="footprints">{{ btn1 }}</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="feeling">{{ btn2 }}</span></el-button>
    </div>
    <div class="box">
      <el-button type="primary" circle><span style="font-size: 12px;" @click="wealth">{{ btn3 }}</span>
      </el-button>
    </div>
  </div>

  <el-dialog title="(宝ᴗ宝) 成长记录" v-model="dialogFormVisible" width="90%">
    <div v-loading="uploadLoadingStatus" :element-loading-text="upload_loading">
      <el-form>
        <el-form-item label="标题：">
          <el-input v-model="babyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="babyForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="时间：">
          <el-date-picker type="date" placeholder="选择日期" v-model="babyForm.date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="瞬间：">
          <el-upload
              class="upload-demo"
              action="#"
              accept='image/jpeg,image/gif,image/png'
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :before-remove="beforeRemove"
              list-type="picture"
              multiple
              :limit="40"
              :on-exceed="handleExceed"
              :auto-upload="false"
              :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="cancelSave">取消</el-button>
          <el-button type="primary" @click="saveAlbum">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">


</script>

<script>

import {useStore} from 'vuex';
import axios from "axios";
import {useRoute, useRouter} from "vue-router";
import router from "../../router";
import {ref, onMounted, onUnmounted} from 'vue';
import NP from 'number-precision';

const text = ref('这里是需要滚动的文字内容');
const isScrolling = ref(false);
onMounted(() => {
  isScrolling.value = true;
});

onUnmounted(() => {
  isScrolling.value = false;
});

export default {
  name: "Index",
  data() {
    return {
      customer: "",
      currentYear: "",
      uploadLoadingStatus: false,
      upload_loading: "我知道你很急，但你现在先别急!",
      dateList: [],
      route: {},
      btn1: "岁月",
      btn2: "星闪",
      btn3: "未来",
      welcome: "",
      dueDate: "",
      btnStatus: false,
      pregnantWeeks: "",
      pregnantWeeksDetail: "",
      percentage: '',
      foodsInfo: "",
      week: "",
      token: "",
      dialogVisible: false,
      albumForm: {
        name: "",
        desc: "",
        date: ""
      },
      fileList: [],
      loadDate: false,
      loading: "数据加载中，请稍后！",
      dateInfo: [],
      text: '人间的美好，源于幸运，来到这的你定好运爆膨！',
      left: 0,
      timer: null,
      baby_list: [],
      babyLife: [],
      babyForm: {
        name: '',
        desc: '',
        date: ''
      },
      dialogFormVisible:false
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    this.token = store.state.user.token
    this.route = useRouter()
    this.getDateInfo()
    this.getBabyLifeInfo()
    this.adjustAnimationDuration();
    window.addEventListener('resize', this.adjustAnimationDuration);
    setTimeout(() => {
      this.$refs.tickerText.classList.add('animation-demo');
    }, 1000)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustAnimationDuration);
  },
  methods: {
    getDateInfo() {
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/feature/info', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.btn1 = response.data.data.btn1
          this.btn2 = response.data.data.btn2
          this.btn3 = response.data.data.btn3
          this.welcome = response.data.data.welcomeStr
          this.dueDate = response.data.data.dueDate
          this.pregnantWeeksDetail = response.data.data.pregnantWeeksDetail
          this.percentage = response.data.data.percentage
          this.pregnantWeeks = response.data.data.pregnantWeeks
          this.week = response.data.data.week
          this.text = response.data.data.noticeValue
          this.baby_list = response.data.data.babyInfo
          this.foodsInfo = response.data.data.foodsInfo
          this.btnStatus = response.data.data.btnStatus
        }
      }).catch(error => {
        console.log(error);
      })
    },
    getBabyLifeInfo() {
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/baby/life', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.babyLife = response.data.data
        }
      }).catch(error => {
        console.log(error);
      })
    },
    showTimeLine(date) {
      this.route.replace({
        path: '/main',
        query: {
          date: date
        }
      })
    },
    footprints() {
      this.route.replace({
        path: '/date'
      })
    },
    feeling() {
      this.route.replace({
        path: '/felling'
      })
    },
    wealth() {
      this.route.replace({
        path: '/wealth'
      })
    },
    openDetail(value) {
      this.$alert(value, "第" + this.week + "周孕周详情", {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true
      });
    },
    noticeDetail(value) {
      this.$alert(value, "第" + this.week + "周孕妇注意事项", {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true
      });
    },
    adjustAnimationDuration() {
      const tickerText = this.$refs.tickerText;
      const tickerContainer = tickerText.parentNode;
      const tickerTextWidth = tickerText.scrollWidth;
      const tickerContainerWidth = tickerContainer.offsetWidth;
      // 根据文本和容器的宽度动态计算动画持续时间
      // 假设基础速度是10秒完成一个容器的宽度
      tickerText.style.animationDuration = (tickerTextWidth / tickerContainerWidth) * 40 + 's';
    },
    addBabyLife() {
      this.dialogFormVisible = true
    },
    checkFood() {
      this.route.replace({
        path: '/food'
      })
    },
    cancelSave(){
      this.dialogFormVisible = false
      this.fileList = []
      this.babyForm.name = ''
      this.babyForm.date = ''
      this.babyForm.desc = ''
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChange(file, fileList){
      this.fileList = fileList;
      this.fileNum = fileList.length
      this.totalSize = NP.plus(Number(this.totalSize), Number((file.size / (1024 * 1024)).toFixed(2)))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 40 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },

    async saveAlbum() {
      if (this.babyForm.name.length === 0 || this.babyForm.name === "") {
        this.$message({
          type: 'warning',
          message: '标题不能为空!'
        });
        return
      }
      if (this.babyForm.desc.length === 0 || this.babyForm.desc === "") {
        this.$message({
          type: 'warning',
          message: '描述不能为空!'
        });
        return
      }
      if (this.babyForm.date.length === 0 || this.babyForm.date === "") {
        this.$message({
          type: 'warning',
          message: '时间不能为空!'
        });
        return
      }
      this.uploadLoadingStatus = true
      let fd = new FormData();
      this.fileList.forEach(item => {
        //文件信息中raw才是真的文件
        fd.append("files", item.raw);
      })
      fd.append("name", this.babyForm.name);
      fd.append("desc", this.babyForm.desc);
      fd.append("date", this.babyForm.date);
      await axios.post(process.env.BASE_URL + '/api/v1/baby/upload', fd, {
        headers: {'Content-Type': 'multipart/form-data', 'Authorization': this.token},
      }).then(response => {
        if (response.data.code === 200) {
          this.$message({
            type: 'success',
            message: "保存成功"
          });
          this.timer = setInterval(() => {
            this.$router.go(0)
          }, 1000)
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          });
          this.route.replace({path: '/'});
        }
        this.uploadLoadingStatus = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.message
        });
      }).finally(e => {
        this.uploadLoadingStatus = false
      })
    },
    openBabyLife(id, title, text){
      this.route.replace({
        path: '/babyLife',
        query: {
          id: id,
          title: title,
          text: text
        }
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
  background: transparent url("http://www.life-moment.top/images/static/baby1.jpg") center;
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

.date-box {
  width: 100%;
  height: 68%;
  overflow-y: auto;
  background: transparent url("http://www.life-moment.top/images/static/baby4.jpg") center;
  background-size: cover;
}

.baby-info {
  height: 23%;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.baby-life {
  height: 63%;
  padding-top: 30px;
  padding-left: 10px;
  padding-right: 10px;
}

.baby-title {
  color: #9f9f9f;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.baby-detail {
  height: 70%;
  border: 1px dashed white;
  border-radius: 5px;
}

.baby-item {
  display: inline-flex;
  font-size: 11px;
  width: 100%;
  padding-top: 6px
}

.baby-item-title {
  color: #9f9f9f;
}

.baby-item-value {
  color: #40c9c6;
}

.baby-item-left {
  padding-left: 10px;
  width: 48%;
}

.baby-item-right {
  width: 48%;
}

.baby-box {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
}

.pregnant-info {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  font-weight: bold;
  font-size: 11px;
}

.pregnant-detail {
  color: #dfdfdf;
  padding-left: 10px;
  padding-top: 15px;
  font-size: 11px;
  height: 25%;
  line-height: 1.5em; /* 设置行高，确保多行文本垂直居中 */
  overflow: hidden;
  text-overflow: ellipsis; /* 在内容溢出时显示省略号 */
  display: -webkit-box; /* 旧的WebKit浏览器 */
  -webkit-line-clamp: 3; /* 限制显示的行数 */
  -webkit-box-orient: vertical; /* 设置盒子为垂直方向 */
}

.title-desc {
  color: white;
  height: 80%;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  font-size: 29px;
}

.text {
  color: white;
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}

.top {
  height: 100%;
}

.top-btn {
  position: absolute;
  top: 4px;
  right: 2px;
}

.baby-percentage {
  position: absolute;
  top: 6.5%;
  right: 6%;
  width: 130px;
  color: white;
}

.news-ticker {
  width: 100%; /* 或你需要的任何宽度 */
  overflow: hidden;
  white-space: nowrap;
}

.ticker-text {
  will-change: transform;
  display: inline-block;
  padding-left: 100%;
  font-size: 11px;
  color: #6a6a6a;
  font-weight: bolder;
}

.baby-life-detail {
  overflow-y: auto;
  height: 86%;
}

::v-deep(.animation-demo) {
  -webkit-animation: scroll-ticker linear infinite;
}

@keyframes scroll-ticker {
  0% {
    -webkit-transform: translateX(0);
  }
  100% {
    -webkit-transform: translateX(-100%);
  }
}

::v-deep(.el-card) {
  background-color: #f2ecde;
}

::v-deep(.el-upload--picture) {
  display: block;
}

::v-deep(.el-upload-list--picture) {
  width: 84%;
  max-height: 200px;
  overflow-y: auto;
}

::v-deep(.is-ready) {
  width: 90%;
}

::v-deep(.el-timeline-item__wrapper) {
  width: 88%;
}

::v-deep(.el-progress__text) {
  font-size: 12px!important;
  color: white;
  font-weight: bolder;
}
</style>

