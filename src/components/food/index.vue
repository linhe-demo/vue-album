<template>
    <div class="top">
        <div class="welcome">
            <el-button type="default" @click="back" class="btn">返回</el-button>
            <div class="title-desc">宝妈遇到下列食物当心哦</div>
        </div>
    </div>
    <div class="detail" v-loading.fullscreen="loadPicture" :element-loading-text="loading">
        <el-table
            :data="tableData" border
            style="width: 100%;height:100%;">
            <el-table-column prop="id" label="食物名" align="center">
                <template v-slot="scope" class="specialColor">
                    <span style="color: #adadad;font-weight: bold;">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="危险等级" align="center">
                <template v-slot="scope">
                    <span v-if="scope.row.level === 1" style="color: red;font-weight: bold;font-size: 13px">x</span>
                    <span v-if="scope.row.level === 2" style="color: greenyellow;font-weight: bold;">O</span>
                </template>
            </el-table-column>
            <el-table-column prop="危害" label="不可吃原因" align="center">
                <template v-slot="scope" class="specialColor">
                    <span style="color: #adadad;font-size: 11px;">{{ scope.row.reason }}</span>
                </template>
            </el-table-column>
        </el-table>
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
            tableData: []
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
        this.getFoodsData()
    },
    methods: {
        getFoodsData() {
            this.loadPicture = true
            let store = useStore()
            this.token = store.state.user.token
            axios.post(process.env.BASE_URL + '/api/v1/life/food', {}, {
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
</style>

