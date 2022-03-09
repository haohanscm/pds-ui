<template>
    <div class="page-wrap">
        <div class="container buyer-info">
            <h4 class="title">基本信息</h4>
            <el-form ref="customerForm"
            :rules="customerRules"
            :model="customerOrder"
            :inline="true"
            label-width="100px">
                <el-form-item label="手机:" prop="telephone">
                    <el-select class="form-field" filterable
                        v-model="customerOrder.telephone"
                        placeholder="请选择"
                        @change="onBuyerChange($event, 'telephone')">
                        <el-option
                        v-for="item in buyerList"
                        :key="item.telephone"
                        :label="item.telephone"
                        :value="item.telephone">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人:">
                    <el-select
                        class="form-field"
                        filterable v-model="customerOrder.contact"
                        placeholder="请选择"
                        @change="onBuyerChange($event, 'contact')">
                        <el-option
                            v-for="item in buyerList"
                            :key="item.contact"
                            :label="item.contact"
                            :value="item.contact">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采购商名称:">
                    <el-select
                        class="form-field" filterable
                        v-model="customerOrder.buyerName"
                        placeholder="请选择"
                        @change="onBuyerChange($event, 'buyerName')">
                        <el-option
                            v-for="item in buyerList"
                            :key="item.buyerName"
                            :label="item.buyerName"
                            :value="item.buyerName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配送时间:" prop="deliveryTime">
                    <el-date-picker
                        :editable="false"
                        class="form-field"
                        v-model="customerOrder.deliveryTime"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="配送时段:" prop="buySeq">
                    <el-select
                        class="form-field"
                        v-model="customerOrder.buySeq"
                        placeholder="请选择">
                        <el-option
                            v-for="item in buySeqs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配送方式:" prop="deliveryType">
                    <el-select class="form-field"
                        v-model="customerOrder.deliveryType"
                        placeholder="请选择">
                        <el-option
                            v-for="item in deliveryTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注:" prop="needNote">
                    <el-input
                        class="form-field"
                        v-model="customerOrder.needNote"
                        placeholder="">
                    </el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="container body">
            <h4 class="title">采购列表</h4>
            <el-table
                class="goods-list"
                max-height="450"
                :show-header="false"
                :data="orderList" border
                :header-cell-style="thStyle">
                <el-table-column
                    width="50">
                    <template slot-scope="scope">
                        <div style="text-align: center">{{scope.$index + 1}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    type="index"
                    width="100">
                    <template slot-scope="scope">
                        <img style="display:block;width:50px;height:50px;"
                        :src="scope.row.thumbUrl + `?x-oss-process=image/resize,w_200`"
                        alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="buyerName">
                    <template slot-scope="scope">
                        <el-form
                            :ref="'orderDetail' + scope.$index"
                            :rules="orderDetailRules"
                            :inline="true"
                            :model="scope.row"
                            class="demo-form-inline"
                            label-width="60px">
                            <el-row class="row">
                                <el-form-item
                                label="商品名称:"
                                prop="goodsName"
                                label-width="100px">
                                    <el-select
                                        class="form-field--large"
                                        clearable
                                        filterable
                                        default-first-option
                                        :disabled="disabled"
                                        v-model="scope.row.goodsName"
                                        remote :remote-method="searchGoodsByName(scope.row)"
                                        :loading="scope.row.loading"
                                        @change="onGoodsSelectChange($event, scope.row)"
                                        placeholder="请输入商品名称">
                                        <el-option
                                        v-for="item in scope.row.goodsList"
                                        :key="item.id" :label="item.goodsName"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-button type="text"
                                        :disabled="disabled"
                                        @click="showGoodsDialog($event, scope.$index)"
                                    >所有商品
                                    </el-button>
                                </el-form-item>
                                <el-form-item label="规格:" prop="goodsId">
                                    <el-select class="form-field"
                                        v-model="scope.row.goodsId"
                                        @change="onModelSelectChange($event, scope.row)"
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in scope.row.goodsModelList"
                                            :key="item.id"
                                            :label="item.modelName+' /单位:'+item.modelUnit"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="scope.row.purchasePrice" label="市场价:">
                                    <!--<el-input-->
                                        <!--class="form-field&#45;&#45;small"-->
                                        <!--v-model="scope.row.purchasePrice"-->
                                        <!--placeholder="市场价"-->
                                        <!--readonly></el-input>-->
                                    {{scope.row.purchasePrice}}元
                                </el-form-item>
                                <el-form-item label="采购价:" prop="buyPrice">
                                    <el-input
                                        class="form-field--small"
                                        v-model="scope.row.buyPrice"
                                        maxlength="10"
                                        placeholder="采购价">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="数量:" prop="goodsNum">
                                    <el-input
                                        class="form-field--small"
                                        v-model="scope.row.goodsNum"
                                        maxlength="10"
                                        placeholder="采购数量">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="备注:" prop="remarks">
                                    <el-input
                                        class="form-field--small"
                                        v-model="scope.row.remarks"
                                        placeholder="备注">
                                    </el-input>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column width="120" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="danger" plain
                            icon="el-icon-hh-delete"
                            @click="delOrderItem(scope.row, scope.$index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px;">
                <el-button
                    type="primary" plain
                    @click="addOrderItem"
                    icon="el-icon-hh-add1">增加
                </el-button>
                <el-button
                    type="primary"
                    @click="submitBuyOrder">提交订单
                </el-button>
                <!-- <el-button
                    type="primary"
                    @click="printOrder">打印订单
                </el-button> -->
            </div>
            <el-dialog title="选择商品" :visible.sync="dialogVisible">
                <goods-list @select="onSelectGoods" :buyer-id="customerOrder.buyerId"></goods-list>
            </el-dialog>
            <!-- <el-dialog title="打印订单" :visible.sync="printDialogVisible">
                <print-order :value="printTitle" :table="printTable"></print-order>
            </el-dialog> -->
        </div>
    </div>
</template>

<script>
    import Request from './../request.js'
    import rules from './rules.js'
    import goodsList from './components/goodsList.vue'
    // import printOrder from './components/print_order.vue'
    function data() {
        return {
            request: new Request(),
            customerRules: rules.customerRules,
            orderDetailRules: rules.orderDetailRules,
            disabled: true,
            customerOrder: this.customerOrderInfo(),
            orderList: this.orderListInfo(),
            selectedRowIndex: '',
            buyerList: [],
            // 选择标签
            buySeqs: this.$dic.buySeqOptions,
            deliveryTypeOptions: this.$dic.deliveryTypeOptions,
            dialogVisible: false,
            printDialogVisible: false,
            printTitle: {},
            printTable: []
        };
    }

    export default {
        data: data,
        computed: {
        },
        components: {
            goodsList
            // , printOrder
        },
        mounted() {
            this.fetchBuyerList()
        },
        methods: {
            /**
             * 页面请求
             */
            getGoodsList(params) {
                params.pageSize = 20;
                params.buyerId = this.customerOrder.buyerId;
                return this.request.getGoodsList(params).then(res => {
                    if (res.code == 200) {
                        return res.ext.list
                    } else {
                        console.log('商品列表获取错误', res.msg)
                    }
                })
            },
            fetchBuyerList() {
                this.request.getBuyerList().then(res => {
                    if (res.code == 200) {
                        this.buyerList = res.ext
                    }
                })
            },
            addBuyOrder(params = {}) {
                return this.request.addBuyOrder(params).then(res => {
                    if (res.code == 200) {
                        return res.ext
                    } else {
                        this.$alert('请重新下单', '提交失败', {
                            confirmButtonText: '确定'
                        })
                    }
                })
            },
            /**
             * 页面方法
             */
            onBuyerChange(value, type) {
                this.disabled = false;
                let index = this.buyerList.map(i => i[type]).indexOf(value)
                this.setCustomerForm(index)
            },
            // printOrder(){
            //     let order = this.customerOrder
            //     let orderDetail = this.genOrderDetail()
            //     Object.assign(order, { ...orderDetail
            //     })
            //     if (this.checkCustomerRule() && this.checkOrderRule()){
            //         console.log( order)
            //         this.printTitle = order;
            //         this.printTable = order.buyOrderDetailList;
            //         this.printDialogVisible = true;
            //     }
            // },
            setCustomerForm(index) {
                let buyer = this.buyerList[index];
                this.$set(this.customerOrder, 'buyerUid', buyer.uid)
                this.$set(this.customerOrder, 'buyerId', buyer.id)
                this.$set(this.customerOrder, 'buyerName', buyer.buyerName)
                this.$set(this.customerOrder, 'contact', buyer.contact)
                this.$set(this.customerOrder, 'telephone', buyer.telephone)
                this.$set(this.customerOrder, 'address', buyer.address)
            },
            searchGoodsByName(row) {
                // 将row信息传入
                let _this = this;
                return function (searchValue) {
                    if (searchValue !== '') {
                        row.loading = true
                        console.log('time', searchValue);
                        let params = {
                            goodsName: searchValue,
                        }
                        _this.getGoodsList(params).then(res => {
                            _this.$set(row, 'goodsList', res)
                            _this.$set(row, 'loading', false)
                        })
                    }
                }
            },
            onGoodsSelectChange(e, row) {
                if(e){
                    let selectedGoods = row.goodsList.filter(item => item.id == e)[0]
                    row.goodsModelList = selectedGoods.goodsModelList
                    this.$set(row, 'goodsName', selectedGoods.goodsName)
                    this.$set(row, 'thumbUrl', selectedGoods.thumbUrl)
                    this.onModelSelectChange(selectedGoods.goodsModelList[0].id, row)
                    row.goodsModel = ''
                }else{
                    // 清空选项时
                    this.$set(row, 'goodsId', '');
                    row.goodsId = '';
                }
            },
            onModelSelectChange(e, row) {
                let selectedModel = row.goodsModelList.filter(item => item.id === e)[0]
                this.$set(row, 'goodsId', selectedModel.id)
                this.$set(row, 'purchasePrice', selectedModel.purchasePrice || selectedModel.modelPrice)
                this.$set(row, 'goodsImg', selectedModel.modelUrl)
                this.$set(row, 'goodsModel', selectedModel.modelName)
                this.$set(row, 'unit', selectedModel.modelUnit)
                this.$set(row, 'buyPrice', selectedModel.buyPrice)
            },
            showGoodsDialog($event, index) {
                this.dialogVisible = true
                this.selectedRowIndex = index
            },
            onSelectGoods(goods) {
                this.dialogVisible = false
                let index = this.selectedRowIndex
                let orderItem = {
                    goodsName: goods.goodsName,
                    goodsModelList: goods.goodsModelList,
                    goodsNum: '',
                    remarks: '',
                    thumbUrl: goods.thumbUrl
                }
                this.$set(this.orderList, index, orderItem)
                this.onModelSelectChange(orderItem.goodsModelList[0].id, orderItem)
            },
            addOrderItem() {
                this.orderList.push({
                    goodsName: '',
                    goodsId: '',
                    goodsImg: '',
                    goodsModel: '',
                    goodsNum: '',
                    purchasePrice: '',
                    buyPrice: '',
                    unit: '',
                    remarks: ''
                })
            },
            delOrderItem(e, index) {
                this.orderList.splice(index, 1)
            },
            resetForm() {
                this.disabled = true;
                this.customerOrder = this.customerOrderInfo();
            },
            submitBuyOrder() {
                this.$confirm("您现在已经完成了" + this.orderList.length + "个商品的录入,确认下单？").then(res => {
                    let order = this.customerOrder
                    let orderDetail = this.genOrderDetail()
                    Object.assign(order, { ...orderDetail
                    })
                    if (!this.checkCustomerRule()) return;
                    if (!this.checkOrderRule()) return;
                    this.addBuyOrder(order).then(res => {
                        let msg = '订单号: ' + res.buyId
                        this.$alert(msg, '提交成功', {
                            confirmButtonText: '确定'
                        })
                    }).then(() => {
                        let info = this.customerOrderInfo();
                        info.deliveryTime = order.deliveryTime;
                        info.buySeq = order.buySeq;
                        info.deliveryType = order.deliveryType;
                        this.customerOrder = info;
                        this.disabled = true;
                        this.orderList = this.orderListInfo();
                    })
                })
            },
            genOrderDetail() {
                let order = this.orderList
                let genPrice = 0
                let buyOrderDetailList = order.map((item, index) => {
                    genPrice += (+item.goodsNum) * (+item.purchasePrice)
                    return {
                        goodsId: item.goodsId,
                        goodsImg: item.goodsImg,
                        goodsName: item.goodsName,
                        goodsModel: item.goodsModel,
                        goodsNum: item.goodsNum,
                        purchasePrice: item.purchasePrice,
                        buyPrice: item.buyPrice,
                        unit: item.unit,
                        remarks: item.remarks,
                    }
                })

                return {
                    buyOrderDetailList,
                    genPrice: genPrice.toFixed(2)
                }
            },
            checkCustomerRule() {
                let result = false
                this.$refs["customerForm"].validate((valid) => {
                    if (valid) {
                        result = valid;
                    } else {
                        console.log('客户信息校验错误!!');
                    }
                });
                return result;
            },
            checkOrderRule() {
                let order = this.orderList
                let result = false
                order.forEach((item, index) => {
                    this.$refs["orderDetail" + index].validate((valid) => {
                        if (valid) {
                            result = valid;
                        } else {
                            console.log('订单信息校验信息!!');
                        }
                    })
                })
                return result
            },
            /**
             * 表格样式
             */
            thStyle() {
                return {
                    background: '#494949',
                    fontSize: '18px',
                    color: '#fff'
                }
            },
            tomorrow() {
                return this.$utils.getDiffDate(1);
            },
            customerOrderInfo() {
                return {
                    buyerUid: '',
                    buyerId: '',
                    buyerName: '',
                    contact: '',
                    telephone: '',
                    address: '',
                    needNote: '',
                    deliveryTime: this.tomorrow(),
                    buySeq: '0',
                    genPrice: 0,
                    totalNum: 0,
                    deliveryType: '9'
                };
            },
            orderListInfo(){
                return [{
                    goodsId: '',
                    goodsImg: '',
                    goodsName: '',
                    goodsModel: '',
                    goodsNum: '',
                    purchasePrice: '',
                    buyPrice: '',
                    unit: '',
                    remarks: '',
                    loading: false,
                    goodsList: [],
                    goodsModelList: [],
                }];
            },
        }
    };

</script>

<style scoped lang="scss">
    .page-wrap {
        height: 100%;

        .title {
            padding: 10px;
        }
    }

    .buyer-info,
    .body {
        background: #fff;
    }

    .buyer-info {
        font-size: 16px;
    }

    .body {
        position: relative;
        /*height: calc(100vh - 600px);*/
        /*min-height: 600px;*/
        margin-top: 10px;
        overflow: auto;
    }

    .el-form-item {
        margin: 15px 5px;
    }

    .row {
        margin-bottom: 10px;
    }

    .form-field--small {
        width: 100px;
    }

    .form-field {
        width: 150px;
    }

    .form-field--large {
        width: 200px;
    }

</style>
