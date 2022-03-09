<template>
    <div class="components-container">
        <el-table
            :data="value"
            border
            show-summary
            style="width: 100%">
            
            <el-table-column prop="buyOrderId" label="采购单号">
            </el-table-column>

            <el-table-column prop="buyerName" label="采购商">
            </el-table-column>

            <el-table-column prop="goodsNum" label="采购数量" width="150px">
                <template slot-scope="scope">
                    <div style="display:flex;">
                        <el-input-number 
                            :disabled="scope.row.detailStatus > 2" 
                            size="mini" v-model="scope.row.goodsNum" 
                            :precision="2" :step="1"></el-input-number>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="" label="采购单价" width="150px">
                <template slot-scope="scope">
                    <div style="display:flex;">
                        <el-input-number :disabled="scope.row.detailStatus > 2" size="mini" v-model="scope.row.buyPrice" :precision="2" :step="0.01" ></el-input-number>
                    </div>
                </template>
            </el-table-column>

            <el-table-column prop="totalPrice" label="应付账款">
            </el-table-column>

        </el-table>
    </div>
</template>
<script>
export default {
    name: 'backToTop-demo',
    data() {
        return {
            totalWeight: 0,
            totalVolume: 0,
            totalNeed: 0
        }
    },
    props:{
        value: Array,
    },
    
    watch:{
        value:{
            handler( newVal, oldVal){
                newVal.forEach(ele => {
                });
            },
            deep: true,
            immediate: true
        }
    },
    methods:{
    }
}
</script>

<style scoped>
.placeholder-container div {
    margin: 10px;
}
</style>
