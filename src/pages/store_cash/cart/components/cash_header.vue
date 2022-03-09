<template>
    <div class="header">
        <div class="collapse-btn">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">浩瀚小店</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 收银台 -->
                <div class="btn-cash">
                    <router-link to="/dashboard" tag="a">
                        <div class="link-btn">
                            <i class="el-icon-hh-home"></i>
                            <span>管理后台</span>
                        </div>
                    </router-link>
                </div>
                <div class="btn-refresh">
                    <router-link to="/storeCash/storeCashCart" tag="a">
                        <div class="link-btn">
                            <i class="el-icon-hh-refresh"></i>
                            <span>刷新</span>
                        </div>
                    </router-link>
                </div>
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item divided  command="my-shop">切换店铺</el-dropdown-item>
                        <el-dropdown-item divided  command="personal">个人中心</el-dropdown-item>
                        <el-dropdown-item divided  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="user-avator"><img src="static/img/img.jpg"></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: '游客你好',
            }
        },
        computed:{
            username(){
                let username = this.$utils.getCookie('userName');
                return username ? username : this.name;
            }
        },

        methods:{
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('ms_username')
                    this.$router.push('/login');
                }
                if(command == 'personal'){
                    this.$router.push('/personal');
                }
                if(command == 'my-shop'){
                    this.$router.push('/personal/personalHome');
                }
            },
        },
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:300px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-cash, .btn-refresh {
        font-size: 16px;
        color: #fff;
        margin-right: 20px;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
    .link-btn {
        color: #fff;
    }
</style>
