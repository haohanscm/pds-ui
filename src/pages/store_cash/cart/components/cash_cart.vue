
<template>
    <div class="cash-cart">
        <div class="member-wrap" @click="showMemberDialog">
            <a>
                <i class="el-icon-hh-people txt-blue"></i>
                <span>{{userInfo.loginName}}</span>
            </a>
        </div>
        <div class="goods-wrap">
            <div class="goods-title">
                <div>商品列表</div>
                <div class="txt-blue" @click="delvalue">清空列表</div>
            </div>
            <div class="goods-body">
                <div class="goods-item" @click="showGoodsDialog(index)"
                    v-for="(item, index) in value" :key="index">
                    <goods-item :height="80" :goods="item" :in-cart="true"></goods-item>
                </div>
            </div>
            <div class="goods-footer">
                <div class="goods-footer-cart">
                    <el-badge :value="cartNum" :max="99">
                        <i class="el-icon-hh-cart"></i>
                    </el-badge>
                </div>
                <div class="goods-count">
                    <span>¥</span>
                    <span class="fs30">{{totalPrice}}</span>
                </div>
            </div>
            <div class="cart-foot">
                <div class="cart-hang-up"  v-if="isCartEmpty" @click="backupCart">挂单</div>
                <div class="cart-hang-up" v-else @click="showBackupCartList">取单</div>
                <div class="cart-submit" @click="submitCartOrder">收银</div>
            </div>
        </div>
        <el-dialog title="会员" :visible.sync="memberVisible" width="30%">
            <div class="member-dialog" >
                <div v-if="userInfo.avatar">
                    <div class="txt-center" >
                        <img class="member-avatar" :src="userInfo.avatar"/>
                    </div>
                </div>
                <div class="txt-center" v-if="userInfo.id">
                    <div class="txt-center member-name fs20">{{userInfo.loginName || userInfo.telephone}}</div>
                    <div class="txt-center member-info member-level">会员</div>
                    <div class="txt-center member-info member-level">积分 0</div>
                    <div class="txt-center member-info member-level">余额 0</div>
                </div>
                <el-input v-model="memberPhone" placeholder="请输入会员手机号" size="medium" clearable></el-input>
            </div>
            <div slot="footer">
                <div v-if="userInfo.id" class="dialog-footer">
                    <el-button type="primary" @click="fetchMember">切换</el-button>
                    <el-button type="default" @click="closeMemberDialog">退出会员模式</el-button>
                </div>
                <div v-else class="dialog-footer">
                    <el-button type="primary" @click="fetchMember">确定</el-button>
                    <el-button type="default" @click="closeMemberDialog">取消</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="goodsInfo.goodsName" :visible.sync="goodsVisible" width="40%">
            <div class="goods-dialog">
                <div class="goods-dialog-input">
                    <div>
                        <el-input size="medium" v-model="goodsInfo.goodsNum" clearable pattern="">
                            <template slot="prepend">数量</template>
                            <template slot="append">{{ goodsInfo.goodsUnit || '个'}}</template>
                        </el-input>
                    </div>
                    <div>
                        <el-input size="medium" v-model="goodsInfo.marketPrice" clearable>
                            <template slot="prepend">单位</template>
                            <template slot="append">元/{{ goodsInfo.goodsUnit || '个'}}</template>
                        </el-input>
                    </div>
                </div>
                <div class="goods-dialog-count">
                    <p>小计</p>
                    <p class="txt-red">¥ {{priceToFixed(goodsInfo.goodsNum * goodsInfo.marketPrice)}}</p>
                </div>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button type="default" @click="delGoodsItem">删除</el-button>
                <el-button type="primary" @click="modifyGoodsItem">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="取单" :visible.sync="backupCartVisible">
            <div style="height:400px;overflow:auto;" >
                <div :class="['backup-cart-item', index == localCartIndex ? 'active' : '']"
                    v-for="(item, index) in localCartList" :key="index"
                    @click="localCartIndex = index">
                    <el-row class="mb10">
                        <el-col :span="12" class="fs20">
                            <i class="el-icon-hh-people"></i>
                            <span>{{item.userInfo && item.userInfo.loginName}}</span>
                        </el-col>
                        <el-col :span="12" class="txt-right">
                            <span>{{$utils.parseTime(item.createTime)}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="20">
                            <div class="selected-goods-wrap">
                                <div class="selected-goods-item" v-for="(selectItem, index) in item.selectGoods" :key="index">
                                    <img class="goods-cover mr10" :src="selectItem.thumbUrl" alt=""/>
                                    <span class="goods-name">{{selectItem.goodsName}}</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="txt-right mt50 fs20">
                                <span>小计</span>
                                <span>¥ {{item.totalPrice}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="txt-center mt50 fs20" v-if="localCartList.length < 1">
                    暂无挂单
                </div>
            </div>
            <div class="txt-center" slot="footer">
                <el-button type="default" @click="invalidCart">作废</el-button>
                <el-button type="primary" @click="takeOutCart">取单</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import eventBus from '@/components/common/bus.js'
import Request from './../../request.js'
import goodsItem from './goods_item'
export default {
    props: {

    },
    data() {
        return {
            request: new Request(),
            // 状态
            memberVisible: false,
            goodsVisible: false,
            backupCartVisible: false,
            localCartIndex: 0,
            goodsIndex: 0,
            // 数据
            userInfo: {
                loginName: '散客',
                telephone: '',
            },
            memberPhone: '18686123492',
            localCartList: [],
            // 常量
            expriedTime: 3600 * 24 * 1,
            buyerId: ""
        }
    },
    props:{
        value:Array
    },
    components: { goodsItem },
    computed: {
        cartNum: function() {
            let num = 0
            this.value.map(item => {
                num += item.goodsNum
            })
            return num
        },
        totalPrice: function() {
            let price = 0
            this.value.map(item => {
                price += item.goodsNum * (+item.purchasePrice || +item.modelPrice || +item.marketPrice)
            })
            return price.toFixed(2)
        },
        originalPrice: function() {
            let price = 0
            this.value.map(item => {
                price += item.goodsNum * item.marketPrice
            })
            return price.toFixed(2)
        },
        isCartEmpty: function() {
            return this.value.length > 0
        },
        createCartOrder: function() {
            let createTime = Date.now() - this.expriedTime
            let expriedDays = Date.now()
            return {
                createTime,
                expriedDays,
                userInfo: this.userInfo,
                selectGoods: this.value,
                totalPrice: this.totalPrice,
                originalPrice: this.originalPrice,
            }
        },
        goodsInfo: function() {
            let goods = {
                goodsName: '商品',
                goodsUnit: '',
                marketPrice: 0,
                goodsNum: 0
            }
            let cart = this.value
            let index = this.goodsIndex
            if (cart && cart[index]) {
                return {
                    goodsName: cart[index].goodsName,
                    goodsUnit: cart[index].goodsUnit,
                    marketPrice: cart[index].goodsPrice || cart[index].marketPrice,
                    goodsNum: cart[index].goodsNum
                }
            } else {
                return goods
            }
        }
    },
    watch: {
        value:{
            handler(){

            },
            deep: true
        }
    },
    created() {
        // if (this.value.length == 0) {
        //     let cart = this.findCacheCart()
        //     if (cart) {
        //         cart = cart[0]
        //         this.$nextTick(() => {
        //             this.value = cart.selectGoods
        //             this.userInfo = cart.userInfo
        //         })
        //     }
        // }
    },
    mounted() {
        eventBus.$on('add-goods', this.addGoodsItem)
        this.findLocalCart()
    },
    methods: {
        showMemberDialog() {
            this.memberVisible = true
        },
        closeMemberDialog() {
            this.memberVisible = false
            this.memberPhone = ''
            this.userInfo = {
                loginName: '散客',
                telephone: '',
            }
        },
        /**
         * 搜索会员
         */
        fetchMember() {
            this.request.queryMemberByMobile({
                mobile: this.memberPhone
            }).then(res => {
                if (res.code == 200) {
                    this.userInfo = res.ext
                } else {
                    this.userInfo = {
                        loginName: '散客',
                        telephone: '',
                    }
                }
            })
            this.memberVisible = false
        },
        /**
         * 购物车商品
         */
        // 添加商品
        addGoodsItem(goods) {
            let result = this.value.find((item, index) => {
                return item.goodsSn == goods.goodsSn
            })
            if (!result) {
                this.$set(goods, 'goodsNum', 1)
                this.value.push(goods)
            } else {
                let num = result.goodsNum
                this.$set(result, 'goodsNum', num + 1)
            }
        },
        // 显示商品
        showGoodsDialog(index) {
            let cart = this.value
            this.goodsIndex = index
            this.goodsVisible = true
        },
        // 修改商品价格, 数量
        modifyGoodsItem() {
            let cart = this.value
            let index = this.goodsIndex
            let price = this.goodsInfo.marketPrice
            let number = this.goodsInfo.goodsNum
            this.goodsVisible = false
            if (price != cart[index].marketPrice) {
                this.$set(cart[index], 'goodsPrice', price)
            }
            if (number != cart[index].goodsNum) {
                this.$set(cart[index], 'goodsNum', number)
            }
        },
        // 删除商品
        delGoodsItem() {
            let cart = this.value
            let index = this.goodsIndex
            if (cart[index].goodsPrice) {
                this.$delete(cart[index], 'goodsPrice')
            }
            cart.splice(index, 1)
            this.goodsVisible = false
        },
        // 清空购物车
        delvalue() {
            this.value.map(item => {
                if (item.goodsPrice) {
                    this.$delete(item, 'goodsPrice')
                }
            })
            this.value = []
        },
        /**
         * 存储本地订单
         */
        // 查找local订单
        findLocalCart(key = 'local_cash_cart') {
            let cacheCart = this.findCacheCart(key)
            let result = this.expriedLocalCart(cacheCart)
            this.saveCacheCart(result)
            return result
        },
        findCacheCart(key = 'temp_cache_cart') {
            let result = this.$utils.getStorage(key)
            return result
        },
        // 存储loacl订单
        saveCacheCart(data, key = 'local_cash_cart') {
            this.$utils.setStorage(key, data)
        },
        /**
         * 挂单
         */
        // 挂单
        backupCart() {
            let localCart = this.findLocalCart()
            if (!localCart) {
                localCart = []
            }
            localCart.push(this.createCartOrder)
            this.saveCacheCart(localCart)
            this.$message.success('挂单成功')
            this.delvalue()
        },
        // 过滤过期订单
        expriedLocalCart(data) {
            if (!Array.isArray(data)) return
            let list = data
            let now = Date.now()
            data.map((item, index) => {
                if((now - +item.expriedDays) > this.expriedTime) {
                    list.splice(index, 1)
                }
            })
            return list
        },
        // 显示local订单列表
        showBackupCartList() {
            this.backupCartVisible = true
            this.localCartIndex = 0
            this.localCartList = this.findLocalCart()
        },
        // 作废local订单
        invalidCart() {
            let index = this.localCartIndex
            this.localCartList.splice(index, 1)
            this.saveCacheCart(this.localCartList)
            this.backupCartVisible = false
        },
        // 取出local订单
        takeOutCart() {
            let index = this.localCartIndex
            let cart = this.localCartList[index]
            this.localCartList.splice(index, 1)
            this.value = cart.selectGoods
            this.userInfo = cart.userInfo
            this.saveCacheCart(this.localCartList)
            this.backupCartVisible = false
        },
        /**
         *
         */
        // 临时订单
        saveTempCart() {
            let temp = []
            temp.push( this.createCartOrder)
            this.saveCacheCart(temp, 'temp_cache_cart')
        },
        //
        /**
         * 收银
         */
        submitCartOrder() {
            if (this.value.length <= 0) {
                this.$message.warning('请选择商品')
                return
            }
            console.log(45654)
            this.$router.push('/storeCash/storeCashPay')

            this.saveTempCart()
            setTimeout(() => {
                eventBus.$emit('submit-cart-order', this.createCartOrder)
            }, 100)
        },
        // 取值
        priceToFixed(number, digit) {
            number = +number
            return number.toFixed(digit)
        }
    },
    beforeDestroy: function () {
        eventBus.$off('add-goods', this.addGoodsItem)
    },
}
</script>

<style scoped>
.cash-cart {
    float: left;
    width: 400px;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.member-wrap {
    position: relative;
    height: 60px;
    margin-top: 10px;
    margin-right: 10px;
    padding-left: 20px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
}
.member-wrap span {
    line-height: 60px;
}
.member-wrap:focus, .member-wrap:active {
    outline: 4px solid #5491de;
}
/* 会员对话框 */
.member-dialog {
    padding: 0 60px;
}
.member-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.member-name {
    margin-top: 20px;
    margin-bottom: 20px;
}
.member-info {
    display: inline-block;
    min-width: 80px;
    line-height: 20px;
    margin: 10px;
    padding: 0 12px;
    border-radius: 16px;
    text-align: center;
    font-size: 12px;
}
.member-level {
    color: #f78726;
    border: 1px solid #f78726;
}
.member-level {
    color: #c83835;
    border: 1px solid #c83835;
}
.goods-wrap {
    display: flex;
    flex-direction: column;
    height: calc(100% - 150px);
    margin-top: 10px;
    margin-right: 10px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 3px;
}
.goods-title {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #e7e7e7;
}
.goods-body {
    overflow: auto;
    flex: 1;
}
.goods-body>div {
    border-bottom: 1px solid #e7e7e7;
}
.goods-footer {
    position: relative;
    height: 50px;
}
.goods-footer-cart {
    position: absolute;
    top: -30px;
    width: 60px;
    height: 60px;
    margin-left: 20px;
    background: #e7e7e7;
    border-radius: 50%;
    line-height: 60px;
    font-size: 35px;
    text-align: center;
}
.goods-count {
    height: 30px;
    text-align: right;
    padding: 10px;
    line-height: 30px;
    background: #e7e7e7;
}
.cart-foot {
    display: flex;
    height: 60px;
    width: 390px;
    color: #fff;
    margin-left: -1px;
    text-align: center;
}
/* 商品对话框 */
.goods-dialog {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.goods-dialog-input {
    width: 60%;
    display: inline-block;
}
.goods-dialog-input>div {
    padding: 10px;
    border: 1px solid #e7e7e7;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 5px;
}
.goods-dialog-count {
    display: inline-block;
    width: 30%;
    margin-left: 20px;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    padding-top: 20px;
    padding-bottom: 20px;
}
.cart-hang-up {
    width: 40%;
    background: #5491de;
    line-height: 60px;
}
.cart-submit {
    flex: 1;
    background: #235073;
    line-height: 60px;
}

/* 挂单对话框 */
.selected-goods-wrap {
    display: flex;
}
.selected-goods-item {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: 10px;
}
.goods-cover {
    width: 100%;
    height: 100%;
}
.goods-name {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 70px;
    color: #fff;
    padding: 0 5px;
    background: rgba(0, 0, 0, 0.6);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
}
.backup-cart-item {
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
}
.active.backup-cart-item {
    background: #f7f7f7;
}
.dialog-footer {
    text-align: center;
}
.txt-center {
    text-align: center;
}
.txt-right {
    text-align: right;
}
.txt-red {
    color: #c83835;
}
.txt-blue {
    color: #235073;
}
.fs20 {
    font-size: 20px;
}
.fs30 {
    font-size: 30px;
}
.mb10 {
    margin-bottom: 10px;
}
.mr10 {
    margin-right: 10px;
}
.mt50 {
    margin-top: 50px;
}
</style>
<style>
.goods-dialog .el-input-group__append,
.goods-dialog .el-input-group__prepend {
    background: #fff;
    border: unset;
}
.goods-dialog input{
    border: unset;
}
.el-dialog__header {
    border-bottom: 1px solid #e4e4e4;
}
</style>

