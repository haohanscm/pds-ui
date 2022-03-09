<template>
    <div>
        <el-row>
            <el-col :span="4">
                采购商:{{title.buyerName}}
            </el-col>
            <el-col :span="4">
                采购单编号:{{title.buyId}}
            </el-col>
            <el-col :span="4">
                状态:{{$dic.buyerOption[title.status]}}
            </el-col>
            <el-col :span="6">
                <div>配送日期:
                    <el-date-picker
                        :editable="false"
                        v-model="title.deliveryTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        class="date-field"
                        placeholder="选择日期">
                    </el-date-picker>
                </div>
            </el-col>
            <el-col :span="6">
                <div>批次:
                    <el-select v-model="title.buySeq" value-key="value" clearable placeholder="请选择" class="select-field">
                        <el-option
                            v-for="item in $dic.buySeqOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="2">需求信息:</el-col>
            <el-col :span="12">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4}"
                    maxlength="100"
                    v-model="title.needNote"></el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="2">备注信息:</el-col>
            <el-col :span="12">
            <el-input
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 4}"
                        maxlength="100"
                        v-model="title.remarks"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="updateBuyOrder()">提交修改</el-button>
            </el-col>
        </el-row>
        <el-table
            :data="goodsList"
            stripe
            height="350px"
            style="min-width: 100%">
            <el-table-column type="index" width="50" fixed>
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称" min-width="80" fixed sortable>
            </el-table-column>
            <el-table-column prop="goodsModel" label="规格" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="unit" label="单位" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="goodsNum" label="商品数" min-width="150" sortable>
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.goodsNum" size="mini" :max="1000000" :min="0"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="marketPrice" label="市场价" min-width="80" sortable>
            </el-table-column>
            <el-table-column prop="buyPrice"  label="采购价" min-width="150" sortable>
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.buyPrice" size="mini" :precision="2" :step="0.1" :max="1000000" :min="0"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="remarks"  label="备注信息" min-width="150">
                <template slot-scope="scope">
                    <el-input maxlength="100"
                              v-model="scope.row.remarks"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="操作" min-width="180" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleChangeNum(scope.row)">提交修改</el-button>
                    <el-button type="danger" @click="handleDetail(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-button
                v-show="showAdd"
                @click="addBuyOrder"
                type="primary" plain
                icon="el-icon-hh-add1">提交商品
            </el-button>
            <el-button
                v-show="!showAdd"
                @click="openShow"
                type="primary" plain
                icon="el-icon-hh-add1">新增商品
            </el-button>
        </el-row>
        <el-row :gutter="20" v-show="showAdd">
            <el-col :span="1.5">
                商品:
            </el-col>
            <el-col :span="4" >
                <el-select
                    v-model="goodsIndex"
                    filterable
                    clearable
                    default-first-option
                    remote
                    :remote-method="searchGoodsByName()"
                    @change="onGoodsSelectChange()"
                    placeholder="请输入商品名称">
                    <el-option
                    v-for="(item,index) in checkList"
                    :key="item.id"
                    :label="item.goodsName"
                    :value="index"
                    @mouseover.native="showPhoto(item.thumbUrl)"
                    >
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="1.5">
                规格:
            </el-col>
            <el-col :span="4">
                <el-select
                    width="100"
                    v-model="goodsModelIndex"
                    @change="onGoodsModelSelectChange()"
                    placeholder="选择商品规格">
                    <el-option
                    v-for="(item,index) in spuGoods.goodsModelList"
                    :key="item.id" :label="item.modelName"
                        :value="index">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="2">
                采购数量:
            </el-col>
            <el-col :span="4">
                <el-input v-model="skuGoods.goodsNum" placeholder="请输入数量" maxlength="10">
                </el-input>
            </el-col>
            <el-col :span="2">
                单位:{{skuGoods.modelUnit}}
            </el-col>
        </el-row>
        <el-row :gutter="20" v-show="showAdd">
            <div v-show="skuGoods.purchasePrice">
            <el-col :span="3">
                市场价:{{skuGoods.purchasePrice}}&nbsp;元/{{skuGoods.modelUnit || "单位"}}
            </el-col>
            <el-col :span="5">
                采购价:<el-input v-model="skuGoods.buyPrice" placeholder="输入采购价" class="input-num" maxlength="10">
            </el-input>&nbsp;元/{{skuGoods.modelUnit}}
            </el-col>
            </div>
            <el-col :span="2">
                备注信息:
            </el-col>
            <el-col :span="5">
                <el-input v-model="skuGoods.remarks" placeholder="请输入备注信息" maxlength="50" style="max-width: 400px">
                </el-input>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-show="showAdd">
            <el-col :span="6" id="show-photo"><img :src="spuGoods.thumbUrl" alt="" width="100px"></el-col>
        </el-row>

    </div>
</template>

<script>;
    import Request from "../../request.js";
    export default {
        data: function(){
            return {
                request: new Request(),
                goodsIndex: "",
                checkList: [],
                modelList: [],
                spuGoods: {},
                skuGoods: {},
                goodsModelIndex: "",
                showAdd: false
            }
        },
        components:{
        },
        props:{
            goodsList: Array,
            title: {
                type:Object
            }
        },
        watch:{
        },
        created(){
        },
        methods:{
            handleDetail(item,index){
                this.$confirm('您确认要删除该商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteDetail(item.id, index)
                })

            },
            deleteDetail(id, index = -1) {
                let params = {
                    buyId: this.title.buyId,
                    buyerId: this.title.buyerId,
                    buyOrderDetailList: [{
                        id: id,
                        delFlag:"1"
                    }]
                };
                this.request.modifyList(params).then(res => {
                    if(res.code == 200){
                        this.$message.success( res.msg)
                    }else{
                        this.$message.warning(res.msg)
                    }
                    this.purchaseList()
                })
            },
            searchGoodsByName() {
                // 将row信息传入
                let _this = this;
                return function (searchValue) {
                    if (searchValue !== '') {
                        let params = {
                            goodsName: searchValue,
                        }
                        _this.getGoodsList(params).then(res => {
                            _this.checkList = res
                        })
                    }
                }
            },
            getGoodsList(params) {
                params.pageSize = 20;
                params.buyerId = this.title.buyerId;
                params.buySeq = this.title.buySeq;
                return this.request.getGoodsList(params).then(res => {
                    if (res.code == 200) {
                        return res.ext.list
                    } else {
                        console.log('商品列表获取错误', res.msg)
                    }
                })
            },
            openShow(){
                this.resetAddGood();
                this.showAdd = true;
            },
            closeShow(){
                this.resetAddGood();
                this.showAdd = false;
            },
            resetAddGood(){
                this.goodsIndex = "";
                this.checkList = [];
                this.modelList = [];
                this.spuGoods = {};
                this.skuGoods = {};
                this.goodsModelIndex = "";
            },
            onGoodsSelectChange() {
                if(typeof this.goodsIndex == 'number'){
                    this.spuGoods =  this.checkList[this.goodsIndex];
                    this.goodsModelIndex = 0;
                    this.onGoodsModelSelectChange();
                }else{
                    this.skuGoods = {};
                    this.spuGoods = {};
                    this.goodsModelIndex = "";
                }
            },
            onGoodsModelSelectChange() {
                this.skuGoods = this.spuGoods.goodsModelList[this.goodsModelIndex];
                this.skuGoods.goodsName = this.spuGoods.goodsName
            },
            handleChangeNum(item){
                let regNum = /^[0-9]+(\.[0-9]{1,2})?$/;
                let regPrice =  /^[0-9]+(\.[0-9]{1,2})?$/;
                if(!regNum.test(item.goodsNum)){
                    this.$message.error('数量有误,请输入数字,最多2位小数');
                    return;
                }
                if(!regPrice.test(item.buyPrice)){
                    this.$message.error('价格有误,请输入数字,最多2位小数');
                    return;
                }
                let params = {};
                params.buyOrderDetailList = [item];
                this.changeNum( params);
            },
            // 新增商品
            addBuyOrder(params = {}) {
                this.$confirm('您确认要新增该商品吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    params.buyId = this.title.buyId;
                    params.buyerId = this.title.buyerId;
                    let obj = { ...this.skuGoods};
                    obj.goodsId = obj.id;
                    obj.id = "";
                    if( !obj.goodsNum){
                        this.$message.warning( "请输入商品数量")
                        return;
                    }
                    params.buyOrderDetailList = [obj];
                    this.request.modifyList(params).then(res => {
                        if (res.code == 200) {
                            this.$message.success( res.msg)
                            this.purchaseList()
                        } else {
                            this.skuGoods = {}
                            this.$message.warning( res.msg)
                        }
                        this.closeShow();
                    })
                })
            },
            // 修改商品数量
            changeNum(params = {}){
                params.buyId = this.title.buyId;
                params.buyerId = this.title.buyerId;
                this.request.modifyList(params).then(res => {
                    if (res.code == 200) {
                        this.$message.success( res.msg)
                    } else {
                        this.$message.warning( res.msg)
                        this.purchaseList()
                    }
                })
            },
            // 修改 采购单基础信息
            updateBuyOrder() {
                if(!this.goodsList || this.goodsList.length < 1){
                    this.$message.error("无采购单明细信息");
                    return ;
                }
                let params = {
                    buyId: this.title.buyId,
                    buyerId: this.title.buyerId,
                    deliveryTime: this.title.deliveryTime,
                    buySeq: this.title.buySeq,
                    needNote: this.title.needNote,
                    remarks: this.title.remarks,
                    // 默认提交第一条明细
                    buyOrderDetailList: [this.goodsList[0]]
                };
                this.request.modifyList(params).then(res => {
                    if (res.code == 200) {
                        this.$message.success( res.msg);
                    } else {
                        this.$message.warning( res.msg);
                        this.purchaseList();
                    }
                })
            },
            purchaseList(){
                this.request.purchaseList({ buyId: this.title.buyId,pageSize: 100}).then(res => {
                    if( res.code == 200) {
                        this.changeGoodsList(res.ext.list);
                    }else{
                        this.changeGoodsList([]);
                        this.$message.warning( res.msg)
                    }
                }).catch( err => {
                    this.$message.error( err)
                })
            },
            changeGoodsList(list){
                this.$emit('change-list', list);
            },
            showPhoto(url){
                this.spuGoods.thumbUrl = url;
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-row{
        margin-top: 10px;
    }
    .input-num{
        width: 100px;
    }
    .date-field{
        width: 150px;
    }
    .select-field{
        width: 150px;
    }
</style>
