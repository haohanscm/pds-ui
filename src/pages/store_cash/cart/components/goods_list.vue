<template>
    <div :class="['goods-list-wrap', categoryId ? 'wrap-with-cate': '']">
        <div class="goods-list">
            <div class="goods-aside">
                <el-menu default-active="" active-text-color="#235073" text-color="#999" @select="selectPrimaryCate">
                    <el-menu-item index="">全部</el-menu-item>
                    <el-menu-item :index="item.id" v-for="(item, index) in primaryCate" :key="index">
                        {{item.name}}
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="goods-wrap" v-loading="loading">
                <div class="goods-header" v-if="categoryId">
                    <div style="width:600px">
                        <el-menu :default-active="secondCate[0].id" mode="horizontal" @select="selectSecondCate"
                            active-text-color="#235073" text-color="#999">
                            <el-menu-item :index="item.id" v-for="(item, index) in secondCate" :key="index">
                                {{item.name}}
                            </el-menu-item>
                        </el-menu>
                    </div>
                </div>
                <div class="goods-body">
                    <div class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="selectGoods(item, index)">
                        <el-card shadow="hover" >
                            <div @click="checkGoods(item)">
                                <goods-item :height="80" :width="300" :goods="item"></goods-item>
                            </div>
                            
                        </el-card>
                    </div>
                    <el-pagination
                        v-show="totalCount"
                        small
                        layout="prev, pager, next"
                        :page-size="15"
                        :current-page.sync="currentPage"
                        :total="totalCount"
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
            <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
                <el-radio-group v-model="checkedIndex">
                    <el-radio v-for="(item,index) in checkedItem.goodsModelList" :label="index" :key="index">{{item.modelName}}</el-radio>
                </el-radio-group>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="filtGoods(checkedItem,checkedIndex)">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import Request from './../../request.js'
    import goodsItem from './goods_item'
    export default {
        data() {
            return {
                request: new Request(),
                visibleGoodsModel: false,
                goodsList: [],
                goodsCategories: [],
                currentPage: 1,
                pageSize: 15,
                categoryId: '',
                totalCount: 0,
                selectGoodsItem: {},
                modelId: '',
                primaryCateId: '',
                secondCateId: '',
                loading: false,
                dialogVisible: false,
                checkedItem: {},
                checkedIndex: 0
            }
        },
        props:{
            buyerId: String,
            value: Array
        },
        watch:{
            value:{
                handler(){
                },
                deep: true
            },
            checkedItem:{
                handler(){

                },
                deep: true
            }
        },
        computed: {
            primaryCate: function () {
                let list = this.goodsCategories.filter(item => {
                    return item.parentId == 0
                })
                return list
            },
            secondCate: function () {
                if (!this.primaryCateId) return
                let list = this.goodsCategories.filter(item => {
                    return item.parentId == this.primaryCateId
                })
                return list
            },
        },
        components: {
            goodsItem
        },
        created() {
            this.fetchCategoryList()
        },
        mounted() {
            this.getGoodsList()
        },
        methods: {
            getGoodsList(params = {}) {
                this.loading = true;
                params.buyerId = this.buyerId;
                params.shopId = $constant.shopId
                params.pageNo = this.currentPage
                params.pageSize = this.pageSize
                this.request.getGoodsList(params).then(res => {
                    this.loading = false
                    if (res.code == 200) {
                        this.goodsList = res.ext.list
                        this.currentPage = res.ext.pageNo
                        this.totalCount = res.ext.count
                    } else if (res.code == '983') {
                        this.goodsList = []
                    } else {
                        this.goodsList = []
                        this.$message.error('请求失败')
                    }
                })
            },
            selectGoods(item) {
                this.selectGoodsItem = item
                this.$emit('select', item)
            },
            handleCurrentChange(e){
                this.currentPage = e;
                this.getGoodsList({
                    categoryId: this.secondCateId
                })
            },
            fetchCategoryList(params = {}) {
                this.loading = true
                params.shopId = $constant.shopId
                this.request.fetchCategoryList(params).then(res => {
                    if (res.code == '200') {
                        this.goodsCategories = res.ext
                        this.loading = false
                    } else {
                        this.$message.error('分类数据, 请求失败')
                    }
                })
            },
            selectPrimaryCate(id) {
                this.categoryId = id
                this.primaryCateId = id
                let subId = this.secondCate[0].id
                this.currentPage = 1
                this.getGoodsList({
                    categoryId: subId
                })
            },
            selectSecondCate(id) {
                this.secondCateId = id
                this.categoryId = id
                this.currentPage = 1
                this.getGoodsList({
                    categoryId: id
                })
            },
            checkGoods(item){
                if(item.goodsModelList.length > 1){
                    this.checkedItem = item;
                    this.dialogVisible = true;
                }else{
                    this.filtGoods( item, 0)
                }
            },
            handleModelCheck(){

            },
            filtGoods(params,index){
                let obj = { ...params.goodsModelList[index]};
                obj.goodsName = params.goodsName;
                this.dialogVisible = false;
                let index1 = this.$utils.findItem( this.value, obj, "id");
                if(index1 < 0){
                    obj.goodsNum = 1;
                    this.value.push(obj)
                }else{
                    // let num = this.value[index].goodsNum + 1;
                    let obj1 = {...this.value[index1]}
                    obj1.goodsNum += 1;
                    this.value.splice(index1, 1, obj1)
                }
            }
        }
    }

</script>

<style scoped>
    .goods-list-wrap {
        font-size: 18px;
    }

    .wrap-with-cate {
        height: 100%;
    }

    .goods-list {
        height: 100%;
        margin-top: 10px;
        background: #fff;
        border: 1px solid #e7e7e7;
        border-radius: 3px;
    }

    .goods-aside {
        float: left;
        /* background: #e7e7e7; */
        border-right: 2px solid #e7e7e7;
        width: 100px;
        height: 100%;
        overflow: auto;
        overflow-x: hidden;
    }

    .goods-aside .el-menu {
        border: unset;
    }

    .goods-wrap {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .goods-header {
        display: flex;
        height: 60px;
        margin-left: 100px;
        /* background: #e7e7e7; */
        border-bottom: 2px solid #e7e7e7;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }

    .goods-header .el-menu {
        border: unset;
        display: inline-block;
    }

    
    .el-menu--horizontal>.el-menu-item{
        display: inline-block;
        float: none !important;
    }

    .goods-body {
        height: 1000px;
        padding-top: 10px;
        padding-left: 10px;
        overflow: auto;
    }

    .wrap-with-cate .goods-body {
        height: calc(100% - 75px)
    }

    .goods-item {
        margin: 10px;
        display: inline-block;
    }

    .goods-btn {
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
        border-bottom: 2px solid #e7e7e7;
    }

    .goods-btn .el-button {
        color: #235073;
        font-size: 18px;
    }

    .goods-model-title {
        font-size: 20px;
        margin-left: 10px;
    }

    .goods-model-option {
        padding: 3px 10px;
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .goods-submodel {
        /* display: flex; */
        padding-left: 10px;
    }

    .goods-submodel-item {
        display: flex;
        border: 1px solid #606266;
        padding: 3px 10px;
        margin: 10px;
        border-radius: 3px;
    }

    .goods-model-price {
        font-size: 20px;
        padding-right: 20px;
    }

    .txt-right {
        text-align: right;
    }

</style>
