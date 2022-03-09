<template>
    <div class="wrap">
        <div class="item item-1">
            <div class="item-title">今日下单金额（元）<p>{{todayObj.orderAmount || 0}}</p></div>
            <div class="item-icon item-icon-1"><i class="el-icon-tickets"></i></div>
        </div>
        <div class="item item-2">
            <div class="item-title">今日订单数（笔）<p>{{todayObj.orderNum || 0}}</p></div>
            <div class="item-icon item-icon-2"><i class="el-icon-refresh"></i></div>
        </div>
        <div class="item item-3">
            <div class="item-title">今日客单价（元）<p>{{todayObj.avgPrice || 0}}</p></div>
            <div class="item-icon item-icon-3"><i class="el-icon-view"></i></div>
        </div>
        <div class="item item-4">
            <div class="item-title">昨日下单金额（元）<p>{{yesterdayObj.orderAmount}}</p></div>
            <div class="item-icon item-icon-4">
                <p>订单数{{todayObj.lastSaleAmount || 0}}笔</p>
                <p>客单价{{todayObj.lastUserAvgPrice || 0}}元</p>
            </div>
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
                todayObj:{},
                yesterdayObj:{},
            }
        },
        watch:{
        },
        mounted(){
            this.todayReport()
            this.yesterdayReport()
        },
        methods:{
            todayReport(){
                this.request.briefReport({
                        startDate: this.$utils.getDay(0),
                        endDate:this.$utils.getDay(0)
                }).then( res => {
                    if( res.code === 200){
                        this.todayObj = res.ext
                    }else{
                        this.$message.warning( res.msg)
                    }
                }).catch( err => {
                    this.$message.warning( err)
                })
            },
            yesterdayReport(){
                this.request.briefReport({
                        startDate: this.$utils.getDay(-1),
                        endDate:this.$utils.getDay(-1)
                }).then( res => {
                    if( res.code === 200){
                        this.yesterdayObj = res.ext
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
            width: 24.5%;
            height: 100px;
            color: #fff;
            display: flex;
            justify-content: space-between;
            .item-title{
                font-weight: 700;
                padding: 20px 0 10px 20px;
                flex: 1;
                border-top: 1px solid #aeaeae;
                border-left: 1px solid #aeaeae;
                border-bottom: 1px solid #aeaeae;
                p{
                    padding: 25px 0 0 30px;
                }
            }
            .item-icon{
                width: 100px;
                text-align: center;
                line-height: 100px;
                font-size: 50px;
            }
            .item-icon-1{
                border: 1px solid rgb(153, 209, 0);
            }
            .item-icon-2{
                border: 1px solid rgb(273, 069, 078);
            }
            .item-icon-3{
                border: 1px solid rgb(241, 165, 25);
            }
            .item-icon-4{
                width: 50%;
                font-size: 16px;
                line-height: 50px;
                border: 1px solid rgb(238, 90, 21);
            }
        }
        .item-4{
            background-color: #ce350a;
        }
        .item-3{
            background-color: #efc028;
        }
        .item-2{
            background-color: #008972;
        }
        .item-1{
            background-color: #0067a6;
        }
    }
</style>
