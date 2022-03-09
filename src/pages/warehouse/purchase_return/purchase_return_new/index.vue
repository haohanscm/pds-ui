<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>新增退货</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->
        <!-- 编辑弹出框 -->
        

        <div class="container marginTop">
            <div class="handle-box">
                供应商：<el-select class="input" v-model="supplierId" placeholder="请选择你要查询的供应状态">
                    <el-option
                    v-for="item in supplierList"
                    :key="item.id"
                    :label="item.supplierName"
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
            <el-table :data="checkedList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="barCode" label="商品编码" >
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称">
                </el-table-column>
                <el-table-column prop="unit" label="单位" >
                </el-table-column>
                <el-table-column prop="price" label="单价" >
                </el-table-column>
                <el-table-column prop="attr" label="规格" >
                </el-table-column>
                <el-table-column prop="amount" label="总价格" >
                </el-table-column>
                <el-table-column prop="stockNum" label="数量" width="150">
                    <template  slot-scope="scope">
                        <el-input-number v-model="scope.row.stockNum" @change="handleNumChange(scope.row, scope.$index)" size="mini" :min="0" :max="scope.row.maxNum" label="描述文字"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="instockTime" label="入库时间" >
                </el-table-column>
                <el-table-column prop="lastInventoryTime" label="上次盘点时间">
                </el-table-column>
                <el-table-column prop="order_info" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="removeItem(scope.$index)">移除</el-button>
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
                    <el-button @click="handleCheckButton" type="primary">退货</el-button>
                </el-col>
            </el-row>
            <el-dialog
                title="选择你要退货的商品"
                :visible.sync="dialogVisible"
                width="50%"
                >
                <v-check-goods :warehouse-list="warehouseList" v-model="checkedList" :supplierId="supplierId"></v-check-goods>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
        
    </div>
</template>

<script>
    import vCheckGoods from "./check_goods.vue";
    import request from "../../request.js"
    export default {
        name: 'basetable',
        components:{ vCheckGoods },
        data() {
            return {
                categoryList: [],//分类列表
                payTypeOpt: this.$dic.payType,
                request: new request(),
                supplierId: "",//选取的要退货的供应商
                supplierList: "",//供应商列表
                dialogVisible: false,
                checkedList: [],//已选列表
                model:{
                    payStatus: "",
                    orderTime: ""
                },
                input2: "",
                warehouseList: [],
                payAmount: 0,//实付金额
                otherAmount: 0,//其它金额
                bizNote:"",//进货备注
                stockStatus: "",//入库状态
                payType: "",//zhifu类型
            }
        },
        created(){
            this._fetchSupplierList()
        },
        computed:{
            //总计金额
            totalAmount(){
                let totalAmount = 0;
                this.checkedList.forEach(ele => {
                    totalAmount += (+ele.amount);
                })
                return totalAmount
            },
            //合计金额
            sumAmount(){
                return (+this.totalAmount) + (+this.otherAmount)
            },
            //拼接退货model
            returnModel(){
                let procurementDetails = [];
                let goodsNum = 0;
                console.log(this.checkedList)
                this.checkedList.forEach(ele => {
                    ele.num = ele.stockNum;
                    goodsNum += ele.stockNum;
                    ele.id = ""
                })
                return {
                    supplierId: this.supplierId,
                    stockStatus: this.stockStatus,
                    totalAmount: this.totalAmount,
                    payAmount: this.payAmount,
                    sumAmount: this.sumAmount,
                    otherAmount: this.otherAmount,
                    payType: this.payType,
                    bizNote: this.bizNote,
                    detailList: this.checkedList
                }
            }

        },
        methods:{
            /**
             * 页面操作
             */
            handleSearchClick(){
                this.dialogVisible = true;
                this._fetchWarehouseList() 
            },
            handleNumChange(item,index){
                item.amount = ((+item.stockNum) * ((+item.price) *100)/100).toFixed(2) ;
                this.$set(this.checkedList,index,item)
            },
            removeItem(index){
                console.log(index)
                this.checkedList.splice(index, 1)
            },
            handleCheckButton(){
                this._addReturnDetail()
            },
            /**查询供应商列表 */
            _fetchSupplierList(){
                this.request.fetchSupplierList().then( res => {
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
            /**新增退货 */
            _addReturnDetail(){
                this.request.addReturnDetail(this.returnModel).then(res => {
                    if(res.code == 200){
                        this.$message.success("退货成功！");
                        this.checkedList = [];
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
    .el-col{
        margin: 10px 5px 0 5px;
        display: flex;
    }
    .flex-1{
        flex: 1
    }
</style>
