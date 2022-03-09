<template>
    <div>
        <el-row>
            <!-- <el-col :span="24">
                <el-input @change="handelInputChange" placeholder="输入商品编码搜索" v-model="modelCode">

                </el-input>
                <el-button @change="handelInputChange">
                    搜索
                </el-button>
            </el-col>     -->
        </el-row>
        <div class="block">
            <div class="block-left">
                <el-menu class="sidebar-el-menu" @select="handleSelect"  background-color="#fff"
                    text-color="#333" active-text-color="#0000ff" unique-opened>
                    <template v-for="item in warehouseList">
                        <el-menu-item :key="item.id" :index="item.id">
                            <span slot="title">{{ item.name }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
            <div class="block-right">
                <div class="block-item">
                    <el-table
                        v-loading="loading"
                        ref="multipleTable"
                        :data="chooseItems"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column
                        type="selection"
                        width="40">
                        </el-table-column>
                        <el-table-column
                        label="商品编码"
                        prop="barCode"
                        width="120"
                        show-overflow-tooltip>
                        </el-table-column> 
                        <el-table-column
                        label="商品名"
                        prop="goodsName"
                        width="250"
                        show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                        prop="price"
                        label="价格"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        prop="attr"
                        label="规格">
                        </el-table-column>
                        <el-table-column
                        prop="stockNum"
                        label="库存">
                        </el-table-column>
                    </el-table>
                </div>
                <!-- <div v-if="!chooseItems.length">暂无数据</div> -->
            </div>
        </div>
    </div>
</template>

<script>
    import request from "../../request.js";
    export default {
        data() {
            return {
                modelCode: "",//扫码条码
                warehouseId: "",//已选条目的id
                tagsList: [],
                chooseItems: [],//备选项
                checkStatusList: [],
                request: new request(),
                loading: false,
            }
        },
        props:{
            warehouseList: Array,
            value: Array,
            supplierId: String
            // checkedList: Array//已选项
        },
        mounted(){
        },
        computed:{
            //商品查询model
            goodsModel(){
                return {
                    warehouseId: this.warehouseId,
                    // supplierId: this.supplierId,
                    pageNo: 1,
                    pageSize: 200
                }
            },
        },
        methods:{
            /**
             * 执行类
             * **/
            //输入框输入值或者点击搜索
            handelInputChange(){
                this._findStockGoodsPage()
            },
            //点击菜单栏
            handleSelect(key){
                this.warehouseId = key;
                console.log(key)
                this._findStockGoodsPage()
            },
            //处理选择项改变
            handleSelectionChange(val){
                // this.chooseItems.forEach(ele => {
                //     this.$utils.deleteItem(this.value,ele,"id")
                // })
                val.forEach( ele => {
                    ele.maxNum = ele.stockNum;
                    ele.amount = (+ele.stockNum)*(ele.price*100)/100
                    this.value.push( ele)
                })
                this.$utils.fliterItem(this.value,"id")
            },
            /**
             * 工具类
             */
            isSelect(arr){
                arr.forEach((ele,index)=>{
                    console.log(this.value)
                    if(this.$utils.findItem(this.value,ele,"id") !== -1){
                        this.$refs.multipleTable.toggleRowSelection(ele,true)
                    }
                })
            },
            /**
             * 请求类
             */  
            // /**查询商品列表 */
            // _goodsModelList(){
            //     this.loading = true;
            //     this.request.goodsModelList(this.goodsModel).then( res => {
            //         if ( res.code == 200 ){
            //             this.chooseItems = res.ext.list;
            //             setTimeout(() => {
            //                 this.isSelect(this.chooseItems)
            //             }, 100);
            //         }else {
            //             this.chooseItems = [];
            //         }
            //         this.warehouseId = "";
            //         this.loading = false;
            //     })
            // },
            /**获取仓库库存列表 */
            _findStockGoodsPage(){
                this.loading = true;
                console.log(this.goodsModel)
                this.request.findStockGoodsPage(this.goodsModel).then( res => {
                    if( res.code == 200){
                        this.chooseItems = res.list;
                    }
                    this.loading = false;
                })
            }
        }
    }

</script>


<style scoped>
    .block{
        display: flex;
        width: 100%;
        height: 400px;
        background-color: #fff;
        border: 1px solid #eaeaea;
    }
    .sidebar-el-menu{
        height: 100%;
    }
    .block>.block-left{
        width: 30%;
        overflow:auto;
        /* flex: 2; */
    }
    .block>.block-right{
        width: 70%;
        overflow:auto;
        /* flex: 5; */
    }
    .block-item{
        margin: 5px;
    }
    .el-col{
        display: flex;
        margin-bottom: 20px;
    }
</style>