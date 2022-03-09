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
                <el-button type="primary" icon="search" @click="getPlanList">查询</el-button>
            </div>
            <div class="handle-box">
                <el-dropdown>
                    <el-popover
                        v-model="visible1"
                        placement="right"
                        width="400"
                        trigger="click">
                        <div>
                            <el-radio v-for="item in deliveryManToCheck" v-model="faceTo" :label="item.id" :key="item.id">{{item.realName}}</el-radio>
                        </div>
                            
                            <el-button type="primary" style="margin-right: 30px; float:right" icon="search" @click="assignTo">确认</el-button>
                        <el-button type="primary" slot="reference">指派已标记订单给</el-button>
                    </el-popover>
                </el-dropdown>
            </div>
            <div class="delivery-nav">
                <div class="item">
                    <div class="item-title">今日配送总数</div>
                    <div class="item-cont">{{countData.totalNum}}</div>
                </div>
                <div class="item">
                    <div class="item-title">已配送订单数</div>
                    <div class="item-cont">{{countData.successNum}}</div>
                </div>
                <div class="item">
                    <div class="item-title">未配送订单数</div>
                    <div class="item-cont">{{countData.waitNum}}</div>
                </div>
                <div class="item">
                    <div class="item-title">待处理订单数</div>
                    <div class="item-cont">{{countData.failedNum}}</div>
                </div>
                <div class="item">
                    <div class="item-title">今日配送小区数</div>
                    <div class="item-cont">{{countData.communityNum}}</div>
                </div>
                <div class="item">
                    <div class="item-title">今日配送客户数</div>
                    <div class="item-cont">{{countData.memberNum}}</div>
                </div>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <div class="container marginTop">
            <el-table fit v-loading="loading" :data="planList" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column
                type="selection"
                width="55">
                </el-table-column>
                <el-table-column prop="theDay" label="配送日期" fit>
                </el-table-column>
                <el-table-column prop="shopName" label="店铺名称" fit>
                </el-table-column>
                <el-table-column prop="memberName" label="客户信息" fit>
                    <!-- <template slot-scope="scope">
                        <div>{{scope.row.memberName}}</div>
                        <div>{{scope.row.memberContact}}</div>
                    </template> -->
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="left">
                            <p>姓名: {{ scope.row.memberName }}</p>
                            <p>电话: {{ scope.row.memberContact }}</p>
                            <p>住址: {{ scope.row.address }}</p>
                            <el-button type="text" slot="reference">{{ scope.row.memberName }}</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="商品信息" min-width="300" fit>
                    <template slot-scope="scope">
                        <div>{{scope.row.goodsName + ' x ' + scope.row.goodsNum + (scope.row.goodsUnit ||'') + (scope.row.goodsInfo ||'')}}</div>
                        <div v-if="scope.row.giftName">{{scope.row.giftName + ' x 1' + (scope.row.giftUnit ||'') + (scope.row.giftInfo ||'')}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="deliveryManName" label="配送员姓名" fit>
                </el-table-column>
                <el-table-column prop="deliverManTel" label="配送员电话" fit>
                </el-table-column>
                <el-table-column prop="updateDate" label="更新时间" fit>
                </el-table-column>
                <el-table-column prop="pay_status" label="配送状态" fit>
                     <template slot-scope="scope">
                        <div>{{deliveryStatus[scope.row.status].label}}
                            <el-popover
                                v-model="visible2[scope.$index]"
                                placement="right"
                                width="400"
                                trigger="click">
                                <div>
                                    <el-radio v-for="item in deliveryStatus" v-model="checkedStatus" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                                </div>
                                    <el-button type="primary" style="margin-right: 30px; float:right" icon="search" @click="changeStatus(scope.$index, scope.row.id)">确认</el-button>
                                <el-button type="text" slot="reference">更改</el-button>
                            </el-popover>
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
    import vClassification from "../../components/page/classification.vue";
    import request from "./index.js"
    export default {
        name: 'basetable',
        components:{ vClassification },
        data() {
            return {
                payStatusOpt:dic.payStatus,
                deliveryStatus: dic.deliveryStatus,
                loading: false,
                //查询配送计划列表请求参数
                planListModel:{
                    pageNo: 1,
                    pageSize: 30,
                    shopId: "",
                    orderId: "",
                    goodsId: "",
                    districtArea: "",
                    communityId: "",
                    memberName: ""
                },
                //统计的数据
                countData:{},
                dialogVisible: false,
                //店铺列表
                shopList: [],
                //片区列表
                areaList: [],
                //配送员列表
                deliveryManList: [],
                //查询时间参数
                date: [],
                //计划列表
                planList: [],
                //已选配送计划列表
                planListChecked:[],
                //指派对象列表
                //指派弹窗控制参数
                visible1: false,
                //指派的配送员对象id
                faceTo: "",
                total: 0,
                /*更改配送计划部分页面控制参数*/
                //修改的配送计划状态
                checkedStatus:"1",
                checkedPlan:"",
                visible2: [],
                request: new request()
            }
        },
        created(){
            this.getCountData()
            this.getPlanList()
            setTimeout(() => {
                
                this.getShopList()
                this.getAreaList()
                this.getDeliveryManList()
            }, 0);
        },
        mounted(){
            for (let index = 0; index < 50; index++) {
                this.visible2.push(false)
            }
        },
        computed:{
            //计划查询model
            listModel(){
                let obj = {
                    beginDate: this.date[0],
                    endDate: this.date[1]
                }
                return Object.assign(obj, this.planListModel)
            },
            //订单指派model
            deliveryManChangeModel(){
                let deliveryPlanIds = [];
                for (let len = this.planListChecked.length - 1; len > -1; len--) {
                    deliveryPlanIds.push(this.planListChecked[len].id);
                }
                return {
                    deliveryPlanIds,
                    deliveryManId:this.faceTo
                }
            },
            //待指派的配送员列表
            deliveryManToCheck(){
                var arr = [];
                this.deliveryManList.forEach(( ele, index)=>{
                    if(ele.id && ele.id != this.planListModel.deliveryManId ){
                        arr.push(ele)
                    }
                })
                return arr;
            },
            //更改配送计划状态的model
            changePlanStatusModel(){
                return {
                    status: this.checkedStatus,
                    deliveryPlanId: this.checkedPlan
                }
            },
        },
        methods:{
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
                this.fetchDeliveryManList().then( res=>{
                    if(res.code == 200){
                        this.deliveryManList = res.ext;
                        this.deliveryManList.push({ id:"", realName:"全部"})
                    }
                })
            },
            //获取订单列表
            getPlanList(){
                this.loading = true
                this.deliveryPlanList().then(res=>{
                    if(res.code == 200){
                        this.total = res.totalRows;
                        this.planList = res.list;
                    }
                }).finally(_=>{
                    this.loading = false
                })
            },
            //处理选择
            handleSelectionChange(val){
                this.planListChecked = val;
            },
            //指派
            assignTo(){
                this.changeDeliveryMan().then(res=>{
                    if(res.code == 200){
                        this.$utils.showSuccess(this, "更改成功")
                        this.visible1 = false;
                    }else{
                        this.$utils.showErr(this, res.msg)
                        this.visible1 = false;
                    }
                })
                this.getPlanList()
            },
            //获取统计数据
            getCountData(){
                this.querySumaryCount().then(res=>{
                    if(res.code == 200){
                        this.countData = res.ext;
                    }
                })
            },
            //处理配送计划状态切换
            changeStatus(index, id){
                this.checkedPlan = id;
                this.changePlanStatus().then(res=>{
                    if(res.code == 200){
                        this.$utils.showSuccess(this, "更改成功")
                        this.$set(this.visible2,index,false)
                    }else{
                        this.$utils.showErr(this, res.msg)
                        this.$set(this.visible2,index,false)
                    }
                }).finally(_=>{
                    this.getPlanList()
                })
            },
            //处理table大小切换
            handleSizeChange(pageSize){
                this.planListModel.pageSize = pageSize;
                this.getPlanList();
            },
            //页面切换处理
            handleCurrentChange(pageNo){
                this.planListModel.pageNo = pageNo;
                this.getPlanList();
            },
            /**
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
            //查询配送计划列表
            deliveryPlanList(){
                return this.request.deliveryPlanList(this.listModel)
            },
            //改配送员
            changeDeliveryMan(){
                return this.request.changeDeliveryMan(this.deliveryManChangeModel)
            },
            //查询配送计划统计
            querySumaryCount(){
                return this.request.querySummaryCount()
            },
            //更改配送计划状态
            changePlanStatus(){
                return this.request.changePlanStatus(this.changePlanStatusModel)
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
    .delivery-nav{
        width: 90%;
        display: flex;
        margin: 80px auto 30px auto;
    }
    .item{
        flex: 1;
        margin: 0 20px 0 20px;
        border: 1px solid #eaeaea;
        box-shadow: 1px 1px #eaeaea;
    }
    .item-title{
        color:white;
        padding: 5px;
        background-color: rgba(34, 106, 223, 0.988);
        text-align: center;
    }
    .item-cont{
        text-align: center;
        padding: 25px;
        line-height: 100%;
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
