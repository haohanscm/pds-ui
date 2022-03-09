
<template>
    <div>
        <div class="title">
            <div style="display:flex">供应商名称: <el-input style="flex:1"></el-input>
            </div>
            <div><el-button type="primary">查询</el-button></div>
            <div><el-button type="primary" @click="generate">生成供应商货款</el-button></div>
        </div>
        <div>
            <el-table
            :data="list"
            border
            style="width: 100%">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>

                <el-table-column prop="supplierPaymentId" label="货款编号">
                </el-table-column>

                <el-table-column prop="supplierName" label="供应商名称">
                </el-table-column>

                <el-table-column prop="merchantName" label="商家名称">
                </el-table-column>

                <el-table-column prop="supplyDate" label="供应日期">
                </el-table-column>

                <el-table-column prop="supplierPayment" label="供应货款">
                </el-table-column>

                <el-table-column prop="goodsNum" label="商品数量">
                </el-table-column>

                <el-table-column prop="status" label="结算状态">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.status === "1" ? "已结算" : "未结算"}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="operator" label="经办人名称">
                </el-table-column>

                <el-table-column prop="askOrderId" label="对应货款单编号">
                </el-table-column>

            </el-table>
        </div>
        <div class="page-box">
            <div></div>
            <my-pagination
            :page-size="pageSize"
            :current-page="pageNo"
            :total="total"
            :page-sizes="[20,30,40,50]"
            @pagechange="handlePageChange">   
            </my-pagination>
        </div>
        <el-dialog title="商家编辑" :visible.sync="dialogFormVisible">
            <edit-temp :form="editValue"></edit-temp>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="creatOrder">生成货款</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Request from "../request.js";
    import editTemp from "./edit"
    export default {
        data: function(){
            return {
                pageSize: 20,
                pageNo: 1,
                total: 0,
                request: new Request(),
                editValue: {},
                dialogFormVisible: false,
                list: []
            }
        },
        watch:{
        },
        components:{
            editTemp
        },
        created(){
            this.getSupamountList()
        },
        methods:{
            handlePageChange(e){
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.getSupamountList()
            },
            generate(){
                this.dialogFormVisible = true;
            },
            creatOrder(){
                this.dialogFormVisible = false;
                this.batchCreateSup()
            },
            // 查询采购商列表
            getSupamountList() {
                this.request.getSupamountList({pageSize: this.pageSize, pageNo: this.pageNo}).then(res => {
                    if (res.code == 200) {
                        this.list = res.ext.list;
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到结算记录：" + res.msg)
                    }
                })
            },
            // 查询采购商货款
            batchCreateSup() {
                this.request.batchCreateSup({...this.editValue}).then(res => {
                    if (res.code == 200) {
                        this.$message.success( res.msg)
                    }else{
                        this.$message.warning( res.msg)
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .title{
        display: flex;
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
    }
    .title>div{
        margin-left: 50px;
    }
    .page-box{
        background-color: white;
        display: flex;
        justify-content: space-between;
    }
</style>

