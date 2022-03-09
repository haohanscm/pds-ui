const goodsRouter = {
    path: '/goods',
    redirct: '/goods/goodsList',
    component: { template: '<router-view></router-view>' },
    meta: { title: '商品库' },
    children:[
        {
            path: 'goodsLib',
            component: () => import('./goodsLib/index.vue'),
            name: 'goodsLib',
            meta: {title: '商品库'}
        },{
            path: 'goodsList',
            component: () => import('./goods_list'),
            name: 'goodsList',
            meta: {title: '商品列表'}
        },
        // {
        //     path: 'goods_quote',
        //     component: () => import('./goods_quote/index.vue'),
        //     name: 'goods_quote',
        //     meta: {title: '商品报价'}
        // },
        {
            path: 'platform_buyer_goods',
            component: () => import('./platform_buyer_goods/index.vue'),
            name: 'platform_buyer_goods',
            meta: {title: '商品报价'}
        },
        {
            path: 'addGoods',
            component: () => import('./../goods/addGoods/index.vue'),
            name: 'addGoods',
            meta: {title: '新增商品'}
        },
        {
            path: 'editGoods',
            component: () => import('./../goods/addGoods/index.vue'),
            name: 'editGoods',
            meta: {title: '编辑商品'}
        },
        {
            path: 'goodsCate',
            component: () => import('./goods_cate/goodsCate.vue'),
            name: 'goodsCate',
            meta: {title: '商品分类'}
        },
        {
            path: 'addGoodsCate',
            component: () => import('./../goods/goods_cate/modifyGoodsCate.vue'),
            name: 'addGoodsCate',
            meta: {title: '新增分类'}
        },
        {
            path: 'editGoodsCate',
            component: () => import('./../goods/goods_cate/modifyGoodsCate.vue'),
            name: 'editGoodsCate',
            meta: {title: '编辑分类'}
        },
    ]
}

export default goodsRouter;
