<template>
    <div>
        <div class="title">
            <el-form @submit.native.prevent :inline="true">
                <el-form-item label="采购商名称:">
                    <el-input v-model="buyerName" clearable placeholder="请输入采购商名称" style="max-width: 150px"></el-input>
                </el-form-item>
                <el-form-item label="联系人:">
                    <el-input v-model="contact" clearable placeholder="请输入联系人姓名" style="max-width: 150px"></el-input>
                </el-form-item>
                <el-form-item label="采购商家:">
                    <v-buyer-merchant v-model="merchantId"></v-buyer-merchant>
                </el-form-item>
                <el-form-item label="采购商类型:">
                    <el-select v-model="buyerType" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in $dic.pdsBuyerType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用:">
                    <el-select v-model="status" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in $dic.yesNoType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="fetchBuyerList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="newList">新增</el-button>
                </el-form-item>
            </el-form>
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

                <el-table-column prop="buyerName" label="采购商" fixed sortable>
                </el-table-column>

                <el-table-column prop="shortName" label="简称" sortable>
                </el-table-column>

                <el-table-column prop="contact" label="联系人" sortable>
                </el-table-column>

                <el-table-column prop="telephone" label="电话" sortable>
                </el-table-column>

                <el-table-column prop="payPeriod" label="账期" sortable>
                    <template slot-scope="scope">
                        {{!(scope.row.payPeriod) ?"":$dic.payPeriod[scope.row.payPeriod-1].label}}
                    </template>
                </el-table-column>

                <el-table-column prop="address" label="地址" sortable>
                </el-table-column>

                <el-table-column prop="merchantName" label="商家名称" sortable>
                </el-table-column>
                <el-table-column prop="buyerType" label="采购类型" min-width="80" sortable>
                    <template slot-scope="scope">
                        {{!(scope.row.buyerType) ?"":$dic.pdsBuyerType[scope.row.buyerType-1].label}}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="启用状态" sortable>
                    <template slot-scope="scope">
                        {{!(scope.row.status) ?"": $dic.yesNoType[scope.row.status].label}}
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="是否绑定微信" sortable>
                    <template slot-scope="scope">
                        {{!(scope.row.uid) ? "否" : "是"}}
                    </template>
                </el-table-column>

                <el-table-column prop="address" label="消息推送" sortable>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.needPush === "0" ? "否" : "是"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序值" sortable>
                </el-table-column>

                <el-table-column label="操作" width="80px" fixed="right">
                    <template slot-scope="scope">
                        <div>
                            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                            <!--<el-button type="text" @click="deleteBuyer(scope.row.id)">删除</el-button>-->
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
        <el-dialog title="采购商编辑" :visible.sync="dialogFormVisible" width="70%">
            <edit-temp :form="editValue"></edit-temp>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import Request from "../request.js";
    import editTemp from "./edit";
    import vBuyerMerchant from "./../../../components/common/buyer_merchant_select";

    let buyerInfo = function () {
        return {
            merchantId: "",
            buyerName: "",
            shortName: "",
            contact: "",
            telephone: "",
            address: "",
            sort: "",
            payPeriod: "",
            needPush: "",
            buyerType: "",
            needConfirmation: "",
            status: "",
            uid: "",
            remarks: ""
        };
    };
    export default {
        data: function () {
            return {
                pageSize: 20,
                pageNo: 1,
                total: 0,
                layout:"total, sizes, prev, pager, next, jumper",
                request: new Request(),
                editValue: buyerInfo(),
                dialogFormVisible: false,
                buyerList: [],
                status: {
                    "0": "待审核",
                    "2": "启用",
                    "-1": "停用"
                },
                merchantName: "",
                merchantId: "",
                buyerType: "",
                status: "",
                contact: "",
                selectStatus: ""
            }
        },
        components: {
            editTemp,
            vBuyerMerchant
        },
        watch: {},
        created() {
            this.fetchBuyerList()
        },
        methods: {
            handlePageChange(e) {
                this.pageSize = e.pageSize;
                this.pageNo = e.pageNo
                this.fetchBuyerList()
            },
            edit(e) {
                this.editValue = e;
                this.dialogFormVisible = true;
            },
            newList() {
                this.editValue = {};
                this.dialogFormVisible = true
            },
            //
            confirm() {
                this.dialogFormVisible = false;
                this.editBuyer()
            },
            // 查询采购商列表
            fetchBuyerList() {
                let params = {
                    status: this.selectStatus,
                    contact: this.contact,
                    buyerName: this.buyerName,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    // merchantName: this.merchantName,
                    merchantId: this.merchantId
                };
                this.request.getBuyerList(params).then(res => {
                    if (res.code == 200) {
                        this.buyerList = res.ext.list;
                        this.total = res.ext.count;
                    } else {
                        this.$message.warning("未查询到采购商列表：" + res.msg)
                    }
                })
            },
            editBuyer() {
                this.request.editBuyer({...this.editValue}).then(res => {
                    if (res.code === 200) {
                        this.$message.success("编辑成功！")
                        this.fetchBuyerList()
                    } else {
                        this.$message.warning("编辑失败：" + res.msg)
                    }
                })
            },
            deleteBuyer(id) {
                this.$confirm("您确认要删除该采购商？").then(_ => {
                    this.request.deleteBuyer({id}).then(res => {
                        if (res.code === 200) {
                            this.$message.success("删除成功！")
                            this.fetchBuyerList()
                        } else {
                            this.$message.warning("删除失败：" + res.msg)
                        }
                    })
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
    .el-row {
        margin-bottom: 10px;
    }

    .select-option {
        width: 100px;
    }

    .page-box {
        background-color: white;
        display: flex;
        justify-content: space-between;
    }
</style>
