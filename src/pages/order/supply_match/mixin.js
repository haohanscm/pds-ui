
import * as math from 'mathjs';
export default {
    name: 'backToTop-demo',
    data() {
    },
    created(){
        this.getSummaryList()
        this.getSupplierList()

    },
    mounted(){
    },
    computed:{
        //净利率
        netProfitPer(){
            var num = (this.netProfit / ((this.goodsExpenditure || 0) + (this.logisticsCosts ||0) + (this.operatingCost || 0) )) * 100;
            var num = math.eval("" + this.netProfit + " /("
            + (this.goodsExpenditure || 0)
            +" + " + (this.logisticsCosts ||0)
            + " + " + (this.operatingCost || 0)
            + ")*100" );
            if(num){
                return num.toFixed(2)
            }else{
                return "0.00"
            }
        },
        //毛利率
        probableProfitPer(){
            var num = ( this.probableProfit / this.goodsExpenditure ) * 100;
            return num ? num.toFixed(2) : "0.00"
        }
    },
    watch:{
        orderList:{
            handler(newVal,oldVal){
                this.totalWeight = 0;
                this.totalVolume = 0;
                this.totalNeed = 0;
                this.totalBuyNum = 0;
                this.totalBuyerBillAmount = 0;
                this.probableProfit = 0;
                this.goodsExpenditure = 0;
                newVal.forEach(ele =>{

                    // var a = ele.buyOrderDetailList
                    try{//计算采购均价
                        var num = 0,//采购总价
                        num1 = 0; //采购商品数
                        var sum = 0;//计算未报价的采购商数
                        var numCount = 0;
                        ele.buyOrderDetailList.forEach(item => {
                            item.totalPrice = (+ math.eval( "" + item.goodsNum + " * " + item.buyPrice)).toFixed(2);
                            num = math.add(num, item.totalPrice)
                            num1 = math.add(num1, item.goodsNum)
                        })
                        ele.needBuyNum = num1;
                        ele.avgBuyPrice = ((math.eval("" + num + " / " + num1))|| "0").toFixed(2);

                    }catch(err){
                        console.log(err)
                    }
                    try{
                        //计算供应均价
                        var supplierMoney = 0, supplierPride = 0;
                        ele.supplierList1.forEach(ele => {
                            ele.supplierBillAmount = (math.eval( "" +  (ele.buyNum || "0" )+ " * " + (ele.supplyPrice|| "0"))).toFixed(2)
                            supplierMoney = (math.add(supplierMoney, ele.supplierBillAmount || "0")).toFixed(2);
                            supplierPride += +ele.buyNum;
                        });
                        ele.avgSupplyPrice = +(math.eval("" + supplierMoney + " / " + supplierPride) || 0).toFixed(2);
                        ele.supplierAmount = supplierMoney;
                        this.goodsExpenditure = math.add(this.goodsExpenditure,ele.supplierAmount)
                        ele.realBuyNum = +math.eval( "" + ele.needBuyNum + "/ (1 -" + ele.lossPercent + ")").toFixed(2);//折损计算，四舍五入取2位小数
                        ele.buyerBillAmount = +math.eval("(" + ele.avgBuyPrice + "*" +  1000 + ") *" + ele.needBuyNum + "/" + 1000).toFixed(2);
                        ele.profits = ((ele.needBuyNum * (ele.avgBuyPrice * 100) - ele.realBuyNum * (ele.avgSupplyPrice * 100)) / 100).toFixed(2);
                    }catch(err){
                        console.log(err)
                    }
                    this.totalWeight += +math.eval( ele.weight + "*" + ele.realBuyNum).toFixed(3);
                    this.totalVolume += +math.eval( ele.volume + "*" + ele.realBuyNum).toFixed(3);
                    this.totalVolume = +this.totalVolume.toFixed(3)
                    this.totalBuyerBillAmount += +(+ele.buyerBillAmount).toFixed(2);
                    this.probableProfit += +ele.profits;
                    this.probableProfit = +this.probableProfit.toFixed(2);
                    this.netProfit = math.eval(
                        "" + (this.probableProfit || 0) +
                        " - " + (this.operatingCost || 0) +
                        "-" + (this.logisticsCosts || 0)
                        ).toFixed(2);
                })
            },
            deep: true,
            immediate: true
        },
        floatingRate:{
            handler(newVal,oldVal){
                this.orderList.forEach((ele,index )=> {
                    var price = ele.avgSupplyPrice || "0";
                    ele.buyOrderDetailList.forEach(ele => {
                        ele.buyPrice =  math.eval( "" + price + "* (1 +" + newVal + ")")
                    })
                });
            }
        },
        //
        logisticsCosts:{
            handler(newVal, oldVal){
                this.netProfit = math.eval(
                "" + (this.probableProfit || 0)
                + " - " + (this.operatingCost || 0)
                + "-" + (this.logisticsCosts || 0)
                ).toFixed(2);
            },
            deep: true,
            immediate: true
        },
        operatingCost:{
            handler(newVal, oldVal){
                this.netProfit = math.eval(
                    "" + (this.probableProfit || 0) +
                    " - " + (this.operatingCost || 0) +
                    "-" + (this.logisticsCosts || 0)
                    ).toFixed(2);
            },
            deep: true,
            immediate: true
        }
    },
    methods:{
        //统一报价
        handleAvgBuyPriceChange(item, index){
            var price = item.avgBuyPrice;
            item.buyOrderDetailList.forEach(ele => {
                ele.buyPrice = price;
            })
        },
    }
}
