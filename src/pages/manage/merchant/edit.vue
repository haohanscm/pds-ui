<template>
    <el-container>
        <!--<el-header height="40px">-->
            <!--<span>商家详情</span>-->
        <!--</el-header>-->
        <el-main>
            <el-row :gutter="20">
                <el-col :span="4">商家名称</el-col>
                <el-col :span="20">
                    <el-input v-model="form.merchantName" maxlength="50" minlength="1" placeholder="必填"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">商家地址</el-col>
                <el-col :span="20">
                    <el-input v-model="form.address" maxlength="255" minlength="1" placeholder="必填"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">联系人</el-col>
                <el-col :span="20">
                    <el-input v-model="form.contact" maxlength="50" minlength="1" placeholder="必填"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">联系电话</el-col>
                <el-col :span="20">
                    <el-input v-model="form.telephone" maxlength="50" minlength="1" placeholder="必填"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">启用状态</el-col>
                <el-col :span="20">
                    <el-select v-model="form.status" placeholder="请选择启用状态">
                        <el-option label="待审核" :value="0"></el-option>
                        <el-option label="停用" :value="-1"></el-option>
                        <el-option label="启用" :value="2"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">所属行业</el-col>
                <el-col :span="20">
                    <el-input v-model="form.industry" maxlength="50"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">规模</el-col>
                <el-col :span="20">
                    <el-input v-model="form.scale" maxlength="50"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">业务介绍</el-col>
                <el-col :span="20">
                    <el-input v-model="form.bizDesc" maxlength="1000" type="textarea" autosize></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">采购配送类型</el-col>
                <el-col :span="20">
                    <el-select v-model="form.pdsType">
                        <el-option label="普通商家" value="0"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">产品线类型</el-col>
                <el-col :span="20">
                    <el-select v-model="form.productLine">
                        <el-option label="采购配送" value="1"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">订单自动分配</el-col>
                <el-col :span="20">
                    <el-select v-model="form.isAutomaticOrder">
                        <el-option label="否" value="0"></el-option>
                        <el-option label="是" value="1"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">备注</el-col>
                <el-col :span="20">
                    <el-input v-model="form.remarks" maxlength="500" type="textarea" autosize></el-input>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props:{
        form:{
            type: Object,
            default: {}
        }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
<style scoped lang="scss">
    .el-row{
        margin-bottom: 10px;
    }
</style>
