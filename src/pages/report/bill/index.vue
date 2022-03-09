<template>
    <div class="wrap">
        <div class="check-condition">
            <div>
                <el-date-picker
                    v-model="date"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <div class="chart">
            <el-tabs v-model="activeName1" type="card">
                <el-tab-pane label="热力图" name="first">
                    <v-the-map :activeName="activeName1" :chartData="chartData"></v-the-map>
                </el-tab-pane>
                <el-tab-pane label="结算表格" name="second">
                    <v-bill-table :activeName="activeName1" :chartData="chartData"></v-bill-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="chart">
            <el-tabs v-model="activeName2" type="card">
                <el-tab-pane label="商家销量柱状图" name="second">
                    <v-bill-bar :activeName="activeName2" :chartData="chartData" :date="date"></v-bill-bar>
                </el-tab-pane>
                <el-tab-pane label="折线/柱状图" name="third">
                    <v-bill-line :activeName="activeName2" :chartData="chartData"></v-bill-line>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div style="height:150px"></div>
    </div>
</template>

<script>
    import Request from "../request";
    import vTheMap from "./components/thermal_map";
    import vBillTable from "./components/bill_table";
    import vBillLine from "./components/bill_line";
    import vBillBar from "./components/bill_bar";
    export default {
        data: function(){
            return {
                request: new Request(),
                date: [this.$utils.getDay(-7), this.$utils.getDay(0)],
                merchantId: "",
                chartData: [],
                activeName1: "first",
                activeName2: "second"
            }
        },
        created(){
            // this.rangeAmount()
        },
        watch:{
            date:{
                handler(){
                    this.rangeAmount()
                },
                deep: true,
                immediate: true
            },
        },
        components:{
            vTheMap, vBillTable, vBillLine, vBillBar
        },
        methods:{
            rangeAmount() {
                this.request.rangeAmount({
                    startDate: this.date[0],
                    endDate: this.date[1],
                    merchantId: this.merchantId
                }).then( res => {
                    if( res.code === 200 ){
                        this.chartData = res.ext.list;
                    }else{
                        this.$message.warning( res.msg)
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        .check-condition{
            background-color: #fff;
            padding: 15px;
            display: flex;
            >div{
                margin-left: 15px;
                display: flex;
                height: 30px;
            }
        }
        .chart{
            margin-top: 10px;
            background-color: white;
        }
    }
</style>
