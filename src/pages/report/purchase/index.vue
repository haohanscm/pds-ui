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
            <div>
                <el-select
                    class="form-field--large"
                    filterable
                    clearable=""
                    remote :remote-method="searchGoodsByName"
                    v-model="spuIndex"
                    @change="onGoodsSelectChange"
                    placeholder="请输入商品名称">
                    <el-option
                    v-for="( item, index) in goodsList"
                    :key="item.id" :label="item.goodsName"
                        :value="index">
                    </el-option>
                </el-select>
            </div>
            <div>
                <el-select
                    v-model="goodsId"
                    clearable
                    class="form-field--large"
                    placeholder="请选择商品规格">
                    <el-option
                    v-for="item in goodsModelList"
                    :label="item.modelName"
                    :value="item.id"
                    :key="item.id">
                    </el-option>
                </el-select>
            </div>

        </div>
        <div class="title">
            <v-total-title :date="date" :buyerId="buyerId"></v-total-title>
        </div>
        <div class="charts">
            <div class="charts-left">
                <v-sale-trend :date="date" :buyerId="buyerId" :goodsId="goodsId"></v-sale-trend>
            </div>

            <div class="charts-right">
                <v-merchant-sale :date="date" :goodsId="goodsId"></v-merchant-sale>
            </div>
        </div>
        <div></div>
    </div>
</template>

<script>
    import vTotalTitle from "./components/total_title";
    import vSaleTrend from "./components/sale_trend";
    import vMerchantSale from "./components/merchant_sale";
    import Request from "../request";
    export default {
        data: function(){
            return {
                request: new Request(),
                date: [this.$utils.getDay(-7),this.$utils.getDay(0)],
                buyerId: "",
                buyerList: [],
                goodsList: [],
                goodsName: "",
                spuIndex: "",
                goodsModelList: [],
                goodsId: ""
            }
        },
        components:{
            vTotalTitle, vSaleTrend, vMerchantSale
        },
        mounted(){
        },
        watch:{
            buyerId:{
                handler(){
                    console.log(2323)
                }
            }
        },
        methods:{
            getDate(){
                console.log(this.date)
            },
            getGoodsList(params) {
                //shopId 需要必传
                params.pageSize = 50;
                this.request.getGoodsList(params).then(res => {
                    if (res.code == 200) {
                        this.goodsList = res.ext.list
                        console.log( this.goodsList)
                    } else {
                        console.log('商品列表获取错误', res.msg)
                    }
                })
            },
            searchGoodsByName(searchValue) {
                let _this = this;
                if (searchValue !== '') {
                    let params = {
                        goodsName: searchValue,
                    }
                    _this.getGoodsList(params)
                }
            },
            onGoodsSelectChange(){
                this.goodsModelList = this.goodsList[this.spuIndex].goodsModelList;
                this.goodsId = this.goodsModelList[0].id
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        .check-condition{
            background-color: #fff;
            padding: 15px;
            display: flex;
            div{
                margin-left: 15px;
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
