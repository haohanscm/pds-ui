<template>
    <div>
        <el-table
            :data="goodsList"
            stripe
            style="min-width: 100%">
            <el-table-column prop="buyId" label="采购单编号" min-width="100">
            </el-table-column>
            <el-table-column prop="buyerName" label="采购商" min-width="180">
            </el-table-column>
            <el-table-column prop="contact" label="联系人" min-width="80">
            </el-table-column>
            <el-table-column prop="telephone" label="电话" min-width="120">
            </el-table-column>
            <el-table-column prop="buyTime" label="下单时间" min-width="180">
            </el-table-column>
            <el-table-column prop="deliveryTime" min-width="100" label="配送日期">
            </el-table-column>
            <el-table-column prop="buySeq" label="批次" min-width="100">
                <template  slot-scope="scope">
                    {{$dic.buySeqOptions[scope.row.buySeq].label}}
                </template>
            </el-table-column>
            <el-table-column prop="deliveryType" label="配送方式" min-width="100">
                <template  slot-scope="scope">
                    {{$dic.deliveryTypeMap[scope.row.deliveryType]}}
                </template>
            </el-table-column>
            <el-table-column prop="genPrice" label="商品总价" min-width="180">
            </el-table-column>
            <el-table-column prop="totalPrice" label="应收总价" min-width="100">
            </el-table-column>
            <el-table-column prop="totalPrice" label="状态" min-width="80">
                <template slot-scope="scope">
                    <el-button type="text">{{$dic.buyerOrderStatusOption[scope.row.status]}}</el-button>
                </template>
            </el-table-column>
            
        </el-table>
    </div>
</template>

<script>
    // import request from "../request.js";
    export default {
        data: function(){
            return {
            }
        },
        components:{
        },
        props:{
            goodsList: Array,
        },
        watch:{
        },
        created(){
        },
        methods:{
        }
    }
</script>

<style scoped lang="scss">
    
</style>
