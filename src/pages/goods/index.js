import httpBase from "../../http/httpBase.js"
export default class login extends httpBase{
    constructor(){
        super();
        this.goodsListUrl = "/f/xiaodian/api/merchant/v2.0/goods/fetchGoodsList"
        this.delGoodsUrl = "/f/xiaodian/api/merchant/v2.0/goods/goodsDelete"
        this.addGoodsBaseUrl = "/f/pds/api/common/goods/goodsBaseModify"
        this.fetchGoodsInfoUrl = "/f/xiaodian/api/merchant/v2.0/goods/fetchGoodsInfo"
        this.fetchCategoryListUrl = '/f/xiaodian/api/merchant/v2.0/goods/fetchCategoryList'
        this.modifyGoodsCategoryUrl = '/f/pds/api/common/goods/goodsCategoryModify'
        this.deleteGoodsCategoryUrl = '/f/xiaodian/api/merchant/v2.0/goods/goodsCategoryDelete'
        this.modifyGoodsStatusUrl = '/f/pds/api/common/goods/goodsStatusModify'
        this.modifygoodsExtInfoUrl = '/f/pds/api/common/goods/goodsExtModify'
    }
    delGoods(params) {
        return this.post(this.delGoodsUrl, params)
    }
    deleteGoodsCategory(params = {}) {
        return this.post(this.deleteGoodsCategoryUrl, params)
    }
}
