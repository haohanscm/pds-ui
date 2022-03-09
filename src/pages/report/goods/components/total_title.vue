<template>
    <div class="wrap">
        <div class="item item-1">
            <div class="item-title">销售额（元）</div>
            <div class="item-cont">{{obj.saleAmount}}</div>
        </div>
        <div class="item item-2">
            <div class="item-title">销售毛利（元）</div>
            <div class="item-cont">{{obj.grossProfit}}</div>
        </div>
        <div class="item item-3">
            <div class="item-title">销售毛利率</div>
            <div class="item-cont">{{(obj.profitRate * 100).toFixed(2)}} %</div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import Request from '../../request';
    export default {
        data: function(){
            return {
                request: new Request(),
                obj:{}
            }
        },
        props:{
            date: Array,
            buyerId: String
        },
        watch:{
            date:{
                handler(){
                    this.orderAnalyze()
                },
                deep: true,
                immediate: true
            },
            buyerId:{
                handler(){
                    this.orderAnalyze()
                },
                deep: true,
                immediate: true
            }
        },
        mounted(){
            this.orderAnalyze()
        },
        methods:{
            orderAnalyze(){
                this.request.orderAnalyze({
                    startDate: this.date[0], 
                    endDate: this.date[1],
                    buyerId: this.buyerId}).then( res => {
                    if( res.code === 200){
                        this.obj = res.ext
                    }else{
                        this.obj = {};
                        this.$message.warning( res.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        width: 100%;
        margin: 0 auto;
        display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box; /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox; /* 混合版本语法: IE 10 */
        display: -webkit-flex; /* 新版本语法: Chrome 21+ */
        display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
        -webkit-box-pack: justify;
        -moz-justify-content: space-between;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        background-color: white;
        padding: 10px 0 10px 0;
        .item{
            width: 33%;
            color: white;
            text-align: center;
            .item-title{
                font-size: 14px;
                padding: 10px 0 10px 20px;
            }
            .item-cont{
                padding: 10px 20px 15px 30px;
                font-size: 22px;
                font-weight: 600;
            }
        }
        .item-1{
            background-color: rgb(000, 185, 209)
        }
        .item-2{
            background-color: rgb(273, 69, 78)
        }
        .item-3{
            background-color: rgb(188, 74, 27)
        }
        .item-4{
            background-color: rgb(236, 124, 83)
        }
        .item-5{
            background-color: rgb(233, 11, 11);
        }
    }
</style>
