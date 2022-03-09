<template>
    <div>

        <div id="adasd" style="width:840px;">
            <div style="text-align: center;font-size:14px;color: #bbb;padding-bottom: 10px;">{{pmName}}</div>
            <div style="display:flex;align-items:center;">
                <table border="1" id="ddd">
                    <caption  colspan="9">供应单</caption>
                    <tbody>
                        <tr>
                            <th colspan="2" class="bc-yellow">供应商名称</th>
                            <td colspan="4">{{value.supplierName}}</td>
                            <td colspan="3" rowspan="2">重庆君磊农产品配送有限公司</td>
                        </tr>
                        <tr>
                            <th colspan="2" class="bc-yellow">供应日期</th>
                            <td colspan="1">{{date}}</td>
                            <th class="bc-yellow">批次</th>
                            <td colspan="2">{{options[buySeq].label}}</td>
                        </tr>
                        <tr>
                            <th colspan="4" class="bc-yellow">供应商地址</th>
                            <th colspan="3" class="bc-yellow">联系人</th>
                            <th colspan="2" class="bc-yellow">联系电话</th>
                        </tr>
                        <tr>
                            <td colspan="4">{{value.address}}</td>
                            <td colspan="3">{{value.contact}}</td>
                            <td colspan="2">{{value.telephone}}</td>
                        </tr>
                        <tr>
                            <td colspan="9">&nbsp;</td>
                        </tr>
                        <tr>
                            <th class="bc-yellow">序号</th>
                            <th class="bc-yellow">供应单编号</th>
                            <th class="bc-yellow">商品分类</th>
                            <th class="bc-yellow">商品名称</th>
                            <th class="bc-yellow">规格</th>
                            <th class="bc-yellow">单位</th>
                            <th class="bc-yellow">供应数量</th>
                            <th class="bc-yellow">单价</th>
                            <th class="bc-yellow">应收款</th>
                        </tr>
                        <tr v-for="(item,index) in list" :key="index">
                            <th class="bc-yellow">{{index + 1}}</th>
                            <td>{{item.offerOrderId}}</td>
                            <td>{{item.goodsCategory}}</td>
                            <td >{{item.goodsName}}</td>
                            <td >{{item.goodsModel}}</td>
                            <td >{{item.goodsUnit}}</td>
                            <td >{{item.buyNum}}</td>
                            <td >{{item.supplyPrice}}</td>
                            <td >{{(+(item.supplyPrice * item.buyNum).toFixed(2) || "")}}</td>
                        </tr>
                        <tr>
                            <td colspan="9">&nbsp;</td>
                        </tr>
                        <tr>
                            <th colspan="2" rowspan="2" class="total">合计</th>
                            <th colspan="1" class="bc-yellow">商品种类</th>
                            <td colspan="2">{{totalKinds}}</td>
                            <th colspan="2" rowspan="2" class="bc-yellow">账款合计（元）：</th>
                            <td colspan="2" rowspan="2">{{totalPrice}}</td>
                        </tr>
                        <tr>
                            <th class="bc-yellow">采购数量</th>
                            <td colspan="2">{{totalNum}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="padRight">第一联白（记账联） 第二联粉（供应商留存）</div>
            </div>
            <div class="footer">
                    <div class="footer-img">
                        <img src="http://haohanshop-file.oss-cn-beijing.aliyuncs.com/merchantFiles/df52d9b3b17643f6916c7d27279a268d/00/20181107/15415868614447adD.png" alt="">
                        <p>关注公众号，自助下单</p>
                    </div>
                <div class="right">
                    <div>
                        <p>♦ 请确保清单上物品信息与实际发出物品的信息相符合；</p>
                        <p>♦ 本人承诺所供应物品的质量完全合格，并愿意承担相应责任；</p>
                        <p>♦ 请在确认货物供应单内容均为正确且属实后，进行签字，服务热线：4000-562-180。</p>
                    </div>
                    <div class="footer-sign">
                        <div>供应商签字：</div>
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
    import excel from "../../../utils/exportExcel.js";
    import request from "../request.js";
    import constructor from "./listConstruct.js"
    export default {
        data: function(){
            return {
                request: new request(),
                pageSize: 20,
                pageNo: 1,
                total: 0,
                totalPage: 0,
                totalKinds: 0,
                options: this.$dic.buySeqOptions,
                list: [],
                pmName: this.$utils.getCookie("pmName")
            }
        },
        props:{
            value: Object,
            date: String,
            buySeq: String

        },
        watch:{
            value:{
                handler(newVal,oldVal){
                    this.fetchOfferList(newVal.id)
                },
                immediate: true
            }
        },
        computed:{
            //
            totalPrice(){
                var num = 0;
                this.list.forEach(ele => {
                    num += +(ele.buyNum * ele.supplyPrice).toFixed(2)
                })
                return num.toFixed(2)
            },
            //应收账款
            totalCharge(){
                return (+this.totalPrice + this.value.shipFee).toFixed(2)
            },
            totalNum(){
                var num = 0;
                this.list.forEach(ele => {
                    num += ele.buyNum
                })
                return num
            }
        },
        methods:{
            exportExcel(){
                excel.getExcel("ddd","","供应单.xls","bb")
            },
            checkSupplierList(){
                this.fetchBuyOrderList()
            },
            changeNo(e){
                console.log(e)
                this.pageNo = e;
                this.fetchOfferList()
            },
            //打印
            printTable(){
                var bodyHtml = document.getElementById("adasd").innerHTML
                window.document.body.innerHTML = bodyHtml;//html为当前显示的div的内容
                window.print();
            },
            //查询供应列表
            fetchOfferList(supplierId){
                this.request.fetchOfferList({prepareDate: this.date,
                                             buySeq:this.buySeq,
                                             supplierId:supplierId || this.value.id,
                                             pageSize: this.pageSize,
                                             pageNo: this.pageNo}).then(res => {
                    if(res.code == 200){
                        this.totalKinds = res.ext.list.length;
                        this.list = constructor.buyConstruct( res.ext.list);
                        this.totalPage = res.ext.totalPage;
                        this.total = res.ext.totalRows;
                    }else{
                        this.$message.warning(res.msg)
                        this.list =  constructor.buyConstruct( [])
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
    .padRight{
        text-align: center;
        margin: 0 auto;
        height: 100%;
        font-size: 14px;
        color: #bbb;
    // transform: rotateZ(90deg);
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        writing-mode: tb-lr;
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
        &.right{
            width: 10px;
            border: 0;
            padding: 1px;
        }
    }
    .total{
        background-color: rgb(237, 125, 49)
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
</style>
