<template>
    <div>
        <div class="title">
            <v-title></v-title>
        </div>
        <div class="chart">
            <div class="chart-line-1">
                <v-line-chart :period="period"></v-line-chart>
            </div>
            <v-order-detail></v-order-detail>
            <div class="chart-line-2">
                <div class="line-2-item">
                    <v-bar-chart></v-bar-chart>
                </div>
                <div class="line-2-item">
                    <v-pie-chart></v-pie-chart>
                </div>
                <!-- <div class="line-2-item-list">
                    <v-waiting-order></v-waiting-order>
                </div> -->
            </div>
        </div>
        <div class="bottom"></div>
    </div>
</template>

<script>
    import request from "./../request.js";
    import echarts from 'echarts';
    import vBarChart from './components/bar_chart';
    import vLineChart from './components/line_chart';
    import vPieChart from './components/pie_chart';
    import vTitle from './components/title';
    import vOrderDetail from './components/order_detail.vue';
    import vWaitingOrder from './components/waiting_order.vue';
    export default {
        data: function(){
            return {
                period: "0"
            }
        },
        components:{
            vBarChart, vLineChart, vPieChart, vTitle, vOrderDetail, vWaitingOrder
        },
        watch:{
        },
        mounted(){
            this.initChart()
        },
        methods:{
            initChart() {
            }
        }
    }
</script>

<style scoped lang="scss">
    .chart{
        width: 100%;
        .chart-line-1{
            width: 100%;
            height: 500px;
            display: block;
            background-color: white;
            margin-top: 10px;
        }
        .chart-line-2{
            width: 100%;
            margin-top: 10px;
            height: 400px;
            display: flex;
            justify-content: space-between;
            .line-2-item{
                width: 48%;
            }
            .line-2-item-list{
                width: 18%;
            }
        }
    }
   .bottom{
       height: 200px;
   }
</style>
