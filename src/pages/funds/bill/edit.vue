<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="结算开始日期">
                <el-date-picker
                    v-model="form.settlementBeginDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结算结束日期">
                <el-date-picker
                    v-model="form.settlementEndDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="付款日期">
                <el-date-picker
                    v-model="form.payDate"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="商家类型">
                <el-select v-model="form.companyType" @change="changeCom" placeholder="请选择">
                    <el-option
                        v-for="item in [{
                            value: '1',
                            label: '采购商'
                        },{
                            value: '2',
                            label: '供应商'
                        }]"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算类型">
                <el-select v-model="form.settlementType" @change="queryAmount" placeholder="请选择">
                    <el-option
                        v-for="item in [{
                            value: '1',
                            label: '收入'
                        },{
                            value: '2',
                            label: '支出'
                        }]"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算公司">
                <el-select v-model="form.companyId" @change="queryAmount" placeholder="请选择">
                    <el-option
                        v-for="item in list"
                        :key="item.merchantName"
                        :label="item.merchantName"
                        :value="item.merchantId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算金额">
                <el-input v-model="form.settlementAmount" :value="form.settlementAmount"></el-input>
            </el-form-item>
            <el-form-item label="结算单号">
                <el-input v-model="form.paymentSn" :value="form.paymentSn"></el-input>
            </el-form-item>
            <el-form-item label="经办人">
                <el-input v-model="form.operator" :value="form.operator"></el-input>
            </el-form-item>
            <el-form-item label="结款人">
                <el-input v-model="form.companyOperator" :value="form.companyOperator"></el-input>
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
            list:[]
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
        },
        changeCom(e){
            this.fetchCompanyList(e)
        },
        // 查询结算商家
        fetchCompanyList(companyType) {
            this.request.fetchCompanyList({ companyType }).then(res => {
                if (res.code == 200) {
                    this.list = res.ext
                }else{
                    this.$message.warning("未查询到结算记录：" + res.msg)
                }
            })
        },
        // 查询结算金额
        queryAmount() {
            this.request.queryAmount({ ...this.form, beginDate:this.form.settlementBeginDate, endDate:this.form.settlementEndDate }).then(res => {
                if (res.code == 200) {
                    this.form.paymentSn = res.ext.paymentSn
                    this.form.settlementAmount = res.ext.settlementAmount
                    console.log( "aaa",this.form)
                }else{
                    this.$message.warning( res.msg)
                }
            })
        },
    }
  }
</script>
