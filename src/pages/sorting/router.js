const sortingRouter = {
    path: '/sorting',
    redirct: '/sorting/sortingList',
    component: { template: '<router-view></router-view>' },
    meta: { title: '分拣管理' },
    children:[
        {
            path: 'sortingList',
            component: () => import('./sortingList/index.vue'),
            name: 'sortingList',
            meta: {title: '分拣记录'}
        },{
            path: 'sortingStation',
            component: () => import('./sortingStation/index.vue'),
            name: 'sortingStation',
            meta: {title: '分拣操作台'}
        }
    ]
}

export default sortingRouter;
