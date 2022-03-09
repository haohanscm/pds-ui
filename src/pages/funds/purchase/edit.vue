<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="商家名称">
                <el-input v-model="form.merchantName"></el-input>
            </el-form-item>
            <el-form-item label="商家地址">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="联系人">
                <el-input v-model="form.contact"></el-input>
            </el-form-item>
            <el-form-item label="商家电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="商家电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="商家电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="商家电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="商家电话">
                <el-input v-model="form.telephone"></el-input>
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
