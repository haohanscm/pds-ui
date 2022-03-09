<template>
    <div class="bms">
        <el-select
            class="bms_select"
            filterable
            clearable
            default-first-option
            v-model="merchantId"
            @change="optionChange"
            style="max-width: 350px"
            placeholder="请选择商家">
            <el-option
                v-for="item in merchantList"
                :key="item.id"
                :label="item.merchantName"
                :value="item.id">
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
                merchantList: [],
                merchantId:""
            }
        },
        model: {
          prop: 'value',
          event: 'change'
        },
        created(){
            this.getMerchantList()
        },
        methods:{
            // 查询商家 列表
            getMerchantList() {
                let params = {
                    pageSize: 100,
                    status: 2
                };
                this.request.getMerchantList(params).then(res => {
                    if (res.code == 200) {
                        this.merchantList = res.ext.list;
                        this.merchantList.push({
                            id: this.$utils.getCookie("pmId"),
                            merchantName: this.$utils.getCookie("pmName")
                        });
                        this.total = res.ext.count;
                    }else{
                        this.$message.warning("未查询到采购商列表：" + res.msg)
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
