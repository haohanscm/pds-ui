<template>
    <div class="goods-search-wrap">
        <div class="goods-search">
            <div class="search-input">
                <el-input placeholder="请输入内容" v-model="content" clearable>
                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                        <el-option label="商品名称" value="1"></el-option>
                        <el-option label="条形码" value="2"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
                </el-input>
            </div>
            <el-button class="reset" type="text" @click="reset">取消</el-button>
        </div>
    </div>
</template>

<script>
import eventBus from '@/components/common/bus.js'
export default {
    props: {

    },
    data() {
        return {
            content: '',
            select: '1',
        }
    },
    mounted() {

    },
    methods: {
        searchGoods() {
            console.log(this.select);
            eventBus.$emit('search-goods', {
                select: this.select,
                content: this.content
            })
        },
        reset() {
            this.content = ''
            this.select = '1'
            eventBus.$emit('search-goods', {})
        }
    },

}
</script>

<style scoped>
.goods-search-wrap {
    margin-left: 400px;
    display: flex;
    flex-direction: column;
}
.goods-search {
    height: 60px;
    margin-top: 10px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.search-input {
    width: 600px;
    margin-right: 20px;
}
.goods-search .reset {
    color: #235073;
    font-size: 16px;
    font-weight: bold;
}
</style>
<style>
.el-select .el-input {
    width: 130px;
}
.search-input .el-input-group__prepend {
    background-color: #fff;
}
</style>

