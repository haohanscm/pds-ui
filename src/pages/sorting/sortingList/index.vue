<template>
    <div class="page-wrap">
        <div class="container search">
            <el-form
            :model="sortingSearchForm"
            :inline="true"
            label-width="100px">
                <el-form-item label="配送日期:">
                    <el-date-picker
                    v-model="sortingSearchForm.deliveryTime"
                    clearable
                    type="date" placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="配送批次:">
                    <el-select
                    v-model="sortingSearchForm.buySeq"
                    clearable
                    placeholder="请选择">
                        <el-option
                        v-for="item in buySeqOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采购商:">
                    <buyer-check v-model="sortingSearchForm.buyerId"></buyer-check>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input
                    v-model="sortingSearchForm.goodsName"
                    placeholder=""></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button
                    type="primary"
                    @click="fetchSortingList">搜索</el-button>
                    <el-button
                    v-if="!$constant.isPds"
                    @click="shortcutFinish">确认装车并送达</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="container body" v-loading="loading">
            <div class="check-block">
                <div>
                    <span>易联云打印机:</span>
                    <el-select
                    v-model="printerSn"
                    placeholder="选择打印机" clearable
                    @change="savePrinterInfo">
                        <el-option
                        v-for="item in printerList"
                        :key="item.id" :label="item.name"
                        :value="item.machineCode">
                        </el-option>
                    </el-select>
                </div>
                <div >
                    <span>打印规格:</span>
                    <el-select v-model="printType" clearable
                    placeholder="选择易联云打印机打印规格"
                    @change="savePrinterInfo">
                        <el-option v-for="item in printList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
                    <span>飞鹅打印机:</span>
                    <el-select v-model="feieSn" clearable
                    placeholder="选择飞鹅打印机"
                    @change="saveFeieInfo">
                        <el-option
                        v-for="item in feieList"
                        :key="item.id" :label="item.printerName"
                        :value="item.printerSn">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <el-table
            :data="sortingList" border
            :header-cell-style="thStyle">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="单位名称" prop="buyerName">
                </el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="scope">
                        <el-popover
                        trigger="hover"
                        placement="top"
                        width="120px">
                            <p>{{ scope.row.goodsName }}</p>
                            <div slot="reference">
                                <p class="text-ellipsis">{{ scope.row.goodsName}}</p>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                label="规格"
                prop="goodsModel"
                width="100">
                </el-table-column>
                <el-table-column
                label="单位"
                prop="unit"
                width="100">
                </el-table-column>
                <el-table-column
                label="订购数量"
                prop="buyNum"
                width="100">
                </el-table-column>
                <el-table-column
                label="备注">
                    <template slot-scope="scope">
                        <el-popover trigger="hover"
                        placement="top"
                        width="120px">
                            <p>{{ scope.row.buyNode }}</p>
                            <div slot="reference">
                                <p class="text-ellipsis">{{ scope.row.buyNode}}</p>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="实际数量" width="150">
                    <template slot-scope="scope">
                        <el-input
                        v-model="scope.row.sortOutNum"
                        placeholder="0"
                        :disabled="!scope.row.isEdit">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="分拣状态" width="100">
                    <template slot-scope="scope">
                        <p v-if="scope.row.opStatus == 2">待分拣</p>
                        <p v-if="scope.row.opStatus == 3">已分拣</p>
                    </template>
                </el-table-column>
                <el-table-column label="管理操作">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.isEdit"
                        type="primary" size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button v-if="scope.row.isEdit"
                        type="success" size="mini"
                        @click="handleSave(scope.$index, scope.row)">保存
                        </el-button>
                        <el-button type="mini"
                        @click="handlerPrint(scope.$index, scope.row)">打印
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Request from './../request.js'
    import mixins from './../mixins/index.js'
    export default {
        mixins: [mixins],
        data: function () {
            return {
                request: new Request(),
                sortingSearchForm: {
                    deliveryTime: this.today
                },
                sortingList: [],

                buySeqOptions: this.$dic.buySeqOptions,
                buyerOptions: [],
                loading: false
            };
        },
        computed: {
            today() {
                let now = new Date()
                return this.$utils.formatDate(now, 'yyyy-MM-dd')
            }
        },
        mounted() {
            this.fetchSortingList()
        },
        methods: {
            fetchSortingList() {
                this.loading = true
                let params = this.sortingSearchForm
                params.pageSize = 1000 // 前端不分页, 默认1000种
                return this.request.fetchSortingList(params).then(res => {
                    if (res.code == 983) {
                        this.sortingList = []
                    }
                    if (res.code == 200) {
                        this.sortingList = res.list
                    }
                    this.loading = false
                })
            },
            confirmSortingNumber(params) {
                this.loading = true
                return this.request.confirmSortingNumber(params).then(res => {
                    this.loading = false
                })
            },
            /**
             * 表格样式
             */
            thStyle() {
                return {
                    background: '#494949',
                    color: '#fff'
                }
            },
            handleEdit(index, row) {
                this.$set(row, 'isEdit', true)
            },
            handleSave(index, row) {
                let that = this;
                this.$set(row, 'isEdit', false)
                let params = {}
                params.tradeId = row.tradeId
                params.sortOutNum = row.sortOutNum
                this.confirmSortingNumber(params).then(res => {
                    this.$message.success('修改分拣数量成功!')
                    this.fetchSortingList()
                })
            },
            resetForm() {
                this.sortingSearchForm = {}
            },
            handlerPrint(index, row) {
                if (!row.sortOutNum) {
                    this.$message.error('请填写实际分拣数量')
                    return
                }
                this.printTicket(row)
            },
            //采购单汇总  --- 君磊农产品 --- 多商家版
            shortcutFinish(){
                this.$confirm('您确认该批次的商品已装车并且已送达?').then(() => {
                    this.request.shortcutFinish(
                        this.sortingSearchForm
                    ).then(res => {
                        if(res.code == 200){
                            this.$message.success( "分拣成功！")
                        }else{
                            this.$message.warning( res.msg)
                        }
                    })
                })
            }

        }
    };

</script>

<style scoped lang="scss">
    .page-wrap {
        height: 100%;
    }

    .search,
    .body {
        background: #fff;
    }

    .search {
        .el-form-item--small.el-form-item {
            margin-top: 5px;
            margin-bottom: 5px;
        }

        font-size: 16px;
    }

    .body {
        position: relative;
        height: calc(100vh - 270px);
        min-height: 600px;
        margin-top: 10px;
        overflow: auto;
        .check-block{
            display: flex;
            justify-content: space-between;
            >div{
              padding-bottom: 10px;
            }
        }

        .print {
            font-size: 14px;
            padding: 10px;
            text-align: right;
        }

        .inner {
            height: 100%;
        }

        .right {
            padding: 10px;
        }

        .name-wrapper {
            width: 160px;
        }

        .text-ellipsis {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

    }

</style>
