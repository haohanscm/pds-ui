const orderRouter = {
    path: '/supplier',
    redirct: '/supplier/supplierList',
    component: { template: '<router-view></router-view>' },
    meta: { title: '供应商管理' },
    children:[
        {
            path: 'supplierList',
            component: () => import('./supplierList/index.vue'),
            name: 'supplierList',
            meta: {title: '供应商列表'}
        }
    ]
}

export default orderRouter;