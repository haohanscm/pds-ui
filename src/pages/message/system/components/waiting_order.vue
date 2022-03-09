<template>
    <div class="wrap">
        <div class="title">待处理单据 <i class="el-icon-warning"></i></div>
        <ul>
            <Li class="item">
                <div class="item-left">待汇总</div>
                <div class="item-right">{{obj.waitSummary}}单</div>
            </Li>
            <Li class="item">
                <div class="item-left">待分拣</div>
                <div class="item-right">{{obj.sortout}}单</div>
            </Li>
            <Li class="item">
                <div class="item-left">待报价</div>
                <div class="item-right">{{obj.offerPrice}}单</div>
            </Li>
            <Li class="item">
                <div class="item-left">待确认</div>
                <div class="item-right">{{obj.confirm}}单</div>
            </Li>
            <Li class="item">
                <div class="item-left">待配送</div>
                <div class="item-right">{{obj.delivering}}单</div>
            </Li>
            <Li class="item">
                <div class="item-left">待支付结款单</div>
                <div class="item-right">{{obj.notPay}}单</div>
            </Li>
        </ul>
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
            this.orderDeal()
        },
        methods:{
            orderDeal(){
                this.request.orderDeal({
                        startDate: this.$utils.getDay(0),
                        endDate:this.$utils.getDay(0)
                }).then( res => {
                    if( res.code === 200){
                        this.obj = res.ext
                    }else{
                        this.$message.warning( res.msg)
                    }
                }).catch( err => {
                    this.$message.warning( err)
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        background-color: #fff;
        display: flex;
        flex-direction: column;
        div.title{
            height: 30px;
            padding: 20px 0 0 30px;
            font-size: 22px;
            >i{
                color: #d3940c;
            }
        }
        ul{
            height: 350px;
            display: flex;
            flex-direction: column;
            .item{
                border-bottom: 1px solid #eaeaea;
                padding: 20px 20px 0 20px;
                flex: 1;
                display: flex;
                justify-content: space-between;
                .item-left{
                    font-weight: 500;
                }
                .item-right{
                    font-size: 18px;
                    font-weight: 550;
                }
            }
        }
    }
</style>
