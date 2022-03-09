<template>
    <div>
        <el-form label-width="100px" style="width:100%;">
            <!-- 规格表单 -->
            <div v-if="hasModel">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品规格">
                            <div class="add-form" @click="showModelDialog"><i class="el-icon-hh-add"></i>添加规格</div>
                        </el-form-item>
                        <el-dialog title="商品规格项目" :visible.sync="visibleModelDialog" width="30%">
                            <el-row>
                                <el-col>
                                    <h4>常用规格</h4>
                                    <div @click="checkGoodsModel" style="text-align:center;">
                                        <el-checkbox-group
                                            v-model="checkedModels" :max="3">
                                            <el-checkbox class="goods-model-item" v-for="(model, index) in commonModels"
                                                :label="model" :key="index" border size="mini">{{model}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div style="margin-top:10px;"><span style="color:#409EFF;margin:0 10px;">已选：</span>{{checkedModels.join('，')}}</div>
                                </el-col>
                            </el-row>
                            <div class="button-group__right">
                                <el-button type="default" @click="visibleModelDialog = false">取消</el-button>
                                <el-button type="primary" @click="confirmGoodsModel">确定</el-button>
                            </div>
                        </el-dialog>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div v-if="(checkedModels.length > 0)" v-for="(modelItem, index) in selectModels" :key="index">
                            <div class="model-item">
                                <div class="model-name">{{modelItem.name}}<i class="el-icon-close" @click="delModelItem(modelItem.name)"></i></div>
                                <div class="sub-model-wrap">
                                    <input-box v-for="(item, index) in modelItem.subModelId" :key="index"
                                        @edit="editSubModel" @cancel="cancelSubModelItem(modelItem)" @delete="delSubModel"
                                        :index="index" :target="modelItem" :content="modelItem.subModelName[index]">
                                    </input-box>
                                    <div class="add-form" v-show="!modelItem.isInputSubModel" @click="addSubModel(modelItem)"><i class="el-icon-hh-add"></i>添加标签</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-table :data="goodsModels" border style="width:calc(50% + 116px);margin-left:20px; border-radius:4px;">
                    <el-table-column v-for="(item, index) in checkedModels" :key="index" :label="item"  align="center" width="100">
                        <template slot-scope="scope">
                            {{transModel(scope.row.modelName, index)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="图片" align="center" width="100">
                        <template slot-scope="scope">
                            <el-upload
                                class="model-pic-uploader"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :show-file-list="false">
                                <img v-if="scope.row.modelUrl" :src="scope.row.modelUrl" style="width:100%;height:100%;">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </template>
                    </el-table-column>
                    <el-table-column class="model-price" ref="modePriceColumn" label="价格" align="center" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.modelPrice"
                                      maxlength="10"
                                      placeholder="价格">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="库存" align="center" width="100">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.modelStorage"
                                      maxlength="10"
                                      placeholder="库存">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" align="center" width="80">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.modelUnit"
                                      maxlength="10"
                                      placeholder="单位">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="扫码购编码" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.modelCode"
                                      maxlength="40"
                                      placeholder="编码">
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
</template>

<script>
// import inputBox from './../../../../components/common/InputBox'
import mixin from './../mixins'
// import request from './../../index.js'
import dictionary from './../../../../utils/dictionary'

export default {
    mixins: [mixin],
    props: {
        hasModel: {
            type: Boolean,
            required: true
        },
        goodsInfo: {
            type: Object
        },
    },
    data() {
        return {
            commonModels: dictionary.commonModels,
            // 选择的规格名称
            checkedModels: [],
            visibleModelDialog: false,
            // 添加的标签栏
            selectModels: {},
            // 规格信息列表
            goodsModels: [],
            isInputSubModel: false,
            subModelLength: 29,
        }
    },
    // components: { inputBox },
    watch: {
        // 'checkedModels': {
        //     handler: function(val, oldVal) {
        //         this.genModels(val, oldVal)
        //     },
        //     deep: true
        // },
        /**
         * 监听selectModels, 动态生成规格信息表格
         */
        'selectModels': {
            handler: function(val, oldVal) {
                console.log("val", val);
                let keys = Object.keys(val)
                // let argsId = []
                // let argsName = []
                let goodsModels = []
                // let oldGoodsModels = this.goodsModels;
                let goodsModelList = this.goodsInfo.goodsModelList
                // 全 规格名称 id name 列表
                let model_id_array = []
                let model_name_array = []
                // subModelId 每次重新 计算
                let cur_sub_Model_id = 29;
                keys.map(item => {
                    let s_id_array = [];
                    let s_name_array = val[item].subModelName;

                    let len = val[item].subModelName.length;
                    for(let i=0;i<len;i++){
                        cur_sub_Model_id++;
                        let s_id = cur_sub_Model_id;
                        let s_name = s_name_array[i];
                        s_id_array.push(s_id);
                        model_id_array.push(s_id);
                        model_name_array.push(s_name);

                        // 在 goodsModelList 中 查找对应 名称 的 规格信息
                        let model_item = goodsModelList && goodsModelList.find(function (obj) {
                            // console.log("find ",obj.modelName,"obj", s_name);
                            return obj.modelName === s_name;
                        });
                        if(model_item){
                            model_item.model = s_id;
                            goodsModels.push(model_item);
                        }else{
                            goodsModels.push({
                                id: '',
                                goodsId: this.goodsInfo.id,
                                model: s_id,
                                modelName: s_name,
                                modelCode: '',
                                modelPrice: this.goodsInfo.marketPrice,
                                modelUrl: this.goodsInfo.thumbUrl,
                                modelUnit: this.goodsInfo.unit,
                                modelStorage: this.goodsInfo.storage
                            });
                        }
                    }
                    // 更新 sub id
                    // val[item].subModelId = s_id_array;
                    // 设置 新增规格 model 值
                    if(this.subModelLength < cur_sub_Model_id){
                        this.subModelLength = cur_sub_Model_id
                    }
                    // argsId.push(s_id_array);
                    // argsName.push(s_name_array);
                })
                // console.log("keys",keys);
                // console.log("argsId",argsId);
                // console.log("argsName",argsName);
                // console.log("goodsModelList",this.goodsModelList);
                // console.log("goodsModels", goodsModels);

                this.goodsModels = goodsModels;
            },
            deep: true
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            let modelInfo = this.goodsInfo.modelInfo
            console.log("init modelInfo", modelInfo);
            for (let item in modelInfo) {
                this.checkedModels.push(modelInfo[item].name)
                let cur_id = 30;
                let len = modelInfo[item].subModelId.length;
                for(let i=0;i<len;i++){
                    modelInfo[item].subModelId[i] = cur_id++;
                }

            }
            this.selectModels = modelInfo || {};
        },
        /**
         * 规格相关
         */
        showModelDialog() {
            this.visibleModelDialog = true
        },
        // 展示规格数据, 将string to array, 返回array[index]
        transModel(model, index) {
            let modelArr = model.split(',')
            return modelArr[index]
        },
        checkGoodsModel(e) {
            let length = this.checkedModels.length
            let checked = this.checkedModels.indexOf(e.target.defaultValue) > 0
            if (e.target.localName == 'input' && length == 3 && !checked) {
                this.$message({
                    showClose: true,
                    message: '规格最多选择3项。',
                    type: 'warning'
                })
            }
        },
        /**
         * 监听 checkedModels 时调用, 生成selectModels =>
         *  {
         *      '1': { id: 1, name: '尺码', subModelId: [], subModelName: []}
         *  }
         *  isInputSubModel 用于标示是否隐藏‘添加标签’按钮
         */
        genModels(val, oldVal) {
            let that = this
            if (!Array.isArray(val)) {
                console.log('genModels参数错误');
                return;
            }
            let models = {}
            val.map((item, index) => {
                let id = that.commonModels.indexOf(item) + 1
                // if (!oldVal.indexOf(item) && (that.selectModels[id] == null)) {
                    models[id] = {
                        id: id,
                        name: item,
                        subModelName: [],
                        subModelId: [],
                        isInputSubModel: false
                    }
                // } else {
                //     models[id] = that.selectModels[id]
                // }
            })
            that.selectModels = models
        },
        /**
         * 确认选择规格类型(颜色,尺寸等), 选择的类型会放入checkedModels(array)
         * 通过 Vue的 watcher 监听 checkedModels 有变化时调用 genModels 生成商品的规格选项
         */
        confirmGoodsModel(e) {
            if (this.checkedModels.length < 1) {
                this.$message({
                    showClose: true,
                     message: '请选择规格',
                    type: 'warning'
                })
                return;
            }
            // 说明: 根据选中的规格动态生成model对象
            this.genModels(this.checkedModels);

            // 关闭对话框
            this.visibleModelDialog = false
        },
        // 删除规格类型, 如: 颜色, 尺寸等
        delModelItem(name) {
            let models = this.checkedModels
            let index = models.indexOf(name)
            models.splice(index, 1)
        },
        /**
         *  添加规格标签, 规格标签id从30开始递增(不连续)
         *  subModelLength记录标签历史最多数量
         *  isInputSubModel 在新增标签后为true, 隐藏添加按钮
         */
        addSubModel(modelItem) {
            this.subModelLength++;
            modelItem.subModelId.push(this.subModelLength);
            modelItem.subModelName.push('');
            let index = modelItem.subModelId.length;
            modelItem.isInputSubModel = (index  > 3 ) ? true : false;
            this.goodsModels[index-1] = {
                modelPrice: this.goodsInfo.marketPrice,
                modelUrl: this.goodsInfo.thumbUrl,
                modelUnit: this.goodsInfo.unit,
                modelStorage: this.goodsInfo.storage
            }
        },

        // 绑定inputBox@delete 非编辑状态点击x, 删除规格标签
        delSubModel(data) {
            let modelItem = data.target
            let index = data.index
            // console.log("del", data);
            modelItem.isInputSubModel = false
            this.subModelLength--;
            let s_name = modelItem.subModelName[index];
            // 删除 规格标签信息
            let s_id_array = [];
            let s_name_array = [];
            let cur_s_id = 29;
            modelItem.subModelName.forEach((item,index)=>{
                cur_s_id++;
                if(s_name === item){
                    cur_s_id--;
                }else{
                    s_id_array.push(cur_s_id);
                    s_name_array.push(item);
                }
            });
            modelItem.subModelId = s_id_array;
            modelItem.subModelName = s_name_array;
            // console.log("del selectModels", this.selectModels);
            // console.log("del modelItem", modelItem);
        },
        // 绑定inputBox@edit 点击‘铅笔’时进入编辑状态
        editSubModel(data) {
            // console.log("edit data", data);
            let modelItem = data.target
            let content = data.content
            let index = data.index
            modelItem.isInputSubModel = false
            modelItem.subModelName[index] = content
            let s_id = modelItem.subModelId[index];
            // 修改 名称
            this.goodsModels.forEach(item=>{
                if(item.model === s_id){
                    item.modelName = content;
                }
            });
            console.log("edit selectModels", this.selectModels);
            console.log("edit modelItem", modelItem);
            console.log("edit goodsInfo", this.goodsInfo);
        },
        // 绑定inputBox@cancel 在inputBox没有值, 点击x时调用, 删除规格标签
        cancelSubModelItem(modelItem) {
            let length = modelItem.subModelId.length
            modelItem.subModelId.pop()
            modelItem.subModelName.pop()
            this.subModelLength--;
            modelItem.isInputSubModel = false
            // console.log("cancel ", modelItem);
        },
        /**
         *  生成规格组合(笛卡尔积)
         *  参数为多个数组, combine([1, 3], ['a', 'b']) => [[1, "a"], [1, "b"],[3, "a"],[3, "b"]]
         *  特殊用法: 使用apply调用, 如: this.combine.apply(this.combine, [[1, 3], ['a', 'b']])
         *  特殊用法: 使用call调用, 如: this.combine.apply(this.combine, [1, 3], ['a', 'b'])
         *  方便在有未知个参数时使用.
         */
         combine() {
            return Array.prototype.reduce.call(arguments, function(a, b) {
                var ret = [];
                a.forEach(function(a) {
                    b.forEach(function(b) {
                        ret.push(a.concat([b]));
                    });
                });
                return ret;
            }, [[]]);
        },

    }

}
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
.picturePreviewDialog {
    margin: auto;
    width: 50%;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
}
.goods-form-input {
  width: 286px;
  margin-right: 10px;
}
.goods-category {
    border: 1px solid #e9e9e9;
    margin-top: 10px;
    width: 286px;
    border-radius: 3px;
    max-height: 200px;
    overflow: scroll;
}
.add-form {
  width: 80px;
  padding-left: 5px;
  border: 1px dashed #e9e9e9;
  border-radius: 3px;
  font-size: 14px;
}
.add-model {
    display: inline-block;
    padding: 3px 10px 3px 10px;
    border: 1px dashed #e9e9e9;
    border-radius: 3px;
    color: #606266;
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 20px;
}
.button-group__center {
  margin-top: 20px;
  text-align: center;
}
.button-group__right {
  margin-top: 20px;
  margin-right: 10px;
  text-align: right;
}
/* 规格相关 */
.goods-model-item {
    margin: 10px;
}
.model-item {
    display: flex;
    align-items: center;
    margin: 20px;
}
.model-name {
    box-sizing: border-box;
    height: 32px;
    font-size: 14px;
    padding: 5px 15px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
}
.model-name i {
    margin-left: 10px;
}
.sub-model-wrap {
    position: relative;
    display: inline-block;
    width: 50%;
    margin-left: 30px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    padding: 10px;
}
.sub-model-wrap::before{
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    margin-top: -12px;
    left: -12px;
    border-bottom: 12px solid transparent ;
    border-top: 12px solid transparent;
    border-right: 12px solid #dcdfe6;
}
.sub-model-wrap::after{
    content: '';
    display: block;
    position: absolute;
    left: -10px;
    top: 50%;
    margin-top:-12px;
    border-bottom: 12px solid transparent ;
    border-top: 12px solid transparent;
    border-right: 12px solid #fff;
}
.sub-model-wrap .add-form {
    display: inline-block;
    padding-top: 5px;
    padding-bottom: 5px;
}

.sub-model-item {
    display: inline-block;
}
.sub-model-item i {
    font-weight: bold;
}
.sub-model-item__confirm {
    display: inline-block;
    height: 32px;
    line-height: 30px;
    padding: 0px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    font-size: 14px;
    box-sizing: border-box;
}
/* 服务相关 */
.service-form .el-button {
    border: none;
}
.service-form {
    margin-top: 20px;
}
/* 通用样式 */
.input-icon {
    color: #409EFF;
    font-weight: bold;
}
.input-icon:hover {
    color: #66b1ff;
}
</style>

<style>
/* 覆盖框架原生样式  不可加scope */
.add-goods .el-dialog__header {
    border-bottom: 1px solid #dcdfe6 !important;
}
.add-goods .el-table--enable-row-hover .el-table__body tr:hover>td {
    background: #fff;
}
.add-goods .el-table__row:hover {
    background: unset;
}
.item-title .el-tooltip {
    color: #666;
}
.add-goods .el-input__suffix-inner {
    line-height: 32px;
}
.add-goods .el-input--suffix .el-input__inner {
    padding-right: 40px;
}
.model-pic-uploader .el-upload--text {
    width: 50px !important;
    height: 50px !important;
    line-height: 50px;
}
</style>
