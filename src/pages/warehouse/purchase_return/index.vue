<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 采购退货</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->
        <!-- 编辑弹出框 -->

        <div class="container marginTop">
            <div class="handle-box">
                <router-link to="/wareHouse/purchaseReturn_new">
                    <el-button type="primary" icon="search">新增退货</el-button>
                </router-link> 
            </div>
            <el-table v-loading="loading" :data="returnList" 
            border style="width: 100%" ref="multipleTable">
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="returnNum" label="单据编号" >
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商">
                </el-table-column>
                <el-table-column prop="goodsNum" label="数量" >
                </el-table-column>
                <el-table-column prop="sumAmount" label="合计金额" >
                </el-table-column>
                <el-table-column prop="bizTime" label="操作时间">
                </el-table-column>
                <el-table-column prop="order_info" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" 
                            @click="viewDetail(scope.row)">查看详情
                        </el-button>
                        <el-button type="text" 
                            @click="confirmReturn(scope.row)">确认退货
                        </el-button>
                        <el-button type="text" 
                            @click="deleteProcureReturn(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background 
                    @size-change="handleSizeChange" 
                    @current-change="handleCurrentChange"
                    :current-page.sync="elPagination.pageNo" 
                    :page-sizes="[20, 30, 40]" 
                    :page-size="elPagination.pageSize"
                    layout="sizes, prev, pager, next" 
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="查看库存" 
            :visible.sync="dialogTableVisible" 
            width="1000px">
            <el-row>
                <el-col :span="12">
                    供应商：{{checkedItem.supplierName}}
                </el-col>
                <el-col :span="12" >
                    操作时间：{{checkedItem.bizTime}}
                </el-col>
            </el-row>
            <el-table
            max-height="500" 
            :data="returnDetailList">
                <el-table-column type="index"></el-table-column>
                <el-table-column property="barCode" label="条形码" width="100">
                </el-table-column>

                <el-table-column property="goodsName" label="商品名" width="200">
                </el-table-column>

                <el-table-column property="attr" label="规格" width="100">
                </el-table-column>

                <el-table-column property="num" label="数量" width="100">
                </el-table-column>

                <el-table-column property="unit" label="单位">
                </el-table-column>

                <el-table-column property="price" label="单价">
                </el-table-column>
            </el-table>
            <div>
                <el-row>
                    <el-col :span="8">
                        总计金额：{{checkedItem.totalAmount}}
                    </el-col>
                    <el-col :span="8" >
                        合计金额：{{checkedItem.totalAmount}}
                    </el-col>
                    <el-col :span="8" >
                        实付金额：{{checkedItem.payAmount}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        备注信息：{{checkedItem.bizNote}}
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" 
                @click="dialogTableVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script scoped>
    import request from "../request.js"
    export default {
        name: 'basetable',
        data() {
            return {
                request: new request(),
                loading: false,
                payStatusOpt:this.$dic.payStatus,
                model:{
                    payStatus: "",
                    orderTime: ""
                },
                elPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                total: 0,
                checkedItem: {},
                returnList:[],
                dialogTableVisible: false,
                returnDetailList: []
            }
        },
        created(){
            this._fetchReturnPage()
        },
        methods:{
            /**
             * 网页操作
             */
            handleSizeChange(e){
                this.elPagination.pageSize = e;
                this._fetchReturnPage()
            },
            handleCurrentChange(e){
                this.elPagination.pageNo = e;
                this._fetchReturnPage()
            },
            viewDetail(item){
                this.dialogTableVisible = true;
                this.checkedItem = item;
                this._fetchReturnDetail(item.id)
            },
            confirmReturn(item){
                this.$confirm('您确认要将该订单进行退货？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._confirmReturn({id: item.id})
                })
            },
            deleteProcureReturn(item){
                this.$confirm('您确认要删除该退货单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._deleteProcureReturn({id: item.id})
                })
            },
            /**
             * 网络请求
             */
            /**查询退款列表 */
            _fetchReturnPage(){
                this.request.fetchReturnPage(this.elPagination).then(res =>{
                    if(res.code == 200){
                        this.returnList = res.list;
                        this.total = res.totalRows;
                    }
                })
            },
            /**退货清单 */
            _fetchReturnDetail(returnId){
                this.request.fetchReturnDetail({returnId: returnId,pageSize:1000}).then(res =>{
                    if(res.code == 200){
                        this.returnDetailList = res.list;
                    }else{
                        this.returnDetailList = [];
                    }
                }).catch(err =>{
                    this.returnList = [];
                })
            },
            /**新增退货 */
            _addReturnDetail(){
                this.request.addReturnDetail().then(res =>{
                    if(res.code == 200){
                    }
                })
            },
            // 
            _confirmReturn(){
                this.request.confirmReturn().then(res => {
                    if(res.code == 200){
                        this.$message.success("退货成功！")
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            },
            // 删除退货单
            _deleteProcureReturn(params = {}){
                this.request.deleteProcureReturn(params).then(res => {
                    if(res.code == 200){
                        this.$message.success("删除成功！")
                        this._fetchReturnPage()
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            }
        }
    }

</script>

<style scoped>
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
