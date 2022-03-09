<template>
    <div class="components-container">
        <el-table
            :data="baojiabiao"
            border
            show-summary
            style="width: 100%">
            <el-table-column
            prop="demand"
            sortable
            label="需求量">
            </el-table-column>

            <el-table-column
            prop="price"
            label="单价">
            </el-table-column>

            <el-table-column
            prop="subtotal"
            sortable
            label="小计">
            </el-table-column>

            <el-table-column
            prop="lossRate"
            sortable
            label="损耗比">
            <template slot-scope="scope">
                <div style="display:flex">
                    <el-input @change="changeRate(scope.$index,scope.row)" v-model="scope.row.lossRate"></el-input>%
                </div>
            </template>
            </el-table-column>

            <el-table-column
            prop="actualBuy"
            sortable
            label="实际采购量">
            </el-table-column>

            <el-table-column
            prop="quality"
            sortable
            label="重量">
            </el-table-column>

            <el-table-column
            prop="volume"
            sortable
            label="体积">
            </el-table-column>

            <el-table-column
            prop="payout"
            sortable
            label="总支出">
            </el-table-column>

            <el-table-column
            prop="increateRate"
            label="报价提升比"
            width="180">
            <template slot-scope="scope">
                <div style="display:flex">
                    <el-input @change="changeRate(scope.$index,scope.row)" v-model="scope.row.increateRate"></el-input>%
                </div>
            </template>
            </el-table-column>

            <el-table-column
            prop="sales"
            sortable
            label="销售额">
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="4">
                <div>总体积：{{totalVolume}}m^3</div>
            </el-col>
            <el-col :span="4">
                <div>总重量：{{totalWeight}}kg</div>
            </el-col>
            <el-col :span="4">
                <div>商品支出：{{goodsPayout}}元</div>
            </el-col>
            <el-col :span="4">
                <div>总销售额：{{totalSales}}元</div>
            </el-col>
            <el-col :span="4">
                <div>毛利：{{profit}}元</div>
            </el-col>
            <el-col :span="4">
                <div>毛利率：{{((profit/goodsPayout)*100).toFixed(2)}}%</div>
            </el-col>
        </el-row>
        

        <el-table
            :data="truckTable"
            border
            show-summary
            style="width: 100%">
            <el-table-column
            prop="volume"
            sortable
            label="容量/m^3">
            </el-table-column>

            <el-table-column
            prop="weight"
            label="载重/kg">
            </el-table-column>

            <el-table-column
            prop="price"
            label="价格/(km*t)">
            </el-table-column>

            <el-table-column
            prop="num"
            label="数量(辆)">
            <template slot-scope="scope">
                <div style="display:flex">
                    <el-input @change="changeNum(scope.$index,scope.row)" v-model="scope.row.num"></el-input>
                </div>
            </template>
            </el-table-column>

            <el-table-column
            prop="actualLoad"
            label="实际载重(kg)">
            <template slot-scope="scope">
                <div style="display:flex">
                    <el-input @change="changeNum(scope.$index,scope.row)" v-model="scope.row.actualLoad"></el-input>
                </div>
            </template>
            </el-table-column>

            <el-table-column
            prop="actualDistance"
            label="行驶里程(km)">
            <template slot-scope="scope">
                <div style="display:flex">
                    <el-input @change="changeNum(scope.$index,scope.row)" v-model="scope.row.actualDistance"></el-input>
                </div>
            </template>
            </el-table-column>

            <el-table-column
            prop="charge"
            label="收费">
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="4">
                <div>运营成本：{{operatingCost}}元</div>
            </el-col>
            <el-col :span="4">
                <div>卡车成本：{{truckPayout}}元</div>
            </el-col>
            <el-col :span="4">
                <div>总支出：{{totalPayout}}元</div>
            </el-col>
            <el-col :span="4">
                <div>净利润：{{netProfit}}元</div>
            </el-col>
            <el-col :span="4">
                <div>净利润率：{{((netProfit/totalPayout)*100).toFixed(2)}}%</div>
            </el-col>
        </el-row>
    </div>
</template>

<script>

export default {
  name: 'backToTop-demo',
  data() {
    return {
            data:[
                {
                    demand: 200,//需求量
                    price: 9,//采购商报价
                    subtotal: 0,//小计
                    quality: 1.00,
                    volume: 0.01,
                    lossRate: 2,//耗损比
                    actualBuy: 0,//实际购买量
                    payout: 0,//实际购买商品的支出
                    increateRate: 2,//报价提升率
                    sales: 0 //销售额
                },
                {
                    demand: 200,//需求量
                    price: 2,//采购商报价
                    subtotal: 0,//小计
                    quality: 1.00,
                    volume: 0.01,
                    lossRate: 2,//耗损比
                    actualBuy: 0,//实际购买量
                    payout: 0,//实际购买商品的支出
                    increateRate: 2,//报价提升率
                    sales: 0 //销售额
                },
                {
                    demand: 200,//需求量
                    price: 2,//采购商报价
                    subtotal: 0,//小计
                    quality: 1.00,
                    volume: 0.01,
                    lossRate: 2,//耗损比
                    actualBuy: 0,//实际购买量
                    payout: 0,//实际购买商品的支出
                    increateRate: 2,//报价提升率
                    sales: 0 //销售额
                },
            ],
            truck:[
                {
                    num: 0,
                    charge: 0,
                    actualLoad: 0,
                    actualDistance: 0,
                    price: 60,//单位 元/(t.km)
                    volume: 300,//单位m^3
                    weight: 1000//单位kg
                },
                {
                    num: 0,
                    charge: 0,
                    actualLoad: 0,
                    actualDistance: 0,
                    price: 50,//单位 元/(t.km)
                    volume: 600,//单位m^3
                    weight: 2000//单位kg
                },
                {
                    num: 0,
                    charge: 0,
                    actualLoad: 0,
                    actualDistance: 0,
                    price: 40,//单位 元/(t.km)
                    volume: 1800,//单位m^3
                    weight: 5000//单位kg
                }
            ],
            operatingCost: 100
        }
    },
    computed:{
        baojiabiao(){
            this.data.forEach(ele => {
                ele.subtotal = ele.demand * (ele.price * 100) / 100;
                ele.actualBuy = Math.round(100 * ele.demand/ (100 - ele.lossRate));
                ele.payout = ele.actualBuy * (ele.price * 100 ) / 100;
                ele.sales = ele.demand * (ele.price * 100 * (100 + (+ele.increateRate))) / 10000;
            })
            return this.data;
        },
        goodsPayout(){
            let num = 0;
            this.baojiabiao.forEach(ele => {
                num = ( num * 100 + ele.payout * 100) / 100
            })
            return num;
        },
        totalSales(){
            let num = 0;
            this.baojiabiao.forEach(ele => {
                num = ( num * 100 + ele.sales * 100) / 100
            })
            return num;
        },
        profit(){
            let num = 0;
            this.baojiabiao.forEach(ele => {
                num += (ele.sales - ele.payout)
            });
            return num;
        },//
        totalVolume(){
            let num = 0;
            this.baojiabiao.forEach(ele => {
                num += (ele.volume*100000*ele.actualBuy)/100000
            })
            return num;
        },//
        totalWeight(){
            let num = 0;
            this.baojiabiao.forEach(ele => {
                num += (ele.quality*100*ele.actualBuy)/100
            })
            return num;
        },
        truckTable(){
            this.truck.forEach(ele => {
                ele.num = Math.ceil(ele.actualLoad / ele.weight);
                if(ele.actualLoad % ele.weight === 0){
                    ele.charge = ele.num * (ele.actualDistance * 100 * ele.price * ele.actualLoad ) / 100000;
                }else{
                    ele.charge = (ele.num - 1) * (ele.actualDistance * 100 * ele.price * ele.actualLoad ) / 100000 
                    + (ele.actualDistance * 100 * ele.price * (ele.actualLoad % ele.weight)) /100000;
                    ele.charge = + ele.charge.toFixed(2)
                }
                
            })
            return this.truck;
        },
        netProfit(){
            let num = 0;
            this.truckTable.forEach(ele => {
                num = ( num * 100 + ele.charge*100) / 100
            })
            return (this.profit * 100 - num * 100 - this.operatingCost * 100) / 100;
        },
        truckPayout(){
            let num = 0;
            this.truckTable.forEach(ele => {
                num = ( num * 100 + ele.charge*100) / 100
            })
            return num;
        },
        totalPayout(){
            return this.goodsPayout + this.truckPayout + this.operatingCost;
        }
    },
    methods:{
        changeRate(index,item){
            this.$set(this.data, index, item);
        },
        changeNum(index,item){
            this.$set(this.truck, index, item);
        },
    }
}
</script>

<style scoped>
.placeholder-container div {
    margin: 10px;
}
</style>
