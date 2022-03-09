<template>
    <div>
        <div class="title">
            <div style="display:flex">供应商名称: <el-input style="flex:1"></el-input>
            </div>
            <div><el-button type="primary">查询</el-button> </div>
            <div><el-button type="primary" @click="newList">新增</el-button> </div>
        </div>
        <div>
            <el-table
            :data="buyerList"
            border
            style="width: 100%">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>

                <el-table-column prop="supplierName" label="供应商名称">
                </el-table-column>

                <el-table-column prop="tags" label="标签">
                </el-table-column>

                <el-table-column prop="shortName" label="简称">
                </el-table-column>

                <el-table-column prop="contact" label="联系人">
                </el-table-column>

                <el-table-column prop="telephone" label="电话">
                </el-table-column>

                <el-table-column prop="payPeriod" label="账期">
                </el-table-column>

                <el-table-column prop="address" label="供应商地址地址">
                </el-table-column>

                <el-table-column prop="merchantName" label="商家名称">
                </el-table-column>

                <el-table-column prop="isUpdateJisu" label="类型" width="100px">
                    <template slot-scope="scope">
                        <div>
                           {{scope.row.supplierType === "1" ? "库存供应商" : "一般供应商"}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="address" label="消息推送">
                    <template slot-scope="scope">
                        <div>
                           {{scope.row.needPush === "0" ? "否" : "是"}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <div>
                           <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                           <!--<el-button type="text" @click="deleteSupplier(scope.row.id)">删除</el-button> -->
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
            :layout="layout"
            :page-sizes="[20,30,40,50]"
            @pagechange="handlePageChange">
            </my-pagination>
        </div>
        <el-dialog title="供应商编辑" :visible.sync="dialogFormVisible">
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
                layout:"total, sizes, prev, pager, next, jumper",
                request: new Request(),
                editValue: {},
                dialogFormVisible: false,
                buyerList: [],
                status:{
                    "0": "待审核",
                    "2": "启用",
                    "-1": "停用"
                },
                authStatus:{
                    "0":"未认证",
                    "1":"已认证"
                }
            }
        },
        components:{
            editTemp
        },
        watch:{
        },
        created(){
            this.getSupplierList()
        },
        methods:{
            handlePageChange(e){
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.getSupplierList()
            },
            edit(e){
                this.editValue = e;
                this.dialogFormVisible = true
            },
            newList(){
                this.editValue = {};
                this.dialogFormVisible = true
            },
            //
            confirm(){
                this.dialogFormVisible = false;
                this.editSupplier()
            },
            // 查询采购商列表
            getSupplierList() {
                this.request.getSupplierList({pageSize: this.pageSize, pageNo: this.pageNo}).then(res => {
                    if (res.code == 200) {
                        this.buyerList = res.ext.list;
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到采购商列表：" + res.msg)
                    }
                })
            },
            editSupplier(){
                this.request.editSupplier({...this.editValue}).then( res => {
                    if( res.code === 200){
                        this.$message.success("编辑成功！")
                    }else{
                        this.$message.warning("编辑失败：" + res.msg)
                    }
                    this.getSupplierList()
                })
            },
            deleteSupplier(id){
                this.$confirm("您确认要删除该店铺？").then(_ => {
                    this.request.deleteSupplier({id}).then( res => {
                        if( res.code === 200){
                            this.$message.success("删除成功！")
                            this.getSupplierList()
                        }else{
                            this.$message.warning("删除失败：" + res.msg)
                        }
                    })
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
