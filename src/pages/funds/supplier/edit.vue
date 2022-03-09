<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="供应日期">
                <el-date-picker
                v-model="form.supplyDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="供应商">
                <el-select v-model="form.supplierId" placeholder="请选择">
                    <el-option
                        v-for="item in supList"
                        :key="item.id"
                        :label="item.supplierName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Request from "../request.js";
  export default {
    data() {
        return {
            request: new Request(),
            supList: []
        }
    },
    props:{
        form:{
            type: Object,
            default: {}
        }
    },
    created(){
        this.getSupplierList()
    },
    methods: {
        onSubmit() {
            console.log( 'submit!');
        },
        // 查询供应商列表
        getSupplierList() {
            this.request.getSupplierList({pageSize: 1000}).then(res => {
                if (res.code == 200) {
                    this.supList = res.ext.list;
                }else{
                    this.$message.warning("未查询到采购商列表：" + res.msg)
                }
            })
        },
        // 查询供应商列表
        getSupplierList() {
            this.request.getSupplierList({pageSize: 1000}).then(res => {
                if (res.code == 200) {
                    this.supList = res.ext.list;
                }else{
                    this.$message.warning("未查询到采购商列表：" + res.msg)
                }
            })
        },
    }
  }
</script>
