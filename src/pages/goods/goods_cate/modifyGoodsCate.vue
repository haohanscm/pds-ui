<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-hh-goods"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pageType == 'add'"><i class="el-icon-hh-cascades"></i> 新增分类</el-breadcrumb-item>
                <el-breadcrumb-item v-if="pageType == 'edit'"><i class="el-icon-hh-cascades"></i> 编辑分类</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container category-wrap">
            <el-form :model="categoryForm" label-width="80px" label-position="right">
                <el-form-item label="分类权重">
                    <el-input v-model="categoryForm.sort" class="form-input"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" required>
                    <el-input v-model="categoryForm.categoryName" class="form-input"></el-input>
                </el-form-item>
                <el-form-item v-if="categoryForm.parentName" label="所属分类" required>
                    <div class="el-button el-button--primary parent-category-name el-button--small">
                        {{categoryForm.parentName}}
                    </div>
                </el-form-item>
                <el-form-item label="分类图标">
                    <el-upload
                        class="category-logo-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false">
                        <img v-if="categoryForm.logo" :src="categoryForm.logo" class="category-logo">
                        <i v-else class="el-icon-plus category-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <div>
                        <el-button type="primary" size="mini" @click="modifyGoodsCategory">保存</el-button>
                        <el-button type="default" size="mini" @click="backToGoodsCategory">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import Request from './../request.js'

export default {
    data() {
        return {
            pageType: 'add',
            request: new Request(),
            categoryForm: {
                categoryId: '',
                categoryName: '',
                parentId: 0,
                parentName: '',
                sort: 0,
                logo: '',
            }
        }
    },
    mounted() {
        let query = this.$route.query
        if (query != null) {
            this.initData(query)
        }
        this.path = this.$route.path
        if (this.path == '/goods/addGoodsCate') {
            this.pageType = 'add'
        } else {
            this.pageType = 'edit'
        }
    },
    methods: {
        initData(data) {
            this.categoryForm.parentId = data.parentId || 0
            this.categoryForm.parentName = data.parentName || ''
            this.categoryForm.categoryId = data.categoryId || ''
            this.categoryForm.categoryName = data.categoryName || ''
            this.categoryForm.sort = data.sort || 0
            this.categoryForm.logo = data.logo || ''
        },
        backToGoodsCategory() {
            this.$router.go(-1)
        },
        modifyGoodsCategory() {
            let cate = this.categoryForm
            this.request.modifyGoodsCategory({
                name: cate.categoryName,
                categoryId: cate.categoryId,
                parentId: cate.parentId,
                logo: cate.logo,
                sort: cate.sort
            }).then(res => {
                let tips = (this.pageType == 'add') ? '添加' : '编辑'
                if (res.code == 200) {
                    this.$message.success(tips + '分类成功')
                    this.$router.go(-1)
                } else {
                    this.$message.error(tips + '分类失败')
                }
            })

        }
    }
}
</script>

<style scoped>
.category-wrap {
    padding: 20px;
}
.form-input {
    width: 286px;
}
.category-uploader-icon {
    line-height: 150px;
}
.parent-category-name {
    color: #409EFF;
    background: #ecf5ff;
    border-color: #b3d8ff;
}
.category-logo {
    width: 150px;
    height: 150px;
}
</style>

<style>
.category-logo-uploader .el-upload--text{
    width: 150px;
    height: 150px;
}
</style>


