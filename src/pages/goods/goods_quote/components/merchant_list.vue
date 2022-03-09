<template>
    <div>
        <div class="title">
            <div>商家分类:<el-select v-model="buySeq" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div>
                商家名称: <div><el-input placeholder="支持模糊查询"></el-input></div>
            </div>
            <div>
                <el-button 
                    @click="handleCheck" 
                    type="primary">查询
                </el-button>
            </div>
        </div>
        <el-table
            :data="goodsList"
            stripe
            style="min-width: 100%">
            <el-table-column prop="buyerName" label="采购商" min-width="180">
            </el-table-column>
            <el-table-column prop="contact" label="联系人" min-width="80">
            </el-table-column>
            <el-table-column prop="telephone" label="电话" min-width="120">
            </el-table-column>
            <el-table-column prop="deliveryTime" min-width="100" label="报价有效期">
            </el-table-column>
            <el-table-column prop="genPrice" label="已报价商品数（已报价商品指与市场价不同的商品）" min-width="180">
            </el-table-column>
            <el-table-column prop="genPrice" label="上次购买时间" min-width="180">
            </el-table-column>
            <el-table-column prop="totalPrice" label="应收总价" min-width="100">
            </el-table-column>
            <el-table-column prop="totalPrice" label="状态（待重新报价，报价有效期即将结束，正常）" min-width="100">
            </el-table-column>
            <el-table-column prop="totalPrice" label="操作" min-width="80">
                <template slot-scope="scope">
                    <el-button type="text">重新报价</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import request from "../../request.js";
    export default {
        data: function(){
            return {
                activeName: "first",
                buySeq: 0,
                options: this.$dic.buySeqOptions,
                deliveryTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                goodsList: [1],//商品列表
            }
        },
        components:{

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
