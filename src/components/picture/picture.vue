<template>
  <div class="top">
    <div class="welcome">
      <el-button type="primary" @click="back" class="btn">返回</el-button>
      <div class="title-desc">{{ title }}</div>
      <el-button type="success" @click="add" style="margin-right:20px;" class="btn">新增</el-button>
    </div>
  </div>
  <div class="detail" v-loading.fullscreen="loadPicture" :element-loading-text="loading">
    <div class="photoBox">
      <ImageRow
          :images="arr" @sendValue="handleChildValue"/>
    </div>
  </div>

  <el-dialog  v-model="dialogVisible" title="新增照片" width="80%">
    <div v-loading="uploadLoadingStatus" :element-loading-text="upload_loading">
      <el-form>
        <el-form-item>
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
            <div slot="tip" class="el-upload__tip">只能上传jpg/gif/png文件</div>
            <div slot="tip" class="el-upload__tip">当前已选文件数：{{ fileNum }} 个 文件大小：{{ totalSize }} M</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="cancelUpload">取消</el-button>
          <el-button type="primary" @click="handlePush">上传</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="percentageStatus">
      上传进度：<span style="font-size: 10px;color: #66b1ff;">(点击右上角X号可让上传过程变为后台进行)</span><el-progress :percentage="percentage" ></el-progress>
    </div>
  </el-dialog>
  <el-dialog title="图片预览" :visible.sync="diaPreviewVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
</template>
<script>
import {useStore} from 'vuex';
import axios from "axios";
import router from "../../router";
import ImageRow from "/src/components/picture/imageRow.vue";
import NP from 'number-precision';

export default {
  name: "Index",
  components: {
    ImageRow,
  },
  data() {
    return {
      id: 0,
      customer: "",
      title: '',
      websocket: '',
      percentageStatus: false,
      percentage: 0,
      imgList: [],
      loading: "数据加载中请稍后!",
      upload_loading: "文件上传中请稍后",
      dialogVisible: false,
      loadPicture: false,
      uploadLoadingStatus: false,
      arr: [],
      lineNum: 3,
      spacingNumber: 5, //行间距单位px
      token: '',
      fileList: [],
      diaPreviewVisible: false,
      //图片预览地址
      dialogImageUrl: "",
      date: '',
      timer: '',
      fileNum: 0,
      totalSize: 0
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    const route = this.$route.query
    this.id = route.id
    this.title = route.title
    this.date = route.date
    this.getDetail()
  },
  methods: {
    async handlePush() {
      this.percentageStatus = true
      this.uploadLoadingStatus = true
      this.setTime()
      let fd = new FormData();
      this.fileList.forEach(item => {
        //文件信息中raw才是真的文件
        fd.append("files", item.raw);
      })
      fd.append("id", this.id);
      await axios.post(process.env.BASE_URL + '/api/v1/image/upload', fd, {
        headers: {'Content-Type': 'multipart/form-data', 'Authorization': this.token},
      }).then(response => {
        if (response.data.code === 200) {
          this.percentageStatus = false
          this.uploadLoadingStatus = false
          this.cleanSetTime()
          this.noticeCleanRedis()
          this.$router.go(0)
        } else {
          alert(response.data.message);
          this.percentageStatus = false
          this.uploadLoadingStatus = false
          this.cleanSetTime()
          this.route.replace({path: '/'});
        }
      }).catch(error => {
        console.log(error);
      })
    },
    handleProgress(evt, file, fileList) {
      console.log(evt, file, fileList)
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
      console.log(Number(this.totalSize), Number((file.size / (1024 * 1024)).toFixed(2)), (file.size / (1024 * 1024)).toFixed(2))
      this.totalSize = NP.plus(Number(this.totalSize), Number((file.size / (1024 * 1024)).toFixed(2)))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 40 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    setTime() {
      //每隔一秒钟运行一次
      this.timer = setInterval(() => {
        this.getProgress();
      }, 1000)
    },
    cleanSetTime() {
      clearInterval(this.timer)
    },
    noticeCleanRedis() {
      axios.post(process.env.BASE_URL + '/api/v1/clean/redis', {}, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {

      }).catch(error => {
        console.log(error);
      });
    },
    getProgress() {
      axios.post(process.env.BASE_URL + '/api/v1/upload/progress', {}, {
        headers: {
          'Authorization': this.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.percentage = response.data.data
          if (this.percentage === 100) {
            this.cleanSetTime()
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getDetail() {
      this.loadPicture = true
      let store = useStore()
      this.token = store.state.user.token
      axios.post(process.env.BASE_URL + '/api/v1/life/moment', {id: this.id}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          const data = response.data.data
          if (data.length === 0) {
            this.loadPicture = false
            return
          }
          for (let i = 0; i < data.length; i++) {
            this.arr.push({'src': data[i].imgUrl, 'horizontal': data[i].horizontalVersion})
          }
        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
      })
          .catch(error => {
            console.log(error);
          });
    },
    handleChildValue(value) {
      this.loadPicture = false;
    },
    cancelUpload() {
      this.fileList = []
      this.dialogVisible = false
      this.totalSize = 0
      this.fileNum = 0
    },
    back() {
      router.replace({
        path: '/main',
        query: {
          date: this.date
        }
      })
    },
    add() {
      this.dialogVisible = true
      console.log(this.dialogVisible)
    }
  }
}
</script>
<style scoped>

.top {
  width: 100%;
  height: 8%;
  vertical-align: middle;
  border-radius: 5px;
  margin: 1px;
  background-color: #181818;
}

.detail {
  width: 100%;
  height: 92%;
  overflow-y: auto;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  display: inline-flex;
  width: 100%;
}

.title-desc {
  color: white;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-weight: bold;
  font-size: 16px;
  width: 100%;
  text-align: center;
}

::v-deep(.el-upload--picture-card) {
  width: 60px;
  height: 60px;
  line-height: 60px;
}

::v-deep(.el-upload-list__item) {
  width: 60px;
  height: 60px;
  line-height: 60px;
}

::v-deep(.is-success) {
  width: 100%;
}
::v-deep(.el-progress--line) {
  width: 100%;
  margin-left: 20px;
}
::v-deep(.el-upload-list__item) {
  width: 100%;
}
::v-deep(.el-upload--picture) {
  display: block;
}
::v-deep(.el-upload-list) {
  max-height: 200px;
  overflow-y: auto;
}
.upload-demo{
  width: 100%;
}
</style>

