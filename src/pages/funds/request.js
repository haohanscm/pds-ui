import req from "../../http/httpBase.js"
export default class request extends req{
    constructor(){
        super()
    }
    // 查询采购商列表
    getBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/common/buyer/list", params)
    }
    // 获取供应商列表
    getSupplierList(params = {}) {
        return this.post("/f/pds/api/admin/roles/supplier/findList", params)
    }
    // 查询结算商家
    fetchCompanyList(params = {}) {
        return this.post("/f/pds/api/admin/bill/settlementRecord/fetchCompanyList", params)
    }
    // 查询供应商货款列表
    getSupamountList(params = {}) {
        return this.post("/f/pds/api/admin/bill/supplierPayment/findList", params)
    }
    // 查询采购商货款列表
    getPuramountList(params = {}) {
        return this.post("/f/pds/api/admin/bill/buyerPayment/findList", params)
    }
    // 批量生成采购商货款
    batchCreate(params = {}) {
        return this.post("/f/pds/api/admin/bill/buyerPayment/batchCreate", params)
    }
    // 批量生成供应商货款
    batchCreateSup(params = {}) {
        return this.post("/f/pds/api/admin/bill/supplierPayment/create", params)
    }
    // 查询结算列表
    getRecordList(params = {}) {
        return this.post("/f/pds/api/admin/bill/settlementRecord/findList", params)
    }
    // 编辑结算列表
    editRecord(params = {}) {
        return this.post("/f/pds/api/admin/bill/settlementRecord/edit", params)
    }
    // 查询结算金额
    queryAmount(params = {}) {
        return this.post("/f/pds/api/admin/bill/settlementRecord/queryAmount", params)
    }
}
