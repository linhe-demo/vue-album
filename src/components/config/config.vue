<template>
  <el-row>
    <div >
      <el-form :inline="true" :model="queryForm" ref="queryFormSum" v-loading="loading"
               element-loading-text="查询中，请稍候...">
        <el-row>
          <el-form-item label="状态：">
            <el-select v-model="queryForm.status" name="status" filterable collapse-tags clearable
                       placeholder="默认全部状态">
              <el-option label="禁用" value="1"/>
              <el-option label="开启" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </el-row>

  <el-row>
    <el-table
        :data="tableData" border
        height="900"
        style="width: 100%">
      <el-table-column prop="id" label="序号" width="100" align="center">
        <template v-slot="scope" class="specialColor">
          <span style="color: #adadad;font-weight: bold;">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <template v-slot="scope">
          <img :src="scope.row.imgUrl" alt="图片" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="text" label="文案" align="center">
        <template v-slot="scope" class="specialColor">
          <span style="color: #adadad;font-weight: 400;">{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template v-slot="scope" class="specialColor">
          <span style="color: #adadad;font-weight: 400;">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center">
        <template v-slot="scope" class="specialColor">
          <span style="color: #adadad;font-weight: 400;">{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.status === 1" style="color: #adadad;font-weight: bold;">禁用</span>
          <span v-if="scope.row.status === 2" style="color: #66b1ff;font-weight: bold;">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="primary" plain>编辑</el-button>
          <el-button type="danger" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>
<script>
import axios from "axios";

export default {
  name: "Config",
  data() {
    return {
      tableData: [],
      queryForm: {
        status: '',
      },
      loading: false
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      axios.post(process.env.REQUEST_URL + '/api/v1/life/config')
          .then(response => {
            this.tableData = response.data.data
          })
          .catch(error => {
            console.log(error);
          });
    }
  }
}
</script>

<style scoped>
.specialColor {
  fontWeight: bold;
  color: #adadad;
}
</style>

