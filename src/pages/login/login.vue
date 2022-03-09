<template>
    <div class="login-wrap">
        <div class="ms-title">{{$constant.merchantName}}农产品供应链系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder="userName"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div ref="box"></div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Request from './request.js'
    export default {
        data: function(){
            return {
                request: new Request(),
                ruleForm: {
                    userName: "采购员",
                    password: ''
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'change' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ]
                },
            }
        },
        created(){
            this.checkLogin()
        },
        methods: {
            checkLogin(){
                /**前端自校验登录 */
                    // this.$utils.setCookie("userName", this.ruleForm.userName, 7);
                    // this.$utils.Cookie("password", this.ruleForm.password, 7);
                let pmId = this.$utils.getCookie("pmId") || "";
                if(pmId){//如果有就直接到首页咯
                    this.$router.replace( '/dashboard');
                }else{
                    if(to.path=='/login'){//如果是登录页面路径，就直接next()
                        this.$router.replace( '/');
                    }else{//不然就跳转到登录；
                        this.$router.replace( '/login');
                    }

                }
            },
            submitForm() {
                /**后端验证登录 */
                this.request.login(this.ruleForm).then( res=>{
                    if(res.code == 200){
                        this.$utils.setCookie("pmId", res.ext.pmId, 7);
                        this.$utils.setCookie("shopId", res.ext.shopId, 7);
                        this.$utils.setCookie("pmName", res.ext.pmName, 7);
                        this.$utils.setCookie("isSelfPm", res.ext.isSelfPm || false, 7);
                        this.$router.replace( '/dashboard');
                    }else{
                        this.$message(res.msg)
                    }

                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100vh;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
