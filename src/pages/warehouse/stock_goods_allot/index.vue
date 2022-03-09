<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 库存调拨</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <v-goods-transfer></v-goods-transfer>
    </div>
</template>

<script>
import dic from "../../../utils/dictionary.js";
import vGoodsTransfer from "./goods_transfer.vue"
    export default {
        name: 'stockGoodsAllot',
        components:{
            vGoodsTransfer
        },
        data() {
            return {
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
    .item{
        flex: 1;
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

