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

                <el-table-column prop="buyerName" label="采购商名称">
                </el-table-column>

                <el-table-column prop="contact" label="联系人" width="100px">
                </el-table-column>

                <el-table-column prop="telephone" label="联系电话" width="100px">
                </el-table-column>

                <el-table-column prop="address" label="地址">
                </el-table-column>

                <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDetailClick(scope.row,scope.$index)">自提单明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="自提单" :visible.sync="deliveryTableVisible" width="900px">
                <v-Detail v-model="detail" :delivery-date="deliveryTime" :buy-seq="buySeq" ></v-Detail>
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
                buySeq: '0',
                options: this.$dic.buySeqOptions,
                dialogTableVisible: false,
                deliveryTableVisible: false,//送货单模态框
                deliveryTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                orderList: [],
                trucks: [],
                truckNo: "",
                deliveryTitle: {},
                detail:{},
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
            this.selfOrderList()
        },
        methods:{
            handleTableClick(item, index){
                this.fetchSumList(item.buyId);
            },
            checkSupplierList(){
                this.selfOrderList()
            },
            //送货单模态框
            handleDetailClick(item, index){
                this.detail = item;
                this.deliveryTableVisible = true;
            },


            //获取自提采购商列表
            selfOrderList(){
                this.request.selfOrderList({
                    deliveryDate: this.deliveryTime,
                    buySeq:this.buySeq,
                    truckNo:this.truckNo}).then(res => {
                    if(res.code == 200){
                        this.orderList = res.ext
                    }else{
                        this.orderList = []
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
