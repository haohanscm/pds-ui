<template>
    <div>
        <div class="title">
            <div>
                <el-input v-model="ip" placeholder="请输入分拣机IP"></el-input><el-button @click="setIp">设置分拣机ip</el-button>
            </div>
            <div>
                <el-input v-model="addressId" placeholder="请输入收银台默认地址Id"></el-input><el-button @click="setAddressId">设置默认地址ID</el-button>
            </div>
        
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ip: this.$utils.getCookie("ip"),
                addressId: ""
            }
        },
        components:{

        },
        watch:{
        },
        created(){
        },
        methods:{
            setIp(){
                try {
                    this.$utils.setCookie( "ip", this.ip, 10000)
                    this.$message.success("保存成功！")
                } catch (error) {
                    this.$message.warning(error)
                }
                
            },
            setAddressId(){
                try {
                    this.$utils.setCookie( "addressId", this.addressId, 10000)
                    this.$message.success("保存成功！")
                } catch (error) {
                    this.$message.warning(error)
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .title{
        display: flex;
        background-color: white;
        padding: 10px;
        margin-bottom: 20px;
        justify-content: space-between;
        >div{
            display: flex;
            width: 350px;
            align-self: center;
        }
    }
</style>
