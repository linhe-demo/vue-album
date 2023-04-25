<script setup>

</script>

<template>
    <el-carousel :interval="4000" type="card"  :height=screenHeight :width= screenWidth>
        <el-carousel-item v-for="item in imgList" :key="item">
            <img :src="item" alt="img" style="object-fit: scale-down; width:100%; height:100%"/>
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
            screenHeight: '',
            screenWidth: ''
        }
    },
    created() {

    },
    mounted() {
        this.screenWidth = window.innerWidth + "px"
        this.setSize()

        window.onresize = () => {
            this.screenWidth = window.innerWidth + "px"
            this.setSize()
        }
    },
    methods: {
        // autoHeight(){
        //     return document.documentElement.clientHeight + 'px'
        // },
        setSize:function () {
            this.screenHeight = 400 / 1920 * this.screenWidth + "px"
            this.screenWidth = 400 / 1920 * this.screenWidth + "px"
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

