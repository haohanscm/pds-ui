const wareHouseRouter = {
    path: 'wareHouse',
    component: { template: '<router-view></router-view>' },
    meta: { title: '进销存' },
    redirect: 'wareHouse',
    hidden: true,
    children:[
        {
            path: 'inventory',
            component: resolve => require(['./inventory/index.vue'], resolve),
            meta: { title: '商品盘点' }
        },
        {
            path: 'procurement',
            component: resolve => require(['./procurement/index.vue'], resolve),
            meta: { title: '进货管理' }
        },
        {
            path: "purchaseReturn",
            component: resolve => require(['./purchase_return/index.vue'], resolve),
            meta: { title: '采购退货' }
        },
        {
            path: 'stockGoodsAllot',
            component: resolve => require(['./stock_goods_allot/index.vue'], resolve),
            meta: { title: '库存调拨' }
        },
        {
            path: 'newPurchase',
            component: resolve => require(['./procurement/new_purchase/index.vue'], resolve),
            meta: { title: '新增采购' }
        },
        {
            path: 'purchaseReturn_new',
            component: resolve => require(['./purchase_return/purchase_return_new/index.vue'], resolve),
            meta: { title: '新增退货' }
        }
    ]
}

export default wareHouseRouter
