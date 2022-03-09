<template>
    <div class="goods-info-wrap">
        <el-form label-width="100px" style="width:100%;">
            <div class="item-title"><span>商品信息</span></div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品名称" required>
                        <el-input class="goods-form-input" v-model="goodsInfo.goodsName"
                                  maxlength="30"
                            placeholder="商品名称" >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品唯一编号">
                        <el-input class="goods-form-input" v-model="goodsInfo.goodsSn" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 分类 -->
            <el-row>
                <el-col :span="12">
                    <el-form-item label="展示分类" required>
                        <el-input class="goods-form-input"
                            @focus="getGoodsCategory"
                            v-model="goodsInfo.categoryName"
                            placeholder="选择商品分类" readonly required>
                        </el-input>
                        <!-- 分类选择 -->
                        <transition name="fade">
                            <div  class="goods-category"  v-show="showCategoryTree" v-loading="goodsCateLoading">
                                <el-tree
                                    :data="goodsCategory" :props="categoryTreeProps"
                                    @check="checkGoodsCategory"
                                    show-checkbox
                                    node-key="id"
                                    ref="categoryTree"
                                    check-strictly
                                    :default-expand-all="true">
                                </el-tree>
                                <div class="button-group__right">
                                    <!--<el-button type="text"  style="color:#999;">取消</el-button>-->
                                    <el-button type="text" @click="showCategoryTree = false">确定</el-button>
                                </div>
                            </div>
                        </transition>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计量单位" required>
                        <el-input class="goods-form-input"
                                  v-model="goodsInfo.unit"
                                  placeholder="必填项"
                                  clearable
                                  maxlength="10"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-tooltip class="item" effect="dark" content="多个词用英文逗号分隔" placement="top-end">
                        <el-form-item label="关键词">
                            <el-input v-model="goodsInfo.simpleDesc"
                                      type="textarea"
                                      autosize
                                      placeholder="多个词用英文逗号分隔"
                                      clearable
                                      maxlength="200"></el-input>
                        </el-form-item>
                    </el-tooltip>
                </el-col>
            </el-row>

            <!-- 图片上传 -->
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品主图" required>
                        <el-upload
                            :on-success="uploadPhotoSuccess"
                            :action="request.baseUrl + '/f/pds/api/common/goods/uploadPhoto'"
                            :on-preview="handlePicturePreview"
                            :on-remove="handlePictureRemove"
                            :on-exceed="pictureLimitTip"
                            :file-list="pictureList"
                            :limit="1"
                            :data="obj"
                            list-type="picture-card">
                            <i class="el-icon-plus"></i>
                            <div slot="tip" class="el-upload__tip">只能上传一个jpg/png文件，且不超过500kb
                                <el-button type="text" @click="showInfoUrl = true">+</el-button>
                            </div>
                        </el-upload>
                        <el-dialog title="商品主图" :visible.sync="picturePreviewVisible" center>
                            <div class="picturePreviewDialog">
                                <img :src="goodsInfo.thumbUrl" style="width:100%;height:100%;"/>
                            </div>
                        </el-dialog>
                        <div v-show="showInfoUrl">
                            <el-input v-model="goodsInfo.thumbUrl"
                                      class="goods-form-input"
                                      placeholder="必填项"
                                      @blur="handlePicturePreview"
                                      clearable></el-input>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="item-title">
                <span>
                    价格库存
                    <el-checkbox class="item-title-tips" label="启用多规格" v-model="hasModel"></el-checkbox>
                    <el-tooltip content="当商品有2种以上的规格的时候（如：颜色：黑、白、黄）请使用此功能" placement="bottom" effect="light"><i class="el-icon-info"></i> </el-tooltip>
                </span>
            </div>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="销售原价" required>
                        <el-input class="goods-form-input"
                                  v-model="goodsInfo.marketPrice"
                                  maxlength="10"
                                  required>
                            <template slot="prepend">¥</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="库存" required>
                        <el-input class="goods-form-input"
                                  v-model="goodsInfo.storage"
                                  maxlength="10"
                                  required></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <!-- 规格表单 -->
            <div class="goods-models-wrap" v-if="hasModel">
                <goods-model-selecter ref="goodsModelsComponent" :has-model="hasModel" :goods-info="goodsInfo"></goods-model-selecter>
            </div>
            <div class="button-group__center">
                <el-button type="default" @click="turnToGoodsList">取消</el-button>
                <el-button type="primary" @click="nextStep">下一步</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import goodsModelSelecter from './goodsModelSelecter'
import mixin from './../mixins'
import Request from './../../request.js'

export default {
    mixins: [mixin],
    props: {
        goodsInfo: {
            type: Object
        }
    },
    data() {
        return {
            request: new Request(),
            currentStep: 0,
            // 分类
            goodsCategory: [],
            showCategoryTree: false,
            goodsCateLoading: false,
            categoryTreeProps: {
                children: 'children',
                label: 'name'
            },
            defaultChecked: [],
            // 图片上传
            pictureList: [],
            picturePreviewVisible: false,
            // 规格
            hasModel: false,
            obj:{
                shopId: this.$utils.getCookie("shopId"),
                pmId: this.$utils.getCookie("pmId"),
            },
            showInfoUrl: false
        }
    },
    computed: {

    },
    watch: {
        pictureCount() {
            return this.pictureList > 0
        }
    },
    components: { goodsModelSelecter },
    mounted() {
        this.initData()
    },
    watch: {
        goodsInfo() {
            this.initData()
        }
    },
    methods: {
        initData() {
            let goodsInfo = this.goodsInfo
            if (goodsInfo.thumbUrl && this.pictureList.length < 1) {
                this.pictureList.push({
                    name: 'cover',
                    url: goodsInfo.thumbUrl
                })
            }
            if (goodsInfo.categoryId) {
                this.defaultChecked = goodsInfo.categoryId.split(',')
            }
            this.hasModel = goodsInfo.goodsModel > 0 ? true : false
        },
        // 分类
        getGoodsCategory() {
            this.goodsCateLoading = true
            this.showCategoryTree = true
            this.request.fetchCategoryList({}).then(res => {
                this.goodsCateLoading = false
                this.goodsCategory = this.$utils.listToTree(res.ext)
                // console.log(this.goodsCategory);
            })
        },
        checkGoodsCategory(node, nodes) {
            console.dir("1",node,nodes);
            if(nodes.checkedKeys.length >0){
                this.$refs.categoryTree.setCheckedKeys([node.id]);
            }
            if(node.children && node.children.length>0){
                this.$refs.categoryTree.setChecked(node, false, false);
                this.$message.warning("父节点不可选");
            }
            if (this.goodsInfo.categoryName) {
                this.goodsInfo.categoryName = node.name;
            } else {
                this.$set(this.goodsInfo,'categoryName', node.name)
            }
            if (this.goodsInfo.categoryId) {
                this.goodsInfo.categoryId = node.id
            } else {
                this.$set(this.goodsInfo,'categoryId', node.id)
            }
        },

        // 图片预览
        handlePicturePreview() {
            this.picturePreviewVisible = true
        },
        // 删除el-upload的图片
        handlePictureRemove(file, fileList) {
            this.pictureList = this.pictureList.filter(item => {
                return file.uid != item.uid
            })
        },
        pictureLimitTip(file, fileList) {
            this.$utils.showError(this, '只可以上传一张主图')
        },
        uploadPhotoSuccess(res) {
            let url = res.ext.photoUrl
            this.goodsInfo.thumbUrl = url
        },
        /**
         * 规格相关
         */
        showModelDialog() {
            this.visibleModelDialog = true
        },
        syncModelInfo() {
            let ref = this.$refs.goodsModelsComponent
            if (ref) {
                this.goodsInfo.goodsModel = this.hasModel ? '1' : '0'
                this.goodsInfo.modelInfo = ref.selectModels
                this.goodsInfo.goodsModelList = ref.goodsModels
            } else {
                this.goodsInfo.goodsModel = '0'
            }
        },
        /**
         * 页面相关
         */
        turnToGoodsList() {
            this.$router.push('/goods/goodsList')
        },
        // 跳转下一步
        nextStep() {
            if(this.goodsInfo.goodsName && this.goodsInfo.unit &&this.goodsInfo.categoryName && this.goodsInfo.thumbUrl.length>10 && this.goodsInfo.marketPrice && this.goodsInfo.storage){
                this.dispatchNextStep()
                this.syncModelInfo()
            }else{
                this.$message.error('有必填项未填写!');
            }
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
    max-height: 300px;
    overflow: scroll;
}
.button-group__center {
  margin-top: 20px;
  text-align: center;
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

