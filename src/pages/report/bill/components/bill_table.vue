<template>
    
    <div >
        <el-table
            id="ddd"
            :data="bodyData"
            show-summary
            border
            style="width: 100%">
            <el-table-column
                v-for="(item,index) in titleData"
                :width="index===0?100:''"
                :key="index"
                :prop="item.prop"
                :label="item.label">
            </el-table-column>
        </el-table>
        <a  style="float:right;padding-bottom:5px"
            id="bb" @click="exportExcel">
            <el-button type="primary">导出excel</el-button>
        </a>
    </div>    
                
</template>

<script>
    import echarts from 'echarts'
    import excel from "@/utils/exportExcel.js";
    export default {
        data: function(){
            return {
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
                titleData: [],
                bodyData: []
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
        mounted(){
            this.rangeAmount()
        },
        methods:{
            rangeAmount() {
                if( !this.chartData[0]) return;
                this.computeMap(this.chartData)
            },
            computeMap(arr){
                let titleData = []; // 表头
                let bodyData = []; // 表体
                titleData.push( {
                    label: "日期",
                    prop: "0"
                })
                let rowLen = arr.length;
                let totalArr = [];
                arr.forEach((ele,index) => {
                    titleData.push({label: ele.merchantName,prop: (index + 1).toString()});
                    let len = ele.dateAmountList.length;
                    ele.dateAmountList.forEach((ele1,index1) => {
                        if( !bodyData[index1]){
                            bodyData[index1] = []
                        }
                        if( !totalArr[index1]){
                            totalArr[index1] = 0;
                        }
                        if( index === 0){
                            bodyData[index1].push(ele1.date)
                        }
                        bodyData[index1].push(ele1.payAmount)
                        totalArr[index1] = totalArr[index1] + ele1.payAmount;
                        if( rowLen - 1 === index){
                            bodyData[index1].push(totalArr[index1].toFixed(2))
                        }
                    })
                    
                });
                titleData.push( {
                    label: "小计",
                    prop: (arr.length + 1).toString()
                })
                console.log(bodyData,titleData)
                this.titleData = titleData;
                this.bodyData = bodyData;
            },
            exportExcel(){
                excel.getExcel("ddd","","商家结算单.xls","bb")
            },
        }
    }
</script>

<style scoped lang="scss">
</style>
