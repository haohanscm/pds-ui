<template>
    <div class="table add-goods">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-hh-goods"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pageType == 'add'"><i class="el-icon-hh-goodsnew"></i> 新增商品</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pageType == 'edit'"><i class="el-icon-hh-goodsnew"></i> 编辑商品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-container>
                <el-header>
                    <el-steps :active="activeStep" simple>
                        <el-step title="基本信息" icon="el-icon-edit"></el-step>
                        <el-step title="图文信息" icon="el-icon-upload"></el-step>
                        <el-step title="高级选项" icon="el-icon-menu"></el-step>
                    </el-steps>
                </el-header>
                <!-- <component :is="'goodsMediaInfo'" /> -->
                <component v-if="activeStep == 0" :is="'goodsBaseInfo'" :goods-info="goodsInfo"
                    @next="nextStep" @prev="prevStep"/>
                <component v-if="activeStep == 1" :is="'goodsMediaInfo'" :goods-info="goodsInfo"
                    @next="nextStep" @prev="prevStep" @save="saveGoodsBaseInfo"/>
                <component v-if="activeStep == 2" :is="'goodsAdvancedInfo'" :goods-info="goodsInfo"
                    @next="nextStep" @prev="prevStep"/>
            </el-container>
        </div>
    </div>
</template>

<script>
import request from '../request.js'
import goodsBaseInfo from './components/goodsBaseInfo'
import goodsMediaInfo from './components/goodsMediaInfo.vue'
import goodsAdvancedInfo from './components/goodsAdvancedInfo.vue'

export default {
    name: "addGoods",
    data () {
        return {
            request: new request(),
            activeStep: 0,
            goodsInfo: {
                goodsSn: '',
                goodsName: '',
                categorySn: '',
                categoryName: '',
                unit: '',
                thumbUrl: '',
                marketPrice: '',
                storage: '',
                detailDesc: '',
                isMarketable: '1'
            },
            pageType: 'add',
        }
    },
    components: { goodsBaseInfo, goodsMediaInfo, goodsAdvancedInfo },
    mounted() {
        let query = this.$route.query
        if (query && query.goodsSn) {
            this.pageType = 'edit',
            this.fetchGoodsInfo(query.goodsSn)
        }
    },
    methods: {
        nextStep(step) {
            this.activeStep = step
        },
        prevStep(step) {
            this.activeStep = step
        },
        fetchGoodsInfo(id) {
            this.request.fetchGoodsInfo({
                goodsSn: id
            }).then(res => {
                if (res.code == 200) {
                    this.goodsInfo = res.ext
                } else {
                    this.$message.error('获取商品信息错误: ', res.msg)
                }
            })
        },
        saveGoodsBaseInfo() {
            this.request.addGoodsBaseInfo({
                ...this.goodsInfo,
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success('保存成功')
                    this.$router.push('/goods/goodsList')
                } else {
                    this.$message.error('保存失败: ', res.msg)
                }
            })
        },
    }
}
</script>

<style scoped>

</style>
