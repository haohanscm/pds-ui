<template>
    <div class="pay-wrap">
        <cash-header></cash-header>
        <el-row style="height: calc(100% - 40px);">
            <el-col class="pay-col" :span="10">
                <div class="pay-container pay-price">
                    <div class="pay-title">
                        <div>原价</div>
                        <div class="txt-red">{{totalPrice}}</div>
                    </div>
                    <div class="pay-content marketing-list">
                        <div class="marketing-list-item" v-if="hasUserInfo">
                            <div>
                                <i class="el-icon-hh-ticket_fill bc-purple marketing-icon" ></i>
                                <div>使用优惠券</div>
                            </div>
                            <div class="marketing-list-right">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="marketing-list-item" v-if="hasUserInfo">
                            <div>
                                <i class="el-icon-hh-presentfill bc-purple marketing-icon" ></i>
                                <div>使用礼品卡</div>
                            </div>
                            <div class="marketing-list-right">
                                <div class="">扫码使用</div>
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                        <div class="marketing-list-item">
                            <div>
                                <i class="el-icon-hh-ticket_money_fill bc-red marketing-icon" ></i>
                                <div>合计改价</div>
                            </div>
                            <div class="marketing-list-right">
                                <div class="txt-red">{{modifyPrice}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </el-col>
            <el-col class="pay-col" :span="10">
                <div class="pay-container">
                    <div class="pay-title">
                        <span>应收: <span class="txt-red fs20 ml10"> {{totalPrice}}</span></span>
                    </div>
                    <div class="pay-content" v-if="payChannelIndex == '1'">
                        <div class="pay-input">
                            <span>实收金额</span>
                            <el-input v-model="actualAmount" size="medium" placeholder="0.00"></el-input>
                        </div>
                        <div class="pay-input">
                            <span>找零金额</span>
                            <el-input v-model="overAmount" size="medium" placeholder="0.00"></el-input>
                        </div>
                        <virtual-board :value="actualAmount" @change="changeAmount"
                            @confirm="payCashOrder" :disabled="requesting">
                        </virtual-board>
                    </div>
                    <div class="pay-content" v-if="payChannelIndex == '2' || payChannelIndex == '3'">
                        <div class="pay-scan">
                            <div class="mt20 pay-scan-icon" v-loading="scanLoading">
                                <i class="el-icon-hh-scan"></i>
                            </div>
                            <div class="mt20">请扫描顾客的付款码</div>
                            <div class="mt20">
                                <div class="pay-scan-input">
                                    <el-input ref="authCodeFrom" suffix-icon="el-icon-hh-scan" clearable
                                    v-model="authCode" type="text" @change="payScanOrder"></el-input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pay-content" v-if="payChannelIndex == '4' || payChannelIndex == '5'">
                        <div class="pay-qrcode">
                            <qr-code class="mt40" v-loading="qrCodeLoading"
                                :text="qrCodeUrl" error-level="L"></qr-code>
                            <div class="mt40">请顾客扫码付款付款码</div>
                            <el-button class="mt40" type="primary"
                                @click="queryPayResult" >查询支付结果</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="pay-col" :span="4">
                <div class="pay-container">
                    <div class="pay-title">支付方式</div>
                    <div class="pay-content">
                        <div :class="['pay-channel', payChannelIndex == 1 ? 'active': '']"
                            @click="changePayChannel(1)">
                            <i class="bc-red el-icon-hh-recharge"></i>现金
                        </div>
                        <div :class="['pay-channel', payChannelIndex == 2 ? 'active': '']"
                            @click="changePayChannel(2)">
                            <i class="bc-blue el-icon-hh-scan"></i>扫码
                        </div>
                        <div class="line"></div>
                        <div :class="['pay-channel', payChannelIndex == 4 ? 'active': '']"
                            @click="changePayChannel(4)">
                            <i class="bc-blue el-icon-hh-barcode"></i>支付宝扫码
                        </div>
                        <div :class="['pay-channel', payChannelIndex == 5 ? 'active': '']"
                            @click="changePayChannel(5)">
                            <i class="bc-green el-icon-hh-barcode"></i>微信扫码
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import qrCode from 'vue-qrcode-component'
import eventBus from '@/components/common/bus.js'
import cashHeader from './../components/cashHeader'
import virtualBoard from './../components/virtualBoard.vue'
import Request from './../request.js'
export default {
    props: {

    },
    data() {
        return {
            request: new Request(),
            // 数据
            cashOrder: {},
            orderId: '',
            authCode: '',
            qrCodeUrl: 'hi',
            payChannelIndex: '1',

            actualAmount: '',
            overAmount: '',

            requesting: false,
            scanLoading: false,
            qrCodeLoading: true,
        }
    },
    components: { cashHeader, virtualBoard, qrCode },
    computed: {
        totalPrice: function() {
            return this.cashOrder.totalPrice || 0
        },
        modifyPrice: function() {
            let origin = +this.cashOrder.originalPrice
            let total = +this.cashOrder.totalPrice
            let result = total - origin
            return (result > 0 ? '+' + result : result) || 0
        },
        hasUserInfo: function() {
            let userInfo = this.cashOrder.userInfo
            return userInfo && (userInfo.id != null)
        },
        orderDesc() {
            let desc = ''
            if (!this.cashOrder.selectGoods) return;
            this.cashOrder.selectGoods.forEach(item => {
                desc += item.goodsName
            })
            return desc
        },
        orderDetails() {
            let list = []
            if (!this.cashOrder.selectGoods) return;
            list = this.cashOrder.selectGoods.map(item => {
                return item
            })
            return list
        },
        payWay() {
            let way = {}
            switch (+this.payChannelIndex) {
                case 1:
                    way.payChannel = 'cash'
                    way.payType = '12'
                    break;
                case 2:
                    way.payChannel = 'alipay'
                    way.payType = '06'
                    break;
                case 3:
                    way.payChannel = 'wechat'
                    way.payType = '02'
                    break;
                case 4:
                    way.payChannel = 'alipay'
                    way.payType = '05'
                    break;
                case 5:
                    way.payChannel = 'wechat'
                    way.payType = '01'
                    break;

                default:
                    break;
            }
            return way
        }
    },
    created() {
        eventBus.$on('submit-cart-order', this.confirmCashOrder)
        setTimeout(() => {
            if (this.cashOrder.selectGoods == null) {
                this.$router.push('/storeCash/storeCashCart')
            }
        }, 250)
    },
    mounted() {
    },
    methods: {
        confirmCashOrder(order) {
            this.cashOrder = order
            this.actualAmount = this.cashOrder.totalPrice
        },
        changeAmount(result) {
            this.actualAmount = result
            this.overAmount = +this.actualAmount - this.totalPrice
        },
        genTerminalOrder() {
            let user = this.cashOrder.userInfo;
            let orderAmount = 0;
            let arr = []
            this.orderDetails.forEach(ele => {
                let obj = {};
                obj.modelId = ele.id;
                obj.goodsName = ele.goodsName;
                obj.goodsUnit = ele.modelUnit;
                obj.modelName = ele.modelName;
                obj.goodsId = ele.goodsId;
                obj.goodsPrice = ele.modelPrice;
                obj.goodsNum = ele.goodsNum;
                arr.push(obj)
            })
            return {
                // shopId
                uid: user && user.id || '',
                addressId: this.$utils.getCookie("addressId"),
                merchantId: this.$utils.getCookie("pmId"),
                orderDesc: this.orderDesc,
                partnerNum: "001",         //渠道编号   固定传001
                orderType: '5',
                orderRemark: '',
                deliveryType: "9",             //配送方式
                orderAmount: this.cashOrder.totalPrice,
                orderDetails: arr,
            }
        },
        createOrder() {
            this.requesting = true
            let that = this
            if (this.cashOrder.selectGoods == null) {
                return new Promise(function(resolve, reject) {
                    throw new Error('没有商品, 请重新选择!')
                });
            }
            return this.request.createTerminalOrder(
                    this.genTerminalOrder()
                ).then(res => {
                    if (res.code == 200) {
                        this.orderId = res.ext
                        return res.ext
                    } else {
                        throw new Error('创建订单失败: ' + res.msg)
                    }
                })
        },
        payCashOrder() {
            if (this.overAmount > 100) {
                this.$message.error('找零金额应小于100元')
                return;
            }
            if (this.overAmount < 0) {
                this.$message.error('请输入正确金额')
                return;
            }
            if (this.requesting) return;
            this.createOrder().then(orderId => {
                this.payOrder(orderId).then(() => {
                    this.$message.success('支付成功')
                    this.$router.replace('/storeCash/storeCashCart')
                    this.$utils.removeStorageItem('temp_cache_cart')
                })
            }, err => {
                this.$message.error( err.message)
            })
        },
        payScanOrder() {
            this.scanLoading = true
            if (this.authCode) {
                this.$refs.authCodeFrom.blur()
                if (!this.checkAuthCode()) {
                    this.$message.error('支付码错误, 请重新扫码!')
                    return;
                }
                this.createOrder().then(orderId => {
                    this.payOrder(orderId, this.authCode).then(() => {
                        this.$message.success('支付成功')
                        this.scanLoading = true
                        this.$router.replace('/storeCash/storeCashCart')
                        this.$utils.removeStorageItem('temp_cache_cart')
                    })
                }, err => {
                    this.$message.error(err.message)
                })
            }
        },
        checkAuthCode(){
            let code = this.authCode
            if (this.isWeiXinCode(code)) {
                this.payChannelIndex = 3
                return true
            } else if (this.isAlipayCode(code)) {
                this.payChannelIndex = 2
                return true
            }
            return false
        },
        isWeiXinCode(code) {
            code = '' + code
            let startNum = code.slice(0, 2)
            if (code.length != 18) {
                return false
            }
            if (startNum == 10) return true;
            if (startNum == 11) return true;
            if (startNum == 12) return true;
            if (startNum == 13) return true;
            if (startNum == 14) return true;
            if (startNum == 15) return true;
            return false
        },
        isAlipayCode(code) {
            code = '' + code
            let startNum = code.slice(0, 2)
            if (code.length < 16 || code.length > 25) {
                return false
            }
            if (startNum < 25 || startNum > 30) {
                return false
            }
            return true
        },
        payQrcodeOrder() {
            this.createOrder().then(orderId => {
                this.payOrder(orderId).then(res => {
                    this.qrCodeLoading = false
                    this.qrCodeUrl = res.qrCode
                    this.queryPayResult(orderId)
                })
            }, err => {
                this.$message.error(err.message)
            })
        },
        payOrder(orderId, authCode = '') {
            return this.request.orderPay({
                orderId: orderId,
                payChannel: this.payWay.payChannel,
                payType: this.payWay.payType,
                orderAmount: this.totalPrice,
                authCode: authCode,
            }).then(res => {
                if (res.code == 200) {
                    let response = JSON.parse(res.ext)
                    this.requesting = false
                    return response
                } else {
                    throw new Error(res.msg)
                }
            }).catch(err => {
                this.$message.error(err.message)
            })
        },
        queryPayResult(orderId, flag) {
            if (orderId) {
                setTimeout(() => {
                    this.$message.success('支付成功: ' + this.payChannelIndex)
                }, 1000)
                return
            }
        },
        changePayChannel(index) {
            this.authCode = ''
            this.payChannelIndex = index
            if (index == 2 || index == 3) {
                this.$nextTick(() => {
                    this.$refs.authCodeFrom.focus()
                })
            }
            if (index == 4 || index == 5) {
                this.payQrcodeOrder()
            }
        },
    },
    beforeDestroy: function () {
        eventBus.$off('add-goods', this.confirmCashOrder)
    },
}
</script>

<style scoped>
.pay-wrap {
    background: #f2f2f2;
    height: 100%;
    font-size: 18px;
    font-weight: bold;
}
.pay-col {
    padding: 10px;
    height: 100%;
}
.pay-container {
    height: calc(100% - 70px);
    background: #fff;
    border-radius: 5px;
    padding: 20px;
}
.pay-title {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e4e4e4;
}
.pay-content {
    padding-top: 20px;
}
.pay-scan,
.pay-qrcode {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 20px;
}
.pay-scan-icon {
    background: #f5f5f5;
    border-radius: 50%;
    font-size: 120px;
}
.pay-scan-icon i{
    padding: 50px;
}
.pay-scan-input {
    position: relative;
    width: 300px;
    height: 30px;
    padding: 15px 20px;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    background: #f5f5f5;
    text-align: left;
    line-height: 30px;
}
.pay-scan-input .el-input__inner {
    background: #f5f5f5;
    border: none;
}
.marketing-list-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.marketing-list-item>div {
    display: flex;
    line-height: 40px;
}
.marketing-list-right {
    color: inherit;
    font-size: 14px;
}
.marketing-list-right i {
    line-height: 40px;
}
.pay-input {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
.pay-input .el-input {
    max-width: 280px;
    font-size: 20px;
}
.pay-input span {
    width: 100px;
    line-height: 38px;
}
.pay-channel {
    padding: 20px;
}
.marketing-icon,
.pay-channel i {
    padding: 5px;
    font-size: 30px;
    border-radius: 5px;
    color: #fff;
    margin-right: 20px;
    font-weight: bold;
}
.pay-channel.active {
    background: #f2f2f2;
    border-right: 6px solid #ba2429;
    border-radius: 5px;
}
.bc-red {
    background: #ee5a50;
}
.bc-blue {
    background: #3092ee;
}
.bc-green {
    background: #40ac0f;
}
.bc-purple {
    background: #7d72ca;
}
.txt-red {
    color: #ba2429;
}
.txt-inherit {
    color: inherit;
}
.line {
    border-bottom: 1px solid #e4e4e4;
    margin: 10px 0;
}
.fs20 {
    font-size: 30px;
    line-height: 20px;
}
.ml10 {
    margin-left: 10px;
}
.mt20 {
    margin-top: 20px;
}
.mt40 {
    margin-top: 40px;
}
</style>
<style>
.pay-scan-input input {
    background: #f5f5f5;
    border: none;
}
</style>
modelId不能为空;uid不能为空;goodsPrice不能为空;partnerNum不能为空;merchantId不能为空;modelId不能为空;goodsPrice不能为空;goodsPrice不能为空;modelId不能为空;
