export default {
    stockStatusOp: [
        {
            value: "0",
            label: "待审核"
        }, {
            value: "1",
            label: "已入库"
        }
    ],
    allotStatus: [
        {
            value: "0",
            label: "审核中"
        }, {
            value: "1",
            label: "已调拨"
        }
    ],
    payType: [
        {
            value: '01',
            label: '微信扫码'
        }, {
            value: '02',
            label: '微信刷卡'
        }, {
            value: '03',
            label: '微信公众号'
        }, {
            value: '04',
            label: '微信小程序'
        }, {
            value: '05',
            label: '支付宝扫码'
        }, {
            value: '06',
            label: '支付宝服务窗'
        }, {
            value: '07',
            label: 'QQ支付'
        }, {
            value: '08',
            label: '百度支付'
        }, {
            value: '09',
            label: '现金支付'
        }
    ],
    deliveryTypeOptions: [
        {
            value: '9',
            label: '送货上门',
        }, {
            value: '1',
            label: '自提',
        }, {
            value: '0',
            label: '快递',
        }],
    deliveryTypeMap: {
        '1': "自提",
        '9': '送货上门',
        '0': '快递'
    },
    deliveryStatus: [
        {
            value: '0',
            label: '待配送',
        }, {
            value: '1',
            label: '配送中',
        }, {
            value: '2',
            label: '已送达'
        }
    ],
    terminalType: [
        "手持pos机", "收银机", "小票打印机", "发票打印机"
    ],
    terminalStatus: {
        "2": "启用",
        "-1": "停用",
        "0": "待审核"
    },
    industryOptions: [
        {
            label: '标超杂食',
            value: '1',
        },
        {
            label: '奶茶小吃',
            value: '2',
        },
        {
            label: '母婴孕童',
            value: '3',
        },
        {
            label: '3C数码',
            value: '4',
        },
        {
            label: '服装鞋帽',
            value: '5',
        },
        {
            label: '生鲜水果',
            value: '6',
        },
        {
            label: '家装建材',
            value: '7',
        },
        {
            label: '无人货架',
            value: '8',
        },
        {
            label: '自动售货',
            value: '9',
        },
        {
            label: '社区仓配',
            value: '10',
        },
        {
            label: '其他',
            value: '11',
        },
    ],

    // 采购明细单状态
    buyerOrderOption: {
        "0": "备货中",
        "1": "待揽货",
        "2": "待分拣",
        "3": "已分拣",
        "4": "已装车",
    },
    // 采购汇总单状态
    buyerOrderStatusOption: {
        "0": "待报价",
        "1": "已报价",
        "2": "平台确认",
        "3": "成交",
        "4": "未成交",
    },
    // 采购单状态
    buyerOption: {
        "1": "已下单",
        "2": "待确认",
        "3": "已成交",
        "4": "已取消"
    },
    buyerOptionLabel: [
        {
            value: '1',
            label: "已下单"
        },
        {
            value: '2',
            label: "待确认"
        },
        {
            value: '3',
            label: "已成交"
        },
        {
            value: '4',
            label: "已取消"
        }
    ],
    buyerOrderCheck: [
        {
            label: '待报价',
            value: "0",
        },
        {
            label: '已报价',
            value: "1",
        },
        {
            label: '平台确认',
            value: "2",
        },
        {
            label: '成交',
            value: "3",
        },
        {
            label: '未成交',
            value: "4",
        },
        {
            label: '全部',
            value: '',
        },
    ],
    buySeqOptions: [
        {
            value: "0",
            label: "第一批次"
        },
        {
            value: "1",
            label: "第二批次"
        }
    ],
    commonModels: [
        "尺码",
        "颜色",
        "口味",
        "容量",
        "套餐",
        "种类",
        "尺寸",
        "重量",
        "型号",
        "款式"
    ],
    paymentStatus: [
        {
            value: '0',
            label: "未结算"
        },
        {
            value: '1',
            label: "已结算"
        }
    ],
    pdsBuyerType: [
        {
            value: '1',
            label: '员工'
        }, {
            value: '2',
            label: '老板'
        }, {
            value: '3',
            label: '运营'
        }, {
            value: '4',
            label: '自营'
        },
    ],
    payPeriod: [
        {
            value: '1',
            label: 'T+1'
        }, {
            value: '2',
            label: 'T+3'
        }, {
            value: '3',
            label: 'T+5'
        }, {
            value: '4',
            label: 'T+7'
        },
    ],
    yesNoType: [
        {
            value: '0',
            label: "否"
        },
        {
            value: '1',
            label: "是"
        }
    ],
}
