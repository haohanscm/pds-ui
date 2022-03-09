import req from "../../http/httpBase.js"
export default class Request extends req{
    constructor(){
        super()
    }
    // 查询采购商列表
    getBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/common/buyer/list", params)
    }

    // 查询采购商家列表
    getBuyerMerchantList(params = {}) {
        return this.post("/f/pds/api/buyer/info/merchantList", params)
    }
    // 查询商家列表
    getMerchantList(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/merchant/findList", params)
    }
}
