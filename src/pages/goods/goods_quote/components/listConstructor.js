
function build(arr, len){
    // 检测参数
    if(Object.prototype.toString.call(arr) !== "[object Array]") return false;
    if(Object.prototype.toString.call(len) !== "[object Number]" || 0 >= len) return false;
    let myArr = [];
    let finalArr = [];
    //对输入数组排序
    arr.sort((a,b) => {
        return b.goodsList.length - a.goodsList.length;
    })
    let len2 = len
    while (len2 > 0) {
        myArr.push([]);
        len2--;
    }
    // 瀑布流拼接
    arr.forEach(ele => {
        // 小的在前
        myArr.sort((a,b) => {
            return a.length - b.length;
        })
        myArr[0].push({title: true,neck: false, name: ele.categoryName,body: false},
            {title:false,neck: true,name: ele.categoryName,body:false})
        ele.goodsList.forEach( item => {
            item.oldPurchasePrice = item.purchasePrice
            myArr[0].push({ title: false, neck: false, name: ele.categoryName, body: item})
        })
    });
    // 数组转置
    for (let index = 0; index < myArr.length; index++) {
        let element = myArr[index];
        element.forEach((ele,idx) => {
            finalArr[idx] ? finalArr[idx] = finalArr[idx] : finalArr[idx] = [];
            finalArr[idx][index] = ele
        })
    }
    console.log( finalArr)
    // 数组填空
    finalArr.forEach(item => {
        for (let index = 0; index < len; index++) {
            let ele = item[index];
            if(!ele){
                ele = {title:false,neck: false,name: false,body:{}}
            }
            item[index] = ele
        }
    })
    return finalArr;
}

export default{
    build,
}