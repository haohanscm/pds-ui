<template>
    <el-container>
        <div class="title">
                <el-form @submit.native.prevent :inline="true">
                    <el-form-item label="商家名称:">
                    <el-input
                        v-model="merchantName"
                        clearable
                        style="max-width:150px"
                        placeholder="采购商所属商家">
                    </el-input>
                    </el-form-item>
                    <el-form-item label="送货时间段:">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                <el-form-item label="采购商:">
                    <buyer-check v-model="buyerId"></buyer-check>
                </el-form-item>
                <el-form-item label="结算状态:">
                    <el-select
                        clearable
                        v-model="status"
                        placeholder="请选择">
                        <el-option
                            v-for="item in $dic.paymentStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getPuramountList" type="primary">查询货款</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogFormVisible = true" type="primary">批量生成采购商货款</el-button>
                </el-form-item>
                </el-form>
        </div>
        <el-main>
            <div>
                <el-table
                    :data="list"
                    border
                    style="width: 100%">
                    <el-table-column
                        type="index"
                        fixed
                        width="50">
                    </el-table-column>

                    <el-table-column prop="buyerPaymentId" label="采购商货款编号" fixed>
                    </el-table-column>
                    <el-table-column prop="buyerName" label="采购商名称" fixed>
                    </el-table-column>
                    <el-table-column prop="merchantName" label="商家">
                    </el-table-column>
                    <el-table-column prop="buyId" label="采购编号">
                    </el-table-column>
                    <el-table-column label="送货日期">
                        <template slot-scope="scope">
                            <span>
                                {{dateFormat(scope.row.buyDate)}}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="goodsNum" label="商品数量">
                    </el-table-column>

                    <el-table-column prop="buyerPayment" label="采购货款">
                    </el-table-column>

                    <el-table-column prop="afterSalePayment" label="售后货款">
                    </el-table-column>

                    <el-table-column prop="status" label="结算状态">
                        <template slot-scope="scope">
                            <div>
                                {{$dic.paymentStatus[scope.row.status].label}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="shipFee" label="运费">
                    </el-table-column>

                    <el-table-column prop="serviceId" label="售后单编号">
                    </el-table-column>

                </el-table>
            </div>
        </el-main>
        <el-footer>
            <div class="page-box">
                <div></div>
                <my-pagination
                    :page-size="pageSize"
                    :current-page="pageNo"
                    :total="total"
                    :layout="layout"
                    :page-sizes="[20,30,40,50]"
                    @pagechange="handlePageChange">
                </my-pagination>
            </div>
        </el-footer>
        <el-dialog title="批量生成采购商货款" :visible.sync="dialogFormVisible" width="70%">
            <el-row :gutter="20">
                <el-col :span="4">
                    送货时间:
                </el-col>
                <el-col :span="10">
                    <el-date-picker
                        v-model="batchCreateModel.deliveryDate"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    送货批次:
                </el-col>
                <el-col :span="10">
                    <el-select v-model="batchCreateModel.buySeq" clearable placeholder="请选择">
                        <el-option
                            v-for="item in $dic.buySeqOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="batchCreate">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
    import request from "../request.js";

    export default {
        data: function () {
            return {
                request: new request(),
                pageSize: 20,
                pageNo: 1,
                total: 0,
                layout:"total, sizes, prev, pager, next, jumper",
                buyerId: "",
                merchantName:"",
                date: [this.$utils.getDay(-7), this.$utils.getDay(0)],
                status: "",
                buyerList: [],
                editValue: {},
                dialogFormVisible: false,
                list: [],
                batchCreateModel: {
                    deliveryDate: "",
                    buySeq: ""
                },
            }
        },
        watch: {},
        computed:{
            dateFormat(){
                return function (date) {
                    if (date) {
                        date = date.split(" ")[0];
                    }
                    return date;
                }
            }
        },
        // components: {
        //     editTemp
        // },
        created() {
            this.getPuramountList()
        },
        methods: {
            handlePageChange(e) {
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.getPuramountList()
            },
            // 查询采购商货款列表
            getPuramountList() {
                if (!this.date) {
                    this.date = ["", ""]
                }
                let params = {
                    beginBuyDate: this.date[0],
                    endBuyDate: this.date[1],
                    buyerId: this.buyerId,
                    status: this.status,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo
                }
                this.request.getPuramountList(params).then(res => {
                    if (res.code == 200) {
                        this.list = res.ext.list;
                        this.total = res.ext.count;
                    } else {
                        this.$message.warning("未查询到结算记录：" + res.msg)
                    }
                })
            },
            // 批量生成采购商货款
            batchCreate() {
                let params = this.batchCreateModel;
                if(!(params.deliveryDate && params.buySeq)){
                    this.$message.error("未选择时间/批次");
                    return;
                }
                this.request.batchCreate(params).then(res => {
                    let msg = res.msg;
                    if(res.ext){
                        console.log("ext",res.ext);
                        msg += "  "+res.ext.successMsg + ";  "+ res.ext.errorMsg;
                    }
                    if (res.code == 200) {
                        this.dialogFormVisible = false;
                        this.$message.success({
                            showClose: true,
                            message:"生成采购商货款成功：" + msg,
                            type:"success",
                            duration:0
                        });
                        this.date = [params.deliveryDate, params.deliveryDate];
                        this.getPuramountList();
                    } else {
                        this.$message({
                            showClose: true,
                            message:"生成采购商货款失败：" + msg,
                            type:"error",
                            duration:0
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">

    .el-row {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .title {
        display: flex;
        flex-direction:column;
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
    }

    .page-box {
        background-color: white;
        display: flex;
        justify-content: space-between;
    }
</style>
