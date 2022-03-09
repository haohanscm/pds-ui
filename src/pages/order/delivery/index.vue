<template>
    <div>
        <div class="title">
            <el-form @submit.native.prevent :inline="true">
                <el-form-item label="送货日期:">
                    <el-date-picker
                        v-model="deliveryTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        :default-value="new Date()"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="批次:">
                    <el-select v-model="buySeq" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采购商:">
                    <buyer-check v-model="buyerId"></buyer-check>
                </el-form-item>
                <el-form-item label="司机:">
                    <el-select v-model="driver" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in drivers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="checkSupplierList" type="primary">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="goodsReceived" type="primary">确认已送达</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
            :data="orderList"
            border
            style="width: 100%">
                <el-table-column
                type="index"
                width="50">
                </el-table-column>

                <el-table-column prop="buyerName" label="采购商名称">
                </el-table-column>

                <el-table-column prop="contact" label="联系人" width="100px">
                </el-table-column>

                <el-table-column prop="telephone" label="联系电话" width="100px">
                </el-table-column>

                <el-table-column prop="address" label="地址">
                </el-table-column>

                <el-table-column prop="deliveryTime" label="批次">
                    <template slot-scope="">
                        <div>{{options[buySeq].label}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="genPrice" label="配送状态">

                    <template slot-scope="scope">
                        <div>{{deliveryStatus[scope.row.status].label}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDeliveryClick(scope.row,scope.$index)">送货单明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="background-color: #fff;text-align: right;">
                <my-pagination
                :page-size="elPagination.pageSize"
                :current-page="elPagination.pageNo"
                :total="total"
                :page-sizes="[10,20,30,40]"
                @pagechange="handlePageChange">
                </my-pagination>

            </div>
            <el-dialog title="送货单" :visible.sync="deliveryTableVisible" width="840px">
                <v-delivery
                v-if="deliveryTableVisible"
                v-model="deliveryTitle"
                :delivery-date="deliveryTime"
                :buy-seq="buySeq"
                :truckNo="truckNo"></v-delivery>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import excel from "../../../utils/exportExcel.js";
    import request from "../request.js";
    import vDelivery from "./delivery.vue";
    export default {
        data: function(){
            return {
                request: new request(),
                buySeq: "0",
                options: this.$dic.buySeqOptions,
                deliveryStatus: this.$dic.deliveryStatus,
                elPagination: {
                    pageSize: 20,
                    pageNo: 0
                },
                dialogTableVisible: false,
                deliveryTableVisible: false,//送货单模态框
                deliveryTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                orderList: [],
                trucks: [],
                total: 0,
                driver: "",
                buyerId: "",
                truckNo: "",
                drivers: [],
                deliveryTitle: {},
                deliveryList: []
            }
        },
        components:{
            vDelivery
        },
        watch:{
            "delivery":{
                handler(){

                },
                deep: true
            }
        },
        created(){
            // this.truckList()
            this.truckBuyerList()
            this.driverList()
        },
        methods:{
            exportExcel(){
                excel.getExcel("ddd","","供应单.xls","bb")
            },
            checkSupplierList(){
                this.truckBuyerList()
            },
            //送货单模态框
            handleDeliveryClick(item, index){
                this.deliveryTitle = item;
                this.deliveryTableVisible = true;
            },
            handlePageChange(e){
                this.elPagination = e;
                this.truckBuyerList();
            },


            //获取采购单列表
            truckBuyerList(){
                this.request.truckBuyerList({
                    deliveryDate: this.deliveryTime,
                    buySeq: this.buySeq,
                    driverId: this.driver,
                    buyerId: this.buyerId,
                    ...this.elPagination
                }).then(res => {
                    if(res.code == 200){
                        this.orderList = res.list;
                        this.total = res.totalRows;
                        this.$message.success( res.msg)
                    }else{
                        this.orderList = [];
                        this.total = 0;
                        this.$message.warning( res.msg)
                    }
                })
            },
            //获取配送单
            truckList(){
                this.request.truckList().then(res => {
                    if(res.code == 200){
                        this.trucks = res.ext;
                    }else{
                        this.trucks = [];
                    }
                })
            },
            //获取司机列表
            driverList(){
                this.request.driverList().then(res => {
                    if(res.code == 200){
                        this.drivers = res.ext;
                    }else{
                        this.drivers = []
                    }
                })
            },
            // 确认送达
            goodsReceived(){
                this.$confirm(`您确认${this.deliveryTime + this.options[this.buySeq].label}的货已全部接收？`).then( res => {
                    this.request.goodsReceived({
                        deliveryTime: this.deliveryTime,
                        buySeq: this.buySeq
                    }).then(res => {
                        if( res.code === 200){
                            this.$message.success( res.msg)
                        }else{
                            this.$message.warning( res.msg)
                        }
                    })
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .title{
        display: flex;
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
    }
    .title>div{
        margin-left: 10px;
    }
    .bc-yellow{
        background-color: rgb(255, 192, 0)
    }
    td{
        border: 0 1px 1px 0;
        padding: 0;
    }
    caption{
        padding: 8px;
        background-color: rgb(112, 173, 71);
        font-weight: 800;
    }
    table{
        width: 100%;
    }
    table.gridtable {
        font-family: verdana,arial,sans-serif;
        font-size: 11px;
        color:#333333;
        border-width: 1px;
        border-color: #666666;
        border-collapse: collapse;
    }
    table th {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #666666;
        background-color: #dedede;
    }
    table td {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #666666;
        background-color: #ffffff;
    }
</style>
