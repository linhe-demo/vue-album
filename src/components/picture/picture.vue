<template>
  <div class="top">
    <div class="welcome">
      <el-button type="primary" @click="back" class="btn">返回</el-button>
      <div class="title-desc">{{ title }}</div>
      <el-button type="success" @click="add" style="margin-right:20px;" class="btn">新增</el-button>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增照片" width="80%">
    <div style="width: 100%;height: 100%">
      <input id="upload_file" type="file" style="display: none;" accept='image/*' name="file"
             @change="fileChange($event)"/>
      <div class="image-item space" @click="showActionSheet()">
        <div class="image-up"></div>
      </div>

      <div class="upload_warp">
        <div class="upload_warp_img">
          <div class="upload_warp_img_div" v-for="(item,index) in imgList">
            <div class="upload_warp_img_div_top">
              <span @click="fileDel(index)">—</span>
            </div>
            <img :src="item.file.src" style="display: inline-block;width: 80px;height: 60px;">
          </div>
          <div class="upload_warp_left" id="upload_warp_left" @click="fileClick()" v-if="this.imgList.length < 6">
            <i class="el-icon-plus"></i> +
          </div>
        </div>

      </div>

      <div class="upload_warp_text">
        <span>选中{{ imgList.length }}张文件，共{{ bytesToSize(this.size) }}</span>
      </div>
    </div>
    <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
                </span>
    </template>
  </el-dialog>
</template>
<script>
import {useStore} from 'vuex';
import axios from "axios";
import router from "../../router";
import $ from 'jquery'

export default {
  name: "Index",
  data() {
    return {
      id: 0,
      customer: "",
      title: '',
      picturesList: [],
      imgList: [],
      datas: new FormData(),
      files: 0,
      size: 0,
      dialogVisible: false
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname

    const route = this.$route.query
    this.id = route.id
    this.title = route.title
  },
  methods: {
    getConfig() {
      let store = useStore()
      axios.post(process.env.BASE_URL + '/api/v1/picture/list', {id: this.id}, {
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
      })
          .catch(error => {
            console.log(error);
          });
    },
    back() {
      router.push({
        name: 'main'
      })
    },
    add() {
      this.dialogVisible = true
      console.log(this.dialogVisible)
    },
    fileClick() {
      $('#upload_file').click();
    },
    //调用手机摄像头并拍照
    getImage() {
      let cmr = plus.camera.getCamera();
      cmr.captureImage(function (p) {
        plus.io.resolveLocalFileSystemURL(p, function (entry) {
          compressImage(entry.toLocalURL(), entry.name);
        }, function (e) {
          plus.nativeUI.toast("读取拍照文件错误：" + e.message);
        });
      }, function (e) {
      }, {
        filter: 'image'
      });
    },
    //从相册选择照片
    galleryImgs() {
      plus.gallery.pick(function (e) {
        let name = e.substr(e.lastIndexOf('/') + 1);
        compressImage(e, name);
      }, function (e) {
      }, {
        filter: "image"
      });
    },
    //点击事件，弹出选择摄像头和相册的选项
    showActionSheet() {
      let bts = [{
        title: "拍照"
      }, {
        title: "从相册选择"
      }];
      plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: bts
          },
          function (e) {
            if (e.index === 1) {
              this.getImage();
            } else if (e.index === 2) {
              this.galleryImgs();
            }
          }
      );
    },
    fileChange(el) {
      this.files = $("#upload_file").get(0).files;
      console.log(this.files.length);
      for (let i = 0; i < this.files.length; i++) {
        this.datas.append("file", this.files[i]);
      }
      this.show1 = false;
      console.log(typeof this.files);
      console.log(this.files);
      if (!el.target.files[0].size) return;
      this.fileList(el.target);
      el.target.value = ''
    },
    fileList(fileList) {
      let files = fileList.files;
      for (let i = 0; i < files.length; i++) {
        //判断是否为文件夹
        if (files[i].type !== '') {
          this.fileAdd(files[i]);
        } else {
          //文件夹处理
          this.folders(fileList.items[i]);
        }
      }
    },
    //文件夹处理
    folders(files) {
      let _this = this;
      //判断是否为原生file
      if (files.kind) {
        files = files.webkitGetAsEntry();
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i]);
          } else {
            _this.folders(file[i]);
          }
        }
      })
    },
    fileAdd(file) {
      //总大小
      this.size = this.size + file.size;
      //判断是否为图片文件
      if (file.type.indexOf('image') === -1) {
        file.src = 'wenjian.png';
        this.imgList.push({
          file
        });
      } else {
        let reader = new FileReader();
        reader.vue = this;
        reader.readAsDataURL(file);
        reader.onload = function () {
          file.src = this.result;
          this.vue.imgList.push({
            file
          });
        }
      }
    },
    fileDel(index) {
      this.size = this.size - this.imgList[index].file.size;//总大小
      this.imgList.splice(index, 1);
    },
    bytesToSize(bytes) {
      if (bytes === 0) {
        return '0 B';
      }
      let k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    dragenter(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    dragover(el) {
      el.stopPropagation();
      el.preventDefault();
    },
    drop(el) {
      el.stopPropagation();
      el.preventDefault();
      this.fileList(el.dataTransfer);
    },
    shows(et, tx) {
      this.strut = et;
      this.txt = tx;
    },
    handleClick() {
      this.$store.commit('add')
    },

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

.time-line {
  width: 100%;
  height: 80%;
}
.upload_warp{
  width: 100%;
  height: 100%;
}

.welcome {
  color: white;
  padding-left: 10px;
  padding-top: 10px;
  display: inline-flex;
  width: 100%;
}

.right {
  width: 57%;
  background: linear-gradient(#a8d0d4, white);
  border-radius: 5px;
  height: 80%;
  margin-top: 5px;
  padding-left: 10px;
  color: white;
  margin-right: 1px;

}

.upload_warp{
  width: 100%;
  height: 10%;
}

.upload_warp_left {
  width: 50px;
  height: 50px;
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
.upload_warp_img_div {
  width: 100px;
  height: 70px;
}
</style>

