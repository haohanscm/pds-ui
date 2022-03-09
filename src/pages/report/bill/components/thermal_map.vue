<template>
    
    <div>
        <div id="map" class="draw"></div>
    </div>    
                
</template>

<script>
    import echarts from 'echarts'
    import Request from '../../request'
    export default {
        data: function(){
            return {
                option:{},
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
        mounted(){
            this.rangeAmount()
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("map"));
                this.chart.clear();
                this.chart.resize();
                this.chart.setOption(this.option)
            },
            rangeAmount() {
                if( !this.chartData[0]) return;
                this.option = this.computeMap(this.chartData)
                this.initChart()
            },
            computeMap(arr){
                let rowData = []; // 横排
                let colData = []; // 竖排
                let data = [];
                let max = 0
                arr[0].dateAmountList.forEach(ele => {
                    colData.push( ele.date)
                })
                arr.forEach((ele,index) => {
                    rowData.push(ele.merchantName);
                    ele.dateAmountList.forEach((ele1,index1) => {
                        data.push([index, index1, ele1.payAmount || "-"])
                        if(ele1.payAmount > max){
                            max = ele1.payAmount;
                        }
                    })
                });
                return {
                    tooltip: {
                        position: 'top'
                    },
                    animation: false,
                    grid: {
                        height: '50%',
                        y: '10%'
                    },
                    xAxis: {
                        type: 'category',
                        data: rowData,
                        splitArea: {
                            show: true
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: colData,
                        splitArea: {
                            show: true
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: max,
                        calculable: true,
                        orient: 'horizontal',
                        left: 'center',
                        bottom: '15%'
                    },
                    series: [{
                        name: '应收账款',
                        type: 'heatmap',
                        data: data,
                        label: {
                            normal: {
                                show: true
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .draw{
        margin: 0 auto;
        height: 600px;
        background-color: white;
    }
</style>
