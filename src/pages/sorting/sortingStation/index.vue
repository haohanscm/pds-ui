<template>
    <div class="container page-wrap">
        <div class="search">
            <el-form :model="sortingSearchForm" :inline="true" label-width="100px">
                <el-form-item label="配送日期:">
                    <el-date-picker class="form-field" v-model="sortingSearchForm.deliveryTime" type="date" placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="配送批次:">
                    <el-select class="form-field"
                    v-model="sortingSearchForm.buySeq"
                    placeholder="请选择">
                        <el-option v-for="item in buySeqOptions"
                        :key="item.value" :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="采购商:">
                    <buyer-check v-model="sortingSearchForm.buyerId"></buyer-check>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input class="form-field" v-model="sortingSearchForm.goodsName" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="" label-width="20">
                    <el-button type="primary" @click="fetchSortingList">搜索</el-button>
                    <el-button type="primary" @click="fastSortOut">一键分拣</el-button>
                    <el-button type="default" @click="resetForm" style="margin-left: 15px;">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="body">
            <el-container class="inner">
                <el-aside width="40%" v-loading="loading">
                    <div class="left-top">
                        <div class="left-title">
                            <div>待分拣（{{sortingNumber}}）</div>
                            <div class="refresh" @click="fetchSortingList">刷新</div>
                        </div>
                        <el-table class="table top-table" :data="waitingList" border :header-cell-style="thStyle('494949')"
                            :cell-style="tcStyle('f5efe3')" @row-click="getItem" @sort-change="getList" :row-class-name="currentRowClass">
                            <el-table-column  prop="buyerName">
                                <template slot="header" slot-scope="">
                                    <div @click="getList('buyerName')">
                                        单位 <i class="el-icon-sort"></i>
                                    </div>
                                </template>
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.buyerName}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="goodsName">
                                <template slot="header" slot-scope="">
                                    <div @click="getList('goodsName')">
                                        商品 <i class="el-icon-sort"></i>
                                    </div>
                                </template>
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="top" width="120px">
                                        <p>{{ scope.row.goodsName }}</p>
                                        <div slot="reference">
                                            <p class="text-ellipsis">{{ scope.row.goodsName}}</p>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="goodsModel" width="100">
                                <template slot="header" slot-scope="">
                                    <div @click="getList('goodsModel')">
                                        规格 <i class="el-icon-sort"></i>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="buyNum" width="100">
                                <template slot="header" slot-scope="">
                                    <div @click="getList('buyNum')">
                                        数量 <i class="el-icon-sort"></i>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="left-bottom">
                        <div class="left-title">已分拣（{{sortedNumber}}）</div>
                        <el-table class="table bottom-table" :data="filterSortedList" border :header-cell-style="thStyle('494949')"
                            :cell-style="tcStyle('edf9fc')" :row-class-name="editRowClass" @row-click="editSortedList">
                            <el-table-column label="单位" prop="buyerName" sortable></el-table-column>
                            <el-table-column label="商品">
                                <template slot-scope="scope">
                                    <el-popover trigger="hover" placement="top" width="120px">
                                        <p>{{ scope.row.goodsName }}</p>
                                        <div slot="reference">
                                            <p class="text-ellipsis">{{ scope.row.goodsName}}</p>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column sortable label="规格" prop="goodsModel" width="100"></el-table-column>
                            <el-table-column sortable label="分拣量" prop="sortOutNum" width="100"></el-table-column>
                        </el-table>
                    </div>
                </el-aside>
                <el-main class="right">
                    <div class="right-header">
                        <div class="print">
                            <span>易联云打印:</span>
                            <el-select v-model="printerSn" placeholder="选择打印机" clearable @change="savePrinterInfo">
                                <el-option
                                v-for="item in printerList"
                                :key="item.id" :label="item.name"
                                :value="item.machineCode"></el-option>
                            </el-select>
                        </div>
                        <div class="print">
                            <span>打印规格:</span>
                            <el-select v-model="printType" clearable placeholder="选择易联云打印机打印规格" @change="savePrinterInfo">
                                <el-option
                                v-for="item in printList" :key="item.value"
                                :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="right-header">
                        <div class="print">
                            <span>飞鹅打印机:</span>
                            <el-select v-model="feieSn" clearable
                            placeholder="选择飞鹅打印机"
                            @change="saveFeieInfo">
                               <el-option v-for="item in feieList"
                               :key="item.id" :label="item.printerName"
                               :value="item.printerSn"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="station">
                        <div v-if="currentSorting">
                            <h2>{{currentSorting.goodsName}}</h2>
                            <el-row class="field">
                                <el-col class="label" :span="8">商品</el-col>
                                <el-col :span="16">{{currentSorting.goodsName}}</el-col>
                            </el-row>
                            <el-row class="field">
                                <el-col class="label" :span="8">规格</el-col>
                                <el-col :span="16">{{currentSorting.goodsModel || '/'}}</el-col>
                            </el-row>
                            <el-row class="field">
                                <el-col class="label" :span="8">订购数量</el-col>
                                <el-col :span="16">{{currentSorting.buyNum}} {{currentSorting.unit ? ('/' + currentSorting.unit) : ''}}</el-col>
                            </el-row>
                            <el-row class="field remark">
                                <el-col class="label" :span="8">备注</el-col>
                                <el-col :span="16">{{currentSorting.remarks}}</el-col>
                            </el-row>
                            <el-row class="field sorting">
                                <el-col class="label" :span="8">实际分拣</el-col>
                                <el-col :span="8">
                                    <el-input class="input" v-model="sortOutNum" placeholder="0" size="default"
                                        readonly></el-input>
                                    <div class="has-submit" v-if="currentSorting.hasSubmit">
                                        <i class="el-icon-check"></i>
                                    </div>
                                </el-col>
                                <el-col :span="8">
                                    <el-switch
                                    v-model="isAuto"
                                    @change="readList"
                                    active-text="自动称重">
                                    </el-switch>
                                </el-col>
                            </el-row>
                            <el-row class="field vboard">
                                <el-col :span="24">
                                    <virtual-board ref="vboard" :value="number" @change="changeNumber">
                                    </virtual-board>
                                </el-col>
                            </el-row>
                            <el-row class="field btn-group">
                                <el-button class="btn" type="primary" @click="handleSave">
                                    <i class="el-icon-hh-check"></i> 确定
                                </el-button>
                                <el-button class="btn" @click="handlePrint">
                                    <i class="el-icon-hh-punch"></i> 单次打印
                                </el-button>
                                <el-button class="btn" @click="handleNext">
                                    <i class="el-icon-hh-right"></i> 下一个
                                </el-button>
                                <el-button class="btn">
                                    <i class="el-icon-hh-punch"></i> 批量打印
                                </el-button>
                            </el-row>
                        </div>
                        <!-- <div class="empty" v-else>暂无分拣商品</div> -->
                    </div>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
    import Request from './../request.js'
    import virtualBoard from './../components/virtualBoard.vue'
    import mixins from './../mixins/index.js'
    export default {
        mixins: [mixins],
        data: function () {
            return {
                request: new Request(),
                sortingSearchForm: {},
                sortingList: [],
                waitingList: [], // 待分拣列表
                currentSortingIndex: 0,
                editSortingIndex: '',
                buySeqOptions: this.$dic.buySeqOptions,
                buyerOptions: [],
                loading: false,
                sortOutNum: '',
                number: '',
                isEdit: false,
                currentSorting: {},
                isAuto: false,//是否自动称重
                timer: {},
                ip: this.$utils.getCookie("ip"),
                // 排序部分按钮
                sortType: "nor",
                sortProp: ""
            };
        },
        computed: {
            filterSortingList() {
                return this.sortingList.filter(i => i.opStatus == 2)
            },
            filterSortedList() {
                return this.sortingList.filter(i => i.opStatus == 3)
            },
            sortingNumber() {
                return this.filterSortingList.length
            },
            sortedNumber() {
                return this.filterSortedList.length
            },
            getSortingItem() {
                return this.waitingList[0]
            },
            getSortedItem() {
                return this.editSortedItem
            }
        },
        components: {
            virtualBoard,
        },
        mounted() {
            this.fetchSortingList()
            this.request.reg(this.ip)
        },
        methods: {
            /**
             * 请求
             */
            fetchSortingList() {
                this.loading = true
                let params = this.sortingSearchForm
                params.pageSize = 1000 // 前端不分页, 默认1000种
                return this.request.fetchSortingList(params).then(res => {
                    if (res.code == 983) {
                        this.sortingList = []
                        this.loading = false
                    }
                    if (res.code == 200) {
                        this.sortingList = res.list
                    }
                    this.loading = false
                    this.waitingList = this.filterSortingList
                    if(this.sortType === "up"){
                        this.waitingList.sort((a,b) => {
                            return a[this.sortProp] > b[this.sortProp] ? 1 : -1
                        })
                    }else if(this.sortType === "down"){
                        this.waitingList.sort((a,b) => {
                            return b[this.sortProp] > a[this.sortProp] ? 1 : -1
                        })
                    }
                    this.currentSorting = this.getSortingItem || {}
                })
            },
            confirmSortingNumber(params) {
                return this.request.confirmSortingNumber(params)
            },
            fastSortOut() {
                if( typeof(this.sortingSearchForm.buySeq) === "undefined" ||
                    typeof(this.sortingSearchForm.deliveryTime) === "undefined" ){
                    this.$message.warning("请选择时间和批次！")
                    return;
                }
                let buySeq = this.buySeqOptions[this.sortingSearchForm.buySeq].label;
                let deliveryDate = this.sortingSearchForm.deliveryTime
                this.$confirm(
                    "您确认要对" +
                    deliveryDate +
                    buySeq +
                    "的商品进行一键分拣吗？"
                ).then(res => {
                    this.request.fastSortOut({
                        deliveryDate: this.sortingSearchForm.deliveryTime,
                        buySeq:this.sortingSearchForm.buySeq
                    }).then( res => {
                        if( res.code == 200){
                            this.$message.success(
                                deliveryDate +
                                buySeq +
                                "分拣成功！"
                            )
                        }else{
                            this.$message.warning( res.msg)
                        }
                    })
                })
            },
            /**
             * 表格样式
             */
            currentRowClass({
                row,
                rowIndex
            }) {
                if (rowIndex === 0) {
                    return 'sorting--current';
                }
                return '';
            },
            editRowClass({
                row,
                rowIndex
            }) {
                if (rowIndex === this.editRowClass) {
                    return 'sorting--current';
                }
                return '';
            },
            thStyle(color) {
                return {
                    background: '#' + color,
                    color: '#fff'
                }
            },
            tcStyle(color) {
                return {
                    background: '#' + color
                }
            },
            /**
             * 操作
             */
            readList(e){
                if(e){
                    this.request.open(this.ip).then( _ =>{
                        this.computeWeight()
                    })
                }else{
                    clearInterval(this.timer)
                }

            },
            // 商品排序
            getList(e){
                // console.log(this.waitingList)
                switch (this.sortType) {
                    case "up":
                        this.sortType = "down"
                        break;

                    case "down":
                        this.sortType = "nor"
                        break;

                    case "nor":
                        this.sortType = "up"
                        break;
                }
                this.sortProp = e
                this.fetchSortingList()
            },
            // 点击获取条目
            getItem( item, event, column, index){
                this.currentSorting = item
                this.sortOutNum = ""
            },
            computeWeight(){
                this.timer = setInterval(() => {
                    this.request.read(this.ip).then( res => {
                        let arr = res.split(`(kg)`);
                        let size = arr.length;
                        if(size < 2) return;
                        let mid = Math.ceil(size / 2) - 10;
                        let total = 0;
                        mid < 0 ? mid = 0 : mid;
                        let base = 20;
                        for (let index = 0; index < 20; index++) {
                            if(arr[mid + index]){
                                let num = + arr[mid + index].split("=")[1]
                                if(!isNaN(num)){
                                    total += + num
                                }else{
                                    base--
                                }
                            }else{
                                base --
                            }

                        }
                        let result = ( total / base )
                        if(isNaN(result)){
                            }else{
                                this.sortOutNum = result.toFixed(2)
                        }
                        this.currentSorting.sortOutNum = this.sortOutNum
                    })
                },500)
            },
            editSortedList(row, event, column, index) {
                this.currentSorting = row
                this.sortOutNum = row.sortOutNum
            },
            handleSave() {
                if (this.sortOutNum <= 0) {
                    this.$message.error('实际数量应该大于0')
                    return
                }
                let params = {}
                params.tradeId = this.currentSorting.tradeId
                params.sortOutNum = this.sortOutNum
                this.confirmSortingNumber(params).then(res => {
                    this.$message.success('分拣成功!')
                    this.$set(this.currentSorting, 'hasSubmit', true)
                })
            },
            handlePrint() {
                if (!this.currentSorting.sortOutNum) {
                    this.$message.error('请填写实际分拣数量')
                    return
                }
                this.printTicket(this.currentSorting)
            },
            handleNext() {
                this.fetchSortingList()
                this.sortOutNum = ''
                this.resetVirtualBoard()
            },
            changeNumber(result) {
                this.currentSorting.sortOutNum = result
                this.sortOutNum = result
            },
            resetForm() {
                this.sortingSearchForm = {}
            },
            resetVirtualBoard() {
                this.$refs.vboard.reset()
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
        min-height: 520px;
        margin-top: 10px;
        border-top: 1px solid #e4e4e4;

        .inner {
            height: 100%;
        }

        .right {
            padding: 10px;
            padding-top: 5px;

            .right-header {
                line-height: 32px;
                display: flex;
                justify-content: space-between;
            }
        }


    }

    .left-top,
    .left-bottom {
        height: 50%;
        padding: 10px;
        box-sizing: border-box;

        .left-title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            .refresh {
                color: blue;
                cursor: pointer;
            }
        }

        .table {
            height: 90%;
            overflow: auto;
            box-sizing: border-box;
        }

        .top-table {
            background: #f5efe3;
        }

        .bottom-table {
            background: #edf9fc;
        }
    }

    .station {
        margin-top: 10px;
        border: 1px solid #e4e4e4;
        height: calc(100% - 45px);
        padding: 0 60px;
        background: #cdebe1;

        .empty {
            text-align: center;
            vertical-align: middle;
            line-height: 200px;
        }

        h2 {
            text-align: center;
            margin: 20px;
        }

        .sorting {
            color: #f66f33;
            margin-top: 10px;
            line-height: calc(1.5em + 22px);
            position: relative;

            .has-submit {
                position: absolute;
                top: -20px;
                right: 40px;
                font-weight: 900;
                font-size: 32px;
                margin-top: 20px;
            }
        }

        .vboard {
            margin-top: 10px;
        }

        .field {
            margin-top: 5px;
            font-size: 1.0em;
        }

        .remark.field {
            font-size: 1em;
        }

        .input {
            width: 80%;
        }

        .btn-group {
            margin-top: 3vh;
            display: flex;
            justify-content: space-between;

            .btn {
                width: 120px;
            }

        }
    }

    .form-field {
        width: 10vw;
    }

</style>
<style>
    .input .el-input__inner {
        height: 2em;
        line-height: 25em;
        font-size: 1.5em;
        border: 1px solid #009184;
    }

    .el-table .sorting--current {
        background: oldlace;
        color: #f66f33;
        font-size: 16px;
        font-weight: bold;
    }

</style>
