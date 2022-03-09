<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-hh-goods"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-hh-cascades"></i> 分类管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-container>
                <!-- <el-aside>
                    <div style="width:200px;">
                        分组侧边栏
                    </div>
                </el-aside> -->
                <el-header>
                    <div class="goods-category-btns">
                        <div>
                            <el-button type="primary" @click="addGoodsCate"><i class="el-icon-plus"></i> 新增分类</el-button>
                            <!-- <el-button type="default" @click="delAllGoodsCate"><i class="el-icon-delete"></i> 删除分类</el-button> -->
                        </div>
                        <div>
                            <el-button type="default" @click="backToGoodsList"><i class="el-icon-hh-back_android"></i> 返回</el-button>
                        </div>
                    </div>
                </el-header>
                <el-main v-loading="goodsCateLoading">
                    <tree-table :columns="columns" :data="data" :expand-all="true" ref="categoryTable"
                        :selectionFn="onSelectionChange">
                        <el-table-column label="分类排序" width="200">
                            <template slot-scope="scope">
                                <el-input-number class="category-sort" v-model="scope.row.sort"
                                    controls-position="right" :min="0">
                                </el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="分类图标"  width="200">
                            <template slot-scope="scope">
                                <img v-if="scope.row.logo" :src="scope.row.logo" class="category-logo">
                                <!-- <el-upload
                                    class="category-logo-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list="false">
                                    <i v-else class="el-icon-plus category-uploader-icon"></i>
                                </el-upload> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="新增子分类" width="200">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row._level == 1" type="primary" @click="addSubGoodsCate(scope.row)">新增</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="editGoodsCate(scope.row)">编辑</el-button>
                                <el-button type="danger" @click="delGoodsCate(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </tree-table>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script>
import Request from './../request.js'

export default {
    data() {
        return {
            request: new Request(),
            // 字典
            columns: [
                {
                    text: '分类名称',
                    value: 'name'
                },
                {
                    text: '分类ID',
                    value: 'id'
                },
                // {
                //     text: '排序',
                //     value: 'sort',
                //     width: 100
                // },
                // {
                //     text: '分类图标',
                //     value: 'logo'
                // },
                // {
                //     text: '父级ID',
                //     value: 'parentId'
                // }
            ],
            // goodsCategories: dictionary.goodsCategories,
            // 状态
            goodsCateLoading: true,
            delTipsVisible: false,
            // 分类数据
            data: [],
            selectionData: [],
        }
    },
    mounted() {
        this.fetchCategoryList()
    },
    // components: {
    //     TreeTable
    // },
    methods: {
        fetchCategoryList() {
            this.request.fetchCategoryList({}).then(res => {
                let data = this.$utils.listToTree(res.ext)
                this.data = data
                this.goodsCateLoading = false
            })
        },
        addGoodsCate(row) {
            this.$router.push({
                path: '/goods/addGoodsCate'
            })
        },
        addSubGoodsCate(row) {
            this.$router.push({
                path: '/goods/addGoodsCate',
                query: {
                    parentId: row.id,
                    parentName: row.name,
                }
            })
        },
        editGoodsCate(row) {
            let parentId = row.parentId,
                parentName = ''

            parentName = this.getCategoryName(this.data, parentId)
            this.$router.push({
                path: '/goods/editGoodsCate',
                query: {
                    categoryId: row.id,
                    categoryName: row.name,
                    parentId: row.parentId,
                    parentName: parentName,
                    sort: row.sort,
                    logo: row.logo,
                }
            })
        },
        delGoodsCate(row) {
            // console.log(row);
            let categoryIds = []
            categoryIds.push(row.id)
            // this.delTipsVisible = false
            this.$confirm('确认删除？').then(_ => {
                this.request.deleteGoodsCategory({
                    categoryIds,
                }).then(res => {
                    if (res.code == 200) {
                        this.$message.success('删除分类成功');
                        this.fetchCategoryList();
                    } else {
                        this.$message.error('删除分类失败')
                    }
                });
            }).catch(_ => {});
        },
        delAllGoodsCate() {
            let categories = this.$refs.categoryTable
            console.log(categories);
        },
        backToGoodsList() {
            console.log('object');
            this.$router.push('/goods/goodsList')
        },
        onSelectionChange(selection) {
            let table = this.$refs.categoryTable
            console.log(selection);

            // todo 当选中父级分类时, 同时选中子分类
            // toggleRowSelection
            this.selectionData = selection
        },
        getCategoryName(data, id) {
            let categoryName = ''
            data.map(item => {
                if (item.id == id) {
                    categoryName = item.name
                } else if (item.children && item.children.length > 0) {
                    this.getCategoryName(item.children, id)
                }
            })
            return categoryName
        }
    }
}
</script>

<style scoped>
.category-sort {
    width: 100px;
}
.category-logo {
    width: 60px;
    height: 60px;
    border-radius: 6px;
}
.category-uploader-icon {
    line-height: 60px;
}
.goods-category-btns {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
}
</style>



