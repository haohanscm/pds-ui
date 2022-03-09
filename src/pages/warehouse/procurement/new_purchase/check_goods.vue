<template>
    <div>
        <div class="block">
            <div class="block-left">
                <el-menu class="sidebar-el-menu" @select="handleSelect"  background-color="#fff"
                    text-color="#333" active-text-color="#0000ff" unique-opened>
                    <template v-for="item in categoryList">
                        <el-menu-item :key="item.id" :index="item.id">
                            <span slot="title">{{ item.name }}</span>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
            <div class="block-right">
                <div v-if="chooseItems.length" class="block-item">
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
                        prop="modelCode"
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
                        prop="modelPrice"
                        label="价格"
                        width="120">
                        </el-table-column>
                        <el-table-column
                        prop="modelName"
                        label="规格">
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="!chooseItems.length">暂无数据</div>
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
                goodsCategoryId: "",//已选条目的id
                tagsList: [],
                chooseItems: [],//备选项
                checkStatusList: [],
                request: new request(),
                loading: false,
            }
        },
        props:{
            categoryList: Array,
            value: Array
            // checkedList: Array//已选项
        },
        mounted(){
            console.log(534)
        },
        computed:{
            //商品查询model
            goodsModel(){
                return {
                    modelCode: this.modelCode,
                    goodsCategoryId: this.goodsCategoryId,
                    pageNo: 1,
                    pageSize: 500
                }
            },
        },
        methods:{
            /**
             * 执行类
             * **/
            //输入框输入值或者点击搜索
            handelInputChange(){
                this._goodsModelList()
            },
            //点击菜单栏
            handleSelect(key){
                this.goodsCategoryId = key;
                this._goodsModelList()
            },
            //处理选择项改变
            handleSelectionChange(val){
                val.forEach( ele => {
                    ele.num = 1;
                    ele.sumAmount = ((+ele.num) * ((+ele.modelPrice) *100)/100).toFixed(2);
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
            /**查询商品列表 */
            _goodsModelList(){
                this.loading = true;
                this.request.goodsModelList(this.goodsModel).then( res => {
                    if ( res.code == 200 ){
                        this.chooseItems = res.ext.list;
                        setTimeout(() => {
                            this.isSelect(this.chooseItems)
                        }, 100);
                    }else {
                        this.chooseItems = [];
                    }
                    this.goodsCategoryId = "";
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