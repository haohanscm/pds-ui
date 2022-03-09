<template>
    
    <div>
        <el-tabs v-model="period" type="card" @tab-click="changeCond">
            <el-tab-pane label="近七日销售额曲线" name="0">
                
            </el-tab-pane>
            <el-tab-pane label="近一月销售额曲线" name="1">
            </el-tab-pane>
            <div id="asa" class="draw"></div>
        </el-tabs>
    </div>
                
</template>

<script>
    import Request from "../request.js";
    import echarts from 'echarts';
    export default {
        data: function(){
            return {
                request: new Request(),
                xAxis: {
                    type: 'category',
                    data: []
                },
                series: [{
                    name: "销售额",
                    data: [],
                    type: 'line',
                    smooth: true
                },{
                    name: "订单数",
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                period: "0",
                date:{
                    startDate: this.$utils.getDay(-7),
                    endDate: this.$utils.getDay(0)
                }
            }
        },
        mounted(){
            this.statisCurve()
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("asa"))
                this.chart.clear();
                this.chart.resize()
                this.chart.setOption({
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['订单数', '销售额']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: this.xAxis,
                    yAxis: {
                        type: 'value'
                    },
                    series: this.series
                })
            },
            changeCond(){
                if(this.period === "0"){
                    this.date.startDate = this.$utils.getDay(-7)
                    this.date.endDate = this.$utils.getDay(0)
                }else if(this.period === "1"){
                    this.date.startDate = this.$utils.getDay(-30)
                    this.date.endDate = this.$utils.getDay(0)
                }
                this.statisCurve()
            },
            statisCurve(){
                this.request.statisCurve({...this.date}).then( res => {
                    if( res.code === 200){
                        let arr = res.ext;
                        let arr1 = [];
                        let arr2 = [];
                        let arr3 = []
                        arr.forEach(ele => {
                            arr1.push(ele.buyDate)
                            arr2.push(ele.amount)
                            arr3.push(ele.orderNum)
                        });
                        this.xAxis.data = arr1;
                        this.series[0].data = arr2;
                        this.series[1].data = arr3;
                        this.initChart()
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .draw{
        margin: 0 auto;
        height: 400px;
        background-color: white;
    }
</style>
