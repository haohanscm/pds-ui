<template>
       <div id="sss" class="wrap"></div>
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
                            name: '占比',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                legendData:{
                        orient: 'vertical',
                        left: 'left',
                        data: []
                    }
            }
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
        mounted(){
            this.goodsTopN()
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("sss"))
                this.chart.setOption({
                    title : {
                        text: '商品销量TOP20占比',
                        subtext:  this.date[0] + "至" + this.date[1],
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}元 ({d}%)"
                    },
                    legend: this.legendData,
                    series : this.seriesData
                })
            },
            goodsTopN(){
                this.request.goodsTopN({
                    startTime: this.date[0],
                    endTime: this.date[1],
                    buyerId: this.buyerId,
                    limitNum: 20
                }).then( res => {
                    if( res.code === 200 ){
                        let arr1 = [];
                        let arr2 = [];
                        let list = res.ext;
                        list.sort(( a, b) => {
                            return b.num - a.num 
                        })
                        res.ext.forEach(ele => {
                            arr1.push( {
                                value: ele.saleAmount,
                                name: ele.goodsName
                            })
                            arr2.push(ele.categoryName)
                        });
                        this.legendData.data = arr2;
                        this.seriesData[0].data = arr1;
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
