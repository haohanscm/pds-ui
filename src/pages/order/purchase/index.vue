<template>
    <div>
        <div class="title">
            <div>
               <div class="block">
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
            <div><el-button @click="checkSupplierList" type="primary">查询</el-button> </div>
        </div>
        <div>
            <el-table
            :data="orderList"
            border
            style="width: 100%">

                <el-table-column prop="buyId" label="采购单编号">
                </el-table-column>

                <el-table-column prop="buyerName" label="采购商" width="100px">
                </el-table-column>

                <el-table-column prop="contact" label="联系人" width="100px">
                </el-table-column>

                <el-table-column prop="telephone" label="联系电话" width="100px">
                </el-table-column>

                <el-table-column prop="buyTime" label="下单时间">
                </el-table-column>

                <el-table-column prop="deliveryTime" label="配送时间">
                </el-table-column>

                <el-table-column prop="genPrice" label="总价">
                </el-table-column>

                <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleTableClick(scope.row,scope.$index)">采购单明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="采购单" :visible.sync="dialogTableVisible" width="1200px">
                <v-detail v-model="detail"></v-detail>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import excel from "@/utils/exportExcel.js";
    import request from "../request.js";
    import vDetail from "./detail.vue";
    export default {
        data: function(){
            return {
                request: new request(),
                buySeq: 0,
                options: this.$dic.buySeqOptions,
                dialogTableVisible: false,
                deliveryTableVisible: false,//送货单模态框
                deliveryTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                orderList: [],
                detail:{},
                deliveryTitle: {},
                deliveryList: []

            }
        },
        components:{
            vDetail
        },
        watch:{
            "delivery":{
                handler(){

                },
                deep: true
            }
        },
        created(){
            this.fetchBuyOrderList()
        },
        methods:{
            handleTableClick(item, index){
                this.fetchSumList(item.buyId);
            },
            exportExcel(){
                excel.getExcel("ddd","","供应单.xls","bb")
            },
            checkSupplierList(){
                this.fetchBuyOrderList()
            },
            //送货单模态框
            handleDeliveryClick(item, index){
                this.deliveryTitle = item;
                this.deliveryTableVisible = true;
            },


            //获取采购单列表
            fetchBuyOrderList(){
                this.request.fetchBuyOrderList({deliveryDate: this.deliveryTime,buySeq:this.buySeq}).then(res => {
                    if(res.code == 200){
                        this.orderList = res.list
                    }else{
                        this.orderList = []
                    }
                })
            },
            //获取采购单汇总详情
            fetchSumList(buyOrderId){
                this.request.fetchSumList({buyOrderId}).then(res => {
                    if(res.code == 200){
                        this.detail = res.ext;
                        this.dialogTableVisible = true;
                    }else{
                        this.detail = [];
                    }
                })
            },
            //获取配送单
            editBuyDetail(buyId){
                this.request.editBuyDetail({buyId}).then(res => {
                    if(res.code == 200){
                        this.deliveryList = res.ext;
                        this.deliveryTableVisible = true;
                    }else{
                        this.deliveryList = []
                    }
                })
            }
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
        margin-left: 50px;
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
        font-size:11px;
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
