const storeCashRouter = {
    path: '/storeCash',
    redirct: '/storeCash/storeCashCart',
    component: { template: '<router-view></router-view>' },
    meta: { title: '收银台' },
    children:[
        {
            path: 'storeCashCart',
            component: () => import('./cart/index.vue'),
            name: 'storeCashCart',
            meta: {title: '购物车'}
        },
        {
            path: 'storeCashPay',
            component: () => import('./storeCashPay/storeCashPay.vue'),
            name: 'storeCashPay',
            meta: {title: '收银台'}
        }
    ]
}

export default storeCashRouter
