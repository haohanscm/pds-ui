<template>
    <div>
        <el-row>
            <el-col :span="4">
                <el-button type="primary" @click="printSelectOrder">批量打印</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="printAgain">重新打印</el-button>
            </el-col>
        </el-row>
       <el-table
            :data="orderList"
            stripe
            max-height="600"
            @selection-change="handleSelectionChange"
            style="min-width: 100%">
           <el-table-column type="selection" width="50" fixed></el-table-column>
            <el-table-column type="index" width="50" fixed>
            </el-table-column>
            <el-table-column prop="buyId" label="采购单编号" min-width="100" fixed sortable>
            </el-table-column>
            <el-table-column prop="buyerName" label="采购商" min-width="80" fixed sortable>
            </el-table-column>
            <el-table-column prop="deliveryTime" min-width="100" label="配送日期" sortable>
            </el-table-column>
            <el-table-column prop="buySeq" label="批次" min-width="80" sortable>
                <template  slot-scope="scope">
                    {{$dic.buySeqOptions[scope.row.buySeq].label}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="80" sortable>
                <template slot-scope="scope">
                    {{$dic.buyerOption[scope.row.status]}}
                </template>
            </el-table-column>
            <el-table-column prop="deliveryType" label="配送方式" min-width="100" sortable>
                <template  slot-scope="scope">
                    {{$dic.deliveryTypeMap[scope.row.deliveryType]}}
                </template>
            </el-table-column>
            <el-table-column prop="genPrice" label="总价预估" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="buyTime" label="下单时间" min-width="140" sortable>
            </el-table-column>
            <el-table-column prop="needNote" label="需求信息" max-width="100">
            </el-table-column>
            <el-table-column prop="remarks" label="备注" max-width="100">
            </el-table-column>
            <el-table-column prop="contact" label="联系人" min-width="80">
            </el-table-column>
            <el-table-column prop="telephone" label="电话" min-width="100">
            </el-table-column>
            <el-table-column prop="totalPrice" label="操作" fixed="right" min-width="120">
                <template slot-scope="scope">
                    <el-button round size="mini" type="primary" @click="checkDetail(scope.row)">详情</el-button>
                    <el-button type="text" @click="handleDelete(scope.row, scope.$index)">取消</el-button>
                </template>
            </el-table-column>
           <el-table-column prop="totalPrice" label="打印" fixed="right" min-width="120">
               <template slot-scope="scope">
                    <el-button round size="mini" type="primary" @click="printTable(scope.row)">打印</el-button>
                    <el-button type="text" @click="printBuyOrder(scope.row)">飞鹅</el-button>
               </template>
           </el-table-column>
        </el-table>
        <el-dialog title="采购单详情"
                   :visible.sync="dialogTableVisible"
                   :before-close="buyOrderClose"
                   width="90%">
            <v-goods-table :goods-list="goodsList"
                           :title="checkedItem"
                           ref="buyOrderInfo"
                           @change-list="onChangeList" ></v-goods-table>
        </el-dialog>
        <el-dialog title="采购单打印" :visible.sync="dialogPrint" width="90%">
            <v-print
                ref="printOrderTable"
                :value="checkedItem"
                :concise-list="goodsList">
            </v-print>
        </el-dialog>
    </div>
</template>

<script>;
    import Request from "../../request.js";
    import vGoodsTable from "./goods_table.vue";
    import vPrint from "./print.vue";
    export default {
        data: function(){
            return {
                dialogTableVisible: false,
                dialogPrint: false,
                goodsList: [],
                totalGoods: 0,
                goodsPage:{
                    pageSize: 20,
                    pageNo: 1
                },
                request: new Request(),
                checkedItem: {},
                activeName: "first",
                multipleSelection: [],
                headHtmlPrint: '',
                bodyHtmlPrint: ''
            }
        },
        components:{
            vGoodsTable, vPrint
        },
        props:{
            orderList: Array,
        },
        watch:{
        },
        created(){
        },
        methods:{
            printAgain(){
                if (this.headHtmlPrint && this.bodyHtmlPrint) {
                    this.printBatch(this.headHtmlPrint, this.bodyHtmlPrint);
                }else{
                    this.$message.warning("没有可重新打印的采购单");
                }
            },
            printSelectOrder(){
                let selectOrderList = this.multipleSelection;
                if (selectOrderList.length == 0) {
                    this.$message.warning("未选择需打印采购单");
                    return;
                }
                this.dialogPrint = true;
                this.headHtmlPrint = '';
                this.bodyHtmlPrint = '';
                this.batchPrint(0, selectOrderList, '', '', '',this.batchPrint, this.printBatch);
            },
            // 批量打印时 等请求返回 顺序执行
            // 当前采购单索引 / 是否继续请求标识 / 采购单列表
            batchPrint(index, selectArray, headHtml, selectBodyHtml, msg,callback, endPrint){
                this.dialogPrint = true;
                let item = selectArray[index];
                this.checkedItem = item;
                // console.log("request", index, item.buyId, item);
                if(index == selectArray.length-1){
                    headHtml = this.$refs.printOrderTable.printHeadHtml();
                }
                this.request.purchaseList({ buyId: item.buyId, pageSize: 1000}).then(res => {
                    this.$message.warning("采购单"+ (index + 1) +"  等待数据加载");
                    if( res.code == 200) {
                        this.goodsList = res.ext.list;
                        this.totalGoods = res.ext.totalRows;
                    }else{
                        this.goodsList = [];
                        this.totalGoods = 0;
                    }
                    // 等待数据加载
                    let time = 10*(this.totalGoods+1)>time;
                    time = (time > 500)? time :500;
                    let _that = this;
                    setTimeout(function () {
                        if(_that.goodsList.length>0){
                            let bodyHtml = _that.$refs.printOrderTable.printBodyHtml('buyOrder');
                            msg += "<p>#"+ (index + 1) +" 采购单 " + item.buyId + " 商品数 " + _that.goodsList.length +"</p>";
                            selectBodyHtml = selectBodyHtml + bodyHtml +'<div style="height: 50px;page-break-after:always"></div>';
                        }
                        _that.dialogPrint = false;
                        index++;
                        if(index < selectArray.length){
                            callback(index, selectArray, headHtml, selectBodyHtml, msg,callback, endPrint);
                        }else{
                            _that.$notify({
                                title: '打印的采购单信息:',
                                dangerouslyUseHTMLString: true,
                                message: msg,
                                duration: 0
                            });
                            _that.headHtmlPrint = headHtml;
                            _that.bodyHtmlPrint = selectBodyHtml;
                            endPrint(headHtml, selectBodyHtml);
                        }
                    }, time);
                });
            },
            // 调起批量打印
            printBatch(headHtml, bodyHtml){
                let newWindow = window.open("", "打印");
                let newHtml = '<html>'+ headHtml +'<body>'+ bodyHtml +'</body></html>';
                newWindow.document.write(newHtml);
                newWindow.document.close();
                newWindow.window.onload = function (){
                    newWindow.window.print();
                };
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                // console.log("selection", this.multipleSelection);
            },
            buyOrderClose(done){
                this.$refs.buyOrderInfo.closeShow();
                done();
            },
            printBuyOrder(item){
                let params = {
                    buyId:item.buyId,
                };
                this.request.printBuyOrder(params).then(res => {
                    console.log("print", res);
                    if( res.code == 200){
                        this.$message.success( res.msg);
                        // this.$emit("refreshList")
                    }else{
                        this.$message.warning('失败：' + res.msg)
                    }
                })
            },
            checkDetail(item){
                this.checkedItem = item;
                this.purchaseList(item.buyId);
                this.dialogTableVisible = true;
            },
            printTable(item){
                this.checkedItem = item;
                this.purchaseList(item.buyId);
                this.dialogPrint = true;
            },
            handleDelete(item,index){
                this.$confirm("您确认要取消" +
                item.buyerName + "的第" +
                item.buyId +"号订单吗？").then( res => {
                    this.modifyList({
                        buyId: item.buyId,
                        buyerId: item.buyerId,
                        status: 4
                    })
                })
            },
            purchaseList(id){
                this.request.purchaseList({ buyId: id,pageSize: 1000}).then(res => {
                    if( res.code == 200) {
                        this.goodsList = res.ext.list;
                        this.totalGoods = res.ext.totalRows;
                    }else{
                        this.goodsList = [];
                        this.totalGoods = 0;
                        this.$message.warning(res.msg)
                    }
                }).catch( err => {
                    this.$message.error( err)
                })
            },
            modifyList(params = {}){
                this.request.modifyList(params).then(res => {
                    if( res.code == 200){
                        this.$message.success( res.msg);
                        this.$emit("refreshList")
                    }else{
                        this.$message.warning('取消失败：' + res.msg)
                    }
                })
            },
            onChangeList(changeList){
                this.goodsList = changeList;
            }
        }
    }
</script>
