<template>
    <div class="goods-info-wrap" ref="goodsInfoWrap">
        <quill-editor ref="myTextEditor" v-model="detailDesc" :options="editorOption"></quill-editor>
        <div class="button-group__center button-fixed">
            <el-button type="default" @click="dispatchPrevStep">上一步</el-button>
            <el-button type="default" @click="dispatchNextStep">填写高级选项</el-button>
            <el-button type="primary" @click="dispathSaveBaseInfo">保存上架</el-button>
        </div>
    </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import mixin from './../mixins'

export default {
    mixins: [mixin],
    props: {
        goodsInfo: {
            type: Object,
        }
    },
    data() {
        return {
            currentStep: 1,
            editorOption: {
                toolbar: [
                    [{ 'size': ['small', false, 'large'] }],
                    ['bold', 'italic'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image']
                ],
                history: {
                    delay: 1000,
                    maxStack: 50,
                    userOnly: false
                },
                imageDrop: true,
                imageResize: {
                    displayStyles: {
                        backgroundColor: 'black',
                        border: 'none',
                        color: 'white'
                    },
                    modules: [ 'Resize', 'DisplaySize', 'Toolbar' ],
                },
                placeholder: '填写商品详情...'
            },

            // 变量
            detailDesc: '',
            wrapWidth: '',
        }
    },
    watch: {

    },
    components: { quillEditor },
    created() {
        this.detailDesc = this.goodsInfo.detailDesc
    },
    methods: {
        dispathSaveBaseInfo() {
            this.goodsInfo.detailDesc = this.detailDesc
            this.$emit('save')
        },
    },

}
</script>

<style scoped>
.goods-info-wrap {
    position: relative;
    padding: 0 20px;
    padding-bottom: 60px;
}
.button-group__center {
  margin-top: 20px;
  text-align: center;
}
.button-fixed {
    position: fixed;
    margin-left: 200px;
    margin-bottom: 30px;
    left: 0;
    bottom: 0;
    width: calc(100% - 170px);
}
</style>


