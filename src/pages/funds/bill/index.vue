<template>
    <div>
        <div class="title">
            
            <div><el-button type="primary" @click="newList">新增结算记录</el-button> </div>
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

                <el-table-column prop="settlementId" label="货款编号">
                </el-table-column>

                <el-table-column prop="settlementBeginDate" label="结算开始日期">
                </el-table-column>

                <el-table-column prop="settlementEndDate" label="结算结束日期">
                </el-table-column>

                <el-table-column prop="payDate" label="付款日期">
                </el-table-column>

                <el-table-column prop="companyName" label="结算公司名称">
                </el-table-column>

                <el-table-column prop="settlementDesc" label="结算说明">
                </el-table-column>

                <el-table-column prop="operator" label="经办人名称">
                </el-table-column>

                <el-table-column prop="paymentSn" label="对应货款单编号">
                </el-table-column>

                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <div>
                           <el-button type="text" @click="edit(scope.row)">编辑</el-button> 
                        </div>
                    </template>
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
        <el-dialog title="结算记录编辑" :visible.sync="dialogFormVisible">
            <edit-temp :form="editValue"></edit-temp>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
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
            this.getRecordList()
        },
        methods:{
            handlePageChange(e){
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.getRecordList()
            },
            edit(e){
                this.editValue = e;
                this.dialogFormVisible = true
            },
            confirm(){
                this.dialogFormVisible = false;
                this.editRecord()
            },
            newList(){
                this.editValue = {};
                this.dialogFormVisible = true;
            },
            // 查询采购商列表
            getRecordList() {
                this.request.getRecordList({pageSize: this.pageSize, pageNo: this.pageNo}).then(res => {
                    if (res.code == 200) {
                        this.list = res.ext.list;
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到结算记录：" + res.msg)
                    }
                })
            },
            editRecord(){
                this.request.editRecord({...this.editValue}).then( res => {
                    if( res.code === 200){
                        this.$message.success("编辑成功！")
                    }else{
                        this.$message.warning("编辑失败：" + res.msg)
                    }
                    this.getCarList()
                })
            }
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
