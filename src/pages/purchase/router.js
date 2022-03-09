const orderRouter = {
    path: '/purchase',
    redirct: '/purchase/sorting',
    component: { template: '<router-view></router-view>' },
    meta: { title: '采购管理' },
    children:[
        {
            path: 'sorting',
            component: () => import('./sorting/index.vue'),
            name: 'sorting',
            meta: {title: '货物分拣'}
        },{
            path: 'purchase',
            component: () => import('./purchase/index.vue'),
            name: 'purchase',
            meta: {title: '货物采购'}
        }
    ]
}

export default orderRouter;