<template>
    <div class="goods-item" :style="itemStyle">
        <div class="goods-cover" v-if="!inCart">
            <img v-if="goods.thumbUrl" :src="goods.thumbUrl + `?x-oss-process=image/resize,w_200`" :style="imgStyle"/>
        </div>
        <div class="goods-cover" v-if="inCart">
            <img v-if="goods.modelUrl" :src="goods.modelUrl + `?x-oss-process=image/resize,w_200`" :style="imgStyle"/>
        </div>
        <div class="goods-info-wrap">
            <div class="goods-info">
                <div class="goods-name">{{goods.goodsName}}</div>
                <div class="goods-num" v-if="inCart"><span>x </span>{{goods.goodsNum}}</div>
            </div>
            <div class="goods-model" v-if="!inCart">
                {{goods.goodsModelList.length > 1 ? '多规格' : ''}}
            </div>
            <div class="goods-model" v-if="inCart">
                {{goods.modelName}}
            </div>
            <div class="goods-price" v-if="inCart">
                <div v-if="goods.goodsPrice">
                    <span class="fs14"><span>¥ </span>{{goods.purchasePrice || goods.modelPrice}}</span>
                    <span class="fs14 txt-del txt-999"><span>¥ </span>{{goods.marketPrice|| goods.purchasePrice || goods.modelPrice}}</span>
                </div>
                <div class="fs14" v-else><span>¥ </span>{{goods.purchasePrice || goods.modelPrice}}</div>
                <div class="fs16 txt-red"><span class="fs14">¥ </span>{{(+goods.purchasePrice || +goods.modelPrice) * (goods.goodsNum)}}</div>
            </div>
            <div class="goods-price" v-if="!inCart">
                <div class="fs16 txt-red"><span class="fs14">¥ </span>{{goods.goodsModelList[0].purchasePrice || goods.goodsModelList[0].modelPrice}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        goods: Object,
        height: Number,
        width: Number,
        inCart: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            imgSrc: 'http://img.1000.com/qm-a-img/prod/000000/34927617f8d8317ecffcca63c8360135.jpg@160w_160h.jpg',
        }
    },
    computed: {
        itemStyle: function() {
            return `height:${this.height}px;width:${this.width}px;`
        },
        imgStyle: function() {
            return `width:${this.height-10}px;height:${this.height-10}px;`
        },
        computedPrice: function() {
            let price = this.goods.purchasePrice || this.goods.goodsPrice || this.goods.marketPrice
            let num = this.goods.goodsNum
            return price * num
        }
    },
    watch: {
    },
    mounted() {

    },
    methods: {

    },

}
</script>

<style scoped>
.goods-item {
    width: 100%;
}
.el-card__body{
    padding: 10px;
}
.goods-cover {
    display: inline-block;
    padding: 5px;
}
.goods-cover img {
    border-radius: 5px;
}
.goods-info-wrap {
    display: inline-block;
    width: calc(100% - 100px);
    vertical-align: super;
}
.goods-info {
    display: flex;;
    text-align: left;
    align-items: center;
}
.goods-name {
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.goods-model {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #999;
}
.goods-num {
    min-width: 15px;
}
.fs1 {
    font-size: 16px;
}
.fs14 {
    font-size: 14px;
}
.txt-red {
    color: #c83835;
}
.txt-999 {
    color: #999;
}
.goods-price {
    display: flex;
    justify-content: space-between;
}
.txt-del {
    text-decoration: line-through;
}
</style>
<style>
.goods-item .el-card__body{
    padding: 0px !important;
}
</style>

