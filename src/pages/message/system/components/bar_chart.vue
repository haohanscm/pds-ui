<template>
    <div id="aaa" class="wrap"></div>
</template>

<script>
    import Request from "../../request.js";
    import echarts from 'echarts'
    export default {
        data: function(){
            return {
                request: new Request(),
                seriesData: [
                        {
                            name: '单品销售',
                            type: 'bar',
                            barWidth: '40%',
                            data: []
                        }
                    ],
                xAxisData: [
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ]
            }
        },
        watch:{
        },
        mounted(){
            this.goodsTopN()
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("aaa"))
                this.chart.clear();
                this.chart.setOption({
                    title: {
                        text: '单品销量top5'
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
                    xAxis: this.xAxisData,
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series: this.seriesData
                })
            },
            goodsTopN(){
                this.request.goodsTopN({
                    dateOffset: 30,
                    opt: 1,
                    limitNum: 5
                }).then( res => {
                    if( res.code === 200){
                        let arr1 = [];
                        let arr2 = [];
                        res.ext.forEach( ele => {
                            arr1.push( ele.goodsName);
                            arr2.push( ele.saleVolume)
                        });
                        console.log(arr1, arr2)
                        this.seriesData[0].data = arr2;
                        this.xAxisData[0].data = arr1;
                        this.initChart()
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        width: 100%;
        height: 100%;
        background-color: white;
    }
</style>
