<template>
    <div>

        <div id="adasd" v-if="list">
            <div style="text-align: center;font-size:14px;color: #bbb;padding-bottom: 10px;">{{pmName}}</div>
            <div style="display:flex;align-items:center;">
                <table border="1" id="ddd">
                    <caption>送货单</caption>
                    <tbody>
                        <tr>
                            <th colspan="2" class="bc-yellow">采购商名称</th>
                            <td colspan="2">{{value.buyerName}}</td>
                            <th class="bc-yellow">车辆</th>
                            <td class="print-hidden" colspan="2">
                                <el-select v-model="truckIndex" placeholder="请选择车辆">
                                    <el-option
                                    v-for="(item,index) in trucks"
                                    :key="item.id"
                                    :label="item.truckName +  item.truckNo"
                                    :value="index">
                                    </el-option>
                                </el-select>
                            </td>
                            <td class="print-show" colspan="2">{{trucks[truckIndex].truckName}} {{trucks[truckIndex].truckNo}}</td>
                            <th class="bc-yellow">司机</th>
                            <td>{{trucks[truckIndex].principal}}</td>
                        </tr>
                        <tr>
                            <th colspan="2" class="bc-yellow">送货时间</th>
                            <td colspan="2">{{deliveryDate}}</td>
                            <th class="bc-yellow">送货批次</th>
                            <td colspan="2">{{options[buySeq].label}}</td>
                            <th class="bc-yellow">司机电话</th>
                            <td>{{trucks[truckIndex].telephone}}</td>
                        </tr>
                        <tr>
                            <th colspan="5" class="bc-yellow">送货地址</th>
                            <th colspan="2" class="bc-yellow">送货联系人</th>
                            <th colspan="2" class="bc-yellow">联系电话</th>
                        </tr>
                        <tr>
                            <td colspan="5">{{value.address}}</td>
                            <td colspan="2">{{value.contact}}</td>
                            <td colspan="2">{{value.telephone}}</td>
                        </tr>
                        <tr>
                            <td colspan="9">&nbsp;</td>
                        </tr>
                        <tr>
                            <th class="bc-yellow">序号</th>
                            <th class="bc-yellow">采购单号</th>
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
                            <td>{{item.buyId}}</td>
                            <td>{{item.goodsCategory}}</td>
                            <td>{{item.goodsName}}</td>
                            <td>{{item.goodsModel}}</td>
                            <td>{{item.goodsUnit}}</td>
                            <td>{{item.shipNum}}</td>
                            <td>{{item.buyPrice}}</td>
                            <td>{{+item.charge || ""}}</td>
                        </tr>
                        <tr>
                            <td colspan="2">备注</td>
                            <td colspan="7" class="print-hidden to-left">
                                <el-input
                                v-model="remarks"
                                @change="changeShipfee">
                                </el-input>
                            </td>
                            <td colspan="7" class="print-show to-left">{{remarks}}</td>
                        </tr>
                        <tr>
                            <th colspan="2" rowspan="2" class="bc-yellow">合计</th>
                            <th class="bc-yellow">商品种类</th>
                            <td colspan="1">{{totalKinds}}</td>
                            <th colspan="2" class="bc-yellow">运费（元）</th>
                            <td colspan="1" class="print-hidden"><el-input v-model="shipfee" @change="changeShipfee"></el-input></td>
                            <td colspan="1" class="print-show">{{value.shipFee}}</td>
                            <th colspan="1" class="bc-yellow">本页小计（元）</th>
                            <td colspan="1">{{totalPrice}}</td>
                        </tr>
                        <tr>
                            <th class="bc-yellow">采购数量</th>
                            <td colspan="1">{{totalNum}}</td>
                            <th colspan="2" class="bc-yellow">应收总账款（元）</th>
                            <td colspan="3" >{{value.totalAmount.toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="padRight">第一联（记账）第二联（库房） 第三联（采购商）</div>
            </div>

            <div class="footer">
                <div class="footer-img">
                    <img src="http://haohanshop-file.oss-cn-beijing.aliyuncs.com/merchantFiles/df52d9b3b17643f6916c7d27279a268d/00/20181107/15415868614447adD.png" alt="">
                    <p>关注公众号，自助下单</p>
                </div>
                <div class="right">
                    <div>
                        <p>♦ 请确认本送货单所填写的信息均与送达您手上的实际物品信息符合</p>
                        <p>♦ 如您对本次的送货与货物有任何意见和建议，请联系我们：4000-562-180。</p>
                        <p>♦ 请您在确认本送货单内容均为正确且属实后，进行签字并给予系统评价。</p>
                    </div>
                    <div class="footer-sign">
                        <div>签收人：</div>
                        <div>日期：</div>
                    </div>
                </div>
            </div>
            <div style="text-align: center;font-size:14px;color: #bbb">
                第{{pageNo}}页-共{{totalPage}}页
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
        <a href @click="printTable(`adasd`)">打印</a>
    </div>
</template>

<script>
    import excel from "@/utils/exportExcel.js";
    export default {
        data: function(){
            return {
                // buySeq: 0,
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
        font-size: 14px;
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
        color: #bbb;
    }
    .padRight-cons{
        text-align: center;
        margin: 0 auto;
        writing-mode: vertical-lr;/*从左向右 从右向左是 writing-mode: vertical-rl;*/
        font-family: 黑体;
        font-size:10px;
    }
    .footer{
        font-family: 黑体;
        font-size:10px;
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
    table{
        border-spacing: 0px;
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
        font-size:10px;
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
