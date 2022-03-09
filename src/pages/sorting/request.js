import req from "../../http/httpBase.js"
export default class request extends req{
    constructor(){
        super()
    }
    //查询采购商列表
    fetchBuyerList(params = {}) {
        return this.post("/f/pds/api/admin/common/buyer/list", params)
    }
    //查询分拣列表
    fetchSortingList(params = {}) {
        return this.post("/f/pds/api/admin/sortout/findPage", params)
    }
    //确定分拣数量
    confirmSortingNumber(params = {}) {
        return this.post("/f/pds/api/admin/sortout/confirm", params)
    }
    //分拣进度(总体)
    fetchSortingProcess(params = {}) {
        return this.post("/f/pds/api/admin/sortout/process/all", params)
    }
    // 打印订单接口
    printTicket(params = {}) {
        return this.post("/f/pds/api/common/printer/textPrint", params)
    }
    // 打印飞鹅订单接口
    printFeieTicket(params = {}) {
        return this.post("/f/xiaodian/api/feieyun/printMsg", params)
    }
    // 获取易联云打印机列表
    fetchPrinterList(params = {}) {
        return this.post("/f/pds/api/common/printer/yiPrinterList", params)
    }
    // 获取飞云云打印机列表
    fetchFeiPrinterList(params = {}) {
        return this.post("/f/pds/api/common/printer/fetchPrinterList", params)
    }


    /**君磊农产品--多商家版 */
    // 交易完成
    shortcutFinish(params = {}){
        return this.post("/f/pds/api/admin/shortcut/finish", params)
    }
    // 一键分拣
    fastSortOut(params = {}){
        return this.post("/f/pds/api/admin/sortout/fastSortOut", params)
    }
    // 注册串口
    reg(base){
        return this.get("http://" + (base || "pds.haohanshop.com")+ "/reg?sn=17332f01ffd017bf4360f7b87813b770a978b628c3e079d9c7e20e96790301193ae0de5b982c792741b58bb1bad8451f&rnd=1545394807801&rel=d21wLml5YW5ob25nLmNvbQ%3D%3D")
    }
    // 打开串口
    open(base = "pds.haohanshop.com"){
        return this.get("http://" + (base || "pds.haohanshop.com") + "/open?cn=1&s=2400%2CN%2C8%2C1&dt=utf-8&rto=5&cmi=WEDEM&oc=1&rnd=1545394807836&rel=d21wLml5YW5ob25nLmNvbQ%3D%3D")
    }
    // 读取串口
    read(base = "pds.haohanshop.com"){
        return this.get("http://" + (base || "pds.haohanshop.com") + "/read?cn=1&cmi=WEDEM&rid=100&rnd=1545394382592&rel=d21wLml5YW5ob25nLmNvbQ%3D%3D")
    }
    // 关闭串口
    close(base = "pds.haohanshop.com"){
        return this.get("http://" + (base || "pds.haohanshop.com") + "/close?cn=1&cmi=WEDEM&rnd=1545395286010&rel=d21wLml5YW5ob25nLmNvbQ%3D%3D")
    }
}
