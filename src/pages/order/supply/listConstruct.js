
//初始化table中的表格对象
function buyConstruct(params = []){
    var obj = {
        buyNum: "",
        buySeq: "",
        goodsModel: "",
        goodsName: "",
        goodsUnit: "",
        offerOrderId: "",
        prepareDate: "",
        supplyPrice: "",
    }
    var num = 20 - params.length;
    for (let index = 0; index < num; index++) {
        params.push(obj)
    }
    
    return params;
}

export default{
    buyConstruct
}