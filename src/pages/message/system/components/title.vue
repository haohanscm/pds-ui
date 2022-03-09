<template>
    <div class="wrap">
        <div class="item item-1">
            <div class="item-title">订单总数</div>
            <div class="item-cont">{{obj.orderNum}}</div>
        </div>
        <div class="item item-2">
            <div class="item-title">销售总额</div>
            <div class="item-cont">{{obj.saleAmount}}</div>
        </div>
        <div class="item item-3">
            <div class="item-title">新用户数</div>
            <div class="item-cont">{{obj.freshUserNum}}</div>
        </div>
        <div class="item item-4">
            <div class="item-title">总用户数</div>
            <div class="item-cont">{{obj.totalUserNum}}</div>
        </div>
        <div class="item item-5" style="background-color:#f1572d">
            <div class="item-title">退款金额</div>
            <div class="item-cont">{{obj.refundAmount}}</div>
        </div>
    </div>
</template>

<script>
    import Request from "../../request.js";
    import echarts from 'echarts'
    export default {
        data: function(){
            return {
                request: new Request(),
                obj:{}
            }
        },
        watch:{
        },
        mounted(){
            this.getOverView()
        },
        methods:{
            getOverView(){
                this.request.overview().then( res => {
                    if( res.code === 200){
                        this.obj = res.ext
                    }else{
                        this.$message.warning( res.msg)
                    }
                }).catch( err => {
                    this.$message.warning( err)
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
        padding: 5px;
        .item{
            width: 19%;
            color: white;
            .item-title{
                font-weight: 700;
                padding: 10px 0 10px 20px;
            }
            .item-cont{
                padding: 10px 20px 20px 30px;
            }
        }
        .item-1{
            background-color: #0067a6;
        }
        .item-2{
            background-color: #00abd8;
        }
        .item-3{
            background-color: #008972;
        }
        .item-4{
            background-color: #efc028;
        }
        .item-5{
            background-color: #f1572d;
        }
    }
</style>
