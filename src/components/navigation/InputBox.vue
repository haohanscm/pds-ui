<template>
    <div class="input-box">
        <div class="input-confirm" v-if="!isEdit">
            <span>{{text}}</span>
            <i class="el-icon-edit" @click="isEdit=true"></i>
            <i class="el-icon-close" @click="delInputBox"></i>
        </div>
        <div class="input-edit" v-if="isEdit">
            <el-popover placement="top" width="200" trigger="manual" content="请填写标签内容" v-model="tips">
                <el-input class="input" slot="reference" v-model="text" maxlength="20"
                    @keyup.enter="confirmInput">
                    <span slot="suffix">
                        <i class="el-input__icon el-icon-check" @click="confirmInput"></i>
                        <i class="el-input__icon el-icon-close" @click="cancelInput"></i>
                    </span>
                </el-input>
            </el-popover>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        index: {
            required: true
        },
        target: {
            required: true
        },
        content: '',
    },
    data() {
        return {
            // 状态
            text: '',
            isEdit: true,
            tips: false
        }
    },
    created() {
        if (this.content) {
            this.text = this.content
            this.isEdit = false
        }
    },
    methods: {
        confirmInput() {
            if (this.text == '' || this.text == null) {
                this.tips = true
                return;
            }
            this.isEdit = false
            this.$emit('edit', {content: this.text, index: this.index, target: this.target})
        },
        cancelInput() {
            if (this.text == '') {
                this.$emit('cancel')
                return;
            }
            this.isEdit = false
        },
        delInputBox() {
            this.$emit('delete', {content: this.text, index: this.index, target: this.target})
        }
    }
}
</script>

<style scoped>
.input-box {
    display: inline-block;
}
.input-box + .input-box{
    margin-left: 10px;
}
.input-edit {
    display: inline-block;
}
.input-edit i {
    font-weight: bold;
}
.input-confirm {
    display: inline-block;
    height: 32px;
    line-height: 30px;
    padding: 0px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    font-size: 14px;
    box-sizing: border-box;
}
.input {
    width: 150px;
}
.input input {
    padding-right: 60px !important;
}
.el-input__icon {
    width: 15px;
}
</style>

