const orderRouter = {
    path: '/report',
    redirct: '/report/goods',
    component: { template: '<router-view></router-view>' },
    meta: { title: '订单管理' },
    children:[
        {
            path: 'goods',
            component: () => import('./goods/index.vue'),
            name: 'goods',
            meta: {title: '商品报表'}
        },{
            path: 'purchase',
            component: () => import('./purchase/index.vue'),
            name: 'purchase',
            meta: {title: '订单报表'}
        },{
            path: 'bill',
            component: () => import('./bill/index.vue'),
            name: 'bill',
            meta: {title: '结算报表'}
        }
    ]
}

export default orderRouter;