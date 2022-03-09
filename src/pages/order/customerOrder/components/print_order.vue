<template>
    <div>
        <div id="concise" v-if="list">
            <div style="display:flex;align-items:center;">
                <table border="1" id="ddd">
                    <caption style="background-color: white">{{pmName}}-采购单</caption>
                    <tbody>
                        <tr>
                            <td class="blod" colspan="2">采购商名称</td>
                            <td colspan="2">{{value.buyerName}}</td>
                            <td class="blod" colspan="1">日期</td>
                            <td colspan="2">{{value.deliveryTime}}</td>
                        </tr>
                        <tr>
                            <td class="blod" colspan="2">送货地址</td>
                            <td colspan="5">{{value.address}}</td>
                        </tr>
                        <tr>
                            <td colspan="8">&nbsp;</td>
                        </tr>
                        <tr>
                            <td class="blod" >序号</td>
                            <td class="blod" >商品名称</td>
                            <td class="blod" >规格</td>
                            <td class="blod" >单位</td>
                            <td class="blod" >价格</td>
                            <td class="blod" >供应数量</td>
                            <td class="blod" >商品价格</td>
                        </tr>
                        <tr v-for="(item,index) in table" :key="index">
                            <td class="blod" >{{index + 1}}</td>
                            <td>{{item.goodsName}}</td>
                            <td>{{item.goodsModel}}</td>
                            <td>{{item.unit}}</td>
                            <td>{{item.purchasePrice}}</td>
                            <td>{{item.goodsNum}}</td>
                            <td>{{item.charge}}</td>
                        </tr>
                        <tr>
                            <td colspan="2">备注</td>
                            <td colspan="5" class="print-hidden to-left"><el-input v-model="value.remarks"></el-input></td>
                            <td colspan="5" class="print-show to-left">{{value.remarks}}</td>
                        </tr>
                        <tr>
                            <td colspan="1" rowspan="2" class="blod" >合计</td>
                            <td class="blod" colspan="1">商品种类</td>
                            <td colspan="2" >{{table.length}}</td>
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
        <a id="bb" @click="exportExcel">导出excel</a>
        <a @click="printTable(`concise`)">打印</a>

    </div>
</template>

<script>
    import excel from "../../../../utils/exportExcel.js";
    import Request from "../../request";
    export default {
        data: function(){
            return {
                request: new Request(),
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
            table: Array
        },
        watch:{
            value:{
                handler(newVal,oldVal){
                },
                deep: true,
                immediate: true
            },
            table:{
                handler(newVal,oldVal){
                    newVal.forEach( ele => {
                        ele.charge = (+ele.purchasePrice) * (+ele.goodsNum)
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
                this.table.forEach(ele => {
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
                this.table.forEach(ele => {
                    if (ele.goodsNum) {
                        num += (+ ele.goodsNum)
                    }
                })
                return num
            }
        },
        methods:{
            exportExcel(){
                excel.getExcel("ddd","","分拣单.xls","bb")
            },
            checkSupplierList(){
                this.fetchBuyOrderList()
            },
            printTable(id){
                this.$confirm("你确认已经完成了所有商品的下单并且数据正确？").then(_ => {
                    return this.request.addBuyOrder(this.value)
                }).then( res=> {
                    if( res.code === 200){
                        var bodyHtml = document.getElementById(id).innerHTML
                        window.document.body.innerHTML = bodyHtml;//html为当前显示的div的内容
                        window.print();
                        location.reload();
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
               
            },
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
