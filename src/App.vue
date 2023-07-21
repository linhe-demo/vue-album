<script setup>

</script>

<template>
    <el-carousel :interval="4000" type="card" :height=screenHeight :width=screenWidth>
        <el-carousel-item v-for="item in imgList" :key="item">
            <img :src="item.imgUrl" alt="img" style="object-fit: scale-down; width:100%; height:100%"/>
            <div class="text">{{ item.text }}</div>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            imgList: [],
            screenHeight: '',
            screenWidth: '',
        }
    },
    created() {

    },
    mounted() {
        this.screenWidth = window.innerWidth + "px"
        this.setSize()
        this.getConfig()
        window.onresize = () => {
            this.screenWidth = window.innerWidth + "px"
            this.setSize()
        }
    },
    methods: {
        // autoHeight(){
        //     return document.documentElement.clientHeight + 'px'
        // },
        setSize: function () {
            this.screenHeight = 400 / 1920 * this.screenWidth + "px"
            this.screenWidth = 400 / 1920 * this.screenWidth + "px"
        },
        getConfig(){
            this.imgList = [{"imgUrl":"img/lixue1.jpg", "text":"灵动遇可爱，光影伴柔光，凡花来增艳，恰好月下逢"}];
            // axios.post('http://150.158.82.218:8806/api/v1/life/moment', {"num":10})
            //     .then(response => {
            //         this.imgList = [{"imgUrl":"img/lixue1.jpg", "text":"灵动遇可爱，光影伴柔光，凡花来增艳，恰好月下逢"}];
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
        }
    }
}
</script>


<style scoped>
.el-carousel__item h4 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>

