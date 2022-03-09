import httpBase from "../../http/httpBase.js"
export default class storeCash extends httpBase{
    constructor(){
        super();
        this.goodsListUrl = "/f/xiaodian/api/merchant/v2.0/goods/fetchGoodsList"
        this.fetchGoodsInfoUrl = "/f/xiaodian/api/merchant/v2.0/goods/fetchGoodsInfo"
        this.fetchCategoryListUrl = '/f/xiaodian/api/merchant/v2.0/goods/fetchCategoryList'
        this.queryMemberUrl = '/f/xiaodian/api/merchant/v2.0/order/genOrder/queryByMobile'
        this.createTerminalOrderUrl = '/f/xiaodian/api/merchant/v2.0/order/genOrder/terminalAddOrder'
        this.orderPayUrl = '/f/xiaodian/api/order/orderPay/send'
    }
    // 查询商品列表
    getGoodsList(params = {}) {
        return this.post( "/f/pds/api/common/goods/fetchGoodsList", params)
    }
    fetchCategoryList(params = {}) {
        return this.post( "/f/pds/api/common/goods/fetchCategoryList", params)
    }
    fetchGoodsInfo(params) {
        return this.post( this.fetchGoodsInfoUrl, params)
    }
    queryMemberByMobile(params) {
        return this.post( this.queryMemberUrl, params)
    }
    createTerminalOrder(params) {
        return this.post( '/f/xiaodian/api/order/goodsOrder/createWebOrder', params, {
            'Content-Type': 'application/json'
        })
    }
    orderPay(params) {
        return this.post( this.orderPayUrl, params)
    }
}
