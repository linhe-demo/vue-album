<template>
  <div class="top">
    <div class="welcome">
      <el-button type="primary" @click="back" class="btn">返回</el-button>
      <div class="title-desc">{{ title }}</div>
      <el-button type="success" @click="add" style="margin-right:20px;" class="btn">新增</el-button>
    </div>
  </div>
  <div>

  </div>
  <div class="time-line">

  </div>
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
      id: 0,
      customer: "",
      title: '',
      picturesList: []
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
      alert("新增照片")
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

.time-line {
  width: 100%;
  height: 80%;
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
</style>

