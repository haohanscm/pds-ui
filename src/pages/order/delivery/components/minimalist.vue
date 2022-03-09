<template>
    <div>
        <div id="concise" v-if="list">
            <div style="display:flex;align-items:center;">
                <table border="1" id="ddd">
                    <caption style="background-color: white">{{pmName}}-送货单</caption>
                    <tbody>
                        <tr>
                            <td class="blod" colspan="3">送货单位</td>
                            <td class="blod" colspan="3">送货地址</td>
                            <td class="blod" colspan="2">日期</td>
                        </tr>
                        <tr>
                            <td colspan="3">{{value.buyerName}}</td>
                            <td colspan="3">{{value.address}}</td>
                            <td colspan="2">{{deliveryDate}}</td>
                        </tr>
                        <tr>
                            <td colspan="8">&nbsp;</td>
                        </tr>
                        <tr>
                            <td class="blod" >序号</td>
                            <td class="blod" >采购单号</td>
                            <td class="blod" >商品名称</td>
                            <td class="blod" >规格</td>
                            <td class="blod" >单位</td>
                            <td class="blod" >供应数量</td>
                            <td class="blod" >单价（元）</td>
                            <td class="blod" >应收款项（元）</td>
                        </tr>
                        <tr v-for="(item,index) in conciseList" :key="index">
                            <td class="blod" >{{index + 1}}</td>
                            <td>{{item.buyId}}</td>
                            <td>{{item.goodsName}}</td>
                            <td>{{item.goodsModel}}</td>
                            <td>{{item.goodsUnit}}</td>
                            <td>{{item.shipNum}}</td>
                            <td>{{item.buyPrice}}</td>
                            <td>{{+item.charge || ""}}</td>
                        </tr>
                        <tr>
                            <td colspan="2">备注</td>
                            <td colspan="6" class="print-hidden to-left"><el-input v-model="remarks" @change="changeRemarks"></el-input></td>
                            <td colspan="6" class="print-show to-left">{{remarks}}</td>
                        </tr>
                        <tr>
                            <td colspan="1" rowspan="2" class="blod" >合计</td>
                            <td class="blod" >商品种类</td>
                            <td colspan="1">{{conciseList.length}}</td>
                            <td class="blod" colspan="2">运费（元）</td>
                            <td colspan="1" class="print-hidden"><el-input v-model="shipfee" @change="changeShipfee"></el-input></td>
                            <td colspan="1" class="print-show">{{value.shipFee}}</td>
                            <td class="blod" colspan="1">本页小计（元）</td>
                            <td colspan="1">{{totalPrice}}</td>
                        </tr>
                        <tr>
                            <td class="blod" >采购数量</td>
                            <td colspan="1">{{(totalNum).toFixed(2)}}</td>
                            <td class="blod" colspan="2">应收总账款（元）</td>
                            <td colspan="3" >{{totalCharge}}</td>
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
        <a id="bb" @click="exportExcel">导出excel</a>
        <a @click="printTable(`concise`)">打印</a>

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
            }
        },
        props:{
            value: Object,
            deliveryDate: String,
            buySeq: Number,
            trucks: Array,
            truckIndex: Number,
            conciseList: Array,
            truckNo: String,
            deliveryDate: String,
            remarks: String
        },
        watch:{
            value:{
                handler(newVal,oldVal){
                    if(!newVal.shipFee){
                        newVal.shipFee = 0
                    }
                    // constuct.deliveryConstruct(newVal)
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
                    if (ele.shipNum) {
                        num += (+ ele.shipNum)
                    }
                })
                return num
            }
        },
        methods:{
            exportExcel(){
                excel.getExcel("ddd","","送货单.xls","bb")
            },
            checkSupplierList(){
                this.fetchBuyOrderList()
            },
            //翻页
            changeNo(e){
                this.pageNo = e;
                this.shipOrder()
            },
            //修改运费
            changeShipfee(e){
                this.editBuyOrder()
            },
            // 修改备注
            changeRemarks(){
                this.$emit("refreshRemarks", this.remarks)
            },
            printTable(id){
                let bodyHtml = document.getElementById(id).innerHTML
                let newWindow = window.open("", "打印");
                let head = document.head.innerHTML.replace(/<script.*?>.*?<\/script>/ig,"");
                let html = '<html><head>'+ head +'</head><body>'+ bodyHtml +'</body></html>';
                newWindow.document.write(html);
                newWindow.document.close();
                newWindow.window.onload = function (){
                    newWindow.window.print();
                };
            }
        }
    }
</script>

<style scoped lang="scss">
    .to-left{
        text-align: left;
    }
    caption{
        font-size: 18px;
        font-family: 黑体;
        font-weight: 1000;
    }
    .blod{
        font-weight: 600;
    }
    .padRight{
        text-align: center;
        margin: 0 auto;
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
        font-size: 14px;
        color: #000;
    }
    .padRight-cons{
        text-align: center;
        margin: 0 auto;
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        font-family: 黑体;
        font-size:14px;
    }
    .footer{
        font-family: 黑体;
        font-size:14px;
        display: flex;
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
    table{
        border-spacing: 0px;
        td{
            border: .5px;
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
    table{
        font-family: 黑体;
        font-size:14px;
        color:#000;
        border-width: 1px;
        border-color: #000;
        border-collapse: collapse;
    }
    table th {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #000;
        background-color: #dedede;
    }
    table td {
        text-align: center;
        line-height: 100%;
        border: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #000;
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
