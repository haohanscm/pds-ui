import req from "../../http/httpBase.js"
export default class request extends req {
    constructor() {
        super()
    }
    /**公共 */

    //查询供应商列表
    getSupplierList(params = {}) {
        return this.post("/f/pds/api/admin/common/supplier/list", params)
    }
    //查询采购商列表
    getBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/common/buyer/list", params)
    }


    //查询订单汇总
    getsummaryOrderList(params = {}){
        return this.post("/f/pds/api/admin/summary/findPage", params)
    }
    //保存报价单
    saveSupplierList(params = {}) {
        return this.post("/f/pds/api/admin/summary/offer/save", params, {
            'Content-Type': 'application/json'
        })
    }
    //修改采购单
    editBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/summary/buy/edit", params, {
            'Content-Type': 'application/json'
        })
    }
    //删除报价单
    deleteSupplierList(params = {}) {
        return this.post("/f/pds/api/admin/summary/offer/delete", params)
    }
    /**purchase */
    //查询供应单列表
    fetchBuyOrderList(params = {}) {
        return this.post("/f/pds/api/admin/order/buy/list", params)
    }
    //查询供应单详情
    fetchSumList(params = {}) {
        return this.post("/f/pds/api/admin/order/buy/sumList", params)
    }
    //修改运费
    editBuyOrder(params = {}) {
        return this.post("/f/pds/api/admin/order/editBuyOrder", params)
    }
    //获取采购单明细
    editBuyDetail(params = {}) {
        return this.post("/f/pds/api/admin/order/buyDetail/findPage", params)
    }
    //查询车辆列表
    truckList(params = {}){
        return this.post("/f/pds/api/admin/common/delivery/truckList", params)
    }
    /**delivery */
    // 查询车辆配送的采购商列表
    truckBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/order/driver/shipList", params)
    }
    // 查询车辆配送的送货单列表
    shipOrder(params = {}) {
        return this.post("/f/pds/api/admin/order/driver/shipDetails", params)
    }
    // 查询车辆配送的送货单列表
    driverList(params = {}) {
        return this.post("/f/pds/api/admin/common/driver/list", params)
    }
    // 添加备注
    editRemark(params = {}) {
        return this.post("/f/pds/api/admin/order/shipOrder/edit", params)
    }

    /**supply */
    //获取供应单 -- 采购单汇总
    fetchOfferList(params = {}){
        return this.post("/f/pds/api/admin/order/offer/findPage", params)
    }

    /**新增采购单 */
    // 查询商品列表
    getGoodsList(params = {}) {
        return this.post("/f/pds/api/common/goods/fetchGoodsList", params)
    }
    fetchCategoryList(params = {}) {
        return this.post("/f/pds/api/common/goods/fetchCategoryList", params)
    }
    // 提交采购单
    addBuyOrder(params = {}) {
        return this.json("/f/pds/api/buyer/order/buyOrder/add", params)
    }
    /**selfLift */
    //获取自提采购商
    selfOrderList(params = {}){
        return this.post("/f/pds/api/admin/order/selfOrder/buyerList", params)
    }
    //获取自提交易单
    selfBuyerOrderList(params = {}){
        return this.post("/f/pds/api/admin/order/selfOrder/orderList", params)
    }

    /**君磊农产品----多商家版 */
    // 采购单汇总
    shortcutCollect(params = {}){
        return this.post("/f/pds/api/admin/shortcut/collect", params)
    }
    // 交易确认
    shortcutConfirm(params = {}){
        return this.post("/f/pds/api/admin/shortcut/confirm", params)
    }
    // 交易完成
    shortcutFinish(params = {}){
        return this.post("/f/pds/api/admin/shortcut/finish", params)
    }
    // 交易完成
    purchaseOrder(params = {}){
        return this.post("/f/pds/api/admin/summary/convert", params)
    }
    /**
     * order
     */
    //采购单明细列表
    purchaseList(params = {}){
        return this.post("/f/pds/api/admin/order/buyDetail/list", params)
    }
    //删除采购单明细
    removeGoods(params = {}){
        return this.post("/f/pds/api/admin/order/buyDetail/delete", params)
    }
    //修改采购单
    modifyList(params = {}){
        return this.post("/f/pds/api/buyer/order/buyOrder/modify", params, {
            'Content-Type': 'application/json'
        })
    }
    // 飞鹅打印 采购单
    printBuyOrder(params = {}){
        return this.post("/f/pds/api/buyer/order/buyOrder/printComplete", params);
    }
    //重置数据
    reset(params = {}){
        return this.post("/f/pds/api/admin/shortcut/reset", params)
    }
    // 确认已收货
    goodsReceived(params = {}){
        return this.post("/f/pds/api/admin/shortcut/goodsReceived", params)
    }




}
