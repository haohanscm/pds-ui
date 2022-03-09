<template>
    <div class="">
        <el-tabs v-model="message">
            <el-tab-pane :label="`商品采购`" name="first">
                <v-goods-procurement v-if="message === 'first'"></v-goods-procurement>
            </el-tab-pane>
            <el-tab-pane :label="`供应商管理`" name="second">
                <v-supplier  v-if="message === 'second'"></v-supplier>
            </el-tab-pane>
            <el-tab-pane :label="`仓库管理`" name="third">
                <v-warehouse v-if="message === 'third'"></v-warehouse>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import vSupplier from "./supplier.vue"
import vWarehouse from "./warehouse.vue"
import vGoodsProcurement from "./goods_procurement.vue"
    export default {
        name: 'tabs',
        components: {
            vSupplier, vWarehouse, vGoodsProcurement
        },
        data() {
            return {
                message: 'first',
            }
        },
        methods: {
        },
        computed: {
        }
    }

</script>

<style scoped>
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
    .item{
        display: flex;
    }

    .handle-box {
        margin: 15px;
        float: left;
    }
    .marginTop{
        margin-top: 20px;
    }
    .handle-select {
        width: 120px;
    }
    .delivery-nav{
        width: 100%;
        display: flex;
    }
    .handle-input {
        width: 300px;
        display: inline-block;
        color: black;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>

