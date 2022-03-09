import httpBase from "../../http/httpBase.js"
export default class login extends httpBase{
    constructor(){
        super();
        this.loginUrl = "/login/login"
    }
    login(params){
        return this.post( this.loginUrl, params)
    }
    /****
     * 片区-小区管理页面接口
     * */ 
    //查询片区列表
    fetchAreaList(params = {}){
        return this.post( '/f/xiaodian/api/merchant/v2.0/delivery/districtArea/fetchList', params)
    }
    //删除片区
    delDistrictArea(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/districtArea/delDistrictArea', params)
    }
    //片区编辑
    editDistrictArea(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/districtArea/editDistrictArea', params)
    }
    //新增片区
    addDistrictArea(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/districtArea/addDistrictArea', params)
    }
    //查询小区
    fetchCommunityList(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/community/fetchList', params)
    }
    //删除小区
    delCommunity(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/community/delCommunity', params)
    }
    //修改小区名
    editCommunity(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/community/editCommunity', params)
    }
    //添加小区
    addCommunity(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/community/addCommunity', params,
        { 'Content-Type': 'application/x-www-form-urlencoded' },
        false)
    }



    /**
     * 店铺服务区域列表
     * **/
    //查询店铺列表
    fetchShopList(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/shopServiceArea/fetchList', params)
    }
    //查询服务片区列表
    queryShopServiceArea(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/shopServiceArea/queryShopServiceArea', params)
    }
    //查询店铺片区小区列表
    queryShopServiceCommunity(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/shopServiceArea/queryShopServiceCommunity', params)
    }
    //编辑区域
    editServiceArea(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/shopServiceArea/editServiceArea', params,
        { 'Content-Type': 'application/json' })
    }



    /***
     * 配送计划部分
    */
    //查看配送计划列表
    deliveryPlanList(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/deliveryPlan/fetchList', params)
    }
    //变更配送员
    changeDeliveryMan(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/deliveryPlan/changeDeliveryMan', params,
        { 'Content-Type': 'application/x-www-form-urlencoded' },
        false)
    }
    //修改计划状态
    changePlanStatus(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/deliveryPlan/changePlanStatus', params)
    }
    //查看配送计划统计
    querySummaryCount(params = {}){
        return this.post('/f/xiaodian/api/merchant/v2.0/delivery/deliveryPlan/querySummaryCount', params)
    }
    



    /***
     * 配送订单部分
     */
    //查询配送订单列表
    fetchDeliveryOrderList(params = {}){
        return this.post("/f/xiaodian/api/merchant/v2.0/delivery/deliveryOrder/fetchList", params)
    }
    //查看配送员列表
    fetchDeliveryManList(params = {}){
        return this.post("/f/xiaodian/api/merchant/v2.0/delivery/deliveryMan/fetchList", params)
    }
    //重新生成配送计划
    genDeliveryPlan(params = {}){
        return this.post("/f/xiaodian/api/merchant/v2.0/delivery/deliveryOrder/genDeliveryPlan", params)
    }
}
