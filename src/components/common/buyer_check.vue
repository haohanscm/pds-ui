<template>
    <div>
        <el-select
            style="width:160px;"
            filterable
            clearable
            default-first-option
            v-model="id"
            @change="onBuyerChange(id)"
            placeholder="请选择采购商">
            <el-option
                v-for="item in buyerList"
                :key="item.buyerName"
                :label="item.buyerName"
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
                buyerList: [{
                    id:"123",
                    buyerName: "123"
                }],
                id: ""
            }
        },
        model: {
          prop: 'value',
          event: 'balabala'
        },
        computed:{
            buyerId(){
                return this.value
            }
        },
        mounted(){
            this.fetchBuyerList()
        },
        methods:{
            // 查询采购商列表
            fetchBuyerList() {
                this.request.getBuyerList().then(res => {
                    if (res.code == 200) {
                        this.buyerList = res.ext
                    }else{
                        this.$message.warning("未查询到采购商列表：" + res.msg)
                    }
                })
            },
            onBuyerChange(id){
                this.$emit('balabala', id)
                let index = -1;
                this.buyerList.forEach( (ele,idx) => {
                    if( ele.id === id){
                        index = idx
                    }
                })
                if( index >= 0){
                    this.$emit("buyerChange", this.buyerList[index])
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .wrap{
        .check-condition{
            background-color: #fff;
            padding: 15px;
            display: flex;
            >div{
                margin-left: 15px;
                display: flex;
                height: 30px;
            }
        }
        .title{
            margin-top: 10px;
            padding: 0;
        }
        .charts{
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            >div{
                width: 49.5%;
            }
        }
    }
</style>
