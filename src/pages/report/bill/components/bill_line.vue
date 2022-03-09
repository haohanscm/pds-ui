<template>
    
    <div>
        <div id="billLine" class="draw"></div>
    </div>
                
</template>

<script>
    import echarts from 'echarts';
    export default {
        data: function(){
            return {
                date:{
                    startDate: this.$utils.getDay(-7),
                    endDate: this.$utils.getDay(0)
                },
                option: {}
            }
        },
        props:{
            chartData: Array,
            activeName: String // 监视展示土城的变化， 以备刷新
        },
        watch:{
            chartData:{
                handler(){
                    this.rangeAmount()
                },
                deep: true
            },
            activeName:{
                handler(){
                    this.rangeAmount()
                },
                deep: true
            }
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("billLine"))
                this.chart.clear();
                this.chart.resize()
                this.chart.setOption( this.option )
            },
            rangeAmount(){
                if(this.chartData.length === 0) return;
                this.option = this.computeLine(this.chartData);
                this.initChart()
            },
            computeLine(arr){
                let seriesData = [];
                let xAxis = [];
                let legendData = [];
                arr.forEach((ele,index) => {
                    let data = {
                        name: ele.merchantName,
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                    legendData.push( ele.merchantName)
                    ele.dateAmountList.forEach(ele1 => {
                        if( index === 0){
                            xAxis.push(ele1.date)
                        }
                        data.data.push(ele1.payAmount)
                    });
                    seriesData.push(data)
                })
                return {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
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
                    legend: {
                        data: legendData
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:{
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: seriesData
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
