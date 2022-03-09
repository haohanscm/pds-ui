const orderRouter = {
    path: '/manage',
    redirct: '/manage/merchant',
    component: { template: '<router-view></router-view>' },
    meta: { title: '商家管理' },
    children:[
        {
            path: 'merchant',
            component: () => import('./merchant/index.vue'),
            name: '商家列表',
            meta: {title: '商家列表'}
        },
        {
            path: 'customer',
            component: () => import('./customer/index.vue'),
            name: '用户列表',
            meta: {title: '用户列表'}
        },
        {
            path: 'shop',
            component: () => import('./shop/index.vue'),
            name: '店铺列表',
            meta: {title: '店铺列表'}
        },
        {
            path: 'supplier',
            component: () => import('./supplier/index.vue'),
            name: '供应商列表',
            meta: {title: '供应商列表'}
        },
        {
            path: 'buyer',
            component: () => import('./buyer/index.vue'),
            name: '采购商列表',
            meta: {title: '采购商列表'}
        }
    ]
}

export default orderRouter;
