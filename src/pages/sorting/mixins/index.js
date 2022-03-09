import Request from './../request'

let request = new Request()
/**
 * 交易单号  tradeId
 * 采购商名称  buyerName
 * 商品名称 goodsName
 * 实际数量  sortOutNum
 * 商品规格 goodsModel
 * 单位 unit
 * 联系人  contact, 电话  contactPhone
 * 地址 deliveryAddress
 * 配送日期  deliveryTime
 * 采购批次 buySeq
 */

var mixin = {
    data() {
        return {
            printerSn: '',
            feieSn: "",//飞鹅打印机id
            feieType: "",//飞鹅类型
            printerType: '3',//易联云打印机类型
            printerList: [],
            feieList:[],//飞鹅打印机列表
            buySeqOptions: this.$dic.buySeqOptions,
            printType: "3",
            printList:[
                {
                    value: "0",
                    label: "70 * 40"
                },
                {
                    value: "1",
                    label: "60 * 40"
                },
                {
                    value: "2",
                    label: "50 * 40"
                },
                {
                    value: "3",
                    label: "50 * 30"
                }
            ]       
        }
    },
    mounted() {
        this.fetchPrinterList().then(res => {
            this.printerList = res
        })
        this.fetchFeiPrinterList().then(res => {
            console.log(res)
            this.feieList = res.list;
        })
        this.initPrinterInfo()
    },
    methods: {
        //获取易联云打印机列表
        fetchPrinterList() {
            let params = {
                shopId: $constant.shopId
            }
            return request.fetchPrinterList(params).then(res => {
                if (res.code == 200) {
                    return res.ext
                } else {
                    console.log('获取打印机列表错误: ', res.msg);
                }
            })
        },
        //获取飞鹅云答应机列表
        fetchFeiPrinterList() {
            let params = {
                pageSize: 100,
                shopId: $constant.shopId
            }
            return request.fetchFeiPrinterList(params).then(res => {
                if (res.code == 200) {
                    return res.ext
                } else {
                    console.log('获取打印机列表错误: ', res.msg);
                }
            })
        },
        printTicket: function (order) {
            let {
                tradeId,
                buyerName,
                goodsName,
                sortOutNum,
                goodsModel,
                unit,
                contact,
                contactPhone,
                deliveryAddress,
                deliveryTime,
                buySeq,
                buyPrice
            } = order;
            let totalAmount = ( sortOutNum * buyPrice ).toFixed(2)
            if(this.feieSn){
                let feieTicket
                if(this.feieType == "2"){
                    
                    feieTicket = `<C>-----------------------------------------------</C>` +
                        `<B>交易单号: ${tradeId}</B><BR><BR>` +
                        `<B>采购商家: ${buyerName}</B><BR><BR>` +
                        `<B>商品名称: ${goodsName}</B><BR><BR>` +
                        `<B>实际数量: ${sortOutNum}${unit ? ' /' + unit : unit}</B><BR><BR>` +
                        `商品规格: ${goodsModel}<BR>` +
                        `单位: ${unit}<BR>` +
                        `<C>-----------------------------------------------</C>` +
                        `联系人: ${contact}<BR>` +
                        `电话: ${contactPhone}<BR>` +
                        `地址: ${deliveryAddress}<BR>` +
                        `配送日期: ${deliveryTime}<BR>` +
                        `采购批次: ${this.buySeqOptions[+buySeq].label}<BR>`
                }else{
                    feieTicket =`<C>--------------------------------</C>` +
                        `<L>交易单号:</L><BOLD><L>${tradeId}</L></BOLD><BR><BR>` +
                        `<L>采购商家:</L><BOLD><L>${buyerName}</L></BOLD><BR><BR>` +
                        `<L>商品名称:</L><BOLD><L>${goodsName}</L></BOLD><BR><BR>` +
                        `<L>实际数量:</L><B>${sortOutNum}${unit ? ' /' + unit : unit}</B><BR><BR>` +
                        `商品规格: ${goodsModel}<BR>` +
                        `单位: ${unit}<BR>` +
                        `<C>--------------------------------</C>` +
                        `联系人: ${contact}<BR>` +
                        `电话: ${contactPhone}<BR>` +
                        `地址: ${deliveryAddress}<BR>` +
                        `配送日期: ${deliveryTime}<BR>` +
                        `采购批次: ${this.buySeqOptions[+buySeq].label}<BR>`
                }
                request.printFeieTicket({
                    sn: this.feieSn,
                    content: feieTicket
                })
            }
            if(!this.printerSn) return;
            let ticket;
            let printerSn = this.printerSn
            let printerType = this.printerType
            if (printerType == '0') {
                ticket = `<FH2><FS><FW><center>采购商名称</center></FW></FS></FH2>` +
                `<FH2><FS>${goodsName}(${goodsModel})x${sortOutNum}${unit}</FS></FH2>\r`+
                `<LR>单号:${tradeId},日期:${deliveryTime}</LR>`         
            }else if(printerType == "1"){//易联云打印
                ticket = `<PW>058</PW><table><tr><td><FB><FS>${goodsName}(${goodsModel})x${sortOutNum}${unit}</FS></FB></td></tr><tr><td>日期：${deliveryTime}</td><td> </td><td>价格：<FB>${totalAmount}</FB></td></tr><tr><td>商家：${buyerName}</td></tr><tr><td>地址：${deliveryAddress}</td></tr><tr><td><BR2>${tradeId}</BR2></td></tr></table>`
            }else if(printerType == "2"){//易联云打印
                ticket = `<table><tr><td><FB><FS>${goodsName}</FS></FB></td></tr><tr><td>数量：${sortOutNum}${unit}</td><td>规格：${goodsModel}</td></tr><tr><td>日期：${deliveryTime}</td></tr><tr><td>商家：${buyerName}</td></tr><tr><td><BR2>${tradeId}</BR2></td><td></td></tr></table>`
            } else {
                ticket = `<FH2><FS><FW><center>${buyerName}</center></FW></FS></FH2>\r` +
                `<FH2><FS>${goodsName}</FS></FH2>\r`+
                `<FH><FS><right>(${goodsModel}) x ${sortOutNum}${unit}</right></FS></FH>\r`+
                `<LR>单号:${tradeId},日期:${deliveryTime}</LR>`;
            }

            request.printTicket({
                orderId: tradeId,
                machineCode: printerSn,
                content: ticket
            })
        },
        initPrinterInfo() {
            let info = this.$utils.getStorage('printer_info')
            let printerInfo = JSON.parse(info)
            if (info) {
                this.printerSn = printerInfo.printerSn
                this.printerType = printerInfo.printerType || '2'
            }
            let info1 = this.$utils.getStorage('feie_printer_info')
            let printerInfo1 = JSON.parse(info1)
            if (printerInfo1) {
                this.feieSn = printerInfo1.printerSn;
                this.feieType = printerInfo1.feieType || '2';
            }
        },
        savePrinterInfo(e) {
            let printerType = this.printType
            this.printerType = printerType
            let store = JSON.stringify({
                printerSn: e,
                printerType
            })
            this.$utils.setStorage('printer_info', store)
        },
        saveFeieInfo(e) {
            let index = this.feieList.map(n => n.printerSn).indexOf(e)
            let printerType = this.feieList[index].printerType
            this.feieType = printerType
            let store = JSON.stringify({
                printerSn: e,
                feieType: this.feieType
            })
            this.$utils.setStorage('feie_printer_info', store)
        }
    }
}


export default mixin
