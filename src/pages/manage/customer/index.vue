<template>
    <div>
        <div class="title">
            <div style="display:flex">昵称: <el-input v-model="inquire.nickName" style="flex:1"></el-input>
            </div>
            <div><el-button type="primary" @click="getCustomerList">查询</el-button> </div>
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

                <el-table-column prop="appName" label="小程序名称">
                </el-table-column>

                <el-table-column prop="nickName" label="微信昵称" width="100px">
                </el-table-column>

                <el-table-column label="头像" width="80px">
                    <template slot-scope="scope">
                        <div>
                            <img style="width: 50px; height: 50px;" :src="scope.row.albumUrl" alt="">
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="性别">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.sex === "1" ? "男" : "女"}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="注册时间">
                </el-table-column>

                <el-table-column prop="updateDate" label="更新时间">
                </el-table-column>

                <!-- <el-table-column prop="address" label="地址">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div>
                           <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                        </div>
                    </template>
                </el-table-column> -->
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
    </div>
</template>

<script>
    import Request from "../request.js";
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
                inquire:{
                    nickName: ""
                }
            }
        },
        watch:{
        },
        created(){
            this.getCustomerList()
        },
        methods:{
            handlePageChange(e){
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.getCustomerList()
            },
            edit(e){
                this.editValue = e;
                this.dialogFormVisible = true
            },
            // 查询采购商列表
            getCustomerList() {
                this.request.getCustomerList({ ...this.inquire, pageSize: this.pageSize, pageNo: this.pageNo}).then(res => {
                    if (res.code == 200) {
                        this.buyerList = res.ext.list;
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到用户列表：" + res.msg)
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
