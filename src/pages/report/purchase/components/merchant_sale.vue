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
                period: "0",
                option:{
                    title: {
                        text: '商户销量排行',
                        subtext: this.date[0] + "至" + this.date[1]
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['订单数', '销售额']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: {readOnly: false},
                            magicType: {type: ['bar', 'bar']},
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
                        data: []
                    },
                    series: [
                        {
                            name: '销售额',
                            type: 'bar',
                            data: []
                        },
                        {
                            name: '订单数',
                            type: 'line',
                            data: []
                        }
                    ]
                }
            }
        },
        mounted(){
            this.buyerSaleTop()
            
        },
        props:{
            date: Array,
            buyerId: String,
            goodsId: String
        },
        watch:{
            date:{
                handler(){
                    this.buyerSaleTop()
                },
                deep: true,
                immediate: true
            },
            buyerId:{
                handler(){
                    this.buyerSaleTop()
                },
                deep: true
            },
            goodsId:{
                handler(){
                    this.buyerSaleTop()
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
            buyerSaleTop() {
                this.request.buyerSaleTop({
                    startDate: this.date[0], 
                    endDate: this.date[1],
                    buyerId: this.buyerId,
                    goodsId: this.goodsId
                }).then( res => {
                    if( res.code === 200){
                        this.computeOpt( res.ext)
                    }else{
                        this.computeOpt([{amount:0,orderNum:0,buyerName:""}])
                        this.$message.warning( res.msg)
                    }
                    this.initChart()
                })
            },
            computeOpt(arr){
                let arr1 = [];
                let arr2 = [];
                let nameArr = [];
                arr.sort((a,b) => {
                    return b.amount - a.amount
                })
                arr.forEach(ele => {
                    arr1.unshift(ele.amount)
                    arr2.unshift(ele.orderNum)
                    nameArr.unshift(ele.buyerName)
                });
                console.log( arr1,arr2)
                this.option.series[0].data = arr1;
                this.option.series[1].data = arr2;
                this.option.yAxis.data = nameArr;
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
