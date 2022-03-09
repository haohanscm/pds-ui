const orderRouter = {
    path: '/funds',
    redirct: '/funds/supplier',
    component: { template: '<router-view></router-view>' },
    meta: { title: '资金管理' },
    children:[
        {
            path: 'supplier',
            component: () => import('./supplier/index.vue'),
            name: 'supplier',
            meta: {title: '供应商账单'}
        },{
            path: 'purchase',
            component: () => import('./purchase/index.vue'),
            name: 'purchase',
            meta: {title: '采购商账单'}
        },{
            path: 'bill',
            component: () => import('./bill/index.vue'),
            name: 'purchase',
            meta: {title: '结算单'}
        }
    ]
}

export default orderRouter;