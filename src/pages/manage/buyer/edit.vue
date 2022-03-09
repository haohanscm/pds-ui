<template>
    <div>
        <el-form :model="buyer" label-width="120px">
            <el-form-item prop="merchantId" label="商家" >
                <el-row :gutter="20">
                    <el-col :span="8" >
                       {{form.merchantName}}
                    </el-col>
                    <el-col :span="5">
                        可修改商家:
                    </el-col>
                    <el-col :span="8" >
                        <v-pm-merchant v-model="form.merchantId"></v-pm-merchant>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item prop="buyerName" label="采购商全称">
                <el-input v-model="form.buyerName"></el-input>
            </el-form-item>
            <el-form-item prop="shortName" label="简称">
                <el-input v-model="form.shortName"></el-input>
            </el-form-item>
            <el-form-item prop="contact" label="联系人">
                <el-input v-model="form.contact"></el-input>
            </el-form-item>
            <el-form-item prop="telephone" label="联系电话">
                <el-input v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item prop="address" label="地址">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item prop="sort" label="排序值">
                <el-input v-model="form.sort"></el-input>
            </el-form-item>
            <el-form-item prop="payPeriod" label="账期">
                <el-select v-model="form.payPeriod" placeholder="请选择">
                    <el-option
                        v-for="item in $dic.payPeriod"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="needPush" label="推送">
                <el-select v-model="form.needPush" placeholder="请选择推送状态">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="buyerType" label="采购商类型">
                <el-select v-model="form.buyerType" placeholder="请选择">
                    <el-option
                        v-for="item in $dic.pdsBuyerType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="needConfirmation" label="是否需确认订单">
                <el-select v-model="form.needConfirmation" placeholder="请选择">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="status" label="是否启用">
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option label="否" value="0"></el-option>
                    <el-option label="是" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="uid" label="uid">
                <el-input v-model="form.uid"></el-input>
            </el-form-item>
            <el-form-item prop="remarks" label="备注">
                <el-input v-model="form.remarks"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import vPmMerchant from "./../../../components/common/pm_merchant_select";

    export default {
        data() {
            return {
                buyer: {
                    merchantId: "",
                    // merchantName:"",
                    buyerName: "",
                    shortName: "",
                    contact: "",
                    telephone: "",
                    address: "",
                    sort: "",
                    payPeriod: "",
                    buyerType: "",
                    uid: "",
                    remarks: "",
                    needPush: "",
                    needConfirmation: "",
                    status: ""
                }
            }
        },
        props: {
            form: {
                type: Object
            }
        },
        components: {
            vPmMerchant
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            }
        }
    }
</script>
