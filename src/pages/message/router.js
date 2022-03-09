const orderRouter = {
    path: '/message',
    redirct: '/message/buyers',
    component: { template: '<router-view></router-view>' },
    meta: { title: '订单管理' },
    children:[
        {
            path: 'buyers',
            component: () => import('./buyers/index.vue'),
            name: 'buyers',
            meta: {title: '采购商通知记录'}
        },{
            path: 'system',
            component: () => import('./system/index.vue'),
            name: 'system',
            meta: {title: '零售报表'}
        },{
            path: 'supplier',
            component: () => import('./supplier/index.vue'),
            name: 'supplier',
            meta: {title: '供应商通知记录'}
        }
    ]
}

export default orderRouter;