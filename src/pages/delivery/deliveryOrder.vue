<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 配送订单查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->
        <div class="container">
            <div class="handle-box">
                店铺：<el-select class="input" v-model="planListModel.shopId" placeholder="请选择你要查询的订单状态">
                    <el-option
                    v-for="item in shopList"
                    :key="item.id"
                    :label="item.shopName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                片区：<el-select class="input" v-model="planListModel.districtArea" placeholder="请选择你要查询的订单状态">
                    <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">    
                配送员：<el-select class="input" v-model="planListModel.deliveryManId" placeholder="请选择你要查询的订单状态">
                    <el-option
                    v-for="item in deliveryManList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                <div style="display:inline">
                    <span class="demonstration">订单日期：</span>
                    <el-date-picker
                        v-model="date"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <el-button type="primary" icon="search" @click="getOrderList">查询</el-button>
            </div>
        </div>
        <div class="container marginTop">
            <el-table v-loading="loading" :data="orderList" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column prop="goodsNames" label="商品详情">
                </el-table-column>
                <el-table-column prop="deliveryManName" label="配送员">
                </el-table-column>
                <el-table-column prop="receiverMobile" label="配送员电话" >
                </el-table-column>
                <el-table-column label="配送次数/总次数">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.finishTimes}}/{{scope.row.totalTimes}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="planGenStatus" label="配送计划生成状态">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            原因：
                            <p> {{ scope.row.planGenDesc }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.planGenStatus }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="planGenDesc" label="描述">
                </el-table-column>
                <el-table-column prop="deliveryType" label="配送方式">
                </el-table-column>
                <el-table-column prop="memberName" label="客户姓名">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>姓名: {{ scope.row.memberName }}</p>
                            <p>电话: {{ scope.row.receiverMobile }}</p>
                            <p>住址: {{ scope.row.address }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.memberName }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                        <div>
                            <!-- <el-button type="text" @click="openDialogModify( scope.$index, scope.row.orderId)">查看配送计划</el-button> -->
                            <el-button type="text" @click="newPlan( scope.$index, scope.row.orderId)">重新生成配送计划</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="planListModel.pageNo" :page-sizes="[30, 40, 50]"
                    layout="sizes, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import dic from "../../utils/dictionary.js";
    import request from "./index.js"
   
        

    export default {
        name: 'basetable',
        data() {
            return {
                loading:false,
                payStatusOpt:dic.payStatus,
                model:{
                    payStatus: "",
                    orderTime:""
                },
                request: new request(),
                planListModel:{
                    pageNo: "1",
                    pageSize: "30",
                    shopId: "",
                    districtArea: "",
                    communityId: "",
                    deliveryManId: "",
                },
                //订单列表
                orderList:[],
                date: [],
                //店铺列表
                shopList: [],
                //片区列表
                areaList: [],
                //配送员列表
                deliveryManList: [],
                total: 0,
                //待生成的配送计划id
                orderId: ""
            }
        },
        created(){
            setTimeout(() => {
                this.getShopList()
                this.getAreaList()
                this.getDeliveryManList()
            }, 0);
            this.getOrderList()
        },
        mounted(){
        },
        computed:{
            listModel(){
                let obj = {
                    beginDate: this.date[0],
                    endData: this.date[1]
                }
                return Object.assign(obj, this.planListModel)
            }
        },
        methods: {
            /***
             * 页面交互
            */
            //查询店铺列表
            getShopList(){
                this.fetchShopList().then(res=>{
                    if(res.code == 200){
                        this.shopList = res.ext;
                        this.shopList.push({id:"",shopName:"全部"})
                    }
                })
            },
            //查询片区列表
            getAreaList(){
                this.fetchAreaList().then(res=>{
                    if(res.code == 200){
                        this.areaList = res.list;
                        this.areaList.push({ id:"", name:"全部"})
                    }
                })
            },
            //查询配送员列表
            getDeliveryManList(){
                this.fetchDeliveryManList().then(res=>{
                    if(res.code == 200){
                        this.deliveryManList = res.ext;
                        this.deliveryManList.push({ id:"", realName:"全部"})
                    }
                })
            },
            //获取订单列表
            getOrderList(){
                this.loading = true;
                this.fetchDeliveryOrderList().then(res=>{
                    if(res.code == 200){
                        this.total = res.totalRows;
                        this.orderList = res.list;
                    }
                }).finally(()=>{
                    this.loading = false;
                })
            },
            //重新生成配送计划
            newPlan(index,orderId){
                this.orderId = orderId;
                this.genDeliveryPlan().then(res=>{
                    if(res.code == 200){
                        this.$utils.showSuccess(this,"重置成功！")
                    }else{
                        this.$utils.showError(this,res.msg)
                    }
                })
            },
            //处理table大小切换
            handleSizeChange(pageSize){
                this.planListModel.pageSize = pageSize;
                this.getOrderList();
            },
            //页面切换处理
            handleCurrentChange(pageNo){
                this.planListModel.pageNo = pageNo;
                this.getOrderList();
            },
            /******
             * 网络请求
            */
            //查询店铺列表
            fetchShopList(){
                return this.request.fetchShopList()
            },
            //查询片区列表
            fetchAreaList(){
                return this.request.fetchAreaList({pageNo:1,pageSize:100})
            },
            //查询配送员列表
            fetchDeliveryManList(){
                return this.request.fetchDeliveryManList()
            },
            //查询配送订单列表
            fetchDeliveryOrderList(){
                return this.request.fetchDeliveryOrderList(this.listModel)
            },
            //重新生成配送计划
            genDeliveryPlan(){
                return this.request.genDeliveryPlan({orderId:this.orderId})
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
    .order-table-body {
    font-size: 12px
}
.order-table-row-hd {
    padding-top: 20px;
    padding-bottom: 5px;
}
.order-table-row-ft {
    padding: 10px 14px;
    background: #eff6ff;
}

/* 商品信息 */
.order-goods-info {
    display: flex;
}
.order-goods-info img{
    width: 80px;
    height: 80px;
    border: 1px solid #e4e4e4;
}
.order-goods-content {
    flex: 1;
    padding: 0 10px;
}
.order-goods-price {
    width: 150px;
    padding: 0 10px;
    text-align: right;
}
.order-price {
    text-align: center;
}
.order-total-price {
    font-size: 14px;
    color: #ed5248;
}
.mr10 {
    margin-right: 10px;
}
.cl999 {
    color: #999;
}
.ml14{
    margin-left: 14px;
}
.txt-center {
    text-align: center;
}
.order-table-header .el-table td {
    border-bottom-width: 2px;
    border-bottom-color: #409EFF;
}

.order-operation .el-button {
    padding: 0px;
}
</style>
