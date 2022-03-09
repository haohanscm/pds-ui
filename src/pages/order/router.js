const orderRouter = {
    path: '/order',
    redirct: '/order/afterSale',
    component: { template: '<router-view></router-view>' },
    meta: { title: '订单管理' },
    children:[
        {
            path: 'afterSale',
            component: () => import('./afterSale/index.vue'),
            name: 'afterSale',
            meta: {title: '售后订单'}
        },{
            path: 'purchase',
            component: () => import('./purchase/index.vue'),
            name: 'purchase',
            meta: {title: '采购订单'}
        },{
            path: 'supplyMatch',
            component: () => import('./supply_match/index.vue'),
            name: 'supplyMatch',
            meta: {title: '供给匹配'}
        },{
            path: 'delivery',
            component: () => import('./delivery/index.vue'),
            name: 'delivery',
            meta: {title: '配送订单'}
        },{
            path: 'trans',
            component: () => import('./trans/index.vue'),
            name: 'trans',
            meta: {title: '交易订单'}
        },{
            path: 'supply',
            component: () => import('./supply/index.vue'),
            name: 'supply',
            meta: {title: '供应订单'}
        },{
            path: 'customerOrder',
            component: () => import('./customerOrder/index.vue'),
            name: 'customerOrder',
            meta: {title: '代客下单'}
        },{
            path: 'selfLift',
            component: () => import('./selfLift/index.vue'),
            name: 'selfLift',
            meta: {title: '自提订单'}
        },{
            path: 'order',
            component: () => import('./order/index.vue'),
            name: 'order',
            meta: {title: '订单查看'}
        }
    ]
}

export default orderRouter;
