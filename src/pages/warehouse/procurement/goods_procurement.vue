<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div style="display:inline">
                    <span class="demonstration">订单日期：</span>
                    <el-date-picker
                        type="daterange"
                        v-model="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <el-button type="primary" @click="checkOrder" icon="search" >查询</el-button>
            </div>
            <div class="handle-box">
                <router-link to="/wareHouse/newPurchase">
                    <el-button type="primary" icon="search">新增进货</el-button>
                </router-link> 
            </div>
        </div>
        <div class="container marginTop">
            <el-table v-loading="loading" 
            :data="procurementList" border 
            style="width: 100%" height="500" ref="multipleTable" >
                <el-table-column type="index" ></el-table-column>
                <el-table-column prop="procureNum" label="单据编号" >
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商">
                </el-table-column>
                <el-table-column prop="sumAmount" label="单价" >
                </el-table-column>
                <el-table-column prop="num" label="数量">
                </el-table-column>
                <el-table-column prop="totalAmount" label="合计金额" >
                </el-table-column>
                <el-table-column prop="payAmount" label="实付金额">
                </el-table-column>
                <el-table-column prop="stockStatus" label="入库状态">
                    <template slot-scope="scope">
                        {{stockStatusOp[+scope.row.stockStatus].label}}
                    </template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库">
                </el-table-column>
                <el-table-column prop="opTime" label="进货时间">
                </el-table-column>
                <el-table-column prop="order_info" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handeleDetail(scope.row)">查看详情</el-button>
                        <el-button type="text" @click="deleteOrder(scope.row)">删除</el-button>
                        <el-button v-if="scope.row.stockStatus  === '0'" type="text" @click="enterStock(scope.row)">入库</el-button>
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
                    layout="sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="采购明细" :visible.sync="dialogTableVisible" width="1000px">
            <el-row>
                <el-col :span="12">
                    供应商：{{checkedItem.supplierName}}
                </el-col>
                <el-col :span="12" >
                    操作时间：{{checkedItem.opTime}}
                </el-col>
            </el-row>
            <el-table :data="purchList"
            height="400">
                <el-table-column type="index" ></el-table-column>
                <el-table-column property="goodsName" label="商品名" width="200"></el-table-column>
                <el-table-column property="modelName" label="规格" width="100"></el-table-column>
                <el-table-column property="goodsNum" label="数量" width="100"></el-table-column>
                <el-table-column property="unit" label="单位"></el-table-column>
                <el-table-column property="price" label="单价"></el-table-column>
                <el-table-column property="sumAmount" label="金额"></el-table-column>
            </el-table>
            <div>
                <el-row>
                    <el-col :span="8">
                        总计金额：{{checkedItem.totalAmount}}
                    </el-col>
                    <el-col :span="8">
                        合计金额：{{checkedItem.totalAmount}}
                    </el-col>
                    <el-col :span="8">
                        实付金额：{{checkedItem.payAmount}}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        备注信息：{{checkedItem.bizNote}}
                    </el-col>
                    <el-col :span="12" >
                        <div class="pagination">
                            <el-pagination background 
                                @size-change="handleSizeChange2" 
                                @current-change="handleCurrentChange2"
                                :current-page.sync="goodsPage.pageNo" 
                                :page-sizes="[20, 30, 40]" 
                                :page-size="goodsPage.pageSize"
                                layout="sizes, prev, pager, next" :total="goodsTotal">
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import request from "../request.js";
    export default {
        data() {
            return {
                request: new request(),
                elPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                goodsTotal: 0,
                goodsPage:{
                    pageNo: 1,
                    pageSize: 20
                },
                procureNum: 0,
                total: 0,
                date: [],//日期区间
                loading: false,
                procurementList: [],
                purchList:[],//采购清单列表
                dialogTableVisible: false,
                checkedItem: {},//选中的条目
                payType: this.$dic.payType,
                stockStatusOp: this.$dic.stockStatusOp
            }
        },
        created(){
            this._fetchProcurement()
        },
        computed: {
        },
        methods: {
            /**
             * 网页操作
             */
            handleSizeChange(e){
                this.elPagination.pageSize = e;
                this._fetchProcurement()
            },
            handleCurrentChange(e){
                this.elPagination.pageNo = e;
                this._fetchProcurement()
            },
            handleSizeChange2(e){
                this.goodsPage.pageSize = e;
                this.fetchPurchaseDetail();
            },
            handleCurrentChange2(e){
                this.goodsPage.pageNo = e;
                this.fetchPurchaseDetail();
            },
            //查询采购单列表
            checkOrder(){
                this._fetchProcurement()
            },
            //
            deleteOrder(item){
                this.$confirm('您确认要删除采购单吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._deleteProcurement({id: item.id})
                })
            },
            enterStock(item){
                this.$confirm('您确认要将该采购单入库？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._enterStock({id: item.id})
                })
            },
            /**点击查看详情 */
            handeleDetail(item){
                this.dialogTableVisible = true;
                this.checkedItem = item;
                this.purchList = item.detailList;
                this.procureNum = item.procureNum;
                this.fetchPurchaseDetail()
            },

            /**查看采购列表 */
            _fetchProcurement(){
                let beginTime = this.date[0];
                let endTime = this.date[1];
                this.request.fetchProcurement({beginTime, endTime, ...this.elPagination}).then(res => {
                    if(res.code == 200){
                        this.procurementList = res.list;
                        this.total = res.totalRows
                    }else{
                        this.procurementList = [];
                        this.$message.warning(res.msg)
                    }
                })
            },
            //查看采购单明细
            fetchPurchaseDetail(){
                this.request.fetchPurchaseDetail({procureNum: this.procureNum, ...this.goodsPage}).then( res => {
                    if( res.code === 200){
                        this.purchList = res.list;
                        this.goodsTotal = res.totalRows
                    }else{
                        this.purchList = [];
                        this.goodsTotal = 0;
                        this.$message.warning( res.msg)
                    }
                })
            },
            //删除采购单
            _deleteProcurement(params = {}){
                this.request.deleteProcurement(params).then(res => {
                    if(res.code == 200){
                        this.$message.success("删除成功！")
                        this._fetchProcurement()
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            },
            _enterStock(params = {}){
                this.request.enterStock(params).then(res => {
                    if(res.code == 200){
                        this.$message.success("入库成功！")
                        this._fetchProcurement()
                    }else{
                        this.$message.warning(res.msg)
                    }
                }) 
            }
        }
    }

</script>
<style scoped>
    .dialog-footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
    .item{
        display: flex;
    }

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
    .delivery-nav{
        width: 100%;
        display: flex;
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