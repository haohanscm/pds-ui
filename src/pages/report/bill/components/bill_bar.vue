<template>
    
    <div>
    <div id="aaa" class="wrap"></div></div>
</template>

<script>
    import echarts from 'echarts'
    export default {
        data: function(){
            return {
                option: {}
            }
        },
        props:{
            chartData: Array,
            date: Array,
            activeName: String // 监视展示土城的变化， 以备刷新
        },
        watch:{
            chartData:{
                handler(){
                    this.rangeAmount()
                },
                deep: true,
                immediate: true
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
                this.chart = echarts.init(document.getElementById("aaa"))
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
                let seriesData = [{
                        name:'商家应付金额',
                        type:'bar',
                        data:[]
                    }];
                let xAxis = [];
                arr.forEach((ele,index) => {
                    seriesData[0].data.push(ele.totalPayAmount);
                    xAxis.push(ele.merchantName)
                })
                return {
                    title: {
                        text: '商家结算图',
                        subtext: this.date[0] + "至" + this.date[1]
                    },
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    axis:{
                        axisLabel: "0"
                    },
                    xAxis: {
                        data: xAxis
                    },
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series: seriesData
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        height: 500px;
        background-color: white;
    }
</style>
