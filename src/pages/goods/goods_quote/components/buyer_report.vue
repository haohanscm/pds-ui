<template>
    <div>
        <div class="title">
            <div>选择商家:<el-select v-model="buyerId" placeholder="请选择">
                <el-option
                    filterable 
                    v-for="item in buyerList"
                    :key="item.id"
                    :label="item.buyerName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
           <div>
                <div>报价时间:</div>
                <div>
                    <el-date-picker
                        v-model="date"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-button 
                    @click="handleCheck" 
                    type="primary">查询
                </el-button>
            </div>
        </div>
        <div class="content">
            <div class="cont-item">
                <table border="1" :v-loading="loading">
                    <caption style="background-color: white">{{pmName}}</caption>
                    <tbody>
                        <tr>
                            <td colspan="1" class="blod bc-yellow">采购商名称</td>
                            <td colspan="4">{{head.buyerName}}</td>
                            <td class="blod bc-yellow">负责人</td>
                            <td class="print-hidden" colspan="2">{{head.contact}}</td>
                            <td class="blod bc-yellow">有效期</td>
                            <td colspan="3">{{startDate}} 至 {{endDate}} <el-button type="text" @click="goToNext">下一阶段报价</el-button></td>
                        </tr>
                        <tr>
                            <td class="blod bc-yellow" colspan="1">地址</td>
                            <td colspan="7">{{head.address}}</td>
                            <td class="blod bc-yellow" >联系电话</td>
                            <td colspan="3" >{{head.telephone}}</td>
                        </tr>
                        <tr>
                            <td colspan="12">&nbsp;</td>
                        </tr>
                        <tr v-for="(item,index) in goodsList" :key="index">
                            <td class="blod bc-yellow" rowspan="2" v-if="item[0] && item[0].title">{{item[0].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[0] && item[0].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[0] && item[0].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[0] && item[0].neck">报价</td>
                            <td v-if="item[0] && item[0].body">{{item[0].body.goodsName}}-{{item[0].body.modelName}}</td>
                            <td v-if="item[0] && item[0].body">{{item[0].body.marketPrice}}</td>
                            <td v-if="item[0] && item[0].body">
                                <el-input-number 
                                    v-if="item[0].body.purchasePrice"
                                    @change="handlePriceChange( item[0].body)" 
                                    v-model="item[0].body.purchasePrice">
                                </el-input-number>
                            </td>

                            <td class="blod bc-yellow" rowspan="2" v-if="item[1] && item[1].title">{{item[1].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[1] && item[1].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[1] && item[1].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[1] && item[1].neck">报价</td>
                            <td v-if="item[1] && item[1].body">{{item[1].body.goodsName}}-{{item[1].body.modelName}}</td>
                            <td v-if="item[1] && item[1].body">{{item[1].body.marketPrice}}</td>
                            <td v-if="item[1] && item[1].body">
                                <el-input-number 
                                    v-if="item[1].body.purchasePrice"
                                    @change="handlePriceChange( item[1].body)" 
                                    v-model="item[1].body.purchasePrice">
                                </el-input-number>
                            </td>
                            
                            <td class="blod bc-yellow" rowspan="2" v-if="item[2] && item[2].title">{{item[2].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[2] && item[2].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[2] && item[2].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[2] && item[2].neck">报价</td>
                            <td v-if="item[2] && item[2].body">{{item[2].body.goodsName}}-{{item[2].body.modelName}}</td>
                            <td v-if="item[2] && item[2].body">{{item[2].body.marketPrice}}</td>
                            <td v-if="item[2] && item[2].body">
                                <el-input-number
                                    v-if="item[2].body.purchasePrice"
                                    @change="handlePriceChange( item[2].body)" 
                                     v-model="item[2].body.purchasePrice">
                                </el-input-number> 
                            </td>
                            
                            <td class="blod bc-yellow" rowspan="2" v-if="item[3] && item[3].title">{{item[3].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[3] && item[3].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[3] && item[3].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[3] && item[3].neck">报价</td>
                            <td v-if="item[3] && item[3].body">{{item[3].body.goodsName}}-{{item[3].body.modelName}}</td>
                            <td v-if="item[3] && item[3].body">{{item[3].body.marketPrice}}</td>
                            <td v-if="item[3] && item[3].body">
                                <el-input-number
                                v-if="item[3].body.purchasePrice"
                                @change="handlePriceChange( item[3].body)" 
                                v-model="item[3].body.purchasePrice">
                                </el-input-number>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table border="1" style="display:none" id="ddd" :v-loading="loading">
                    <caption style="background-color: white">{{pmName}}</caption>
                    <tbody>
                        <tr>
                            <td colspan="1" class="blod bc-yellow">采购商名称</td>
                            <td colspan="4">{{head.buyerName}}</td>
                            <td class="blod bc-yellow">负责人</td>
                            <td class="print-hidden" colspan="2">{{head.contact}}</td>
                            <td class="blod bc-yellow">有效期</td>
                            <td colspan="3">{{startDate}} 至 {{endDate}} <el-button type="text" @click="goToNext">下一阶段报价</el-button></td>
                        </tr>
                        <tr>
                            <td class="blod bc-yellow" colspan="1">地址</td>
                            <td colspan="7">{{head.address}}</td>
                            <td class="blod bc-yellow" >联系电话</td>
                            <td colspan="3" >{{head.telephone}}</td>
                        </tr>
                        <tr>
                            <td colspan="12">&nbsp;</td>
                        </tr>
                        <tr v-for="(item,index) in goodsList" :key="index">
                            <td class="blod bc-yellow" rowspan="2" v-if="item[0] && item[0].title">{{item[0].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[0] && item[0].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[0] && item[0].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[0] && item[0].neck">报价</td>
                            <td v-if="item[0] && item[0].body">{{item[0].body.goodsName}}-{{item[0].body.modelName}}</td>
                            <td v-if="item[0] && item[0].body">{{item[0].body.marketPrice}}</td>
                            <td v-if="item[0] && item[0].body">{{item[0].body.purchasePrice}}
                            </td>

                            <td class="blod bc-yellow" rowspan="2" v-if="item[1] && item[1].title">{{item[1].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[1] && item[1].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[1] && item[1].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[1] && item[1].neck">报价</td>
                            <td v-if="item[1] && item[1].body">{{item[1].body.goodsName}}-{{item[1].body.modelName}}</td>
                            <td v-if="item[1] && item[1].body">{{item[1].body.marketPrice}}</td>
                            <td v-if="item[1] && item[1].body">{{item[1].body.purchasePrice}}</td>
                            
                            <td class="blod bc-yellow" rowspan="2" v-if="item[2] && item[2].title">{{item[2].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[2] && item[2].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[2] && item[2].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[2] && item[2].neck">报价</td>
                            <td v-if="item[2] && item[2].body">{{item[2].body.goodsName}}-{{item[2].body.modelName}}</td>
                            <td v-if="item[2] && item[2].body">{{item[2].body.marketPrice}}</td>
                            <td v-if="item[2] && item[2].body">{{item[2].body.purchasePrice}}</td>
                            
                            <td class="blod bc-yellow" rowspan="2" v-if="item[3] && item[3].title">{{item[3].name}}</td>
                            <td class="blod bc-yellow" colspan="2" v-if="item[3] && item[3].title">净重</td>
                            <td class="blod bc-yellow" v-if="item[3] && item[3].neck">市场价</td>
                            <td class="blod bc-yellow" v-if="item[3] && item[3].neck">报价</td>
                            <td v-if="item[3] && item[3].body">{{item[3].body.goodsName}}-{{item[3].body.modelName}}</td>
                            <td v-if="item[3] && item[3].body">{{item[3].body.marketPrice}}</td>
                            <td v-if="item[3] && item[3].body">{{item[3].body.purchasePrice}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <a id="bb" @click="exportExcel">导出excel</a>
        <el-button 
            @click="shopDia = true" 
            type="primary">将该表格应用到
        </el-button>
        <el-dialog title="商家列表" :visible.sync="shopDia">
            <el-table
                :data="buyerList"
                stripe
                style="min-width: 100%">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="buyerName" label="采购商" min-width="100">
                </el-table-column>
                <el-table-column prop="contact" label="联系人">
                </el-table-column>
                <el-table-column prop="totalPrice" label="设置上浮比率" >
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.rate" :step="0.01"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="操作" >
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleDest(scope.row, scope.$index)">应用到此商家</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import { Loading } from 'element-ui';
    import excel from "../../../../utils/exportExcel.js";
    import Request from "../../request.js";
    import construct from "./listConstructor.js"
    export default {
        data: function(){
            return {
                activeName: "first",
                buyerId: "",
                request: new Request(),
                buyerList: [],
                date: '',
                head: {},
                shopDia: false,
                endDate: "",
                startDate: "",
                goodsReqList: [],
                deliveryTime: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate(),
                // goodsList: [1],//商品列表
                pmName: this.$utils.getCookie('pmName'),
                goodsList:[],
                loading: true
            }
        },
        components:{

        },
        watch:{
        },
        created(){
            this.fetchBuyerList()
        },
        methods:{
            handleCheck(){
                switch (this.activeName) {
                    case "first":
                        this.queryList()
                        break;
                
                    default:
                        break;
                }
            },
            handlePriceChange( item){
                this.goodsReqList.push({id: item.id,price: item.purchasePrice});
                this.batchUpdateGoodsPrice(item);
                console.log( item);
            },
            exportExcel(){
                excel.getExcel("ddd","",this.pmName + "报价单.xls","bb")
            },
            handleClick(){
                this.queryList()
            },
            goToNext(){
                let d =  +new Date( this.endDate)
                d += 24 * 60 * 60 * 1000;
                d = new Date(d);
                let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
                this.date = str;
                this.queryList()
            },
            // 处理应用到某个商家
            handleDest(item, index){
                let idx;
                this.buyerList.forEach( (ele,indx) => {
                    if( ele.id == this.buyerId){
                        idx = indx
                    }
                })
                console.log( index)
                console.log(this.buyerList[idx].buyerName)
                this.$confirm(`您确认将您对${this.buyerList[idx].buyerName}下${this.startDate}日到${this.endDate}日的报价上升${item.rate}的比率应用到${item.buyerName}？`)
                .then(res => {
                    this.copyGoodsByBuyer({destBuyerId:item.id,
                    queryDate: this.deliveryTime,
                    rate: item.rate,
                    })
                })
                
            },
            // 查询采购商列表
            fetchBuyerList(){
                this.request.fetchBuyerList().then( res => {
                    if(res.code == 200){
                        this.buyerList = res.ext;
                    }else{
                        this.$message.warning(res.msg)
                    }
                    
                }).catch(err => {
                    this.$message.warning(err)
                })
            },
            // 查询商品列表
            queryList(){
                let loadingInstance = Loading.service()
                this.request.queryGoodsList({
                    buyerId: this.buyerId,
                    queryDate: this.date
                }).then(res => {
                    if( res.code === 200){
                        this.head = res.ext.pdsBuyer;
                        this.goodsList = construct.build(res.ext.categoryList,4);
                        this.startDate = res.ext.startDate;
                        this.endDate = res.ext.endDate;
                        console.log( this.goodsList)
                        this.loading = false;
                    }else{
                        this.$message.warning(res.msg)
                        this.loading = false;
                    }
                    loadingInstance.close()
                }).catch( err => {
                    this.$message.warning( err)
                    this.loading = false;
                    loadingInstance.close()
                })
            },
            // 批量更新商品报价
            batchUpdateGoodsPrice(item){
                this.request.batchUpdateGoodsPrice({ goodsReqList: this.goodsReqList,buyerId: this.buyerId}).then( res => {
                    if( res.code === 200){
                        this.$message.success( res.msg)
                        item.oldPurchasePrice = item.purchasePrice
                    }else{
                        this.$message.warning( res.msg)
                        item.purchasePrice = item.oldPurchasePrice
                    }
                }).catch( err => {
                        this.$message.warning( err)
                        item.purchasePrice = item.oldPurchasePrice
                })
            },
            // 
            copyGoodsByBuyer(params = {}){
                params.buyerId = this.buyerId;
                this.request.copyGoodsByBuyer(params).then(res => {
                    if( res.code === 200){
                        this.$message.success(res.msg)
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .title{
        display: flex; 
        display: flex;
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
        justify-content: space-between;
        >div{
            display: flex;
            width: 300px;
            align-self: center;
        }
    }
    .to-left{
        text-align: left;
    }
    caption{
        font-size: 24px;
    }
    .blod{
        font-weight: 600;
    }
    .padRight{
        text-align: center;
        margin: 0 auto;
        // height: 100%;
    // transform: rotateZ(90deg);
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
        font-size: 14px;
        color: #bbb;
    }
    .padRight-cons{
        text-align: center;
        margin: 0 auto;
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
        font-size: 14px;
    }
    table{
        border-spacing: 0px;
        // border: 0.5px;
        td{
            border: 0.5px;
        }
    }
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
    td ,th{
        // border: 0 1px 1px 0;
        padding: 0;
        max-width: 150px;
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
        text-align: center;
        line-height: 100%;
        border: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #666666;
        background-color: #ffffff;
    }
    .print-show{
        display: none;
    }
    @media print{
        .print-show{
            display: table-cell !important;
        }
        .print-hidden{
            display: none;
        }
    }
</style>
