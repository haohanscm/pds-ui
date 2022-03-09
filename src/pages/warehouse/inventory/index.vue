<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 商品盘点</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 编辑弹出框 -->
        <div class="container">
            <div class="handle-box">
                选择仓库：<el-select class="input" v-model="warehouseId" 
                            placeholder="请选择仓库">
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
                @click="_fetchInventoryList" 
                icon="search">查询
                </el-button>
            </div>
        </div>
        <div class="container marginTop">
            <el-table id="aa" 
                v-loading="loading" 
                :data="inventoryList" border 
                style="width: 100%" 
                ref="multipleTable" max-height="600">
                <el-table-column type="index">
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称">
                </el-table-column>
                <el-table-column prop="attr" label="规格">
                </el-table-column>
                <el-table-column prop="unit" label="单位" >
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库">
                </el-table-column>
                <el-table-column prop="stockNum" label="库存数量">
                </el-table-column>
                <el-table-column prop="price" label="价格" >
                </el-table-column>
                <el-table-column prop="instockTime" label="入库时间" >
                </el-table-column>
                <el-table-column prop="lastInventoryTime" label="上次盘点时间">
                </el-table-column>
                <el-table-column prop="order_info" label="操作">
                    <template slot-scope="scope">
                        <el-button 
                            type="text" icon="search" 
                            @click="adjust(scope.row)">数量调整
                        </el-button>
                        <el-button 
                            type="text" icon="search" 
                            @click="fetchCheckList(scope.row.id)">盘点记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="盘点记录" 
            :visible.sync="dialogTableVisible">
                <el-table :data="goodsList">
                    <el-table-column 
                    property="origNum" 
                    label="原有库存">
                    </el-table-column>
                    <el-table-column 
                    property="modifyNum" 
                    label="修改数量" >
                    </el-table-column>
                    <el-table-column 
                    property="operator" 
                    label="操作人员">
                    </el-table-column>
                    <el-table-column 
                    property="checkTime" 
                    label="盘点时间" 
                    width="200">
                    </el-table-column>
                </el-table>
                    
                <div slot="footer" class="dialog-footer">
                    <el-button 
                    type="primary" 
                    @click="dialogTableVisible = false">确 定
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog 
            title="数量盘点" width="600px" 
            :visible.sync="dialogTableVisible2">
                <el-form>
                    <el-form-item 
                    label="商品名称" 
                    :label-width="'80px'">
                        <el-input disabled 
                        v-model="checkedItem.goodsName" 
                        autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="原有库存" 
                        label-width="'80px'">
                        <el-input disabled 
                            v-model="checkedItem.stockNum" 
                            autocomplete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="修改数量" 
                        :label-width="'80px'">
                        <el-input 
                            v-model="checkNum" 
                            autocomplete="off">
                            </el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogTableVisible2 = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAjust">确 定</el-button>
                </div>
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

<script scoped>
    import dic from "../../../utils/dictionary.js";
    import request from "../request.js"
    export default {
        name: 'basetable',
        data() {
            return {
                request: new request(),
                loading: false,
                elPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                total: 0,
                inventoryList: [],
                checkedItem: {},
                warehouseList: [],//
                payStatusOpt: dic.payStatus,
                dialogTableVisible: false, // 盘点记录模态框布尔值
                dialogTableVisible2: false, //数量调整
                checkNum: 0, //盘点数量
                warehouseId: "",
                checkListId:"",//查看盘点及记录是所用的id
                goodsList: [],//盘点记录列表
                model:{
                    payStatus: "",
                    orderTime: ""
                }
            }
        },
        created(){
            this._fetchInventoryList()
            this._fetchWarehouseList()
        },
        computed:{
            //数量调整时的传参
            adjustModel(){
                return {
                    stockNum: this.checkNum,
                    warehouseStockId: this.checkedItem.id
                }
            },
            //记录盘点时的传参
            checkedListModel(){
                return {
                    warehouseStockId: this.checkListId
                }
            }
        },
        methods:{
            /**
             * 网页操作
             */
            handleSizeChange(e){
                this.elPagination.pageSize = e;
                this._fetchInventoryList()
            },
            handleCurrentChange(e){
                this.elPagination.pageNo = e;
                this._fetchInventoryList()
            },

            /**数量确认 */
            confirm(id){
                this.$utils.confirm(this, "你确认和仓库数量一致了吗？").then(() => {
                    this._checkConfirm(id);
                })
            },
            /**数量调整 */
            adjust(item){
                this.checkedItem = item;
                this.dialogTableVisible2 = true;
            },
            /**用户修改点确认 */
            confirmAjust(){
                if(!this.checkNum){
                    this.$message.error("输入修改后的数量！")
                }else{
                    this._editInventory();
                    this.dialogTableVisible2  = false;
                }
            },
            /**查看盘点记录 */
            fetchCheckList(id){
                this.dialogTableVisible = true;
                this.checkListId = id;
                this._findGoodsCheckPage();
            },

            /**
             * 网络请求
             */
            /**获取记录列表 */
            _fetchInventoryList(){
                this.request.fetchInventoryList({
                        warehouseId: this.warehouseId,
                        ...this.elPagination
                    }).then(res => {
                    if(res.code == 200){
                        this.inventoryList = res.list;
                        this.total = res.totalRows;
                    }else{
                        this.inventoryList = [];
                        this.$message.error(res.msg)
                    }
                })
            },
            /**修改库存数量 */
            _editInventory(){
                this.request.editInventory(this.adjustModel).then(res => {
                    if(res.code == 200){
                        this.$message.success("调整成功！")
                        this._fetchInventoryList()
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            /**数量确认 */
            _checkConfirm(id){
                this.request.checkConfirm({ warehouseStockId: id}).then(res => {
                    if(res.code == 200){
                        this.$message.success("盘点成功！")
                        this._fetchInventoryList();
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            /**盘点商品记录列表 */
            _findGoodsCheckPage(){
                this.request.findGoodsCheckPage(this.checkedListModel).then(res => {
                    if(res.code == 200){
                        this.goodsList = res.list;
                    }else{
                        this.goodsList = [];
                        this.$message.warning(res.msg)
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
