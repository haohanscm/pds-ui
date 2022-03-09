<template>
    <el-container>
            <div class="title">
                <el-form :model="queryForm" ref="queryForm" @submit.native.prevent :inline="true" >
                    <el-form-item label="配送日期:" prop="deliveryTime">
                        <el-date-picker
                            :editable="false"
                            v-model="queryForm.deliveryTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            class="date-field"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="批次:"  prop="buySeq">
                        <el-select v-model="queryForm.buySeq" clearable placeholder="请选择" class="small-select-field">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采购商:" prop="buyerId">
                        <buyer-check v-model="queryForm.buyerId"></buyer-check>
                    </el-form-item>
                    <el-form-item label="状态:" prop="buyerStatus">
                        <el-select
                            clearable
                            filterable
                            v-model="queryForm.buyerStatus"
                            default-first-option
                            class="small-select-field"
                            placeholder="请选择">
                            <el-option
                                v-for="item in $dic.buyerOptionLabel"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采购单编号:" prop="buyId">
                        <el-input v-model="queryForm.buyId" placeholder="请输入" style="width: 150px"></el-input>
                    </el-form-item>
                    <el-form-item label="采购商名称:" prop="buyerName">
                        <el-input v-model="queryForm.buyerName" placeholder="请输入" style="width: 150px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            @click="handleCheck"
                            type="primary">查询
                        </el-button>
                        <el-button
                            @click="resetForm('queryForm')"
                            type="primary">清空条件
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        <el-main>
            <v-purchase-table :order-list="purchaseList" @refreshList="fetchBuyOrderList"></v-purchase-table>
        </el-main>
        <el-footer>
            <div class="page-box">
                <div></div>
                <my-pagination
                    :page-size="pageSize"
                    :current-page="pageNo"
                    :total="total"
                    :layout="layout"
                    :page-sizes="[20,40,60,80]"
                    @pagechange="handlePageChange">
                </my-pagination>
            </div>
        </el-footer>

    </el-container>
</template>

<script>;
import request from "../request.js";
import vPurchaseTable from "./components/purchase_order_table.vue";

export default {
    data: function () {
        return {
            request: new request(),
            activeName: "first",
            pageSize: 20,
            pageNo: 1,
            total: 0,
            layout: "total, sizes, prev, pager, next, jumper",
            options: this.$dic.buySeqOptions,
            // buySeq: '',
            // buyerId: "",
            // buyerStatus: "",
            // deliveryTime: '',
            // buyId:"",
            purchaseList: [],//采购订单列表
            queryForm:{
                deliveryTime:"",
                buySeq:"",
                buyerId:"",
                buyerStatus:"",
                buyId:"",
                buyerName:""
            }
        }
    },
    components: {
        vPurchaseTable
    },
    watch: {},
    created() {
        this.handleCheck()
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleCheck() {
            switch (this.activeName) {
                case "first":
                    this.fetchBuyOrderList()
                    break;
                default:
                    break;
            }
        },
        handlePageChange(e) {
            this.pageSize = e.pageSize;
            this.pageNo = e.pageNo
            this.fetchBuyOrderList()
        },
        handleClick() {

        },
        //查询采购单列表
        fetchBuyOrderList() {
            this.request.fetchBuyOrderList(
                {
                    deliveryDate: this.queryForm.deliveryTime,
                    buySeq: this.queryForm.buySeq,
                    status: this.queryForm.buyerStatus,
                    buyerId: this.queryForm.buyerId,
                    buyId: this.queryForm.buyId,
                    buyerName: this.queryForm.buyerName,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                }
            ).then(res => {
                if (res.code === 200) {
                    this.purchaseList = res.list;
                    this.total = res.totalRows;
                } else {
                    this.purchaseList = [];
                    this.$message.warning(res.msg);
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
    .title {
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
    }

    .page-box {
        background-color: white;
        display: flex;
        justify-content: space-between;
    }

    .small-select-field {
        width: 150px;
    }

    .date-field {
        width: 150px;
    }
</style>
