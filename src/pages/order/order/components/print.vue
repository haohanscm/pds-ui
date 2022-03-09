<template>
    <div>
        <el-tabs v-model="activeName">
            <!--<el-tab-pane label="分拣单" name="one">-->
                <!--<div id="concise" v-if="list">-->
                    <!--<div style="display:flex;align-items:center;">-->
                        <!--<table border="1" id="ddd">-->
                            <!--<caption style="background-color: white">{{pmName}}-分拣单</caption>-->
                            <!--<tbody>-->
                                <!--<tr>-->
                                    <!--<td class="blod" colspan="2">采购商名称</td>-->
                                    <!--<td class="blod" colspan="3">送货批次</td>-->
                                    <!--<td class="blod" colspan="2">日期</td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td colspan="2">{{value.buyerName}}</td>-->
                                    <!--<td colspan="3">{{$dic.buySeqOptions[value.buySeq].label}}</td>-->
                                    <!--<td colspan="2">{{value.deliveryTime}}</td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td colspan="8">&nbsp;</td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td class="blod" >序号</td>-->
                                    <!--<td class="blod" >采购单号</td>-->
                                    <!--<td class="blod" >商品名称</td>-->
                                    <!--<td class="blod" >规格</td>-->
                                    <!--<td class="blod" >单位</td>-->
                                    <!--<td class="blod" >供应数量</td>-->
                                    <!--<td class="blod" >实际分拣量</td>-->
                                <!--</tr>-->
                                <!--<tr v-for="(item,index) in conciseList" :key="index">-->
                                    <!--<td class="blod" >{{index + 1}}</td>-->
                                    <!--<td>{{item.buyId}}</td>-->
                                    <!--<td>{{item.goodsName}}</td>-->
                                    <!--<td>{{item.goodsModel}}</td>-->
                                    <!--<td>{{item.unit}}</td>-->
                                    <!--<td>{{item.goodsNum}}</td>-->
                                    <!--<td>{{""}}</td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td colspan="2">备注</td>-->
                                    <!--<td colspan="6" class="print-hidden to-left"><el-input v-model="value.remarks"></el-input></td>-->
                                    <!--<td colspan="6" class="print-show to-left">{{value.remarks}}</td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td colspan="1" rowspan="2" class="blod" >合计</td>-->
                                    <!--<td class="blod" colspan="2">商品种类</td>-->
                                    <!--<td colspan="4" >{{conciseList.length}}</td>-->
                                <!--</tr>-->
                                <!--<tr>-->
                                    <!--<td class="blod" colspan="2">采购数量</td>-->
                                    <!--<td colspan="4">{{totalNum}}</td>-->
                                <!--</tr>-->
                            <!--</tbody>-->
                        <!--</table>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<a id="bb1" @click="exportExcel('ddd','','分拣单.xls','bb1')">导出excel</a>-->
                <!--<a @click="printTable('concise')">打印</a>-->
            <!--</el-tab-pane>-->
            <el-tab-pane label="采购单" name="second">
                <div id="buyOrder" v-if="list">
                    <div style="display:flex;align-items:center;">
                        <table border="1" id="buy">
                            <caption>{{pmName}}-采购单</caption>
                            <tbody>
                                <tr>
                                    <td class="blod" colspan="2">采购商名称</td>
                                    <td colspan="3">{{value.buyerName}}</td>
                                    <td class="blod" colspan="1">日期</td>
                                    <td colspan="2">{{value.deliveryTime}}</td>
                                </tr>
                                <tr>
                                    <td class="blod" colspan="2">送货地址</td>
                                    <td colspan="6">{{value.address}}</td>
                                </tr>
                                <tr>
                                    <td colspan="9">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td class="blod" >序号</td>
                                    <td class="blod" >采购单号</td>
                                    <td class="blod" >商品名称</td>
                                    <td class="blod" >规格</td>
                                    <td class="blod" >单位</td>
                                    <td class="blod" >采购数量</td>
                                    <td class="blod" >单价(元)</td>
                                    <td class="blod" >应收款(元)</td>
                                </tr>
                                <tr v-for="(item,index) in conciseList" :key="index">
                                    <td class="blod" >{{index + 1}}</td>
                                    <td>{{item.buyId}}</td>
                                    <td>{{item.goodsName}}</td>
                                    <td>{{item.goodsModel}}</td>
                                    <td>{{item.unit}}</td>
                                    <td>{{item.goodsNum}}</td>
                                    <td>{{item.buyPrice}}</td>
                                    <td>{{+item.charge || ""}}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" rowspan="2" class="blod" >合计</td>
                                    <td class="blod" colspan="1">商品种类</td>
                                    <td colspan="2" >{{conciseList.length}}</td>
                                    <td class="blod" colspan="1">采购数量</td>
                                    <td colspan="2">{{totalNum}}</td>
                                </tr>
                                <tr>
                                    <td class="blod" colspan="1">商品总价</td>
                                    <td colspan="5">{{totalCharge}}元</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="padRight-cons">第一联（记账联）第二联（库房）第三联（采购商）</div>
                    </div>
                    <div class="footer">
                        <div class="right">
                            <div class="footer-sign">
                                <div>签收人：</div>
                                <div>日期：</div>
                            </div>
                        </div>
                    </div>
                </div>
                <a id="bb" @click="exportExcel('buy','','采购单.xls','bb')">导出excel</a>&nbsp;&nbsp;&nbsp;&nbsp;
                <a @click="printTable('buyOrder')">打印</a>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import excel from "@/utils/exportExcel.js";
    export default {
        data: function(){
            return {
                options: this.$dic.buySeqOptions,
                pmName: this.$utils.getCookie("pmName"),
                tabStatus: "first",
                shipfee: 0,
                pageSize: 20,
                pageNo: 1,
                total: 0,
                totalPage: 0,
                totalKinds: 0,
                list: [],
                activeName:'second'
            }
        },
        props:{
            value: Object,
            conciseList: Array,
            // deliveryDate: String,
            // remarks: String
        },
        watch:{
            value:{
                handler(newVal,oldVal){
                    if(!newVal.shipFee){
                        newVal.shipFee = 0
                    }
                },
                deep: true,
                immediate: true
            },
            conciseList:{
                handler(newVal,oldVal){
                    newVal.forEach(ele => {
                        ele.charge = ele.goodsNum * (ele.buyPrice || ele.purchasePrice)
                        ele.charge = ele.charge.toFixed(2)
                    })
                },
                deep: true,
                immediate: true
            }
        },
        computed:{
            //
            totalPrice(){
                var num = 0;
                this.conciseList.forEach(ele => {
                    num += ((+ ele.charge) || 0)
                })
                return num.toFixed(2)
            },
            //应收账款
            totalCharge(){
                return (+this.totalPrice + (+this.shipfee)).toFixed(2)
            },
            //
            totalNum(){
                var num = 0;
                this.conciseList.forEach(ele => {
                    if (ele.goodsNum) {
                        num += (+ ele.goodsNum)
                    }
                })
                return num.toFixed(2)
            }
        },
        methods:{
            exportExcel(a, b, name, id){
                // excel.getExcel("ddd","","分拣单.xls","bb")
                excel.getExcel(a, b, name, id)
            },
            checkSupplierList(){
                this.fetchBuyOrderList()
            },
            printTable(id){
                let bodyHtml = document.getElementById(id).innerHTML;
                let newWindow = window.open("", "打印");
                let head = this.printHeadHtml();
                let html = '<html>'+ head +'<body><div>'+ bodyHtml +'</div></body></html>';
                newWindow.document.write(html);
                newWindow.document.close();
                newWindow.window.onload = function (){
                    newWindow.window.print();
                };
            },
            printBodyHtml(id){
                let bodyHtml = '<div>'+document.getElementById(id).innerHTML+'</div>';
                return bodyHtml;
            },
            printHeadHtml(){
                // let head = document.head.innerHTML.replace(/<script.*?>.*?<\/script>/ig,"");
                // return '<head>'+head+'</head>';
                return "<head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'>" +
                    "<style scoped lang='scss'>\n" +
                    "    body {\n" +
                    "        font-family: 'SimHei', 'SimHei', 'Times New Roman';\n" +
                    "        font-size: 16px;\n" +
                    "    }\n" +
                    "    caption {\n" +
                    "        font-size: 18px;\n" +
                    "        font-weight: 800;\n" +
                    "        padding: 8px;\n" +
                    "    }\n" +
                    "    .blod {\n" +
                    "        font-weight: 500;\n" +
                    "    }\n" +
                    "    .padRight-cons {\n" +
                    "        text-align: center;\n" +
                    "        margin: 0 auto;\n" +
                    "        writing-mode: vertical-lr;\n" +
                    "        font-size: 14px;\n" +
                    "    }\n" +
                    "    .footer {\n" +
                    "        display: flex;\n" +
                    "    }\n" +
                    "    .footer .right {\n" +
                    "        padding-left: 30px;\n" +
                    "        padding-top: 20px;\n" +
                    "        padding-bottom: 20px;\n" +
                    "    }\n" +
                    "    .right p {\n" +
                    "        line-height: 39px;\n" +
                    "    }\n" +
                    "    .right .footer-sign {\n" +
                    "        display: flex;\n" +
                    "    }\n" +
                    "    .footer-sign div {\n" +
                    "        margin-top: 8px;\n" +
                    "        margin-right: 200px;\n" +
                    "        margin-left: 20px;\n" +
                    "    }\n" +
                    "    table {\n" +
                    "        border-spacing: 0px;\n" +
                    "        border-collapse: collapse;\n" +
                    "        border: 1px solid #000;\n" +
                    "        width: 100%;\n" +
                    "        text-align: center;\n" +
                    "        line-height: 100%;\n" +
                    "        background-color: #ffffff;\n" +
                    "    }\n" +
                    "    table td {\n" +
                    "        border: 1px solid #000;\n" +
                    "        padding: 8px;\n" +
                    "        max-width: 150px;\n" +
                    "        line-height: 100%;\n" +
                    "    }\n" +
                    "    table th {\n" +
                    "        border: 1px solid #000;\n" +
                    "        padding: 8px;\n" +
                    "        line-height: 100%;\n" +
                    "    }\n" +
                    "</style>"
                    + "</head>";
            },

        }
    }
</script>

<style scoped lang='scss'>
    body {
        font-family: 'SimHei', 'SimHei', 'Times New Roman';
        font-size: 16px;
    }
    caption {
        font-size: 18px;
        font-weight: 800;
        padding: 8px;
    }
    .blod {
        font-weight: 500;
    }
    .padRight-cons {
        text-align: center;
        margin: 0 auto;
        writing-mode: vertical-lr;
        font-size: 14px;
    }
    .footer {
        display: flex;
    }
    .footer .right {
        padding-left: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .right p {
        line-height: 39px;
    }
    .right .footer-sign {
        display: flex;
    }
    .footer-sign div {
        margin-top: 8px;
        margin-right: 200px;
        margin-left: 20px;
    }
    table {
        border-spacing: 0px;
        border-collapse: collapse;
        border: 1px solid #000;
        width: 100%;
        text-align: center;
        line-height: 100%;
        background-color: #ffffff;
    }
    table td {
        border: 1px solid #000;
        padding: 8px;
        max-width: 150px;
        line-height: 100%;
    }
    table th {
        border: 1px solid #000;
        padding: 8px;
        line-height: 100%;
    }
</style>
