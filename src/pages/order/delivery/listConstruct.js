
//初始化table中的表格对象
function deliveryConstruct(params = [],len){
    let list = [];
    var obj = {
        buyId: "",
        buyPrice: "",
        buyerId: "",
        goodsId: "",
        goodsImg: "",
        goodsModel: "",
        goodsName: "",
        goodsNum: "",
        id: "",
        marketPrice: "",
        remarks: "",
        status: "",
        unit: "",
        updateDate: "",
    }
    var num = len - params.length;
    for (let index = 0; index < num; index++) {
        params.push(obj)
    }
    
    return params;
}

export default{
    deliveryConstruct
}