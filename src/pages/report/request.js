import req from "../../http/httpBase.js"
export default class Request extends req{
    constructor(){
        super()
    }
    // 查询商品列表
    getGoodsList(params = {}) {
        return this.post("/f/pds/api/common/goods/fetchGoodsList", params)
    }
    // 查询数据总览
    overview(params = {}){
        return this.post( "/f/pds/api/admin/statistical/overview", params)
    }
    // 查询销售曲线
    statisCurve(params = {}){
        return this.post( "/f/pds/api/admin/statistical/statisCurve", params)
    }
    // 查询销量top
    goodsTopN(params = {}){
        return this.post( "/f/pds/api/admin/statistical/goodsTopN", params)
    }
    // 订单数据(当天)
    orderDeal(params = {}){
        return this.post( "/f/pds/api/admin/statistical/orderDeal", params)
    }


    // 采购订单数据分析
    orderAnalyze(params = {}){
        return this.post( "/f/pds/api/admin/statistical/orderAnalyze", params)
    }
    // 销售趋势
    saleTrend(params = {}){
        return this.post( "/f/pds/api/admin/statistical/saleTrend", params)
    }
    
    // 商户销量排行
    buyerSaleTop(params = {}){
        return this.post( "/f/pds/api/admin/statistical/buyerSaleTop", params)
    }

    // 采购商贷款金额统计
    rangeAmount(params = {}){
        return this.post( "/f/pds/api/admin/statistical/rangeAmount", params)
    }
}