<template>
       <div id="sss" class="wrap"></div>
</template>

<script>
    import Request from "../request.js";
    import echarts from 'echarts'
    export default {
        data: function(){
            return {
                request: new Request(),
                seriesData: [
                        {
                            name: '分类占比',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
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
        watch:{
        },
        mounted(){
            this.categoryPercent()
        },
        methods:{
            initChart() {
                this.chart = echarts.init(document.getElementById("sss"))
                this.chart.setOption({
                    title : {
                        text: '分类销量占比',
                        subtext: '',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: this.legendData,
                    series : this.seriesData
                })
            },
            categoryPercent(){
                this.request.categoryPercent({
                    dateOffset: 6
                }).then( res => {
                    if( res.code === 200){
                        let arr1 = [];
                        let arr2 = [];
                        let list = res.ext;
                        list.sort(( a, b) => {
                            return b.num - a.num 
                        })
                        res.ext.forEach(ele => {
                            arr1.push( {
                                value: ele.num,
                                name: ele.categoryName
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
