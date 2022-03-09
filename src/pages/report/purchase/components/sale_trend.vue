<template>
    
    <div>
        <div id="asa" class="draw"></div>
    </div>    
                
</template>

<script>
    import echarts from 'echarts'
    import Request from '../../request'
    export default {
        data: function(){
            return {
                request: new Request(),
                xAxis: {
                    type: 'category',
                    data: []
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                period: "0"
            }
        },
        props:{
            date: Array,
            buyerId: String,
            goodsId: String
        },
        watch:{
            date:{
                handler(){
                    this.saleTrend()
                },
                deep: true,
                immediate: true
            },
            buyerId:{
                handler(){
                    this.saleTrend()
                },
                deep: true
            },
            goodsId:{
                handler(){
                    this.saleTrend()
                },
                deep: true
            }
        },
        mounted(){
            this.saleTrend()
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("asa"));
                this.chart.clear();
                this.chart.resize();
                this.chart.setOption( {
                    title: {
                        text: '销售趋势',
                        subtext: this.date[0] + "至" + this.date[1]
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['下单金额','销售金额',"实际成本","毛利润","毛利率"]
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxisData
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: this.series
                })
            },
            saleTrend() {
                this.request.saleTrend({
                    startDate: this.date[0], 
                    endDate: this.date[1],
                    buyerId: this.buyerId,
                    goodsId: this.goodsId
                }).then( res => {
                    if( res.code === 200 ){
                        let obj = this.computeLine(res.ext);
                        this.series = obj.series;
                        this.xAxisData = obj.xAxisData;
                    }else{
                        this.series = [];
                        this.xAxisData = [];
                        this.$message.warning(res.msg)
                    }
                    this.initChart()
                })
            },
            computeLine(arr){
                let orderAmountObj = {
                        name:'下单金额',
                        type:'line',
                        data:[]
                    },
                    saleAmountObj = {
                        name:'销售金额',
                        type:'line',
                        data:[]
                    },
                    costObj = {
                        name:'实际成本',
                        type:'line',
                        data:[]
                    },
                    grossProfitObj = {
                        name:'毛利润',
                        type:'line',
                        data:[]
                    },
                    grossProfitRateObj = {
                        name:'毛利率',
                        type:'line',
                        data:[]
                    },
                    xAxisData = [];
                arr.forEach(ele => {
                    orderAmountObj.data.push(ele.orderAmount)
                    saleAmountObj.data.push(ele.saleAmount)
                    costObj.data.push(ele.cost)
                    grossProfitObj.data.push(ele.grossProfit)
                    grossProfitRateObj.data.push(ele.grossProfitRate)
                    xAxisData.push(ele.buyDate)
                })
                return {
                    series:[orderAmountObj,saleAmountObj,costObj,grossProfitObj,grossProfitRateObj],
                    xAxisData
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .draw{
        margin: 0 auto;
        height: 500px;
        background-color: white;
    }
</style>
