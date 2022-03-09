<template>
    <div>
        <div class="title">
            <el-row :gutter="10">
                <el-col :span="2.5">商家名称:</el-col>
                <el-col :span="4">
                    <el-input v-model="merchantName" clearable maxlength="20" placeholder="模糊查询" ></el-input>
                </el-col>
                <el-col :span="2.5">店铺名称:</el-col>
                <el-col :span="4">
                    <el-input v-model="shopName" clearable maxlength="20" placeholder="模糊查询"></el-input>
                </el-col>
                <el-col :span="1.5">状态: </el-col>
                <el-col :span="4">
                        <el-select v-model="selectStatus" clearable placeholder="请选择">
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="停用" value="-1"></el-option>
                        <el-option label="启用" value="2"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"><el-button type="primary" @click="getShopList">查询</el-button> </el-col>
                <el-col :span="2"><el-button type="primary" @click="addShop">新增</el-button> </el-col>
            </el-row>
        </div>
        <div>
            <el-table
            :data="shopList"
            border
            style="width: 100%">
                <el-table-column
                type="index"
                fixed
                width="50">
                </el-table-column>
                <el-table-column prop="name" label="店铺名称" fixed>
                </el-table-column>
                <el-table-column prop="address" label="店铺地址">
                </el-table-column>
                <el-table-column prop="merchantName" label="商家名称" fixed>
                </el-table-column>
                <el-table-column prop="manager" label="店铺负责人" width="100px">
                </el-table-column>
                <el-table-column prop="telephone" label="联系电话" width="100px">
                </el-table-column>
                <el-table-column prop="shopDesc" label="店铺描述">
                </el-table-column>
                <el-table-column prop="shopService" label="服务内容">
                </el-table-column>
                <el-table-column prop="isUpdateJisu" label="是否更新即速" width="100px">
                    <template slot-scope="scope">
                        <div>
                           {{scope.row.isUpdateJisu === "0" ? "否" : "是"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="认证状态" width="100px">
                    <template slot-scope="scope">
                        <div>
                           {{authStatus[scope.row.authType]}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="审核状态">
                    <template slot-scope="scope">
                        <div>
                           {{status[scope.row.status]}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px" fixed="right">
                    <template slot-scope="scope">
                        <div>
                           <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                           <!--<el-button type="text" @click="deleteShop(scope.row.id)">删除</el-button> -->
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
        <el-dialog title="店铺编辑" :visible.sync="dialogFormVisible">
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

    let shopInfo = function () {
        return {
            name: "",
            address: "",
            shopDesc: "",
            shopService: "",
            manager: "",
            telephone: "",
            isUpdateJisu: "",
            authType: "",
            status: ""
        };
    }

    export default {
        data: function(){
            return {
                pageSize: 20,
                pageNo: 1,
                total: 0,
                layout:"total, sizes, prev, pager, next, jumper",
                request: new Request(),
                editValue: shopInfo(),
                dialogFormVisible: false,
                shopList: [],
                merchantName:"",
                shopName:"",
                selectStatus:"",
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
            this.getShopList()
        },
        methods:{
            handlePageChange(e){
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo;
                this.getShopList();
            },
            edit(e){
                this.editValue = e;
                this.dialogFormVisible = true;
            },
            addShop(){
                this.editValue = shopInfo();
                this.dialogFormVisible = true;
            },
            //
            confirm(){
                this.editShop();
            },
            // 查询 店铺列表
            getShopList() {
                let params = {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    name: this.shopName,
                    merchantName: this.merchantName,
                    status: this.selectStatus
                };
                this.request.getShopList(params).then(res => {
                    if (res.code == 200) {
                        this.shopList = res.ext.list;
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到采购商列表：" + res.msg)
                    }
                })
            },
            editShop(){
                this.request.editShop({...this.editValue}).then( res => {
                    if( res.code === 200){
                        this.dialogFormVisible = false;
                        this.$message.success("编辑成功！");
                        this.getShopList();
                    }else{
                        this.$message.warning("编辑失败：" + res.msg)
                    }
                })
            },
            deleteShop(id){
                this.$confirm("您确认要删除该店铺？").then(_ => {
                    this.request.deleteShop({id}).then( res => {
                        if( res.code === 200){
                            this.$message.success("删除成功！")
                            this.getShopList()
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
