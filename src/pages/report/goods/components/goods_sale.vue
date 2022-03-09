<template>
    
    <div>
        <div id="merchant-sale" class="draw"></div>
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
                option:{
                    title: {
                        text: '商品销量排行TOP20',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['下单量', '销售额']
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
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['商品啊','商品啊','商品啊','商品啊','商品啊','商品啊']
                    },
                    series: [
                        {
                            name: '销售额',
                            type: 'bar',
                            data: [ 18203, 23489, 29034, 104970, 131744, 630230]
                        },
                        {
                            name: '下单量',
                            type: 'bar',
                            data: [1, 2, 4, 8, 6, 21]
                        }
                    ]
                },
                period: "0"
            }
        },
        mounted(){
            this.goodsTopN()
        },
        props:{
            date: Array,
            buyerId: String
        },
        watch:{
            date:{
                handler(){
                    this.goodsTopN()
                },
                deep: true,
                immediate: true
            },
            buyerId:{
                handler(){
                    this.goodsTopN()
                },
                deep: true
            }
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("merchant-sale"))
                this.chart.clear();
                this.chart.resize()
                this.chart.setOption( this.option )
            },
            goodsTopN(){
                this.request.goodsTopN({
                    startTime: this.date[0],
                    endTime: this.date[1],
                    buyerId: this.buyerId,
                    limitNum: 30
                }).then(res => {
                    if( res.code === 200){
                        this.getOpt(res.ext);
                        this.initChart()
                    }else{
                        this.$message.warning( res.msg)
                    }
                })
            },
            getOpt(arr){
                let arr1 = [];
                let arr2 = [];
                let nameArr = [];
                arr.forEach(ele => {
                    arr1.unshift( ele.saleAmount)
                    arr2.unshift( ele.saleNum);
                    nameArr.unshift( ele.goodsName)
                })
                this.option.yAxis.data = nameArr;
                this.option.series[0].data = arr1;
                this.option.series[1].data = arr2;
                this.option.title.subtext = this.date[0] + "至" + this.date[1]
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
