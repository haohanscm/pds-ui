import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import axios from 'axios';

import utils from "./utils/utils.js";
import '../static/css/icon.css';
import "babel-polyfill";
import dic from "./utils/dictionary.js";
import store from './store';
import components from "./components/common/common.js";

let $utils = new utils();
Vue.use(ElementUI, {size: 'small'});
Vue.prototype.$axios = axios;
Vue.prototype.$utils = $utils;
Vue.prototype.$dic = dic;
Vue.prototype.$constant = $constant;
Vue.use(components)
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {


     // /**前端自校验登录代码块 */
    let pmId = $utils.getCookie("pmId") || "";
    let shopId = $utils.getCookie("shopId") || "";
    let pmName = $utils.getCookie("pmName") || "";
    console.log("检测cookie:"+pmId);
    if(pmId){
        $utils.setCookie("pmId", pmId, 0.1);
        $utils.setCookie("shopId", shopId, 0.1);
        $utils.setCookie("pmName", pmName, 0.1);
        next();
    }else{
        if(to.path === "/login"){
            next();
        }else{
            next("/login")
        }
    }

})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
