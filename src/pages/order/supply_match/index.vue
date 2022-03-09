<template>
    <div class="components-container">
        <div class="title">
           <div>
               <div class="block">
                   时间:
                    <el-date-picker
                    v-model="deliveryTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    :default-value="new Date()"
                    placeholder="选择日期">
                    </el-date-picker>
                </div>
            </div>
           <div>批次:<el-select v-model="buySeq" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            </div>
           <div>状态:<el-select v-model="status" placeholder="请选择">
                    <el-option
                        v-for="item in opt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div><el-button @click="getSummaryList" type="primary" >查询采购单</el-button></div>
            <div><el-button @click="shortcutCollect" type="primary"> 汇总采购单</el-button></div>
        </div>
        <div class="body">
        <div>
            <el-row>
                <el-col :span="10">
                    统一上浮报价：<el-input-number size="mini"
                            v-model="floatingRate"
                            :precision="2"
                            :step="0.01" :max="10"></el-input-number>
                </el-col>
                <el-col :span="6">
                    <el-button @click="supQuote" type="primary" v-if="isSelfPm == 'false'"> 一键供应商报价</el-button>
                </el-col>
            </el-row>
        </div>
        <div >
            <el-row>
                <el-col :span="4">
                    总销售额：{{(totalBuyerBillAmount).toFixed(2)}} 元
                </el-col>
                <el-col :span="4">
                    毛利：{{probableProfit}} 元
                </el-col>
                <el-col :span="4">
                    净利润：{{netProfit}} 元
                </el-col>
                <el-col :span="4">
                    毛利率：{{probableProfitPer}} %
                </el-col>
                <el-col :span="4">
                    净利率：{{netProfitPer}} %
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="4">
                    总重：{{totalWeight}} kg
                </el-col>
                <el-col :span="4">
                    总体积：{{totalVolume}} m^3
                </el-col>
            </el-row>
            <el-row style="line-height:32px;">
                <el-col :span="4">
                    运营成本：<div style="width:100px;margin-right:10px;">
                        <el-input v-model="operatingCost"></el-input>
                    </div> 元
                </el-col>
                <el-col :span="4">
                    物流成本：<div style="width:100px;margin-right:10px;">
                        <el-input v-model="logisticsCosts"></el-input>
                    </div> 元
                </el-col>
                <el-col :span="4">
                    商品成本：{{(goodsExpenditure).toFixed(2)}} 元
                </el-col>
                <el-col :span="4">
                    <el-button @click="sunmitTable" type="primary">提交修改信息</el-button>
                </el-col>
                <el-col :span="4">
                    <a class="el-button el-button--small el-button--primary"
                        id="bb" href @click="exportExcel">导出excel
                    </a>
                </el-col>
                <el-col :span="4"  v-if="!$constant.isPds">
                    <el-button @click="shortcutConfirm">交易确认</el-button>
                    <el-button @click="purchaseOrder" v-if="isSelfPm == 'true'">向供应商下单</el-button>
                </el-col>
            </el-row>
        </div>
        <div>
        <el-table
            v-loading="loading"
            :data="orderList"
            border
            stripe
            max-height="500"
            style="width: 100%">
            <el-table-column type="index" width="50" fixed>
            </el-table-column>

            <el-table-column prop="summaryOrderId" label="汇总单号" fixed>
            </el-table-column>

            <el-table-column prop="category" label="类别" width="80px">
            </el-table-column>

            <el-table-column prop="goodsName" label="名称" fixed width="120px">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" width="150">
                    <p>商品: {{ scope.row.goodsName }}</p>
                    <div slot="reference" class="name-wrapper">
                        <div class="goods-slot">{{ scope.row.goodsName }}</div>
                    </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column prop="goodsModel" label="规格" width="100px">
            </el-table-column>

            <el-table-column prop="unit" label="单位" width="50px">
            </el-table-column>

            <el-table-column prop="weight" label="重量(kg)" width="80px" >
            </el-table-column>

            <el-table-column prop="volume" label="体积(m^3)" width="80px">
            </el-table-column>

            <el-table-column prop="needBuyNum" label="需求数量">
            </el-table-column>

            <el-table-column prop="realBuyNum" label="实际采购数量">
            </el-table-column>

            <el-table-column prop="stockNum" label="库存">
            </el-table-column>

            <el-table-column prop="lossPercent" label="损耗比" width="80px">
            </el-table-column>

            <el-table-column prop="platformPrice" label="报价(元)">

                <el-table-column label="统一报价(销售均价)" width="150px">
                    <template slot-scope="scope">
                        {{scope.row.avgBuyPrice}}
                    </template>
                </el-table-column>
                <el-table-column label="采购商详情" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text"
                        @click="showBuyers(scope.row,scope.$index)">采购商({{scope.row.buyOrderDetailList.length}})</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="供应商详情" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text"
                        @click="showSupplier(scope.row, scope.$index)">供应商({{scope.row.supplierList1.length}})</el-button>
                    </template>
                </el-table-column>
            </el-table-column>

            <el-table-column prop="marketPrice" label="市场单价">
            </el-table-column>

            <el-table-column prop="avgBuyPrice" label="采购均价">
            </el-table-column>

            <el-table-column prop="avgSupplyPrice" label="供应均价">
                <template slot-scope="scope">
                    {{ + scope.row.avgSupplyPrice}}
                </template>
            </el-table-column>

            <el-table-column prop="supplierAmount" label="供应商应收账款">
                <template slot-scope="scope">
                    <el-button type="text">{{scope.row.supplierAmount}}</el-button>
                </template>
            </el-table-column>

            <el-table-column prop="buyerBillAmount" label="采购商应付账款">
                <template slot-scope="scope">
                    <el-button type="text">{{scope.row.buyerBillAmount}}</el-button>
                </template>
            </el-table-column>

            <el-table-column prop="profits" label="毛利润">
                <template slot-scope="scope">
                    {{ scope.row.profits}}
                </template>
            </el-table-column>

            <el-table-column label="状态" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text">{{statusOption[scope.row.status]}}</el-button>
                </template>
            </el-table-column>
        </el-table>

<!-- 打印的table -->
        <el-table
            id="ddd"
            v-loading="loading"
            :data="orderList"
            border
            stripe
            max-height="500"
            style="width: 100%;display: none">
            <el-table-column type="index" width="50">
            </el-table-column>

            <el-table-column prop="summaryOrderId" label="汇总单号" >
            </el-table-column>

            <el-table-column prop="category" label="类别" width="80px">
            </el-table-column>

            <el-table-column prop="goodsName" label="名称" width="120px">
            </el-table-column>

            <el-table-column prop="goodsModel" label="规格" width="100px">
            </el-table-column>

            <el-table-column prop="unit" label="单位" width="50px">
            </el-table-column>

            <el-table-column prop="needBuyNum" label="需求数量">
            </el-table-column>

            <el-table-column prop="realBuyNum" label="实际采购数量">
            </el-table-column>

            <el-table-column prop="lossPercent" label="损耗比" width="80px">
            </el-table-column>

            <el-table-column prop="avgBuyPrice" label="报价(元)">
            </el-table-column>

            <el-table-column prop="marketPrice" label="市场单价">
            </el-table-column>

            <el-table-column prop="avgBuyPrice" label="采购均价">
            </el-table-column>

            <el-table-column prop="avgSupplyPrice" label="供应均价">
            </el-table-column>

            <el-table-column prop="supplierAmount" label="供应商应收账款">
            </el-table-column>

            <el-table-column prop="buyerBillAmount" label="采购商应付账款">
            </el-table-column>

            <el-table-column prop="profits" label="毛利润">
            </el-table-column>

            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-button type="text">{{statusOption[scope.row.status]}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-box">
            <div></div>
            <my-pagination
            @pagechange="handlePageChange"
            :current-page.sync="pageNo"
            :page-sizes="[20, 30, 40, 50, 100, 200, 1000]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="total">
            </my-pagination>
        </div>
        </div>
            <my-drag v-if="visiable" v-model="buyPosition">
                <div slot="main">
                    <div style="float:right" @click="visiable = false">X</div>
                    <div class="report-title">
                        <div>汇总单号：{{buyOrderDetail.summaryOrderId}}</div>
                        <div>商品：{{buyOrderDetail.goodsName}}</div>
                        <div>实际采购数量：{{buyOrderDetail.realBuyNum}}</div>
                        <div>市场价格：{{buyOrderDetail.marketPrice}}</div>
                        <div>需求数量：{{buyOrderDetail.needBuyNum}}</div>
                        <div>实际采购数量：{{buyOrderDetail.realBuyNum}}</div>
                        <div>采购均价：{{buyOrderDetail.avgBuyPrice}}</div>
                        <div>供应均价：{{buyOrderDetail.avgSupplyPrice}}</div>
                    </div>
                    <v-buyer v-model="buyOrderDetail.buyOrderDetailList" >
                    </v-buyer><div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="visiable = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="closeBuyers">确定</el-button>
                    </div>
                </div>
            </my-drag>
        <my-drag v-if="supplierVisiable" v-model="supPosition">

            <div slot="main">
                <div style="float:right" @click="supplierVisiable = false">X</div>
                <div class="report-title">
                    <div>汇总单号：{{supplierOrderDetail.summaryOrderId}}</div>
                    <div>采购均价：{{supplierOrderDetail.avgBuyPrice}}</div>
                    <div>供应均价：{{supplierOrderDetail.avgSupplyPrice}}</div>
                    <div>需求数量：{{supplierOrderDetail.needBuyNum}}</div>
                    <div>商品：{{supplierOrderDetail.goodsName}}</div>
                    <div style="color:red">库存：{{supplierOrderDetail.stockNum}}</div>
                    <div>市场价格：{{supplierOrderDetail.marketPrice}}</div>
                    <div>实际采购数量：{{supplierOrderDetail.realBuyNum}}</div>
                </div>
                <v-supplier
                v-model="supplierOrderDetail.supplierList1"
                :original="supplierOrderDetail"
                :order-status="supplierOrderDetail.status">
                </v-supplier>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="supplierVisiable = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="closeSupplier">确定</el-button>
                </div>
            </div>
        </my-drag>
        </div>
    </div>
</template>

<script>
import excel from "../../../utils/exportExcel.js";
import vBuyer from "./buyer.vue";
import vSupplier from "./supplier.vue";
import * as math from 'mathjs';
import request from "../request.js";
import listFun from "./listConstructor";
import supplierVue from './supplier.vue';
import compute from './mixin.js'
export default {
    name: 'backToTop-demo',
    data() {
        return {
            request: new request(),
            deliveryTime: this.$utils.getDiffDate(1),
            buySeq: '0',
            options: this.$dic.buySeqOptions,
            opt: this.$dic.buyerOrderCheck,
            status: "",
            pageSize: 1000,
            pageNo: 1,
            total: 0,
            loading: false,
            statusOption: this.$dic.buyerOrderStatusOption,
            orderList: [],
            totalWeight: 0,
            totalVolume: 0,
            totalNeed: 0,
            netProfit: 0,//近利
            floatingRate: 0,
            probableProfit: 0,//毛利
            goodsExpenditure: 0,//货品支出--应向供应商付款
            operatingCost: 0,//运营成本
            logisticsCosts: 0,//物流成本
            totalBuyerBillAmount: 0,//总销售额
            supplierPopList: [],
            buyerPopList: [],
            buyOrderDetail: {},//采购商在拖拽框中的处理对象
            supplierOrderDetail:{},//供应商在拖拽框中的处理对象，这是对整个一条数据的处理
            visiable: false,
            supplierVisiable: false,//供应商报价弹窗控制
            buyPosition:{
                x: 600,
                y: 300
            },
            supPosition:{
                x:600,
                y:300
            },
            waitingList: [],
            isSelfPm: this.$utils.getCookie("isSelfPm")
        }
    },
    mixins: [compute],
    components:{
        vBuyer, vSupplier
    },
    created(){
        this.getSummaryList()
        this.getSupplierList()

    },
    mounted(){
    },
    methods:{
        //提交表格
        sunmitTable(){
            this.$confirm('本次提交仅提交当前页面的采购和报价，您确认提交？').then(() => {
                this.saveSupplierList()
                this.editBuyerList()
            })
        },
        //打开采购商报价
        showBuyers(item, index){
            this.buyOrderDetail = item;
            this.visiable = true;
        },
        //关闭采购商报价
        closeBuyers(){
            this.editOneBuyer();
            this.visiable = false;
        },
        //打开供应商报价
        showSupplier(item, index){
            this.supplierOrderDetail = item;
            this.supplierVisiable = true;
        },
        //关闭供应商报价
        closeSupplier(){
            this.saveOneSupplierList();
            this.supplierVisiable = false;
        },
        handlePageChange(e){
            this.pageSize = e.pageSize;
            this.pageNo = e.pageNo;
            this.getSummaryList()
        },
        exportExcel(){
            var str = "";
            this.opt.forEach(ele => {
                if(ele.value == this.status){
                    str = ele.label
                }
            })
            excel.getExcel("ddd","",this.deliveryTime
            + this.options[this.buySeq].label
            + str + "供应单.xls","bb")
        },
        // 一键供应商报价
        supQuote(){
            this.orderList.forEach( ele => {
                let arr1 = []; // 库存供应商
                let arr2 = []; // 商家供应商
                this.waitingList.forEach(ele => {
                    if(ele.supplierType === "1"){
                        arr1[0] = {...ele};
                    }else{
                        arr2[0] = {...ele};
                    }
                })
                if(ele.stockNum <= 0){
                    let arr3 = arr2;
                    if(arr2.length==0){
                        arr3 = arr1;
                    }
                    ele.supplierList1 = listFun.supplierOnce( arr3, ele, ele.realBuyNum);
                }else if(ele.stockNum >= ele.realBuyNum){
                    ele.supplierList1 = listFun.supplierOnce( arr1, ele, ele.realBuyNum);
                }else if(ele.stockNum < ele.realBuyNum){
                    let arr4 = listFun.supplierOnce( arr2, ele, ele.realBuyNum - ele.stockNum);
                    let arr5 = listFun.supplierOnce( arr1, ele, ele.stockNum);
                    ele.supplierList1 = [arr4[0],arr5[0]];
                }
            })
        },
        /**网络请求层 */
        //获取采购单汇总
        getSummaryList(){
            this.loading = true;
            this.request.getsummaryOrderList({
                deliveryDate: this.deliveryTime,
                status: this.status,
                buySeq:this.buySeq,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            }).then(res => {
                if(res.code == 200){
                    this.orderList = listFun.listConstruct(res.list);
                    this.buyOrderDetail = this.orderList[0];
                    this.supplierOrderDetail = this.orderList[0];//
                    this.total = res.totalRows;
                }else{
                    this.orderList = [];
                    this.$message.warning(res.msg)
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$message.warning(err)
            })
        },
        //提交报价单修改
        saveSupplierList(){
            this.loading = true;
            this.request.saveSupplierList({
                offerOrderList:listFun.offerOrderModelCon(this.orderList)
            }).then(res => {
                if(res.code == 200){
                    this.$message.success("操作成功！")
                    this.getSummaryList();
                }else{
                    this.$message.warning(res.msg);
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$message.warning("网络错误！")
            })
        },
        //提交总的采购单报价修改
        editBuyerList(){
            this.loading = true;
            this.request.editBuyerList( {detailList:listFun.buyOrderModelCon(this.orderList)}).then(res => {
                if(res.code == 200){
                    this.$message.success("操作成功！");
                    this.getSummaryList();
                }else{
                    this.$message.warning(res.msg);
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$message.warning("网络错误！")
            })
        },
        //提交单个采购报价单修改
        editOneBuyer(){
            this.loading = true;
            this.request.editBuyerList(
                    {detailList:listFun.buyOrderModelCon([this.buyOrderDetail])}
                ).then(res => {
                if(res.code == 200){
                    this.$message.success("操作成功！")
                }else{
                    this.$message.error(res.msg);
                    this.getSummaryList();
                }
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                this.$message.error("网络错误！")
                this.getSummaryList();
            })
        },
        //提交单个供应商报价单修改
        saveOneSupplierList(){
            this.loading = true;
            this.request.saveSupplierList(
                    {offerOrderList: listFun.offerOrderModelCon([this.supplierOrderDetail])}
                ).then(res => {
                if(res.code == 200){
                    this.$message.success("操作成功！");
                    this.supplierOrderDetail.supplierList1.forEach((ele, index) => {
                        ele.offerId = res.ext[index]
                    })

                }else{
                    this.$message.error(res.msg);
                }
                this.loading = false;
            }).catch(err => {
            this.loading = false;
                this.$message.error("网络错误！")
                this.getSummaryList();
            })
        },
        //采购单汇总  --- 君磊农产品 --- 多商家版
        shortcutCollect(){
            this.$confirm('您将要汇总采购单,是否继续?').then(() => {
                this.loading = true;
                this.request.shortcutCollect({
                    deliveryTime: this.deliveryTime,
                    buySeq: this.buySeq
                }).then(res => {
                    if(res.code == 200){
                        this.$message.success( "汇总成功!")
                    }else{
                        this.$message.warning( res.msg)
                    }
                this.loading = false;
                }).catch(err => {
                this.loading = false;
                    this.$message.error("网络错误！")
                    this.getSummaryList();
                })
            });
        },
        //交易确认  --- 君磊农产品 --- 多商家版
        shortcutConfirm(){
            this.$confirm('您确认已经完成了全部页面的商品报价?').then(() => {
                this.loading = true;
                this.request.shortcutConfirm({
                    deliveryTime: this.deliveryTime,
                    buySeq: this.buySeq
                }).then(res => {
                    if(res.code == 200){
                        this.$message.success( "交易确认成功！")
                    }else{
                        this.$message.warning( res.msg)
                    }
                this.loading = false;
                })
            });
        },
        purchaseOrder(){
            this.$confirm('您确认向供应商下单?').then(() => {
                this.loading = true;
                this.request.purchaseOrder({
                    deliveryDate: this.deliveryTime,
                    buySeq: this.buySeq
                }).then(res => {
                    if(res.code == 200){
                        this.$message.success( "下单成功！")
                    }else{
                        this.$message.warning( res.msg)
                    }
                    this.loading = false;
                })
            });
        },
        // 获取供应商列表
        getSupplierList(){
            this.request.getSupplierList().then(res => {
                if(res.code == 200){
                    this.waitingList = res.ext;
                    this.waitingList.forEach(ele => {
                        ele.supplyNum = 9999;
                        ele.minSaleNum = 0;
                    })
                }
            })
        },
    }
}
</script>

<style scoped lang="scss">
.placeholder-container div {
    margin: 10px;
}
.title{
    display: flex;
    background-color: white;
    padding: 10px;
    margin-bottom: 20px;
    > div{
        margin-left: 50px;
    }
}
.el-col{
    display: flex;
    margin-top: 10px;
}
.body{
    background-color: white;
    > div{
        padding: 10px;
    }
    .goods-slot{
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
    }
}
.report-title{
    display: flex;
    width: 650px;
    flex-wrap: wrap;
    div{
        width:25%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        line-height: 23px;
        color:#707276;
        font-weight: 590;
    }
}
.el-row{
    font-size: 14px;
    font-weight: 580;
    color: #808286;
}
.page-box{
    background-color: white;
    display: flex;
    justify-content: space-between;
}
</style>
