import req from "../../http/httpBase.js"
export default class Request extends req{
    constructor(){
        super()
    }
    // 查询数据总览
    overview(params = {}){
        return this.post( "/f/xiaodian/api/order/report/summary", params)
    }
    // 查询销售曲线
    statisCurve(params = {}){
        return this.post( "/f/xiaodian/api/order/report/saleCurve", params)
    }
    // 查询销量top
    goodsTopN(params = {}){
        return this.post( "/f/xiaodian/api/order/report/saleVolumeRank", params)
    }
    // 分类销量占比
    categoryPercent(params = {}){
        return this.post( "/f/xiaodian/api/order/report/categorySaleStatis", params)
    }
    // 订单数据(当天)
    orderDeal(params = {}){
        return this.post( "/f/pds/api/admin/statistical/orderDeal", params)
    }

    // 运营简报
    briefReport(params = {}){
        return this.post( "/f/xiaodian/api/order/report/realTimeSummary", params)
    }
}