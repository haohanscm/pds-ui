<template>
    <div>

        <div id="adasd">
            <table border="1" id="ddd">
                <caption>{{pmName}}-采购单汇总</caption>
                <tbody>
                    <tr>
                        <td rowspan="4"></td>
                        <th class="bc-yellow">采购单编号</th>
                        <td colspan="2">{{value.buyId}}</td>
                    </tr>
                    <tr>
                        <th class="bc-yellow">采购商名称</th>
                        <td colspan="2">{{value.buyerName}}</td>
                        <th class="bc-yellow">采购日期</th>
                        <td colspan="2">{{value.buyTime}}</td>
                    </tr>
                    <tr>
                        <th class="bc-yellow">送货时间</th>
                        <td colspan="2">{{value.deliveryTime}}</td>
                        <th class="bc-yellow">送货批次</th>
                        <td colspan="2">{{options[value.buySeq].label}}</td>
                    </tr>
                    <tr>
                        <th class="bc-yellow">送货地址</th>
                        <td colspan="4">{{value.address}}</td>
                        <th class="bc-yellow">联系人</th>
                        <td>{{value.contact}}</td>
                        <th class="bc-yellow">联系电话</th>
                        <td>{{value.telephone}}</td>
                    </tr>
                    <tr>
                        <td colspan="14">&nbsp;</td>
                    </tr>
                    <tr>
                        <th class="bc-yellow">序号</th>
                        <th class="bc-yellow">商品分类</th>
                        <th class="bc-yellow" style="max-width: 10%">商品名称</th>
                        <th class="bc-yellow">规格</th>
                        <th class="bc-yellow">单位</th>
                        <th class="bc-yellow">采购数量</th>
                        <th class="bc-yellow">采购单价</th>
                        <th class="bc-yellow">应付账款</th>
                        <th class="bc-yellow">报价单号</th>
                        <th class="bc-yellow">供应商名称</th>
                        <th class="bc-yellow">供应数量</th>
                        <th class="bc-yellow">交易单号</th>
                        <th class="bc-yellow">订单状态</th>
                    </tr>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <th :rowspan="item.height" v-if="item.show" class="bc-yellow">{{item.myIndex}}</th>
                        <td :rowspan="item.height" v-if="item.show">{{item.categroy}}</td>
                        <td :rowspan="item.height" v-if="item.show" style="max-width: 10%">{{item.goodsName}}</td>
                        <td :rowspan="item.height" v-if="item.show">{{item.goodsModel}}</td>
                        <td :rowspan="item.height" v-if="item.show">{{item.goodsUnit}}</td>
                        <td :rowspan="item.height" v-if="item.show">{{item.goodsNum}}</td>
                        <td :rowspan="item.height" v-if="item.show">{{item.buyPrice}}</td>
                        <td :rowspan="item.height" v-if="item.show">{{(item.buyPrice * item.goodsNum)?(item.buyPrice * item.goodsNum).toFixed(2): "0.00"}}元</td>
                        <td>{{item.offerId}}</td>
                        <td>{{item.supplierName}}</td>
                        <td>{{item.supplyNum}}</td>
                        <td>{{item.tradeId}}</td>
                        <td>{{buyerOrderOption[item.opStatus]}}</td>
                    </tr>
                    <tr>
                        <td colspan="14">&nbsp;</td>
                    </tr>
                    <tr>
                        <td rowspan="3"></td>
                        <th class="bc-yellow">总价</th>
                        <td colspan="3">{{(+totalPrice) || "0"}}元</td>
                    </tr>
                    <tr>
                        <th class="bc-yellow">商品种类</th>
                        <td colspan="2">{{value.orderDetailList.length}}</td>
                        <th class="bc-yellow">物流运费</th>
                        <td colspan="2" class="td-num">{{value.shipFee || "0"}}元</td>
                        <!-- <td colspan="2" class="td-input" v-show="!print"><el-input-number size="mini" v-model="value.shipFee" :step="10" @change="changeShipFee()">元</el-input-number>元</td>                 -->
                    </tr>
                    <tr>
                        <th class="bc-yellow">采购数量</th>
                        <td colspan="2">{{totalNum}}</td>
                        <th class="bc-yellow">应收账款</th>
                        <td colspan="2">{{(+totalCharge )|| "0"}}元</td>
                    </tr>
                </tbody>
            </table>

            <div class="footer">
                    <div class="footer-img">
                        <img src="http://haohanshop-file.oss-cn-beijing.aliyuncs.com/merchantFiles/df52d9b3b17643f6916c7d27279a268d/00/20181107/15415868614447adD.png" alt="">
                        <p>关注公众号，自助下单</p>
                    </div>
                <div class="right">
                    <div>
                        <p>♦ 请确保清单上物品信息与实际发出物品的信息相符合；</p>
                        <p>♦ 本人承诺所供应物品的质量完全合格，并愿意承担相应责任；</p>
                        <p>♦ 请在确认本货物供货单内容均为正确且属实后，进行签字，服务热线4000-562-180。</p>
                    </div>
                    <div class="footer-sign">
                        <div>供应商签字：</div>
                        <div>日期：</div>
                    </div>
                </div>

            </div>
        </div>
            <a id="bb" @click="exportExcel">导出excel</a>
            <a href @click="printTable">打印</a>

    </div>
</template>

<script>
    import excel from "@/utils/exportExcel.js";
    import request from "../request.js";
    export default {
        data: function(){
            return {
                request: new request(),
                options: this.$dic.buySeqOptions,
                buyerOrderOption:this.$dic.buyerOrderOption,
                print: false,
                pmName: this.$utils.getCookie("pmName")
            }
        },
        props:{
            value: Object
        },
        computed:{
            tableList(){
                var arr = [];
                var num = 1
                this.value.orderDetailList.forEach(ele => {
                    var goodsName = ele.goodsName, goodsModel = ele.goodsModel, goodsUnit = ele.goodsUnit,
                    goodsNum = ele.goodsNum, buyPrice = ele.buyPrice;
                    if(ele.tradeOrderList){
                        var length = ele.tradeOrderList.length
                        ele.tradeOrderList.forEach((item,index) => {
                            if(index == 0){
                                arr.push({
                                    height:length,
                                    myIndex: num,
                                    show:true,
                                    goodsName,goodsModel,goodsUnit,goodsNum,buyPrice,
                                    offerId: item.offerId, supplyNum: item.supplyNum, tradeId: item.tradeId, opStatus: item.opStatus,
                                    offerPrice: item.buyPrice,supplierName: item.supplierName
                                })
                                num++
                            }else{
                                arr.push({
                                    height:length,
                                    index,
                                    show: false,
                                    offerId: item.offerId, supplyNum: item.supplyNum, tradeId: item.tradeId, opStatus: item.opStatus,
                                    offerPrice: item.buyPrice,supplierName: item.supplierName
                                })
                            }
                        })

                    }else{
                        arr.push({
                            height: 1,
                            myIndex: num,
                            goodsName,goodsModel,goodsUnit,goodsUnit,goodsNum,buyPrice,show: true,
                        })
                        num++
                    }
                })
                return arr
            },
            //
            totalPrice(){
                var num = 0;
                this.value.orderDetailList.forEach(ele => {
                    num += ele.goodsNum * ele.buyPrice
                })
                return num.toFixed(2)
            },
            //应收账款
            totalCharge(){
                return (+this.totalPrice + (this.value.shipFee || 0)).toFixed(2)
            },
            totalNum(){
                var num = 0;
                this.value.orderDetailList.forEach(ele => {
                    num += ele.goodsNum
                })
                return num.toFixed(0)
            }
        },
        methods:{
            exportExcel(){
                excel.getExcel("ddd","","供应单.xls","bb")
            },
            checkSupplierList(){
                this.fetchBuyOrderList()
            },
            printTable(){
                this.print = true;
                var bodyHtml = document.getElementById("adasd").innerHTML
                window.document.body.innerHTML = bodyHtml;//html为当前显示的div的内容
                window.print();
            },
            //运费值变化
            changeShipFee(){
                this.editBuyOrder()
            },



            //修改运费接口
            editBuyOrder(){
                this.request.editBuyOrder({buyId:this.value.buyId, shipFee:this.value.shipFee}).then(res => {
                    if(res.code !=200 ){
                        this.$message.error(res.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    caption{
        font-size: 24px;
    }

    .footer{
        display: flex;
        .footer-img{
            width: 200px;
            height: 200px;
            text-align: center;
            img{
                width: 120px;
                height: 120px;
                margin: 23px 15px auto 15px;
            }
        }
        .right{
            padding-left: 30px;
            padding-top: 20px;
            p{
                line-height: 39px;
            }
            .footer-sign{
                display: flex;
                div{
                    margin-top: 8px;
                    margin-right: 200px;
                    margin-left: 20px;
                }
            }
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
        border: 0 1px 1px 0;
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
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #666666;
        background-color: #ffffff;
    }

</style>
