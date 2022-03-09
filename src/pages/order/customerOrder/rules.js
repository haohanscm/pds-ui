export default {
    customerRules: {
        telephone: [{
            required: true,
            message: '请输入采购商信息'
        }],
        deliveryTime: [{
            required: true,
            message: '请选择配送时间'
        }],
        buySeq: [{
            required: true,
            message: '请选择配送时段',
        }],
        deliveryType: [{
            required: true,
            message: '请选择配送方式',
        }]
    },
    orderDetailRules: {
        goodsName: [{
            required: true,
            message: '请输入商品信息',
        }],
        goodsId: [{
            required: true,
            message: '请输入商品规格'
        }],
        goodsNum: [{
                required: true,
                message: '请输入商品数量'
            },
            {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: '商品数量必须为数字,最多2位小数',
                trigger: 'blur'
            },
            {
                max: 10,
                message: '长度必需小于10',
                trigger: 'blur'
            }
        ],
        buyPrice: [
            {
                required: false,
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: '价格必须为数字,最多2位小数'
            },
            {
                max: 10,
                message: '长度必需小于10',
                trigger: 'blur'
            }
        ]
    }
}
