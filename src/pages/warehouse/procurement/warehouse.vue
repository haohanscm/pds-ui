<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="search" @click="dialogFormVisible1 = true">新增仓库</el-button>
        </div>
        <el-table v-loading="loading" :data="warehouseList" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="name" label="仓库名称">
            </el-table-column>
            <el-table-column prop="warehouseNum" label="仓库编码" >
            </el-table-column>
            <el-table-column prop="manager" label="联系人" >
            </el-table-column>
            <el-table-column prop="contact" label="联系电话">
            </el-table-column>
            <el-table-column prop="address" label="仓库地址" >
            </el-table-column>
            <el-table-column prop="order_info" label="是否启用">
                <template slot-scope="scope">
                    <el-tooltip>
                        <el-switch
                            @change="changeStatus(scope.row)"
                            v-model="scope.row.status"
                            active-text="是"
                            inactive-text="否"
                            active-value="1"
                            inactive-value="0">
                        </el-switch>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="order_info" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editWarehouse(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteWarehouse(scope.row.id)">删除</el-button>
                    <el-button type="text" @click="viewInventory(scope.row.id,scope.row)">查看库存</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增仓库 -->
        <el-dialog title="新增仓库" width="600px" :visible.sync="dialogFormVisible1">
            <el-form :model="add" :rules="editRules" ref="add">
                <el-form-item prop="name" label="仓库名称" :label-width="'80px'">
                    <el-input v-model="add.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="contact" label="联系电话" :label-width="'80px'">
                    <el-input v-model="add.contact" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="manager" label="管理人员" :label-width="'80px'">
                    <el-input v-model="add.manager" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="仓库状态" :label-width="'80px'">
                    <el-select v-model="add.status" placeholder="请选择" width="100%">
                        <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="address" label="仓库地址" :label-width="'80px'">
                    <el-input v-model="add.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="subAddWarehouse">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑仓库" width="600px" :visible.sync="dialogFormVisible2">
            <el-form :model="edit" :rules="editRules" ref="edit">
                <el-form-item prop="name" label="仓库名称" :label-width="'80px'">
                    <el-input v-model="edit.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="contact" label="联系电话" :label-width="'80px'">
                    <el-input v-model="edit.contact" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="manager" label="管理人员" :label-width="'80px'">
                    <el-input v-model="edit.manager" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="仓库状态" :label-width="'80px'">
                    <el-select v-model="edit.status" placeholder="请选择" width="100%">
                        <el-option
                        v-for="item in status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="address" label="仓库地址" :label-width="'80px'">
                    <el-input v-model="edit.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="subEditWarehouse">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="库存列表" :visible.sync="dialogTableVisible3" width="1000px">
            <el-table :data="inventoryList"
                max-height="500"
            >
                <el-table-column
                    type="index"
                    width="50">
                    </el-table-column>
                <el-table-column property="goodsName" label="商品名" width="150"></el-table-column>
                <el-table-column property="attr" label="规格" width="100"></el-table-column>
                <el-table-column property="stockNum" label="库存" width="100"></el-table-column>
                <el-table-column property="unit" label="单位"></el-table-column>
                <el-table-column property="price" label="单价"></el-table-column>
                <el-table-column property="amount" label="金额"></el-table-column>
            </el-table>
            <div>
                <div style="display:flex">
                    <div style="flex:1">
                        仓库名称：{{checkedStuck.name}}
                    </div>
                    <div style="flex:1">
                        联系人：{{checkedStuck.manager}}
                    </div>
                </div>
                <div style="display:flex;margin-top:10px">
                    <div style="flex:1">
                        联系电话：{{checkedStuck.contact}}
                    </div>
                    <div style="flex:1">
                        地址：{{checkedStuck.address}}
                    </div>
                    <div style="flex:1">
                        <el-pagination
                            layout="prev, pager, next"
                            @size-change="handleWareSizeChange" 
                            @current-change="handleWareCurrentChange"
                            :page-size="elWarehousePagination.pageSize"
                            :page-no="elWarehousePagination.pageNo"
                            :total="50">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </el-dialog>
        <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="elPagination.pageNo" :page-sizes="[20, 30, 40]" :page-size="elPagination.pageSize"
                layout="sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import request from "../request.js"
    export default {
        name: 'tabs',
        data() {
            return {
                request: new request(),
                warehouseList: [],
                edit: {

                },
                loading: false,
                add: {},
                status:[
                    {
                        label: "启用",
                        value: "1"
                    },{
                        label: "未启用",
                        value: "0"
                    }
                ],
                elPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                elWarehousePagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                warehouseGoodsTypes: 0,
                editRules:{
                    name: [
                        { type: 'string', required: true, message: '请输入仓库名', trigger: 'change' }
                    ],
                    num: [
                        { type: 'string', required: false, message: '请输入仓库编码', trigger: 'change' }
                    ],
                    contact: [
                        { type: 'string', required: true, message: '请输入联系人电话', trigger: 'change' }
                    ]
                },
                total: 0,
                checkedId:"",//已选取的仓库id
                input: "",//商品搜索框传入的值
                inventoryList: [],//库存列表
                checkedStuck: {},
                dialogFormVisible1: false,//新增仓库
                dialogFormVisible2: false,//仓库编辑
                dialogTableVisible3: false, //查看库存
            }
        },
        created(){
            this._fetchWarehouse()
        },
        computed:{
            /**生成查询对象 */
            goodsModel(){
                return {
                    warehouseId: this.checkedId,
                    queryParams: this.input,
                    ...this.elWarehousePagination
                }
            }
        },
        methods: {
            /**
             * 页面操作
             */
            /**编辑仓库 */
            editWarehouse(item){
                this.edit = item;
                this.dialogFormVisible2 = true;
            },
            /**提交编辑后的信息 */
            subEditWarehouse(){
                this.$refs.edit.validate((valid) => {
                    if (valid) {
                        this._editWarehouse();
                        this.dialogFormVisible2 = false;
                    } 
                });
            },
            /**改变状态 */
            changeStatus(item){
                this.edit = item;
                this._editWarehouse();
                
            },
            /**查看库存 */
            viewInventory(id,item){
                this.dialogTableVisible3 = true;
                this.checkedId = id;
                this.checkedStuck = item;
                this._findStorageGoodsPage();
            },
            /**根据商品名、条形码搜索商品列表 */
            fetchGoods(){
                this._findStorageGoodsPage();
            },
            /**新增仓库 */
            subAddWarehouse(){
                this.$refs.add.validate((valid) => {
                    if (valid) {
                        this._addWarehouse();
                        this.dialogFormVisible1 = false;
                    } 
                });
            },
            /**删除仓库 */
            deleteWarehouse(id){
                this.$utils.confirm(this, "您将删除仓库，是否继续？").then(()=>{
                    this._deleteWarehouse(id)
                })
            },
            handleWareCurrentChange(e){
                this.elWarehousePagination.pageNo = e;
                this._findStorageGoodsPage()
            },
            handleWareSizeChange(e){
                this.elWarehousePagination.pageSize = e;
                this._findStorageGoodsPage()
            },
            handleSizeChange(e){
                this.elPagination.pageSize = e;
                this._fetchWarehouse()
            },
            handleCurrentChange(e){
                this.elPagination.pageNo = e;
                this._fetchWarehouse()
            },


            /**
             * 网络请求
             */
            /**查询仓库列表 */
            _fetchWarehouse(){
                this.request.fetchWarehouse(this.elPagination).then(res => {
                    if(res.code == 200){
                        this.warehouseList = res.list;
                        this.total = res.totalRows;
                    }
                })
            },
            /**编辑仓库 */
            _editWarehouse(){
                this.request.editWarehouse(this.edit).then(res => {
                    if(res.code == 200){
                        this.$message.success("修改成功！")
                        this._fetchWarehouse()
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            /**删除仓库 */
            _deleteWarehouse(id){
                this.request.deleteWarehouse({id: id}).then(res => {
                    if(res.code == 200){
                        this.$message.success("删除成功！")
                        this._fetchWarehouse()
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            },
            /**查看库存 */
            _findStorageGoodsPage(){
                this.request.findStorageGoodsPage(this.goodsModel).then(res => {
                    if(res.code == 200){
                        this.inventoryList = res.list;
                        this.warehouseGoodsTypes = res.totalRows;
                        this.input = ""
                    }else{
                        this.inventoryList = []
                        this.warehouseGoodsTypes = 0;
                    }
                })
            },
            /**添加仓库 */
            _addWarehouse(){
                this.request.addWarehouse(this.add).then(res=>{
                    if(res.code == 200){
                        this.$message.success("添加成功！")
                        this._fetchWarehouse()
                    }
                })
            }
        },
    }

</script>

<style scoped>
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