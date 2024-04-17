<template>
  <div class="title">
    <div class="top">
      <div class="welcome">
        欢迎 {{ customer }} ^_^
      </div>
      <div class="artistic-conception">
        <p>&nbsp;&nbsp;{{ textToShow }}</p>
      </div>
    </div>
  </div>
  <div class="date-box" v-loading.fullscreen="loadDate" :element-loading-text="loading">
    <div class="add-btn">
      <el-button type="primary" @click="addFeeling" round>新增</el-button>
    </div>
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in timelineItems" :timestamp="item.date" placement="top">
          <el-card @click="open(item.title, item.text)">
            <p style="font-weight: bold; text-align: left; line-height: 12px;">{{ item.title }}</p>
            <div class="box-text">{{ item.text }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
  <div class="foot">
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="footprints">岁月</span></el-button>
    </div>
    <div class="box">
      <el-button type="primary" circle><span style="font-size: 12px;" @click="feeling">星闪</span></el-button>
    </div>
    <div class="box">
      <el-button circle><span style="font-size: 12px;" @click="baby">宝宝</span></el-button>
    </div>
  </div>

  <el-dialog v-loading="fellingLoading" title="记录星闪瞬间" width="90%" v-model="dialogVisible">
    <el-form :model="form">
      <el-form-item label="标题：">
        <el-input
            placeholder="请输入标题"
            v-model="form.title">
        </el-input>
      </el-form-item>
      <el-form-item label="内容：">
        <el-input
            type="textarea"
            :rows="12"
            placeholder="请输入内容"
            v-model="form.fellingText">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
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
      dateList: [],
      route: {},
      token: "",
      dialogVisible: false,
      fellingLoading: false,
      albumForm: {
        name: "",
        desc: "",
        date: ""
      },
      loadDate: false,
      loading: "数据加载中，请稍后！",
      dateInfo: [],
      timelineItems: [],
      textToShow: "",
      form: {
        title: '',
        fellingText: ''
      },
      editorOption: []
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    this.token = store.state.user.token
    this.route = useRouter()
    this.getConfig()
    this.getDateInfo()
    this.showTitle()
  },
  methods: {
    showTitle(){
      const fullText = "时光如流水，似静悄无声。岁月如涟漪，起伏波未行。浮生如沙粒，刹那即永恒。愿卿多留迹，夜半或黄昏。晨钟与暮鼓，明月伴星辰。流水虽无意，望卿加墨痕。待到耄耋纪，聚亲叙旧情。"
      let idx = 0;
      const intervalId = setInterval(() => {
        if (idx < fullText.length) {
          this.textToShow += fullText[idx];
          idx += 1;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // 调整这个参数可以控制文字出现的速度
    },
    getConfig() {
      this.loadAlbum = true
      let store = useStore()
      this.token = store.state.user.token
      axios.post(process.env.BASE_URL + '/api/v1/life/felling', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.timelineItems = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.message
          });
          this.route.replace({path: '/'});
        }
        this.loadAlbum = false
      }).catch(error => {
        console.log(error);
      });
    },
    getDateInfo() {
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/date/info', {}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.dateInfo = response.data.data
        }
      }).catch(error => {
        console.log(error);
      });
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
    baby() {
      this.route.replace({
        path: '/baby'
      })
    },
    open(title, value) {
      this.$alert(value, title, {
        showConfirmButton: false,
        customClass: 'custom-alert',
        center: true
      });
    },
    addFeeling() {
      this.dialogVisible = true
    },
    cancel() {
      this.form.fellingText = ''
      this.form.title = ""
      this.dialogVisible = false
    },
    submit() {
      if (this.form.title.length === 0) {
        this.$message({
          type: 'warning',
          message: "标题不能为空！"
        });
        return
      }
      if (this.form.fellingText.length === 0) {
        this.$message({
          type: 'warning',
          message: "内容不能为空！"
        });
        return
      }
      this.loadDate = true
      this.loading = "数据保存中，请稍后！"

      axios.post(process.env.BASE_URL + '/api/v1/felling/save', this.form, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.$message({
            type: 'success',
            message: "保存成功！"
          });
        }
        this.dialogVisible = false
        this.loadDate = false
        location.reload();
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error
        });
        this.dialogVisible = false
        this.loadDate = false
      });
    }
  }
}
</script>
<style scoped>

.title {
  width: 100%;
  height: 20%;
  vertical-align: middle;
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

.date-box {
  width: 100%;
  height: 68%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent url("http://www.life-moment.top/images/static/bk4.jpg") center;
  background-size: cover;
  text-align: center;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  width: 100%;
}
.artistic-conception{
  color: white;
  font-size: 12px;
  font-weight: bolder;
  padding-right: 10px;
  line-height: 20px;
  padding-left: 10px;
  padding-top: 10px;
}

.top {
  height: 100%;
}

.block {
  width: 90%;
  height: 100%;
  margin-top: 10px;
  padding-top: 10px;
}

.box-text {
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 超出部分显示省略号 */
  white-space: nowrap; /* 文本不换行 */
  text-align: left;
  line-height: 20px;
}

.add-btn {
  position: absolute;
  top: 20.5%;
  right: 0.5%;
  z-index: 10;
}

.dialog-footer {
  text-align: center;
}

::v-deep(.el-timeline) {
  padding-left: 0;
}

::v-deep(.is-top) {
  text-align: left;
  color: white;
  font-weight: bold;
}

.quill-editor .ql-editor {
  height: 200px; /* 根据需要调整编辑器的高度 */
}
</style>

<style>
.custom-alert {
  max-height: 81%;
  overflow-y: auto !important;
}
</style>

