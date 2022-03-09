
//初始化table中的表格对象
function listConstruct(params = []){
    let list = [];
    params.forEach(ele => {
        let obj = {
            summaryOrderId: ele.summaryOrderId || 123,
            goodsId: ele.goodsId,
            category: ele.category || "无分类",
            goodsName: ele.goodsName || "无名称",
            goodsModel: ele.goodsModel || "无规格",
            unit: ele.unit || "无规格",
            weight: ele.weight || "0",
            volume: ele.volume || "0.000",
            needBuyNum: ele.needBuyNum || "0",
            realBuyNum: "0",
            lossPercent: ele.lossPercent || "0.00",
            stockNum: ele.stockNum || "0",
            platformPrice: "0",//市场价
            marketPrice:  ele.marketPrice || "2.00",
            avgBuyPrice:  "0.00",
            buyerBillAmount:  "0.00",
            avgSupplyPrice:  "0.00",
            profits:  "0",
            status: ele.status,
            supplierAmount:  "0.00",
            buyOrderDetailList: buyOrderDetailCon(ele.buyOrderDetailList, ele),
            supplierList1: supplierListCon(ele.offerOrderList, ele)

        }
        list.push(obj)
    })
    return list;
}
function buyOrderDetailCon(list = [], original = {}){
    list.forEach(ele => {
        ele.buyPrice = ele.buyPrice || "0"
        ele.totalPrice = ( ele.goodsNum * (+ele.buyPrice )).toFixed(2);
    })
    return list;
}

function supplierListCon(list = [], original = {}, buyNum = 0){
    list.forEach(ele => {
        let offerId = ele.id;
        let supplierId = ele.supplierId;
        ele.offerId = offerId;
        ele.supplierId = supplierId;
        ele.supplyPrice = ele.supplyPrice || original.marketPrice || "0";
        ele.buyNum = buyNum || ele.buyNum || original.needBuyNum || '0';
        ele.supplierBillAmount = ( ele.buyNum * ele.supplyPrice ).toFixed(2)
    })
    return list;
}

function supplierOnce(list = [], original = {}, buyNum = 0){
    list.forEach(ele => {
        ele.supplyPrice = original.marketPrice || "0";
        ele.supplyPrice = +(ele.supplyPrice * 0.7).toFixed(2);
        ele.buyNum = buyNum || '0';
        ele.supplierBillAmount = ( ele.buyNum * ele.supplyPrice ).toFixed(2)
    })
    return list;
}
//修改供应单的传参模型
function offerOrderModelCon(params = []){
    let offerOrderModel = [];
    params.forEach(ele => {
        let askOrderId = ele.summaryOrderId;
        ele.supplierList1.forEach(item => {
            offerOrderModel.push({
                askOrderId,
                supplierId: item.supplierId || item.id,
                supplierName: item.supplierName,
                supplyPrice: item.supplyPrice,
                supplyNum: item.supplyNum,
                minSaleNum: item.minSaleNum,
                buyNum: item.buyNum,
                offerId: item.offerId
            })
        })
    })
    return offerOrderModel;
}
//修改总的采购单的传参模型
function buyOrderModelCon(params = []){
    let buyOrderModel = [];
    params.forEach(ele => {
        ele.buyOrderDetailList.forEach(item => {
            buyOrderModel.push({
                ...item
            })
        })
    })
    return buyOrderModel;
}
//修改单个采购单的传参模型
function oneBuyOrderModelCon(params = []){
    let buyOrderModel = [];
    params.forEach(item => {
        buyOrderModel.push({
            ...item
        })
    })
    return buyOrderModel;
}

export default{
    listConstruct,
    buyOrderModelCon,
    oneBuyOrderModelCon,
    offerOrderModelCon,
    supplierListCon,
    supplierOnce
}
