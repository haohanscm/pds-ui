import req from "@/http/httpBase.js"
export default class request extends req{
    constructor(){
        super()
    }
    // 查询商家列表
    getMerchantList(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/merchant/findList", params)
    }
    // 商家编辑
    editMerchant(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/merchant/edit", params)
    }
    // 商家删除
    deleteMerchant(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/merchant/delete", params)
    }
    // 查询用户列表
    getCustomerList(params = {}) {
        return this.post("/f/pds/api/admin/customer/findList", params)
    }
    // 查询店铺列表
    getShopList(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/shop/findList", params)
    }
    // 店铺编辑
    editShop(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/shop/edit", params)
    }
    // 店铺删除
    deleteShop(params = {}) {
        return this.post("/f/pds/api/admin/merchantShop/shop/delete", params)
    }
    // 获取供应商列表
    getSupplierList(params = {}) {
        return this.post("/f/pds/api/admin/roles/supplier/findList", params)
    }
    // 供应商编辑
    editSupplier(params = {}) {
        return this.post("/f/pds/api/admin/roles/supplier/edit", params)
    }
    // 供应商删除
    deleteSupplier(params = {}) {
        return this.post("/f/pds/api/admin/roles/supplier/delete", params)
    }
    // 获取采购商列表
    getBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/roles/buyer/findList", params)
    }
    // 编辑采购商
    editBuyer(params = {}) {
        return this.post("/f/pds/api/admin/roles/buyer/edit", params)
    }
    // 删除采购商
    deleteBuyer(params = {}) {
        return this.post( "/f/pds/api/admin/roles/buyer/delete", params)
    }
}