import Vue from 'vue';
import Router from 'vue-router';
import demo from './../pages/demo/demoRouter'
import supplier from './../pages/supplier/router'
import purchase from './../pages/purchase/router'
import order from './../pages/order/router'
import message from './../pages/message/router'
import goods from './../pages/goods/router'
import logistics from './../pages/logistics/router'
import funds from './../pages/funds/router'
import equipment from './../pages/equipment/router'
import report from './../pages/report/router'
import buyers from '../pages/manage/router'
import sorting from './../pages/sorting/router'
import warehouse from "./../pages/warehouse/router"
import dashboard from "./../pages/dashboard/router"
import storeCash from "./../pages/store_cash/router"

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import('../components/navigation/Home.vue'),
            meta: {title: '首页'},
            hidden: true,
            children: [
                demo,
                supplier,
                purchase,
                order,
                message,
                goods,
                logistics,
                funds,
                equipment,
                report,
                buyers,
                sorting,
                warehouse,
                dashboard,
                storeCash
            ]
        },
        {
            path: '/storeCash',
            component: () => import('../components/board/cash'),
            meta: {title: '收银台'},
            children: [
                storeCash,
            ]
        },
        {
            path: '/login',
            component: () => import('../pages/login/login.vue'),
            meta: {title: '登陆'},
            hidden: true,
        }
    ]
})
