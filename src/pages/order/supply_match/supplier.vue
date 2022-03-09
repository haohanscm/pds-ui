<template>
    <div class="components-container">
        <div>
            <el-select :disabled="isDisabled" 
            @visible-change="handleGetSupplier" 
            @change="checkSupplier" 
            v-model="supplier" 
            filterable placeholder="请选择">
                <el-option
                v-for="(item, index) in waitingList"
                :key="item.id"
                :label="item.supplierName"
                :value="index">
                </el-option>
            </el-select><el-button>新增</el-button>
        </div>
        <el-table
            :data="value"
            border
            show-summary
           >

            <el-table-column prop="supplierName" label="供应商名称" width="200px">
            </el-table-column>

            <el-table-column prop="supplyNum" label="供应数量(最大)" width="150px">
                <template slot-scope="scope">
                    <div style="display: flex;">
                        <el-input-number size="mini" 
                        :disabled="isDisabled" 
                        @change="priceChange(scope.row,scope.$index)" 
                        v-model="scope.row.supplyNum" 
                        :precision="2" :step="1" ></el-input-number>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="供应价格" width="150px">
                <template slot-scope="scope">
                    <div style="display: flex;">
                        <el-input-number :disabled="isDisabled" 
                        size="mini" v-model="scope.row.supplyPrice" 
                        :precision="2" :step="0.01" ></el-input-number>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="buyNum" label="平台采购数量" width="150px">
                <template slot-scope="scope">
                    <div style="display: flex;">
                        <el-input-number size="mini" 
                        :disabled="isDisabled" 
                        v-model="scope.row.buyNum" 
                        :precision="2" :step="1" 
                        :max="+scope.row.supplyNum"></el-input-number>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="supplierBillAmount" label="供应商应收款" width="100px">
            </el-table-column>

            <el-table-column prop="" label="操作" width="50px">
                <template slot-scope="scope">
                    <el-button :disabled="isDisabled"  
                    type="text" @click="handleTableClick(scope.row,scope.$index)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import request from "../request.js";
import * as math from 'mathjs';
export default {
    name: 'backToTop-demo',
    data() {
        return {
            request: new request(),
            waitingList: [],
            supplier:"",
            tableList: [""],
            totalWeight: 0,
            totalVolume: 0,
            totalNeed: 0,
        }
    },
    props:{
        value: Array,
        orderStatus: String,
        original: Object,
    },
    computed:{
        isDisabled(){
            return this.orderStatus > 2;
        }
    },
    watch:{
        value:{
            handler(newVal,oldVal){
            },
            deep: true,
            immediate: true
        },
        //异步监听
        orderStatus(newVal,oldVal){
            // console.log(newVal)
        }
    },
    methods:{
        handleGetSupplier(){
            if(this.waitingList.length == 0){
                this.getSupplierList()
            }
        },
        handleTableClick(item, index){
            var _this = this
            if(item.offerOrderId){
                this.deleteSupplierList(item.offerOrderId,function(){
                    _this.value.splice(index, 1)
                })
            }else{
                this.value.splice(index, 1)
            }
        },
        checkSupplier(e){
            this.value.push(this.waitingList[e])
        },
        priceChange(item, index){
            this.$set(this.value, index, item)
        },
        //获取供应商列表
        getSupplierList(){
            this.request.getSupplierList({goodsId: this.original.goodsId}).then(res => {
                if(res.code == 200){
                    this.waitingList = res.ext;
                    this.waitingList.forEach(ele => {
                        ele.supplyPrice = ele.supplyPrice || this.original.marketPrice || "0";
                        ele.buyNum = this.original.needBuyNum || '0';
                        ele.supplyNum = 9999;
                        ele.minSaleNum = 0;
                    })
                }
            })
        },
        //删除供应商
        deleteSupplierList(offerOrderId, fun){
            this.request.deleteSupplierList({ offerOrderId}).then(res => {
                if(res.code == 200){
                    fun()
                }else{
                    this.$message.error(res.msg)
                }
            })
        },
    }
}
</script>

<style scoped>
.placeholder-container div {
    margin: 10px;
}
</style>
