const deliveryRouter = {
    path: 'delivery',
    component: { template: '<router-view></router-view>'},
    redirect: 'wareHouse',
    meta: {title: '配送管理'},
    hidden: true,
    children: [
        {
            path: 'community',
            component: resolve => require(['./community.vue'], resolve),
            meta: { title: '小区-区域统计' }
        },
        {
            path: 'deliveryOrder',
            component: resolve => require(['./deliveryOrder.vue'], resolve),
            meta: { title: '订单统计' }
        },
        {
            path: 'deliveryPlan',
            component: resolve => require(['./deliveryPlan.vue'], resolve),
            meta: { title: '配送计划' }
        },
        {
            path: 'serviceArea',
            component: resolve => require(['./serviceArea.vue'], resolve),
            meta: { title: '服务区域' }
        },
        {
            path: 'community_edit',
            component: resolve => require(['./community_edit.vue'], resolve),
            meta: { title: '区域修改' }
        }
    ]
}

export default deliveryRouter
