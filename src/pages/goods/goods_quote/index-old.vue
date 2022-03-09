<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- <el-tab-pane label="商家列表" name="first">
                <v-merchant-list :goods-list="goodsList"></v-merchant-list>
            </el-tab-pane> -->
            <el-tab-pane label="商家报价" name="second">
                <v-buyer-report :goods-list="goodsList"></v-buyer-report>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import request from "../request.js";
    import vBuyerReport from "./components/buyer_report.vue";
    import vMerchantList from "./components/merchant_list.vue"
    export default {
        data: function(){
            return {
                activeName: "second",
                buySeq: 0,
                options: this.$dic.buySeqOptions,
                deliveryTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                goodsList: [],//商品列表
            }
        },
        components:{
            vBuyerReport,vMerchantList
        },
        watch:{
        },
        created(){
        },
        methods:{
            handleCheck(){
                switch (this.activeName) {
                    case "first":
                        this.fetchBuyOrderList()
                        break;
                
                    default:
                        break;
                }
            },
            handleClick(){

            },
            //查询采购单列表
            fetchBuyOrderList(){
            },
        }
    }
</script>

<style scoped lang="scss">
    .title{
        display: flex; 
        display: flex;
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
        justify-content: space-between;
        >div{
            display: flex;
            width: 300px;
            align-self: center;
        }
    }
</style>
