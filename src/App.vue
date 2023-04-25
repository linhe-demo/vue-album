<script setup>

</script>

<template>
    <el-carousel :interval="4000" type="card" indicator-position="outside" :height="screenHeight + 'px'" width="100%">
        <el-carousel-item v-for="item in imgList" :key="item">
            <img :src="item" alt="img" style="max-width:100%;max-height:100%"/>
        </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
    data() {
        return {
            imgList: [
                '/img/lixue1.jpg',
                '/img/lixue2.jpg',
                '/img/lixue3.jpg',
                '/img/lixue4.jpg',
                '/img/lixue5.jpg',
                '/img/lixue6.jpg',
                '/img/lixue7.jpg',
            ],
            screenHeight: 0
        }
    },
    created() {
        this.screenHeight = this.autoHeight()
    },
    mounted() {
        // window.onresize = () => {
        //     return (() => {
        //         this.screenHeight = document.documentElement.clientHeight + 'px'
        //     })
        // }
    },
    methods: {
        autoHeight(){
            return document.documentElement.clientHeight + 'px'
        }
    }
}
</script>


<style scoped>

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>

