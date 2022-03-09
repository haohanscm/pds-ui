const orderRouter = {
    path: '/equipment',
    redirct: '/equipment/printer',
    component: { template: '<router-view></router-view>' },
    meta: { title: '设备管理' },
    children:[
        {
            path: 'printer',
            component: () => import('./printer/index.vue'),
            name: 'printer',
            meta: {title: '打印机管理'}
        },{
            path: 'terminal',
            component: () => import('./terminal/index.vue'),
            name: 'terminal',
            meta: {title: '终端管理'}
        }
    ]
}

export default orderRouter;