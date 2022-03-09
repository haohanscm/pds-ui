<template>
    <div>
        <div class="container">
            <div class="handle-box">
                调入店铺：<el-select class="input" 
                            v-model="checkDetailInId" 
                            placeholder="请选择你要调入的店铺">
                    <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                调出店铺：<el-select class="input" 
                            v-model="checkDetailOutId" 
                            placeholder="请选择你要调出的店铺">
                    <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                <el-button 
                type="primary" 
                @click="_fetchGoodsAllotList" 
                icon="search">查询</el-button>
            </div>
            <div class="handle-box">
                <el-button type="primary" icon="search" 
                @click="dialogTableVisible3 = true">新增调拨</el-button>
            </div>
        </div>
        <div class="container marginTop">
            <el-table v-loading="loading" 
                :data="allotList" border 
                style="width: 100%" 
                ref="multipleTable">
                <el-table-column prop="allotNum" label="单据编号" >
                </el-table-column>
                <el-table-column prop="allotinName" label="调入门店">
                </el-table-column>
                <el-table-column prop="allotoutName" label="调出门店">
                </el-table-column>
                <el-table-column prop="totalAmount" label="总金额" >
                </el-table-column>
                <el-table-column prop="auditStatus" label="审核状态">
                    <template slot-scope="scope">
                        {{orderStatus[scope.row.orderStatus]}}
                    </template>
                </el-table-column>
                <el-table-column prop="order_info" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" icon="search" 
                        @click="checkDetail(scope.row.id)">调拨商品列表</el-button>
                        <el-button v-show="scope.row.orderStatus < 3" 
                        type="text" icon="search" 
                        @click="confirmAllot(scope.row.id)">
                        确认调拨
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="新增调拨" width="60%;" :visible.sync="dialogTableVisible3">
                <v-warehouse @closeModal="closeChoose" v-model="warehouseList"></v-warehouse>
            </el-dialog>
            
            <el-dialog title="调拨详情" width="60%;" :visible.sync="dialogTableVisible2">
                <el-table :data="allotGoodList">
                    <el-table-column property="goodsName" label="商品名"></el-table-column>
                    <el-table-column property="price" label="价格"></el-table-column>
                    <el-table-column property="modelName" label="规格"></el-table-column>
                    <el-table-column property="goodsNum" label="数量"></el-table-column>
                    <el-table-column property="unit" label="单位"></el-table-column>
                    <el-table-column property="price" label="进价"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible2 = false">取 消</el-button>
                    <el-button type="primary" @click="dialogTableVisible2 = false">确 定</el-button>
                </span>
            </el-dialog>
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
    </div>
</template>

<script>
    import request from "../request.js";
    import vWarehouse from "./warehouse/index.vue"
    export default {
        name: 'goodsTransfer',
        components:{
            vWarehouse
        },
        data() {
            return {
                loading: false,
                request: new request(),
                elPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                orderStatus:{
                    "1":"审核中",
                    "3":"已调拨",
                },
                showHeader: false,
                allotGoodList: [],
                checkDetailInId: "",//调入店铺 查询用
                checkDetailOutId: "",//调出店铺 查询用
                allotList: [],//商品调拨列表
                checkList: [],//已选取的商品列表
                payStatusOpt: this.$dic.payStatus,
                orderTime:"",
                model:{
                    payStatus: "",
                    orderTime: ""
                },
                supplierList: [],//供应商列表
                warehouseList: [],//仓库列表
                warehouseId: "",//
                add:{
                    allotoutId: "",//调出仓库
                    allotinId: ""//调入仓库
                },
                supplierId: "",
                ware: "",
                dialogTableVisible3: false,
                dialogTableVisible2: false,
                goodsList: [],
                operateNode: "",//调拨备注
                total: 0,
                allotNum: this.$utils.strConstructor()
            }
        },
        created(){
            this._fetchGoodsAllotList();
            this._fetchSupplierList();
            this._fetchWarehouseList();
        },
        computed:{
            fetchGoods(){
                return {
                    warehouseId: this.add.allotoutId
                }
            },
            totalAmount(){
                let num = 0;
                this.checkList.forEach(ele => {
                    num += (ele.price * 100) * ele.num / 100
                })
                return num;
            }
        },
        methods: {
            /**
             * 页面操作
             */
            handleSizeChange(e){
                this.elPagination.pageSize = e;
                this._fetchGoodsAllotList()
            },
            handleCurrentChange(e){
                this.elPagination.pageNo = e;
                this._fetchGoodsAllotList()
            },
            checkDetail(id){
                this.dialogTableVisible2 = true
                this._queryTransferDetail(id)
            },
            search(){
                this.dialogTableVisible2 = true;
                this.dialogTableVisible3 = false;
                this._findStockGoodsPage()
            },
            handleSelectionChange(e){
                e.forEach(ele => {
                    ele.num = 0;
                })
                this.checkList = e;
            },
            handleItemRemove(index){
                this.checkList.splice(index, 1);
            },
            handleNumChange(item,index){
                this.$set(this.checkList,index,item)
            },
            //关闭调拨模态
            closeChoose(e){
                this.dialogTableVisible3 = e;
            },
            confirmAllot(id){
                this.$confirm('您确认要商品已完成调拨？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this._confirmGoodsTransfer({id})
                })
            },
            /**商品调拨列表 */
            _fetchGoodsAllotList(){
                this.request.fetchGoodsAllotList({
                    allotoutId: this.checkDetailOutId,
                    allotinId: this.checkDetailInId,
                    ...this.elPagination
                    }).then(res => {
                    if(res.code = 200){
                        this.allotList = res.list;
                        this.total = res.totalRows;
                    }else{
                        this.allotList = []
                    }
                })
            },
            /**查询供应商列表 */
            _fetchSupplierList(){
                this.request.fetchSupplierList().then( res => {
                    if( res.code == 200){
                        this.supplierList = res.list;
                    }
                })
            },
            /**查询仓库列表 */
            _fetchWarehouseList(){
                this.request.fetchWarehouseList().then( res => {
                    if( res.code == 200){
                        this.warehouseList = res.list;
                    }
                })
            },
            /**查看调拨详情 */
            _queryTransferDetail(id){
                this.request.queryTransferDetail({allotId: id}).then(res => {
                    if(res.code == 200){
                        this.allotGoodList = res.list
                    }
                })
            },
            /**查询仓库库存列表 */
            _findStockGoodsPage(){
                this.request.findStorageGoodsPage(
                        this.fetchGoods
                    ).then(res => {
                    if(res.code == 200){
                        this.goodsList = res.list;
                    }
                })
            },
            /**确认调拨 */
            _confirmGoodsTransfer(params = {}){
                this.request.confirmGoodsTransfer(params).then(res => {
                    if(res.code == 200){
                        this._fetchGoodsAllotList()
                        this.$message.success("操作成功！")
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
        }
    }

</script>
<style scoped>
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
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
    .item{
        flex: 1;
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

