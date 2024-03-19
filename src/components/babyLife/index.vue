<template>
  <div class="top">
    <div class="welcome">
      <el-button type="default" @click="back" class="btn">返回</el-button>
      <div class="title-desc">{{title}}</div>
    </div>
  </div>
  <div class="detail" v-loading.fullscreen="loadPicture" :element-loading-text="loading">
    <div class="baby-text">{{text}}</div>
    <div class="baby-img" v-for="(item, index) in tableData.data">
      <div class="demo-image__preview">
        <el-image
            style="width: 100px; height: 100px"
            :src=item.url
            :preview-src-list=tableData.list>
        </el-image>
      </div>
    </div>
  </div>
</template>
<script>
import {useStore} from 'vuex';
import axios from "axios";
import router from "../../router";

export default {
  name: "Index",
  data() {
    return {
      loadPicture: false,
      loading: "我知道你很急，但你先别急",
      tableData: [],
      title: '',
      text: '',
      id: ''
    }
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
    let store = useStore()
    this.customer = store.state.user.nickname
    const route = this.$route.query
    this.id = route.id
    this.title = route.title
    this.text = route.text
    this.id = route.id
    this.getFoodsData()
  },
  methods: {
    getFoodsData() {
      this.loadPicture = true
      let store = useStore()
      this.token = store.state.user.token
      axios.post(process.env.BASE_URL + '/api/v1/baby/highlight', {id: this.id}, {
        headers: {
          'Authorization': store.state.user.token
        }
      }).then(response => {
        if (response.data.code === 200) {
          this.tableData = response.data.data
        } else {
          alert(response.data.message);
          this.route.replace({path: '/'});
        }
      })
          .catch(error => {
            console.log(error);
          }).finally(e => {
        this.loadPicture = false
      });
    },
    back() {
      router.replace({
        path: '/wealth',
        query: {
          date: this.date
        }
      })
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
  background-color: #fec978;
}

.detail {
  width: 100%;
  height: 92%;
  overflow-y: auto;
  background-color: #f2ecde;
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

.baby-text {
  font-size: 12px;
  color: #adadad;
  padding-top: 10px;
  padding-left: 10px;
  height: 8%;
}
.baby-img {
  padding:10px;
  margin: 10px;
  border-radius: 5px;
  height: 84%;
  overflow-y: auto;
}
</style>

