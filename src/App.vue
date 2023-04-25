<script setup>

</script>

<template>
    <el-carousel :interval="4000" type="card" indicator-position="outside" :height="bannerHeight + 'px'" width="100%">
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
                    '/home/vue/src/assets/img/lixue1.jpg',
                    '/home/vue/src/assets/img/lixue1.jpg',
                    '/home/vue/src/assets/img/lixue1.jpg',
                    '/home/vue/src/assets/img/lixue1.jpg',
                    '/home/vue/src/assets/img/lixue1.jpg',
                    '/home/vue/src/assets/img/lixue1.jpg',
                ],
                bannerHeight: 0
            }
        },
        mounted () {
            this.setSize();
            const that = this;
            window.addEventListener('resize', function() {
                that.screenWidth = $(window).width();
                that.setSize();
            }, false);
        },
        methods: {
            setSize: function () {
                this.bannerHeight = 740 / 2560 * this.screenWidth
                if(this.bannerHeight > 740) this.bannerHeight = 740
                if(this.bannerHeight < 360) this.bannerHeight = 360
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

