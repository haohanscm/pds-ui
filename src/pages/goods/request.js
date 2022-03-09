import req from "../../http/httpBase.js"
export default class Request extends req{
    constructor(){
        super()
    }
    // 查询商列表
    fetchBuyerList(params = {}){
        return this.post( "/f/pds/api/admin/common/buyer/list", params)
    }
    queryList(params = {}){
        return this.post( "/f/pds/api/buyer/order/buyGoods/queryList", params)
    }
    // 查询采购商商品报价
    queryGoodsList(params = {}){
        return this.post( "/f/pds/api/buyer/goods/queryList", params)
    }
    //更改采购商商品批量报价修改
    batchUpdateGoodsPrice(params = {}){
        return this.post( "/f/pds/api/buyer/goods/batchUpdateGoodsPrice", params, {
            'Content-Type': 'application/json'
        })
    }
    // 采购商商品报价修改
    updateGoodsPrice(params = {}){
        return this.post( "/f/pds/api/buyer/goods/updateGoodsPrice", params)
    }
    // 复制采购商平台报价到新采购商
    copyGoodsByBuyer(params = {}){
        return this.post( "/f/pds/api/buyer/goods/copyGoodsByBuyer", params)
    }
    // 采购商商品报价初始化
    initPrice(params = {}){
        return this.post( "/f/pds/api/buyer/goods/initPrice", params)
    }
    // 采购商商品报价初始化
    updatePriceToPmShop(params = {}){
        return this.post( "/f/pds/api/buyer/goods/shopPrice/batchUpdate", params)
    }


    // 查询商品
    getGoodsList(params = {}) {
        return this.post("/f/pds/api/common/goods/fetchGoodsList", params)
    }
    // 查询商品分类
    fetchCategoryList(params = {}) {
        return this.post("/f/pds/api/common/goods/fetchCategoryList", params)
    }
    // 获取商品详情
    fetchGoodsInfo(params = {}) {
        return this.post("/f/pds/api/common/goods/fetchGoodsInfo", params)
    }
    // 商品分类编辑
    modifyGoodsCategory(params = {}) {
        return this.post('/f/pds/api/common/goods/goodsCategoryModify', params)
    }
    // 商品分类删除
    deleteGoodsCategory(params = {}) {
        return this.post('/f/pds/api/common/goods/goodsCategoryDelete', params)
    }
    // 修改商品上下架
    modifyGoodsStatus(params = {}) {
        return this.post( '/f/pds/api/common/goods/goodsStatusModify', params)
    }
    // 编辑商品基础信息
    addGoodsBaseInfo(params = {}) {
        return this.json('/f/pds/api/common/goods/goodsBaseModify', params)
    }
    // 修改商品拓展信息
    modifygoodsExtInfo(params = {}) {
        return this.json( '/f/pds/api/common/goods/goodsExtModify', params)
    }
}
