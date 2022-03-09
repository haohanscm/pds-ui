<template>
    <div style="overflow:hidden">
        <div style="display:flex">
            <div class="handle-box">
                调出店铺：<el-select class="input" 
                v-model="allotoutId" 
                placeholder="选择你要调出的店铺">
                    <el-option
                    v-for="item in value"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="handle-box">
                调入店铺：<el-select class="input" 
                v-model="allotinId" 
                placeholder="选择你要调入的店铺">
                    <el-option
                    v-for="item in value"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
        <div class="handle-box" style="display:flex">
            <el-button @click="search">搜索</el-button>
        </div>
        </div>
        <el-table :data="checkList">
            <el-table-column property="barCode" label="条形码"></el-table-column>
            <el-table-column property="goodsName" label="商品名"></el-table-column>
            <el-table-column property="goodsModelId" label="规格"></el-table-column>
            <el-table-column property="stockNum" label="库存"></el-table-column>
            <el-table-column property="address" label="数量" width="200">
                <template slot-scope="scope">
                    <el-input-number 
                    @change="handleNumChange(scope.row, scope.$index)" 
                    v-model="scope.row.num" 
                    size="mini" :min="0" 
                    :max="scope.row.stockNum">
                    </el-input-number>
                </template>
            </el-table-column>
            <el-table-column property="price" label="进价"></el-table-column>
            <el-table-column property="address" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" 
                    @click="handleItemRemove(scope.row, scope.$index)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <div style="display:flex">
                <div style="flex:1;display:flex">
                    备注信息：<el-input 
                    v-model="operateNode" 
                    style="flex:1" placeholder="备注">
            </el-input>
                </div>
                <div style="flex:1">
                </div>
            </div>
            <div style="display:flex">
                <div style="flex:1">
                    合计金额：{{totalAmount}}
                </div>
                <div style="flex:1">
                    调拨单号：{{allotNum}}
                </div>
            </div>
        </div>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="handleAddAllot">新增调拨</el-button>
        </span>
    </div>
</template>
<script>
    import request from "../../request.js"
    export default {
        name: 'tabs',
        data() {
            return {
                request: new request(),
                allotinId: "",
                allotoutId: "",
                checkList: [],
                allotNum: this.$utils.strConstructor(),
                allotGoods: [],
                totalAmount: "0.00",
                operateNode: ""
            }
        },
        props:{
            value: Array
        },
        watch:{
            allotinId:{
                handler(){
                    this.checkList = [];
                }
            },
            allotoutId:{
                handler(){
                    this.checkList = [];
                }
            }
        },
        created(){
        },
        computed:{
        },
        methods: {
            /**
             * 页面操作
             */
            search(){
                this.findStockGoodsPage()
            },
            handleItemRemove( item, index){
                this.checkList.splice( index, 1)
            },
            handleNumChange( item, index){
                let num = 0;
                this.checkList.forEach(ele => {
                    num += (( ele.price * ele.num ) || 0)
                })
                this.totalAmount = num.toFixed(2)
            },
            handleAddAllot(){
                this.addGoodsAllot();
                this.dialogTableVisible3 = false
            },
            closeModal(){
                this.$emit("close", false)
            },

            /**
             * request
             */
            //查询库存商品列表
            findStockGoodsPage(){
                this.request.findStorageGoodsPage(
                    {
                        warehouseId: this.allotoutId
                    }
                ).then(res => {
                    if(res.code == 200){
                        this.checkList = res.list; 
                    }else{
                        this.checkList = [];
                    }
                })
            },
            //新增调拨
            addGoodsAllot(){
                let allotDetails = []
                this.checkList.forEach(ele => {
                    if(ele.num > 0){
                        allotDetails.push({
                            goodsModelId: ele.goodsModelId,
                            goodsName: ele.goodsName,
                            goodsNum: ele.num
                        })
                    }
                });
                this.request.addGoodsAllot({
                    // allotNum: this.allotNum,
                    totalAmount: this.totalAmount,
                    allotoutId: this.allotoutId,
                    allotinId: this.allotinId,
                    operateNode: this.operateNode,
                    goodsAllotDetailList: allotDetails
                }).then(res => {
                    if(res.code == 200){
                        this.$message.success( "新增调拨成功！")
                    }else{
                        this.$message.warning( res.msg)
                    }
                })
                this.$emit("closeModal", false)
            }
        }
    }

</script>
<style scoped>
    .handle-box {
        margin-left: 15px;
    }
    .dialog-footer{
        float: right;
        display: block;
    }
</style>