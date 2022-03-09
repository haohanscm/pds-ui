<template>
    <div class="goods-info-wrap">
        <el-form label-width="100px" style="width:100%;">
            <div class="item-title">
                <span>
                    售卖规则
                    <el-checkbox class="item-title-tips" label="启用售卖规则" v-model="hasSaleRules"></el-checkbox>
                    <el-tooltip content="限制售卖区域或售卖数量, 0为不限制" placement="bottom" effect="light">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="最少起购数量">
                    <el-input-number v-model="saleRules.minSaleNum" :min="0" :disabled="!hasSaleRules"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最多购买数量">
                    <el-input-number v-model="saleRules.limitBuyTimes" :min="0" :disabled="!hasSaleRules"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="限制售卖区域">
                    <el-cascader expand-trigger="hover" :options="areaOptions"
                        v-model="saleRules.saleAreas" @change="handleAreasChange" :disabled="!hasSaleRules">
                    </el-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="限制售卖时间">
                        <el-date-picker v-model="saleRules.limitSaleDate" type="daterange"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="yyyy-MM-dd 00:00:00" :disabled="!hasSaleRules">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="item-title">
                <span>
                    赠品规则
                    <el-checkbox class="item-title-tips" label="启用赠品规则" v-model="hasGoodsGift"></el-checkbox>
                    <el-tooltip content="每个商品个可添加一种赠品" placement="bottom" effect="light">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="赠品名称" :disabled="!hasGoodsGift" :required="hasGoodsGift" >
                        <el-input class="goods-form-input" v-model="goodsGift.giftName" :disabled="!hasGoodsGift"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="赠品数量" :required="hasGoodsGift">
                        <el-input-number v-model="goodsGift.giftNum" :min="0" :disabled="!hasGoodsGift"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="赠品规则描述">
                        <el-input class="goods-form-input" v-model="goodsGift.giftRule" :disabled="!hasGoodsGift"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 配送规则 -->
            <div class="item-title">
                <span>
                    配送规则
                    <el-checkbox class="item-title-tips" label="启用配送规则" v-model="hasDeliveryRules"></el-checkbox>
                    <el-tooltip content="默认支持快递, 自提; 选择送货上门需配置其他选项." placement="bottom" effect="light">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="支持配送类型">
                        <el-select
                            class="goods-form-input" v-model="deliveryRules.deliveryType"
                            multiple filterable allow-create
                            default-first-option placeholder="请选择配送类型" :disabled="!hasDeliveryRules">
                            <el-option
                                v-for="item in deliveryTypeOptions"
                                :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="送货方式" v-if="canDeliveryToHome">
                        <el-select v-model="deliveryRules.deliveryPlanType" class="goods-form-input" :disabled="!hasDeliveryRules">
                            <el-option v-for="item in deliveryPlanTypeOptions"
                                :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="配送时效" v-if="deliveryRules.deliveryPlanType == '0'">
                        <el-select v-model="deliveryRules.arriveType" class="goods-form-input" :disabled="!hasDeliveryRules">
                            <el-option v-for="item in arriveTypeOptions"
                                :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="deliveryRules.deliveryPlanType == '1'">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="可配送周期">
                            <el-select
                                class="goods-form-input" v-model="deliveryRules.deliverySchedule"
                                multiple filterable allow-create
                                default-first-option placeholder="请选择配送类型" :disabled="!hasDeliveryRules">
                                <el-option
                                    v-for="item in deliveryScheduleOptions"
                                    :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="配送规则描述">
                            <el-input class="goods-form-input" v-model="deliveryRules.rulesDesc" type="textarea"
                                placeholder="填写配送方式的规则, 方式等描述内容" :disabled="!hasDeliveryRules">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="配送总数量">
                            <el-input-number v-model="deliveryRules.deliveryTotalNum" :min="0" :disabled="!hasDeliveryRules"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="配送开始间隔">
                            <el-input-number v-model="deliveryRules.startDayNum" :min="0" :disabled="!hasDeliveryRules"></el-input-number>
                            <el-tooltip content="下单与第一次配送间隔的时间" placement="bottom" effect="light">
                                <i class="el-icon-info"></i>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="送货时间" v-if="deliveryRules.deliveryPlanType == '2'">
                        <el-date-picker v-model="deliveryRules.specificDate" type="date"
                            value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期" :disabled="!hasDeliveryRules">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 服务选项 -->
            <div class="item-title">
                <span>
                    服务选项
                    <el-checkbox class="item-title-tips" label="启用服务选项" v-model="hasServiceSelection"></el-checkbox>
                    <el-tooltip content="每种商品可添加一种服务选项" placement="bottom" effect="light">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </span>
            </div>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="服务选项名称">
                        <el-input class="goods-form-input" v-model="serviceName"
                            :disabled="!hasServiceSelection">
                        </el-input>
                        <div class="service-form" v-if="hasServiceSelection">
                            <el-table :data="serviceSelection" border>
                                <!-- <el-table-column label="服务名称"  align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.serviceName" placeholder="服务名称"></el-input>
                                    </template>
                                </el-table-column> -->
                                <el-table-column label="选项说明"  align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.serviceDetail" placeholder="选项名称"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="服务数量" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.serviceNum" placeholder="服务数量"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="服务价格" align="center">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.servicePrice" placeholder="服务价格">
                                            <template slot="prepend">¥</template>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center" width="100">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" plain @click="delServiceItem(scope.$index, scope.row)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="add-form" style="margin-top: 20px;" @click="addServiceItem"><i class="el-icon-hh-add"></i>添加选项</div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="button-group__center">
            <el-button type="default" @click="dispatchPrevStep">上一步</el-button>
            <el-button type="primary" @click="saveGoodsInfo">保存上架</el-button>
        </div>
    </div>
</template>

<script>
import Request from './../../request.js'
import mixin from "./../mixins";
import dictOptions from './../../dictionary.js'
import dictionary from './../../../../utils/dictionary.js'

export default {
    mixins: [mixin],
    props: {
        goodsInfo: Object
    },
    data() {
        return {
            request: new Request(),
            // 常量
            currentStep: 2,
            // 状态, 变量
            // 售卖规则
            hasSaleRules: false,
            saleRules: {
                saleAreas: [],
                saleArriveType: '',
                minSaleNum: '',
                limitBuyTimes: '',
                limitSaleDate: [],
                // beginSaleDate: '',
                // endSaleDate: '',
            },

            // 赠品规则
            hasGoodsGift: false,
            goodsGift: {
                giftRule: '',
                giftName: '',
                giftNum: ''
            },
            // 配送规则
            canDeliveryToHome: false,
            hasDeliveryRules: false,
            deliveryRules: {
                deliveryType: [],
                deliveryPlanType: '',
                specificDate: '', // 2
                arriveType: '', // 0
                deliverySchedule: [],
                minNum: '',
                rulesDesc: '',
                startDayNum: '',
                deliveryTotalNum: ''
            },

            // 服务选项规则
            hasServiceSelection: false,
            serviceName: '',
            serviceSelection: [
                {
                    id: '',
                    serviceName: this.serviceName,
                    serviceDetail: '',
                    servicePrice: '',
                    serviceNum: '',
                    serviceSchedule: '',
                }
            ],
            // 存储数据, 变量
            // 字典, 变量
            areaOptions: [],
            // 选项字典
            deliveryTypeOptions: dictionary.deliveryTypeOptions,
            deliveryPlanTypeOptions: dictionary.deliveryPlanTypeOptions,
            areaOptions: dictOptions.areaOptions,
            arriveTypeOptions: dictionary.arriveTypeOptions,
            deliveryScheduleOptions: dictionary.deliveryScheduleOptions,
        };
    },
    components: {},
    watch: {
        'deliveryRules.deliveryType': {
            handler: function(val, oldVal) {
                if (val.indexOf('9') > 0 || val == '9') {
                    this.canDeliveryToHome = true
                } else {
                    this.canDeliveryToHome = false
                }
            },
            deep: true
        },
        'deliveryRules.deliveryPlanType': {
            handler: function(val, oldVal) {
                if (val != 0) {
                    this.deliveryRules.arriveType = ''
                }
                if (val != 2) {
                    this.deliveryRules.specificDate = ''
                }
                if (val != 1) {
                    this.deliveryRules.deliverySchedule = []
                    this.deliveryRules.deliveryTotalNum = ''
                    this.deliveryRules.startDayNum = ''
                    this.deliveryRules.rulesDesc = ''
                }
            },
            deep: true
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            let goodsInfo = this.goodsInfo
            this.hasSaleRules = goodsInfo.saleRule > 0 ? true : false
            this.hasGoodsGift = goodsInfo.goodsGift > 0 ? true : false
            this.hasDeliveryRules = goodsInfo.deliveryRule > 0 ? true : false
            this.hasServiceSelection = goodsInfo.serviceSelection > 0 ? true : false

            if (this.hasSaleRules) {
                this.saleRules.saleAreas = goodsInfo.saleAreas && goodsInfo.saleAreas.split(','),
                this.saleRules.saleArriveType = goodsInfo.saleArriveType
                this.saleRules.minSaleNum = goodsInfo.minSaleNum
                this.saleRules.limitBuyTimes = goodsInfo.limitBuyTimes
                this.saleRules.limitSaleDate[0] = goodsInfo.beginSaleDate
                this.saleRules.limitSaleDate[1] = goodsInfo.endSaleDate
            }
            if (this.hasGoodsGift) {
                this.goodsGift.giftRule = goodsInfo.giftRule
                this.goodsGift.giftName = goodsInfo.giftName
                this.goodsGift.giftNum = goodsInfo.giftNum
            }
            if (this.hasDeliveryRules) {
                this.deliveryRules.deliveryType = goodsInfo.deliveryType && goodsInfo.deliveryType.split(',')
                this.deliveryRules.deliveryPlanType = goodsInfo.deliveryPlanType
                this.deliveryRules.specificDate = goodsInfo.specificDate
                this.deliveryRules.arriveType = goodsInfo.arriveType
                this.deliveryRules.deliverySchedule = goodsInfo.deliverySchedule && goodsInfo.deliverySchedule.split(',')
                this.deliveryRules.minNum = goodsInfo.minNum
                this.deliveryRules.rulesDesc = goodsInfo.rulesDesc
                this.deliveryRules.specificDate = goodsInfo.specificDate
                this.deliveryRules.startDayNum = goodsInfo.startDayNum
                this.deliveryRules.deliveryTotalNum = goodsInfo.deliveryTotalNum
            }
            if (this.hasServiceSelection) {
                this.serviceName = goodsInfo.serviceSelectionList[0].serviceName
                this.serviceSelection = goodsInfo.serviceSelectionList
            }
        },
        // 售卖规则
        handleAreasChange() {},
        saveGoodsBaseInfo() {
            return this.request.addGoodsBaseInfo({
                ...this.goodsInfo,
            })
        },
        saveGoodsExtInfo(id) {
            let params = {
                saleRule: this.hasSaleRules ? '1' : '0',
                goodsGift: this.hasGoodsGift ? '1' : '0',
                deliveryRule: this.hasDeliveryRules ? '1' : '0',
                serviceSelection: this.hasServiceSelection ? '1' : '0',
                goodsSn: id,
            }
            let saleRules = this.saleRules
            let goodsGift = this.goodsGift
            let deliveryRules = this.deliveryRules
            let serviceSelection = this.serviceSelection

            if (this.hasSaleRules) {
                params.saleAreas = saleRules.saleAreas.join(','),
                params.saleArriveType = saleRules.saleArriveType,
                params.minSaleNum = saleRules.minSaleNum,
                params.limitBuyTimes = saleRules.limitBuyTimes
                params.beginSaleDate = saleRules.limitSaleDate && saleRules.limitSaleDate[0]
                params.endSaleDate = saleRules.limitSaleDate && saleRules.limitSaleDate[1]
            }
            if (this.hasGoodsGift) {
                params.giftRule = goodsGift.giftRule,
                params.giftName = goodsGift.giftName,
                params.giftNum = goodsGift.giftNum
            }
            if (this.hasDeliveryRules) {
                params.deliveryType = deliveryRules.deliveryType.join(',')
                params.deliveryPlanType = deliveryRules.deliveryPlanType
                params.specificDate = deliveryRules.specificDate
                params.arriveType = deliveryRules.arriveType
                params.deliverySchedule = deliveryRules.deliverySchedule.join(',')
                params.minNum = deliveryRules.minNum
                params.rulesDesc = deliveryRules.rulesDesc
                params.specificDate = deliveryRules.specificDate
                params.startDayNum = deliveryRules.startDayNum
                params.deliveryTotalNum = deliveryRules.deliveryTotalNum
            }
            if (this.hasServiceSelection) {
                serviceSelection.map(item => {
                    item.serviceName = this.serviceName
                })
                params.serviceSelectionList = serviceSelection
            }

            return this.request.modifygoodsExtInfo(params)
        },
        saveGoodsInfo() {
            this.saveGoodsBaseInfo().then(res => {
                if (res.code == 200) {
                    if (!this.hasSaleRules && !this.hasGoodsGift && !this.hasDeliveryRules && !this.hasServiceSelection) {
                        this.$message.success('保存成功')
                        this.$router.push('/goods/goodsList')
                    }

                    this.saveGoodsExtInfo(res.ext.goodsSn).then(res => {
                        if (res.code == 200) {
                            this.$message.success('保存成功')
                            this.$router.push('/goods/goodsList')
                        } else {
                            this.$message.error('保存失败: ', res.msg)
                        }
                    })
                } else {
                    this.$message.error('保存失败: ', res.msg)
                }
            })
        },

        // 服务选项
        addServiceItem() {
            this.serviceSelection.push({
                id: '',
                serviceName: '',
                serviceDetail: '',
                servicePrice: '',
                serviceNum: ''
            })
        },
        delServiceItem(index) {
            this.serviceSelection.splice(index, 1)
        },
    }
};
</script>
<style scoped>
.goods-info-wrap {
    padding: 0 20px;
}
/* 标题 */
.item-title {
  margin-top: 15px;
  margin-bottom: 24px;
  padding-bottom: 10px;
  font-size: 14px;
  line-height: 16px;
  border-bottom: 1px solid #e9e9e9;
}
.item-title span {
  display: block;
  padding-left: 10px;
  margin-right: 5px;
  border-left: 3px solid #5491de;
}
.item-title-tips {
  display: inline-block;
  margin-left: 10px;
  color: #999999;
  font-size: 12px;
}
.goods-form-input {
  width: 286px;
  margin-right: 10px;
}
.add-form {
  width: 80px;
  padding-left: 5px;
  border: 1px dashed #e9e9e9;
  border-radius: 3px;
  font-size: 14px;
}
.button-group__center {
  margin-top: 20px;
  text-align: center;
}

/* 服务相关 */
.service-form .el-button {
  border: none;
}
.service-form {
  margin-top: 20px;
}
</style>

