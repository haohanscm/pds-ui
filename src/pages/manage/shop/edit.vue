<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="店铺名称">
                <el-input v-model="form.name" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="店铺地址">
                <el-input v-model="form.address" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="店铺经营范围">
                <el-input v-model="form.shopService" maxlength="200" type="textarea" autosize></el-input>
            </el-form-item>
            <el-form-item label="负责人">
                <el-input v-model="form.manager" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
                <el-input v-model="form.telephone" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="启用状态">
                <el-select v-model="form.status" placeholder="请选择启用状态">
                    <el-option label="待审核" value="0"></el-option>
                    <el-option label="停用" value="-1"></el-option>
                    <el-option label="启用" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="店铺描述">
                <el-input v-model="form.shopDesc"></el-input>
            </el-form-item>
            <el-form-item label="更新即速">
                <el-select v-model="form.isUpdateJisu" placeholder="请选择认证状态">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="认证状态">
                <el-select v-model="form.authType" placeholder="请选择认证状态">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
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
