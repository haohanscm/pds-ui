import httpBase from "../../http/httpBase.js"
import Utils from "@/utils/utils"
const utils = new Utils();
export default class order extends httpBase{
    constructor(){
        super();
    }
    /**
     * 公共接口
     */
    //查询供应商列表 ---- 下拉框使用
    fetchSupplierList(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/fetchList", params)
    }
    //查询仓库列表  ----- 下拉框使用
    fetchWarehouseList(params = {}){
        params.merchantId = utils.getCookie("pmId")
        params.pageSize = 200;
        params.pageNo = 1
        return this.post("/f/pss/api/wareHouse/findPage", params)
    }
    //获取仓库库存商品列表
    findStockGoodsPage(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/xiaodian/api/merchant/v2.0/pss/storage/findPage", params)
    }


    /**
     * 供应商
     */
    //查询供应商列表
    fetchSupplier(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/findPage", params)
    }
    //修改供应商
    editSupplier(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/save", params)
    }
    //删除供应商
    deleteSupplier(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/delete", params)
    }
    //添加供应商
    addSupplier(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/save", params)
    }
    //还款
    repayment(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/repayment", params)
    }
    //查看还款记录列表
    repaymentRecordList(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/supplier/repayment/history", params)
    }

    /**
     * 仓库
     */
    //查询仓库列表
    fetchWarehouse(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/wareHouse/findPage", params)
    }
    //修改仓库
    editWarehouse(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/wareHouse/save", params)
    }
    //删除仓库
    deleteWarehouse(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/wareHouse/delete", params)
    }
    //添加仓库
    addWarehouse(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/wareHouse/save", params)
    }
    //查看库存详情
    findStorageGoodsPage(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/storage/findPage", params)
    }

    /**
     * 商品采购
     */
    //查看采购列表
    fetchProcurement(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procurement/findPage", params)
    }
    //复制新增
    // copyProcurement(params = {}){
    //     return this.post("/f/xiaodian/api/merchant/v2.0/pss/procurement/copy", params)
    // }
    //新增
    addProcurement(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procurement/save", params,
        { 'Content-Type': 'application/json' })
    }
    //删除采购单
    deleteProcurement(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procurement/delete", params)
    }
    //采购单入库
    enterStock(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procurement/details/enterStock", params)
    }
    //查看采购单明细
    fetchPurchaseDetail(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procurement/details/findPage", params)
    }

    
    //删除采购单明细
    // deleteProcurementDetail(params = {}){
    //     return this.post("/f/pss/api/procurement/details/delete", params)
    // }
    
    //采购清单
    // findDetailPage(params = {}){
    //     return this.post("/f/xiaodian/api/merchant/v2.0/pss/procurement/findDetailPage", params)
    // }
    //查询分类
    // fetchCategoryList(params = {}){
    //     return this.post ('/f/pss/api/goods/fetchCategoryList', params)
    // }
    //获取商品列表
    // goodsModelList(params = {}){
    //     return this.post('/f/pss/api/goods/goodsModelList',params)
    // }



    /**
     * 采购退货部分
     */
    //退货列表
    fetchReturnPage(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procureReturn/findPage", params)
    }
    //退货清单
    fetchReturnDetail(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procureReturn/details", params)
    }
    //新增退货
    addReturnDetail(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procureReturn/save", params,
        { 'Content-Type': 'application/json' })
    }
    //确认退货
    confirmReturn(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procureReturn/confirm", params)
    }
    //删除退货单
    deleteProcureReturn(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/procureReturn/delete", params)
    }
    
    /**
     * 商品库存盘点
     */
    //列表
    fetchInventoryList(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/storage/findPage", params)
    }
    //修改库存数量
    editInventory(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/storage/adjustNum", params)
    }
    //数量确认
    // checkConfirm(params = {}){
    //     return this.post("/f/xiaodian/api/merchant/v2.0/pss/goodsStorageInventory/checkConfirm", params)
    // }
    //盘点商品记录列表
    findGoodsCheckPage(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/storage/inventory/history", params)
    }

    /**
     * 商品调拨
     */
    //商品调拨列表
    fetchGoodsAllotList(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/goodsAllot/findPage", params)
    }
    //新增调拨
    addGoodsAllot(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/goodsAllot/save", params,
        { 'Content-Type': 'application/json' })
    }
    //确认调拨
    confirmGoodsTransfer(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/goodsAllot/confirm", params)
    }
    //调拨详情
    queryTransferDetail(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/goodsAllot/details", params)
    }
    //获取仓库库存商品列表
    findStockGoodsPage(params = {}){
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pss/api/storage/findPage", params)
    }
    // 查询商品列表
    getGoodsList(params = {}) {
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pds/api/common/goods/fetchGoodsList", params)
    }
    fetchCategoryList(params = {}) {
        params.merchantId = utils.getCookie("pmId")
        return this.post("/f/pds/api/common/goods/fetchCategoryList", params)
    }
}
