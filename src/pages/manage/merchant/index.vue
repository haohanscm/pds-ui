<template>
    <div>
        <div class="title">
            <el-row :gutter="10">
                <el-col :span="2.5">商家名称:</el-col>
                <el-col :span="4">
                    <el-input v-model="merchantName" clearable maxlength="20" placeholder="模糊查询"></el-input>
                </el-col>
                <el-col :span="2">联系人:</el-col>
                <el-col :span="4">
                    <el-input v-model="contact" clearable maxlength="20" placeholder="模糊查询"></el-input>
                </el-col>
                <el-col :span="1.5">状态: </el-col>
                <el-col :span="4">
                    <el-select v-model="selectStatus" clearable placeholder="请选择">
                        <el-option label="待审核" value="0"></el-option>
                        <el-option label="停用" value="-1"></el-option>
                        <el-option label="启用" value="2"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2"><el-button type="primary" @click="getMerchantList">查询</el-button> </el-col>
                <el-col :span="2"><el-button type="primary" @click="newList">新增</el-button> </el-col>
            </el-row>
        </div>
        <div>
            <el-table
            :data="buyerList"
            border
            style="width: 100%">
                <el-table-column
                type="index"
                fixed
                width="50">
                </el-table-column>

                <el-table-column prop="merchantName" label="商家名称" fixed>
                </el-table-column>
                <el-table-column prop="contact" label="联系人" width="100px">
                </el-table-column>

                <el-table-column prop="telephone" label="联系电话" width="100px">
                </el-table-column>

                <el-table-column prop="address" label="地址">
                </el-table-column>
                <el-table-column prop="status" label="启用状态">
                    <template slot-scope="scope">
                        <div>
                           {{status[scope.row.status]}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="bizDesc" label="业务介绍">
                </el-table-column>

                <el-table-column prop="industry" label="行业" width="100px">
                </el-table-column>



                <el-table-column label="操作" width="100px" fixed="right">
                    <template slot-scope="scope">
                        <div>
                           <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                           <!--<el-button type="text" @click="deleteMerchant(scope.row.id)">删除</el-button> -->
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
        <el-dialog title="商家编辑" :visible.sync="dialogFormVisible" width="70%">
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
    import editTemp from "./edit";

    let merchantInfo = function () {
        return {
            merchantName: "",
            address: "",
            contact: "",
            telephone: "",
            status: 0,
            industry: "",
            scale: "",
            bizDesc: "",
            pdsType: "",
            productLine: "",
            isAutomaticOrder: "",
            remarks: ""
        };
    };
    export default {
        data: function(){
            return {
                pageSize: 20,
                pageNo: 1,
                total: 0,
                layout:"total, sizes, prev, pager, next, jumper",
                request: new Request(),
                editValue: merchantInfo(),
                dialogFormVisible: false,
                buyerList: [],
                status:{
                    "0": "待审核",
                    "2": "启用",
                    "-1": "停用"
                },
                merchantName: "",
                contact: "",
                selectStatus: ""
            }
        },
        components:{
            editTemp
        },
        watch:{
        },
        created(){
            this.getMerchantList()
        },
        methods:{
            handlePageChange(e){
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.getMerchantList()
            },
            edit(e){
                this.editValue = e;
                this.dialogFormVisible = true
            },
            newList(){
                this.editValue = merchantInfo();
                this.dialogFormVisible = true
            },
            confirm(){
                // 默认设置
                if(!this.editValue.status){
                    this.editValue.status = 0;
                }
                if(!this.editValue.pdsType){
                    this.editValue.pdsType = "0";
                }
                if(!this.editValue.productLine){
                    this.editValue.productLine = "1";
                }
                if(!this.editValue.isAutomaticOrder){
                    this.editValue.isAutomaticOrder = "0";
                }
                if(this.editValue.merchantName && this.editValue.address && this.editValue.contact && this.editValue.telephone){
                    let params = JSON.parse(JSON.stringify(this.editValue));
                    // area user 处理
                    params.area = "";
                    if(this.editValue.area && this.editValue.area.id){
                        params.area = this.editValue.area.id;
                    }
                    params.user = "";
                    if(this.editValue.user && this.editValue.user.id){
                        params.user = this.editValue.user.id;
                    }
                    this.editMerchant(params);
                }else{
                    this.$message.error("商家必填信息未填写");
                }
                // console.log("edit",this.editValue);
            },
            // 查询商家列表
            getMerchantList() {
                let params = {
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    status: this.selectStatus,
                    contact: this.contact,
                    merchantName: this.merchantName
                };
                this.request.getMerchantList(params).then(res => {
                    if (res.code == 200) {
                        this.buyerList = res.ext.list;
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到采购商列表：" + res.msg)
                    }
                })
            },
            editMerchant(params){
                this.request.editMerchant(params).then( res => {
                    if( res.code === 200){
                        this.dialogFormVisible = false;
                        this.$message.success("编辑成功！")
                        this.getMerchantList()
                    }else{
                        this.$message.warning("编辑失败：" + res.msg)
                    }
                })
            },
            deleteMerchant(id){
                this.$confirm("您确认要删除该商家？").then(_ => {
                    this.request.deleteMerchant({id}).then( res => {
                        if( res.code === 200){
                            this.$message.success("删除成功！")
                            this.getMerchantList()
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
