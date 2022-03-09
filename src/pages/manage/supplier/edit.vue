<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="供应商名称">
                <el-input v-model="form.supplierName"></el-input>
            </el-form-item>
            <el-form-item label="标签">
                <el-input v-model="form.tags"></el-input>
            </el-form-item>
            <el-form-item label="简称">
                <el-input v-model="form.shortName"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
                <el-input v-model="form.contact"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="账期">
                <el-input v-model="form.payPeriod"></el-input>
            </el-form-item>
            <el-form-item label="供应商地址">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="商家名称">
                <el-input v-model="form.merchantName"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="form.supplierType" placeholder="请选择认证状态">
                    <el-option label="库存供应商" value="1"></el-option>
                    <el-option label="一般供应商" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="消息推送">
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
