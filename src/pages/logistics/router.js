const orderRouter = {
    path: '/logistics',
    redirct: '/logistics/car',
    component: { template: '<router-view></router-view>' },
    meta: { title: '订单管理' },
    children:[
        {
            path: 'car',
            component: () => import('./car/index.vue'),
            name: 'car',
            meta: {title: '车辆管理'}
        },{
            path: 'path',
            component: () => import('./path/index.vue'),
            name: 'path',
            meta: {title: '路线管理'}
        },{
            path: 'distribution',
            component: () => import('./distribution/index.vue'),
            name: 'distribution',
            meta: {title: '配送列表'}
        }
    ]
}

export default orderRouter;