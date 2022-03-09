<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="('/' + item.index + '/' + subItem.index)">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-hh-home',
                        index: '/dashboard',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-document',
                        index: 'report',
                        title: '配送报表',
                        subs: [
                            {
                                icon: 'el-icon-star-on',
                                index: 'purchase',
                                title: '订单报表'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'goods',
                                title: '商品报表'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'bill',
                                title: '结算报表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-hh-qi',
                        index: 'manage',
                        title: '商家管理',
                        subs: [
                            {
                                icon: 'el-icon-star-on',
                                index: 'merchant',
                                title: '商家列表'
                            },{
                                icon: 'el-icon-star-on',
                                index: 'shop',
                                title: '店铺列表'
                            },{
                                icon: 'el-icon-star-on',
                                index: 'buyer',
                                title: '采购商列表'
                            },{
                                icon: 'el-icon-star-on',
                                index: 'customer',
                                title: '用户列表'
                            },{
                                icon: 'el-icon-star-on',
                                index: 'supplier',
                                title: '供应商列表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-hh-shop',
                        index: 'order',
                        title: '订单中心',
                        subs: [
                            {
                                icon: 'el-icon-tickets',
                                index: 'supplyMatch',
                                title: '供给匹配'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'delivery',
                                title: '配送单'
                            },
                            // {
                            //     icon: 'el-icon-tickets',
                            //     index: 'purchase',
                            //     title: '订单溯源'
                            // },
                            {
                                icon: 'el-icon-tickets',
                                index: 'supply',
                                title: '供应订单'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'selfLift',
                                title: '自提订单'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'order',
                                title: '采购订单'
                            },
                            // {
                            //     icon: 'el-icon-tickets',
                            //     index: 'trans',
                            //     title: '交易订单'
                            // },
                            // {
                            //     icon: 'el-icon-hh-shop',
                            //     index: 'afterSale',
                            //     title: '售后订单'
                            // },
                            {
                                icon: 'el-icon-hh-shop',
                                index: 'customerOrder',
                                title: '代客下单'
                            }
                        ]

                    },
                    {
                        icon: 'el-icon-hh-text',
                        index: 'message',
                        title: '零售报表',
                        subs: [
                            {
                                icon: 'el-icon-tickets',
                                index: 'system',
                                title: '零售汇总'
                            },
                            // {
                            //     icon: 'el-icon-tickets',
                            //     index: 'supplier',
                            //     title: '供应商通知记录'
                            // },
                            // {
                            //     icon: 'el-icon-tickets',
                            //     index: 'buyers',
                            //     title: '运营商通知记录'
                            // }
                        ]
                    },
                    {
                        icon: 'el-icon-hh-goods',
                        index: 'goods',
                        title: '商品管理',
                        subs: [
                            {
                                icon: 'el-icon-tickets',
                                index: 'goodsList',
                                title: '商品列表'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'addGoods',
                                title: '新增商品'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'goodsCate',
                                title: '分类管理'
                            },{
                                icon: 'el-icon-tickets',
                                index: 'platform_buyer_goods',
                                title: '商品定价'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'goodsLib',
                                title: '商品库列表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-hh-sort',
                        index: 'sorting',
                        title: '分拣管理',
                        subs: [
                            {
                                icon: 'el-icon-tickets',
                                index: 'sortingList',
                                title: '分拣记录'
                            },
                            {
                                icon: 'el-icon-tickets',
                                index: 'sortingStation',
                                title: '分拣操作台'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-hh-global',
                        index: 'wareHouse',
                        title: '进销存',
                        subs: [
                            {
                                icon: 'el-icon-tickets',
                                index: 'procurement',
                                title: '进货管理'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'purchaseReturn',
                                title: '采购退货'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'inventory',
                                title: '商品盘点'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'stockGoodsAllot',
                                title: '库存调拨'
                            }
                        ]
                    },
                    // {
                    //     icon: 'el-icon-hh-people',
                    //     index: 'logistics',
                    //     title: '物流管理',
                    //     subs: [
                    //         {
                    //             icon: 'el-icon-tickets',
                    //             index: 'car',
                    //             title: '车辆管理'
                    //         },
                    //         {
                    //             icon: 'el-icon-tickets',
                    //             index: 'path',
                    //             title: '路线管理'
                    //         },
                    //         {
                    //             icon: 'el-icon-tickets',
                    //             index: 'distribution',
                    //             title: '配送列表'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-hh-global',
                    //     index: 'purchase',
                    //     title: '采购管理',
                    //     subs: [
                    //         {
                    //             icon: 'el-icon-tickets',
                    //             index: 'purchase',
                    //             title: '货物采购'
                    //         },
                    //         {
                    //             icon: 'el-icon-star-on',
                    //             index: 'sorting',
                    //             title: '货物分拣'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-hh-peoplelist',
                    //     index: 'storeCash',
                    //     title: '收银台',
                    //     subs: [
                    //         {
                    //             icon: 'el-icon-star-on',
                    //             index: 'storeCashCart',
                    //             title: '现金收银'
                    //         },{
                    //             icon: 'el-icon-star-on',
                    //             index: 'purchase',
                    //             title: '采购商账单'
                    //         }
                    //     ]
                    // },
                    {
                        icon: 'el-icon-hh-order',
                        index: 'funds',
                        title: '账单管理',
                        subs: [
                            {
                                icon: 'el-icon-star-on',
                                index: 'purchase',
                                title: '采购商货款'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'supplier',
                                title: '供应商货款'
                            },
                            {
                                icon: 'el-icon-star-on',
                                index: 'bill',
                                title: '结算记录'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-hh-apps',
                        index: 'equipment',
                        title: '设备管理',
                        subs: [
                            // {
                            //     icon: 'el-icon-star-on',
                            //     index: 'printer',
                            //     title: '打印机管理'
                            // },
                            {
                                icon: 'el-icon-star-on',
                                index: 'terminal',
                                title: '终端管理'
                            }
                        ]
                    },
                    // {
                    //     icon: 'el-icon-hh-settings',
                    //     index: 'system',
                    //     title: '系统设置',
                    //     subs: [
                    //         {
                    //             icon: 'el-icon-star-on',
                    //             index: 'printer',
                    //             title: '打印机管理'
                    //         }
                    //     ]
                    // }
                ]
            }
        },
        computed:{
            onRoutes(){
                // console.log(this.$route.path)
                return this.$route.path;
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 180px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
