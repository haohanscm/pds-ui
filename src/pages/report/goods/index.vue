<template>
    <div class="wrap">
        <div class="check-condition">
            <div>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div>采购商:
                <buyer-check v-model="buyerId"></buyer-check>
            </div>
        </div>
        <div class="title">
            <v-total-title :date="date" :buyerId="buyerId"></v-total-title>
        </div>
        <div class="charts">
            <div class="charts-left">
                <v-cate-rate :date="date" :buyerId="buyerId"></v-cate-rate>
            </div>

            <div class="charts-right">
                <v-goods-sale :date="date" :buyerId="buyerId"></v-goods-sale>
            </div>
        </div>
        <div></div>
    </div>
</template>

<script>
    import vTotalTitle from "./components/total_title";
    import vCateRate from "./components/cate_rate";
    import vGoodsSale from "./components/goods_sale";
    import Request from "../request";
    export default {
        data: function(){
            return {
                request: new Request(),
                date: [this.$utils.getDay(-7),this.$utils.getDay(0)],
                buyerId: ""
            }
        },
        mounted(){
        },
        components:{
            vTotalTitle, vCateRate, vGoodsSale
        },
        methods:{
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        .check-condition{
            background-color: #fff;
            padding: 15px;
            display: flex;
            >div{
                margin-left: 15px;
                display: flex;
                height: 30px;
            }
        }
        .title{
            margin-top: 10px;
            padding: 0;
        }
        .charts{
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            >div{
                width: 49.5%;
            }
        }
    }
</style>
