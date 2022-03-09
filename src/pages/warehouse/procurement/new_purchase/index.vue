<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 新增采购</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->
        <!-- 编辑弹出框 -->
        

        <div class="container marginTop">
            <div class="handle-box">
                供应商：<el-select class="input" v-model="checked.supplier" placeholder="选取供应商">
                    <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.supplierName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                仓库：<el-select class="input" v-model="checked.warehouse" placeholder="选择仓库">
                    <el-option
                    v-for="item in warehouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                <el-input
                    placeholder="输入商品条形码"
                    suffix-icon=""
                    v-model="input2">
                    <i @click="handleSearchClick" style="background-color: #eaeaea;margin-right:-10px" slot="suffix" class="el-input__icon el-icon-search">
                    </i>
                </el-input>
            </div>
            <div class="handle-box">
                <el-button type="primary" @click="handleSearchClick">搜索商品</el-button>
            </div>
            <el-table :data="checkedList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="goodsSn" label="商品编码" >
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称">
                </el-table-column>
                <el-table-column prop="modelPrice" label="单价" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.modelPrice" @change="handleModelPriceChange(scope.row, scope.$index)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="modelName" label="规格" >
                    <template slot-scope="scope">
                        <el-select class="input" v-model="scope.row.goodsModelId" placeholder="选择商品规格">
                            <el-option
                            v-for="item in scope.row.goodsModelList"
                            :key="item.id"
                            :label="item.modelName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="数量" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.num" @change="handleNumChange(scope.row, scope.$index)"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位">
                </el-table-column>
                <el-table-column prop="sumAmount" label="合计金额" >
                </el-table-column>
                <el-table-column prop="order_info" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="removeItem(scope.$index)">从列表移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="5">
                    总计金额：￥{{totalAmount}}
                </el-col>
                <el-col :span="5">
                    合计金额：￥{{sumAmount}}
                </el-col>
                <el-col :span="5">
                    实付金额：￥<el-input class="flex-1" v-model="payAmount"></el-input>
                </el-col>
                <el-col :span="5">
                    其他费用：￥<el-input class="flex-1" v-model="otherAmount"></el-input>
                </el-col>
                <el-col :span="6">
                    支付方式：<el-select class="flex-1" v-model="payType" placeholder="请选择你要查询的订单状态">
                                <el-option
                                v-for="item in payTypeOpt"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                </el-col>
                <el-col :span="6">
                    备注：<el-input class="flex-1" v-model="bizNote"></el-input>
                </el-col>
                <el-col :span="5">
                </el-col>
                <el-col :span="5">
                    <el-button @click="handleSaveButton" type="primary">保存</el-button>
                    <el-button @click="handleCheckButton" type="primary">入库并审核</el-button>
                        <el-button type="success">
                            <router-link to="../wareHouse/procurement">
                                <p style="color:white">返回</p> 
                            </router-link> 
                        </el-button>
                </el-col>
            </el-row>
            <el-dialog
                title="选择你要采购的商品"
                :visible.sync="dialogVisible"
                width="50%"
                >
                <goods-list @select="onSelectGoods"></goods-list>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        
    </div>
</template>

<script>
    // import dic from "../../utils/dictionary.js";
    import vCheckGoods from "./check_goods.vue";
    import request from "../../request.js";
    import goodsList from './components/goodsList.vue'
    export default {
        name: 'basetable',
        components:{ vCheckGoods, goodsList},
        data() {
            return {
                request: new request(),
                input2: "",
                supplierList: [],//下拉框 供应商列表
                warehouseList: [],//下拉框 仓库列表
                checkedList: [],//已选列表
                checked:{
                    supplier: "",
                    warehouse: ""
                },//选中的供应商和仓库
                payTypeOpt: this.$dic.payType,
                categoryList: [],
                totalCount:{

                },
                dialogVisible: false,
                ctrl:{
                    data:[
                        {
                            title: "1",//列表展示项
                            params: {
                                id: 1223
                            }//列表展示项参数
                        }
                    ],
                    request:"fun" //组件内部请求函数
                },//组件控制器
                payAmount: 0,//实付金额
                otherAmount: 0,//其它金额
                bizNote:"",//进货备注
                stockStatus: "",//入库状态
                payType: "09",//zhifu类型
            }
        },
        created(){
            this._fetchWarehouseList();
            this._fetchSupplierList();
        },
        computed:{
            //总计金额
            totalAmount(){
                let totalAmount = 0;
                this.checkedList.forEach(ele => {
                    totalAmount += +ele.sumAmount;
                })
                return totalAmount
            },
            //合计金额
            sumAmount(){
                return (+this.totalAmount) + (+this.otherAmount)
            },
            //拼接采购model
            procurementModel(){
                let procurementDetails = [];
                this.checkedList.forEach(ele => {
                    let modelName = "";
                    let id = ele.goodsModelId;
                    ele.goodsModelList.forEach( item => {
                        if( item.id === id){
                            ele.modelName = item.modelName
                            ele.goodsModelSn = item.goodsModelSn
                        }
                    })
                    procurementDetails.push({
                        goodsName: ele.goodsName,
                        goodsModelId: ele.goodsModelId,
                        price: ele.modelPrice,
                        goodsNum: ele.num,
                        modelName: ele.modelName,
                        sumAmount: ele.sumAmount,
                        goodsModelSn: ele.goodsModelSn,
                        unit: ele.unit,
                        category: ele.goodsCategoryId
                    })
                })
                return {
                    // procureNum: this.$utils.strConstructor(),
                    warehouseId: this.checked.warehouse,
                    supplierId: this.checked.supplier,
                    stockStatus: this.stockStatus,
                    totalAmount: this.totalAmount,
                    payAmount: this.payAmount,
                    sumAmount: this.sumAmount,
                    otherAmount: this.otherAmount,
                    payType: this.payType,
                    bizNote: this.bizNote,
                    detailList: procurementDetails
                }
            }
        },
        methods:{
            /**
             * 页面操作
             */
            handleSearchClick(){
                this.dialogVisible = true;
                this._fetchCategoryList();
            },
            handleNumChange(item, index){
                item.sumAmount = ((+item.num) * ((+item.modelPrice) *100)/100).toFixed(2) ;
                this.$set(this.checkedList,index,item)
            },
            handleModelPriceChange(item, index){
                item.sumAmount = ((+item.num) * ((+item.modelPrice) *100)/100).toFixed(2) ;
                this.$set(this.checkedList,index,item)
            },
            removeItem(index){
                this.checkedList.splice( index, 1)
            },
            handleSaveButton(){
                this.stockStatus = 0;
                this._addProcurement()
            },
            handleCheckButton(){
                this.stockStatus = 1;
                this._addProcurement()
            },
            onSelectGoods(goods) {
                this.checkedList.push(goods)
            },
            /**
             * 工具类
             */
            /**
             * 网络请求类
             */
            /**查询供应商列表 */
            _fetchSupplierList(){
                this.request.fetchSupplierList().then( res => {
                    console.log(res)
                    if( res.code == 200){
                        this.supplierList = res.ext;
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
            /**查询商品分类列表 */
            _fetchCategoryList(){
                this.request.fetchCategoryList().then( res => {
                    if( res.code == 200){
                        this.categoryList = res.ext;
                    }
                })
            },
            /**商品采购新增 */
            _addProcurement(){
                this.request.addProcurement(this.procurementModel).then( res => {
                    if( res.code == 200){
                        this.$message.success("新增采购成功！")
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
    .marginTop {
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
    .el-col{
        margin: 10px 5px 0 5px;
        display: flex;
    }
    .flex-1{
        flex: 1
    }
</style>
