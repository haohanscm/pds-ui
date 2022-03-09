<template>
    <el-container style="height: 650px">
        <el-header style="height: 100px" class="title">
            <el-form @submit.native.prevent :inline="true">
                <el-form-item label="采购商家:">
                    <v-buyer-merchant v-model="buyerMerchantId"></v-buyer-merchant>
                </el-form-item>
                <el-form-item label="查询日期:">
                    <el-date-picker
                        v-model="queryDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleCheck" type="primary">查询</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="4">
                    <el-button @click="initPriceDialog" type="primary">定价初始化</el-button>
                </el-col>
                <el-col :span="4">
                    <el-button @click="updateShopPriceDialog" type="primary">更新零售价</el-button>
                </el-col>
                <!--<el-col :span="6"></el-col>-->
                <el-col :span="10">
                    <template v-show="categoryList.length > 0">
                        查找商品:
                        <el-select
                            v-model="viewGoods"
                            filterable
                            @change="lookUp"
                            placeholder="请选择">
                            <el-option-group
                                v-for="group in categoryList"
                                :key="group.categoryId"
                                :label="group.categoryName">
                                <el-option
                                    v-for="item in group.goodsList"
                                    :key="item.id"
                                    :label="item.goodsName +'-'+ item.modelName"
                                    :value="item.id">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </template>
                </el-col>
            </el-row>
        </el-header>
        <el-main class="content">
            <el-container>
                <el-main>
                    <div class="cont-item">
                        <table border="1" :v-loading="loading" >
                            <caption style="background-color: white">{{pmName}}</caption>
                            <tbody>
                            <tr>
                                <td colspan="1" class="blod bc-yellow">采购商家名称</td>
                                <td colspan="1">{{head.merchantName}}</td>
                                <td class="blod bc-yellow">采购人</td>
                                <td class="print-hidden" colspan="1">{{head.contact}}</td>
                                <td class="blod bc-yellow">有效期</td>
                                <td colspan="2">{{startDate}} 至 {{endDate}}
                                    <!--<el-button type="text" @click="goToNext">下一阶段报价</el-button>-->
                                </td>
                            </tr>
                            <tr>
                                <td class="blod bc-yellow" colspan="1">地址</td>
                                <td colspan="3">{{head.address}}</td>
                                <td class="blod bc-yellow">联系电话</td>
                                <td colspan="2">{{head.telephone}}</td>
                            </tr>
                            <tr>
                                <td colspan="7">&nbsp;</td>
                            </tr>
                            <template v-for="category in categoryList">
                                <tr class="blod bc-yellow">
                                    <td class="blod bc-yellow">分类名称</td>
                                    <td class="blod bc-yellow">商品编号</td>
                                    <td class="blod bc-yellow">商品名称</td>
                                    <td class="blod bc-yellow">规格</td>
                                    <td class="blod bc-yellow">市场价</td>
                                    <td class="blod bc-yellow">采购价</td>
                                    <td class="blod bc-yellow">单位</td>
                                </tr>
                                <tr v-for="goods in category.goodsList" :id="'tr'+goods.id">
                                    <td>{{goods.categoryName}}</td>
                                    <td>{{goods.goodsModelSn}}</td>
                                    <td>{{goods.goodsName}}</td>
                                    <td>{{goods.modelName}}</td>
                                    <td>{{goods.marketPrice}}</td>
                                    <td>
                                        <!--{{goods.purchasePrice}}-->
                                        <el-input-number
                                            @change="handlePriceChange(goods)"
                                            v-model="goods.purchasePrice">
                                        </el-input-number>
                                    </td>
                                    <td>{{goods.unit}}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>-</td>
                                </tr>
                            </template>
                            </tbody>
                        </table>

                        <table border="1" :v-loading="loading" id="exportTable" style="display:none">
                            <caption style="background-color: white">{{pmName}}</caption>
                            <tbody>
                            <tr>
                                <td colspan="1" class="blod bc-yellow">采购商家名称</td>
                                <td colspan="1">{{head.merchantName}}</td>
                                <td class="blod bc-yellow">采购人</td>
                                <td class="print-hidden" colspan="1">{{head.contact}}</td>
                                <td class="blod bc-yellow">有效期</td>
                                <td colspan="2">{{startDate}} 至 {{endDate}}
                                </td>
                            </tr>
                            <tr>
                                <td class="blod bc-yellow" colspan="1">地址</td>
                                <td colspan="3">{{head.address}}</td>
                                <td class="blod bc-yellow">联系电话</td>
                                <td colspan="2">{{head.telephone}}</td>
                            </tr>
                            <tr>
                                <td colspan="7">&nbsp;</td>
                            </tr>
                            <template v-for="category in categoryList">
                                <tr class="blod bc-yellow">
                                    <td class="blod bc-yellow">分类名称</td>
                                    <td class="blod bc-yellow">商品编号</td>
                                    <td class="blod bc-yellow">商品名称</td>
                                    <td class="blod bc-yellow">规格</td>
                                    <td class="blod bc-yellow">市场价</td>
                                    <td class="blod bc-yellow">采购价</td>
                                    <td class="blod bc-yellow">单位</td>
                                </tr>
                                <tr v-for="goods in category.goodsList" >
                                    <td>{{goods.categoryName}}</td>
                                    <td>{{goods.goodsModelSn}}</td>
                                    <td>{{goods.goodsName}}</td>
                                    <td>{{goods.modelName}}</td>
                                    <td>{{goods.marketPrice}}</td>
                                    <td>
                                        {{goods.purchasePrice}}
                                    </td>
                                    <td>{{goods.unit}}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </template>
                            </tbody>
                        </table>
                    </div>
                </el-main>
            </el-container>
        </el-main>
        <el-footer>
            <a id="exportBtn" @click="exportExcel">
                <el-button type="primary">导出excel</el-button>
            </a>
        </el-footer>
        <el-dialog title="选项列表" :visible.sync="showDialog">
            <el-form
                :model="dialogForm"
                @submit.native.prevent
            >
                <el-form-item>
                    <span v-show="dialogShowType == 'init'">初始化采购商家采购价</span>
                    <span v-show="dialogShowType == 'update'">更新零售店铺市场价</span>
                </el-form-item>
                <el-form-item>
                    <v-buyer-merchant v-model="dialogForm.buyerMerchantId"></v-buyer-merchant>
                </el-form-item>
                <el-form-item label="定价时间段">
                    <el-date-picker
                        v-model="dialogForm.purchaseDate"
                        :clearable="false"
                        :editable="false"
                        type="daterange"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="下调价格比例" v-show="dialogShowType == 'init'">
                    <el-input v-model="dialogForm.rate" style="max-width: 250px" placeholder="输入小数"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="initPriceSubmit" v-show="dialogShowType == 'init'">开始初始化</el-button>
                    <el-button type="primary" @click="updateShopPriceSubmit" v-show="dialogShowType == 'update'">开始更新价格</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import {Loading} from 'element-ui';
    import excel from "../../../../utils/exportExcel.js";
    import Request from "../../request.js";
    // import construct from "./listConstructor.js";
    import vBuyerMerchant from "../../../../components/common/buyer_merchant_select";

    export default {
        data: function () {
            return {
                request: new Request(),
                activeName: "first",
                buyerMerchantId: "",
                buyerList: [],
                queryDate: this.nowDate(),
                head: {},
                endDate: "",
                startDate: "",
                deliveryTime: this.nowDate(),
                pmName: this.$utils.getCookie('pmName'),
                categoryList: [],
                loading: true,
                viewGoods: "",
                showDialog: false,
                dialogShowType: "init",
                dialogForm: {
                    shopId: "",
                    buyerMerchantId: "",
                    purchaseDate: [this.nowDate(), this.nowDate()],
                    rate: 0,
                },
            }
        },
        components: {
            vBuyerMerchant
        },
        watch: {},
        created() {
            this.lookUp();
        },
        computed: {},
        methods: {
            initPriceSubmit(){
                this.showDialog = false;
                let params = {
                    buyerMerchantId: this.dialogForm.buyerMerchantId,
                    startDate: this.dialogForm.purchaseDate[0],
                    endDate: this.dialogForm.purchaseDate[1],
                    rate: 0 - this.dialogForm.rate
                };
                if(!(params.buyerMerchantId && params.startDate && params.endDate)){
                    this.$message.warning("必选项未选择");
                    return;
                }
                if(!(params.rate<0.9 && params.rate>=-10)){
                    this.$message.warning("下调价格比例有误");
                    return;
                }
                this.request.initPrice(params).then(res => {
                    if (res.code === 200) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.warning(res.msg);
                    }
                }).catch(err => {
                    this.$message.warning(err);
                })
            },
            updateShopPriceSubmit(){
                this.showDialog = false;
                let params = {
                    buyerMerchantId: this.dialogForm.buyerMerchantId,
                    startDate: this.dialogForm.purchaseDate[0],
                    endDate: this.dialogForm.purchaseDate[1]
                };
                if(!(params.buyerMerchantId && params.startDate && params.endDate)){
                    this.$message.warning("必选项未选择");
                    return;
                }
                this.request.updatePriceToPmShop(params).then(res => {
                    if (res.code === 200) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.warning(res.msg);
                    }
                }).catch(err => {
                    this.$message.warning(err);
                })
            },
            initPriceDialog() {
                // 平台商家采购商定价初始化
                this.dialogShowType = "init";
                this.showDialog = true;
            },
            updateShopPriceDialog() {
                // 平台商家店铺零售价更新
                this.dialogShowType = "update";
                this.showDialog = true;
            },
            lookUp() {
                // 查找商品的锚点位置
                let id = this.viewGoods;
                console.log("viewGoods", id);
                if (id) {
                    document.querySelector("#tr" + id).scrollIntoView(true);
                    // document.querySelector("#"+id).style.backgroundColor = "#FFC000";
                }
            },
            nowDate() {
                let d = new Date();
                return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            },
            handleCheck() {
                switch (this.activeName) {
                    case "first":
                        this.queryList()
                        break;

                    default:
                        break;
                }
            },
            handlePriceChange(item) {
                this.updateGoodsPrice(item);
            },
            exportExcel() {
                if (this.categoryList) {
                    let excelName = this.pmName + "采购商定价单"+this.startDate+"_"+this.endDate+".xls";
                    excel.getExcel("exportTable", "采购商定价", excelName, "exportBtn")
                } else {
                    this.$message.warning("当前无表格数据");
                }
            },
            // handleClick(){
            //     this.queryList()
            // },
            // goToNext(){
            //     let d =  +new Date( this.endDate)
            //     d += 24 * 60 * 60 * 1000;
            //     d = new Date(d);
            //     let str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
            //     this.date = str;
            //     this.queryList()
            // },
            // // 处理应用到某个商家
            // handleDest(item, index){
            //     let idx;
            //     this.buyerList.forEach( (ele,indx) => {
            //         if( ele.id == this.buyerId){
            //             idx = indx
            //         }
            //     })
            //     console.log( index)
            //     console.log(this.buyerList[idx].buyerName)
            //     this.$confirm(`您确认将您对${this.buyerList[idx].buyerName}下${this.startDate}日到${this.endDate}日的报价上升${item.rate}的比率应用到${item.buyerName}？`)
            //     .then(res => {
            //         this.copyGoodsByBuyer({destBuyerId:item.id,
            //         queryDate: this.deliveryTime,
            //         rate: item.rate,
            //         })
            //     })
            //
            // },
            // // 查询采购商列表
            // fetchBuyerList(){
            //     this.request.fetchBuyerList().then( res => {
            //         if(res.code == 200){
            //             this.buyerList = res.ext;
            //         }else{
            //             this.$message.warning(res.msg)
            //         }
            //
            //     }).catch(err => {
            //         this.$message.warning(err)
            //     })
            // },
            // 查询商品列表
            queryList() {
                let params = {
                    buyerMerchantId: this.buyerMerchantId,
                    queryDate: this.queryDate
                };
                if (!(params.buyerMerchantId && params.queryDate)) {
                    this.$message.warning("请选择采购商家和日期");
                    return;
                }
                let loadingInstance = Loading.service({fullscreen: true});
                this.request.queryGoodsList(params).then(res => {
                    if (res.code === 200) {
                        this.head = res.ext.pdsBuyer;
                        this.categoryList = res.ext.categoryList;
                        this.startDate = res.ext.startDate;
                        this.endDate = res.ext.endDate;
                        // console.log(this.categoryList)
                        this.loading = false;
                    } else {
                        this.$message.warning(res.msg)
                        this.loading = false;
                    }
                    loadingInstance.close()
                }).catch(err => {
                    this.$message.warning(err)
                    this.loading = false;
                    loadingInstance.close()
                })
            },
            // 更新商品报价
            updateGoodsPrice(goods) {
                let params = {
                    id: goods.id,
                    price: goods.purchasePrice
                };
                this.request.updateGoodsPrice(params).then(res => {
                    if (res.code === 200) {
                        this.$message.success(res.msg);
                    } else {
                        this.$message.warning(res.msg);
                    }
                }).catch(err => {
                    this.$message.warning(err);
                })
            },
            // //
            // copyGoodsByBuyer(params = {}){
            //     params.buyerId = this.buyerId;
            //     this.request.copyGoodsByBuyer(params).then(res => {
            //         if( res.code === 200){
            //             this.$message.success(res.msg)
            //         }else{
            //             this.$message.warning(res.msg)
            //         }
            //     })
            // }
        }
    }
</script>

<style scoped lang="scss">

    .el-header, .el-main, .el-footer {
        margin: 5px;
    }

    .title {
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
    }

    .to-left {
        text-align: left;
    }

    caption {
        font-size: 24px;
    }

    .blod {
        font-weight: 600;
    }

    .padRight {
        text-align: center;
        margin: 0 auto;
        // height: 100%;
        // transform: rotateZ(90deg);
        writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
        font-size: 14px;
        color: #bbb;
    }

    .padRight-cons {
        text-align: center;
        margin: 0 auto;
        writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
        font-size: 14px;
    }

    table {
        border-spacing: 0px;
        // border: 0.5px;
        td {
            border: 0.5px;
        }
    }



    .bc-yellow {
        background-color: rgb(255, 192, 0)
    }

    td, th {
        // border: 0 1px 1px 0;
        padding: 0;
        max-width: 150px;
    }

    caption {
        padding: 8px;
        background-color: rgb(112, 173, 71);
        font-weight: 800;
    }

    table {
        width: 100%;
    }

    table.gridtable {
        font-family: verdana, arial, sans-serif;
        font-size: 11px;
        color: #333333;
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

</style>
