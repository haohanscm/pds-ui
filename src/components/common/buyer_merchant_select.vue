<template>
    <div class="bms">
        <!--<span class="bms_label">采购商家：</span>-->
        <el-select
            class="bms_select"
            filterable
            clearable
            default-first-option
            v-model="merchantId"
            @change="optionChange"
            style="max-width: 350px"
            value-key="merchantId"
            placeholder="请选择">
            <el-option
                v-for="item in buyerMerchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import Request from "./request";
    export default {
        data: function(){
            return {
                request: new Request(),
                buyerMerchantList: [],
                merchantId:""
            }
        },
        model: {
          prop: 'value',
          event: 'change'
        },
        created(){
            this.getBuyerMerchantList()
        },
        methods:{
            // 查询采购商家 列表
            getBuyerMerchantList() {
                this.request.getBuyerMerchantList().then(res => {
                    if (res.code == 200) {
                        if(res.ext.count > 0){
                            this.buyerMerchantList = res.ext.merchantList;
                        }
                    }else{
                        this.$message.warning("未查询到采购商家列表：" + res.msg)
                    }
                })
            },
            optionChange(){
                // console.log("merchantId", this.merchantId);
                this.$emit('change', this.merchantId);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
