const orderRouter = {
    path: '/demo',
    redirct: '/demo/demo',
    component: { template: '<router-view></router-view>' },
    meta: { title: '订单管理' },
    children:[
        {
            path: 'demo',
            component: () => import('./demo.vue'),
            name: 'demo',
            meta: {title: 'demo'}
        }
    ]
}

export default orderRouter