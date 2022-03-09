
//初始化table中的表格对象
function deliveryConstruct(params = []){
    let list = [];
    var obj = {
        buyId: "",
        buyPrice: "",
        goodsCategory: "",
        goodsModel: "",
        goodsName: "",
        goodsUnit: "",
        sortOutNum: "",
        tradeId: "",
    }
    var num = 20 - params.length;
    for (let index = 0; index < num; index++) {
        params.push(obj)
    }
    
    return params;
}

export default{
    deliveryConstruct
}