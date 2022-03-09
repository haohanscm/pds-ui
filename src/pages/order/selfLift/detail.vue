<template>
    <div>
        <div id="adasd" v-if="list">
            <div style="text-align: center;font-size:14px;color: #bbb;padding-bottom: 10px;">
                重庆{{$constant.merchantName}}配农产品配送有限公司
            </div>
            <div style="display:flex;align-items:center;">
                <table border="1" id="ddd">
                    <caption>采购商 - 提货单</caption>
                    <tbody>
                        <tr>
                            <th colspan="2" class="bc-yellow">采购商名称</th>
                            <td colspan="3">{{value.buyerName}}</td>
                            <th colspan="2" class="bc-yellow">提货日期</th>
                            <td colspan="2">{{deliveryDate}}</td>
                        </tr>
                        <tr>
                            <th colspan="2" class="bc-yellow">提货批次</th>
                            <td colspan="3">{{options[buySeq].label}}</td>
                            <th colspan="2" class="bc-yellow">联系人</th>
                            <td colspan="2">{{value.contact}}</td>
                        </tr>
                        <tr>
                            <th colspan="2" class="bc-yellow">提货地址</th>
                            <td colspan="3">{{value.address}}</td>
                            <th colspan="2" class="bc-yellow">联系电话</th>
                            <td colspan="2">{{value.telephone}}</td>
                        </tr>
                        <tr>
                            <td colspan="9">&nbsp;</td>
                        </tr>
                        <tr>
                            <th class="bc-yellow">序号</th>
                            <th class="bc-yellow">提货单号</th>
                            <th class="bc-yellow">商品分类</th>
                            <th class="bc-yellow">商品名称</th>
                            <th class="bc-yellow">规格</th>
                            <th class="bc-yellow">单位</th>
                            <th class="bc-yellow">供应数量</th>
                            <th class="bc-yellow">单价（元）</th>
                            <th class="bc-yellow">应收款项（元）</th>
                        </tr>
                        <tr v-for="(item,index) in tableList" :key="index">
                            <th class="bc-yellow">{{index + 1}}</th>
                            <td>{{item.tradeId}}</td>
                            <td>{{item.goodsCategory}}</td>
                            <td>{{item.goodsName}}</td>
                            <td>{{item.goodsModel}}</td>
                            <td>{{item.goodsUnit}}</td>
                            <td>{{item.sortOutNum}}</td>
                            <td>{{item.buyPrice}}</td>
                            <td>{{+item.charge || ""}}</td>
                        </tr>
                        <tr>
                            <td colspan="9">&nbsp;</td>
                        </tr>
                        <tr>
                            <th colspan="2" rowspan="2" class="bc-yellow">合计</th>
                            <th class="bc-yellow">商品种类</th>
                            <td colspan="2">{{totalKinds}}</td>
                            <th colspan="2" rowspan="1" class="bc-yellow">本页小计（元）</th>
                            <td colspan="2" rowspan="1" >{{totalCharge}}</td>
                        </tr>
                        <tr>
                            <th class="bc-yellow">采购数量</th>
                            <td colspan="2">{{totalNum}}</td>
                            <th colspan="2" class="bc-yellow">应收总账款（元）</th>
                            <td colspan="2">{{(value.totalAmount).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="padRight">第一联白（记账联） 第二联粉（采购商留存）</div>
            </div>

            <div class="footer">
                <div class="footer-img">
                    <img src="http://haohanshop-file.oss-cn-beijing.aliyuncs.com/merchantFiles/df52d9b3b17643f6916c7d27279a268d/00/20181107/15415868614447adD.png" alt="">
                    <p>关注公众号，自助下单</p>
                </div>
                <div class="right">
                    <div>
                        <p>♦ 请确保清单上物品信息与实际发出物品的信息相符合；</p>
                        <p>♦ 如您对本次所提货物有任何意见和建议，请联系我们：4000-562-180。</p>
                        <p>♦ 请在确认提货单内容均为正确且属实后，进行签字并给予系统评价。</p>
                    </div>
                    <div class="footer-sign">
                        <div>提货人：</div>
                        <div>日期：</div>
                    </div>
                </div>
            </div>
            <div style="text-align: center;font-size:14px;color: #bbb">
                第{{pageNo}}页-共{{totalPage}}页
            </div>
        </div>
        <div>
            <el-pagination
                layout="prev, pager, next"
                :page-size="20"
                :total="total"
               @current-change="changeNo">
            </el-pagination>
        </div>
        <a id="bb" @click="exportExcel">导出excel</a>
        <a href @click="printTable">打印</a>

    </div>
</template>

<script>
    import excel from "@/utils/exportExcel.js";
    import request from "../request.js"
    import constuct from "./listConstruct.js"
    export default {
        data: function(){
            return {
                request: new request(),
                options: this.$dic.buySeqOptions,
                shipfee: 0,
                pageSize: 20,
                pageNo: 1,
                total: 0,
                totalPage: 0,
                totalKinds: 0,
                list: [],
                trucks:[],
                truckIndex: 0
            }
        },
        props:{
            value: Object,
            buySeq:String,
            deliveryDate: String
        },
        watch:{
            value:{
                handler(newVal,oldVal){
                    if(!newVal.shipFee){
                        newVal.shipFee = 0
                    }
                    this.selfBuyerOrderList(newVal.buyerId)
                },
                immediate: true,

            }
        },
        computed:{
            tableList(){
                var arr = [];
                this.list.forEach(ele => {
                    if( ele.buyPrice || ele.goodsNum){
                        ele.charge = ( ele.sortOutNum * ele.buyPrice ).toFixed(2)
                    }else{
                        ele.charge = ""
                    }

                    arr.push(ele)
                })
                return arr
            },
            //
            totalPrice(){
                var num = 0;
                this.tableList.forEach(ele => {
                    num += ((+ ele.charge) || 0)
                })
                return num.toFixed(2)
            },
            //应收账款
            totalCharge(){
                return (+this.totalPrice + (+this.value.shipFee)).toFixed(2)
            },
            //
            totalNum(){
                var num = 0;

                this.tableList.forEach(ele => {
                    if (ele.sortOutNum) {
                        num += (+ ele.sortOutNum)
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
                console.log(e)
                this.pageNo = e;
                this.selfBuyerOrderList()
            },
            printTable(){
                var bodyHtml = document.getElementById("adasd").innerHTML
                window.document.body.innerHTML = bodyHtml;//html为当前显示的div的内容
                window.print();
            },


            //获取配送单
            selfBuyerOrderList(id){
                this.request.selfBuyerOrderList({
                    buyerId: id || this.value.id, 
                    deliveryDate:this.deliveryDate, 
                    buySeq:this.buySeq, 
                    truckNo:this.truckNo, 
                    pageSize:this.pageSize,
                    pageNo:this.pageNo}).then(res => {
                    if(res.code == 200){
                        this.totalKinds = res.list.length;
                        this.list = constuct.deliveryConstruct(res.list);
                        this.total = res.totalRows;
                        this.totalPage = res.totalPage
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    caption{
        font-size: 24px;
    }
    .padRight{
        text-align: center;
        margin: 0 auto;
        font-size: 14px;
        color: #bbb;
        height: 100%;
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
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
        text-align: center;
        line-height: 100%;
        border-width: 1px;
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
