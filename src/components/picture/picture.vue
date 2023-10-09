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

  <el-dialog v-model="dialogVisible" title="新增照片" width="80%">
    <div>
      <el-form>
        <el-form-item>
          <el-upload
              ref="upload"
              accept='image/jpeg,image/gif,image/png'
              action="#"
              multiple
              list-type="picture-card"
              :on-change="handleChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :auto-upload="false"
              :file-list="fileList"
              :limit="20"
          >+
          </el-upload>
          <el-dialog title="图片预览" :visible.sync="diaPreviewVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item>

        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="cancelUpload">取消</el-button>
          <el-button type="primary" @click="handlePush">上传</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>

</template>
<script>
import {useStore} from 'vuex';
import axios from "axios";
import router from "../../router";
import ImageRow from "/src/components/picture/imageRow.vue";

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
      imgList: [],
      loading: "数据加载中请稍后!",
      dialogVisible: false,
      loadPicture: false,
      arr: [],
      lineNum: 3,
      spacingNumber: 5, //行间距单位px
      token: '',
      fileList: [],
      diaPreviewVisible: false,
      //图片预览地址
      dialogImageUrl: "",
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    const route = this.$route.query
    this.id = route.id
    this.title = route.title
    this.getDetail()
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    async handlePush() {
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
          this.$router.go(0)
        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
      }).catch(error => {
        console.log(error);
      })
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.diaPreviewVisible = true
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      this.$message({
        type: 'info',
        message: '已删除原有图片',
        duration: 1000
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
            this.arr.push(data[i].imgUrl)
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
    },
    back() {
      router.push({
        name: 'main'
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
</style>

