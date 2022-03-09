<template>
    <div class="page-box">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total">
        </el-pagination>
    </div>
</template>

<script>;
    export default {
        data: function(){
            return {
                pageNo: 1,
            }
        },
        props:{
            pageSizes: {
                type: Array,
                default(){
                    return [ 20, 30, 40, 50]
                }
            },
            pageSize:{
                type: Number,
                default(){
                    return 15;
                }
            },
            currentPage: {
                type: Number,
                default(){
                    return 1;
                }
            },
            total: {
                type: Number,
                required: true
            },
            layout: {
                type: String,
                default(){
                    return "sizes, prev, pager, next";
                }
            }
        },
        watch:{
        },
        created(){
        },
        methods:{
            handleSizeChange(e){
                this.$emit("pagechange", {pageSize: e,pageNo: this.pageNo})
            },
            handleCurrentChange(e){
                this.$emit("pagechange", {pageSize: this.pageSize,pageNo: e})
            },
        }
    }
</script>

<style scoped lang="scss">
    .page-box{
        background-color: white;
        display: inline-block;
        justify-content: space-between;
    }
</style>
