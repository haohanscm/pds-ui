<template>
    <div class="cash-wrap">
        <cash-header></cash-header>
        <cash-cart v-model="goodsList"></cash-cart>
        <div style="height:100%;">
            <goods-search></goods-search>
            <goods-list v-model="goodsList"></goods-list>
        </div>
    </div>
</template>

<script>
import cashHeader from '../components/cashHeader'
import cashCart from './components/cash_cart'
import goodsList from './components/goods_list'
import goodsSearch from './components/goods_search'
export default {
    props: {

    },
    components: { cashHeader, cashCart, goodsList, goodsSearch },
    data() {
        return {
            goodsList: []
        }
    },
    watch:{
        goodsList:{
            handler(newVal){
                console.log( newVal)
            },
            deep: true,
        }
    },
    computed: {
    },
    mounted() {

    },

    methods: {

    },

}
</script>

<style scoped>
.cash-wrap {
    background: #f2f2f2;
    height: 100%;
    font-size: 18px;
    font-weight: bold;
}
</style>
