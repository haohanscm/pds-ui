<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-hh-goods"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item><i class="el-icon-hh-list"></i> 商品列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="search-wrap">
                <el-input placeholder="请输入内容" v-model="searchText" width="286">
                    <el-select v-model="searchSelect" slot="prepend" placeholder="请选择">
                        <el-option label="商品编号" value="1"></el-option>
                        <el-option label="商品名称" value="2"></el-option>
                    </el-select>
                </el-input>
                <el-button type="primary" size="small" @click="searchGoodsList">搜索</el-button>
                <el-button type="default" size="small" @click="resetGoodsList">清除条件</el-button>
            </div>
            <el-container >
                <el-header>
                    <el-tabs v-model="activeTab" @tab-click="changeTab">
                        <el-tab-pane label="全部" name="0"></el-tab-pane>
                        <el-tab-pane label="在售中" name="1"></el-tab-pane>
                        <el-tab-pane label="已售罄" name="2"></el-tab-pane>
                        <el-tab-pane label="已下架" name="3"></el-tab-pane>
                    </el-tabs>
                </el-header>
                <el-container style="height: 600px;">
                    <el-header class="tool-btns">
                        <div class="menu-title">商品分类<i class="el-icon-menu" @click="collapseMenu"></i></div>
                        <div class="btn-group">
                            <el-button type="primary" @click="turnToAddGoods">新增商品</el-button>
                            <el-dropdown @command="handleGoodsCommand">
                                <el-button type="default" size="small">
                                    更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item></el-dropdown-item>
                                    <!-- <el-dropdown-item>批量分类</el-dropdown-item> -->
                                    <el-dropdown-item v-if="activeTab == '3'" :command="{type: 'handleMarketable'}">批量上架</el-dropdown-item>
                                    <el-dropdown-item v-if="activeTab == '1'" :command="{type: 'handleDisMarketable'}">批量下架</el-dropdown-item>
                                    <!--<el-dropdown-item :command="{type: 'deleteAll'}">批量删除</el-dropdown-item>-->
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </el-header>
                    <el-container style="height:600px;">
                    <el-aside width="200px">
                        <el-menu class="goods-category" :collapse="collapse" ref="goodsCategoryMenu"
                                 @select="getCategoryGoods" @open="getCategoryGoods" >
                            <el-menu-item index="">全部</el-menu-item>
                            <template v-for="item in goodsCategories">
                                <template v-if="item.children">
                                    <el-submenu :index="item.id" :key="item.id">
                                        <template slot="title">
                                            <span slot="title">{{ item.name }}</span>
                                        </template>
                                        <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.id">
                                            {{ subItem.name }}
                                        </el-menu-item>
                                    </el-submenu>
                                </template>
                                <template v-else>
                                    <el-menu-item :index="item.id" :key="item.id">
                                        <span slot="title">{{ item.name }}</span>
                                    </el-menu-item>
                                </template>
                            </template>
                        </el-menu>
                    </el-aside>
                    <!--</el-container>-->
                    <!--<el-container>-->
                    <el-main>
                        <el-table :data="goodsList"
                                  ref="goodsListTable"
                                  tooltip-effect="dark"
                                  style="width: 100%"
                                  v-loading="loading"
                                  stripe
                                  height="500"
                            @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="50" fixed></el-table-column>
                            <el-table-column type="index" width="50" fixed></el-table-column>
                            <el-table-column prop="goodsName" label="商品名称" fixed> </el-table-column>
                            <el-table-column prop="sort" label="权重" width="80">
                            </el-table-column>
                            <el-table-column label="商品图片" width="100">
                                <template slot-scope="scope"><img class="goods-cover" :src="scope.row.thumbUrl"/></template>
                            </el-table-column>
                            <el-table-column prop="goodsSn" label="商品编码"  width="120"> </el-table-column>
                            <el-table-column prop="categoryName" label="商品分类" show-overflow-tooltip> </el-table-column>
                            <el-table-column prop="marketPrice" label="售价" show-overflow-tooltip width="80"> </el-table-column>
                            <el-table-column prop="storage" label="库存" show-overflow-tooltip width="60"> </el-table-column>
                            <el-table-column prop="unit" label="单位" show-overflow-tooltip width="60"> </el-table-column>
                            <el-table-column label="是否上架" show-overflow-tooltip width="70">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.isMarketable" :active-value="1" :inactive-value="0"
                                        @change="changeMarketable(scope.row.isMarketable, scope.row.goodsSn)">
                                    </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" show-overflow-tooltip width="60" fixed="right">
                                <template slot-scope="scope">
                                    <router-link :to="{path: 'editGoods', query: {goodsSn: scope.row.goodsSn}}">
                                        <el-button type="text" size="small">编辑</el-button>
                                    </router-link>
                                    <!--  <template>
                                        <el-dropdown trigger="click" @command="handleGoodsCommand">
                                            <el-button type="text" size="small"><i class="el-icon-more"></i></el-button>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item></el-dropdown-item>
                                                <el-dropdown-item>设价</el-dropdown-item>
                                                <el-dropdown-item>推广二维码</el-dropdown-item>
                                                <el-dropdown-item :command="{type: 'disMarketable', row: scope.row, index: scope.$index}"
                                                    v-if="activeTab == '1'">下架
                                                </el-dropdown-item>
                                                <el-dropdown-item :command="{type: 'marketable', row: scope.row, index: scope.$index}"
                                                    v-if="activeTab == '3'" >上架
                                                </el-dropdown-item>
                                                <el-dropdown-item :command="{type: 'delete', row: scope.row, index: scope.$index}">删除</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </template> -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                    </el-container>
                </el-container>
                    <el-footer>
                        <div class="pagination">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="currentPage" :page-sizes="[10, 20, 40, 60]" :page-size="10"
                                           background :layout="layout" :total="totalCount">
                            </el-pagination>
                        </div>
                    </el-footer>
            </el-container>

        </div>
        <!-- 删除提示框 -->
        <!--<el-dialog title="提示" :visible.sync="delVisible" width="300px" center>-->
            <!--<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="delVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="handleDelete">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
import dictionary from '../dictionary.js'
import request from '../request.js'

export default {
    name: "goodsList",
    data() {
        return {
            request: new request(),
            // request数据
            goodsCategories: [],
            goodsList: [],

            /**
             * 状态, 中间变量
             */
            activeTab: '0',
            loading: true,
            multipleSelection: [],
            isDelAll: false,
            // delVisible: false,
            collapse: false,
            totalCount: 10,
            currentPage: 1,
            pageSize: 10,
            layout: "total, sizes, prev, pager, next, jumper",
            categoryId: '',
            searchText: '',
            searchSelect: '2'
        }
    },
    created() {
        this.getGoodsList()
        this.getGoodsCategoryList()
    },
    methods: {
        /**
         * 请求方法
         */
        getGoodsList(params = {}) {
            let goodsStatus = ''
            if (this.activeTab == '1') {
                goodsStatus = 0
            }
            if (this.activeTab == '2') {
                goodsStatus = 2
            }
            if (this.activeTab == '3') {
                goodsStatus = 1
            }
            if (this.activeTab == '0') {
                params.status = '2'
            }
            params.goodsStatus = goodsStatus
            params.categoryId = params.categoryId || this.categoryId
            params.pageNo = params.pageNo || this.currentPage
            params.pageSize = params.pageSize || this.pageSize
            this.request.getGoodsList(params).then(res => {
                this.loading = false
                if (res.code == '200') {
                    this.goodsList = res.ext.list
                    this.currentPage = res.ext.pageNo
                    this.totalCount = res.ext.count
                } else if (res.code == '983') {
                    this.goodsList = []
                } else {
                    this.$message.error('请求失败')
                }
            })
        },
        getGoodsCategoryList(param = {}) {
            this.request.fetchCategoryList(param).then(res => {
                if (res.code == '200') {
                    this.goodsCategories = this.$utils.listToTree(res.ext)
                    this.loading = false
                } else {
                    this.$message.error('分类数据, 请求失败')
                }
            })
        },
        getCategoryGoods(categoryId) {
            let params = {}
            params.pageNo = this.currentPage
            params.categoryId = categoryId
            this.categoryId = categoryId
            this.loading = true
            this.getGoodsList(params)
        },
        /**
         * 页面相关方法
         */
        searchGoodsList() {
            this.loading = true
            this.categoryId = ''
            let params = {}
            let searchSelect = this.searchSelect
            if (searchSelect == 1) {
                params.goodsSn = this.searchText
            }
            if (searchSelect == 2) {
                params.goodsName = this.searchText
            }
            params.pageNo = this.currentPage
            this.getGoodsList(params)
        },
        resetGoodsList() {
            this.loading = true
            this.categoryId = ''
            this.searchText = ''
            this.searchSelect = '1'
            this.currentPage = 1
            let params = {}
            params.pageNo = this.currentPage
            let menu = this.$refs.goodsCategoryMenu
            this.getGoodsList(params)
        },
        changeTab(tab) {
            this.activeTab = tab.name
            this.loading = true
            this.categoryId = ''
            let params = {}
            let searchSelect = this.searchSelect
            if (searchSelect == 1) {
                params.goodsSn = this.searchText
            }
            if (searchSelect == 2) {
                params.goodsName = this.searchText
            }
            params.pageNo = this.currentPage
            this.getGoodsList(params)
        },
        collapseMenu() {
            this.collapse = !this.collapse
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        handleGoodsCommand(command) {
            if (command.type == 'delete') {
                this.delVisible = true
                this.delItem = command.row,
                this.delIndex = command.index
            }
            if (command.type == 'deleteAll') {
                this.delVisible = true
                this.isDelAll = true
            }
            if (command.type == 'handleMarketable') {
                this.handleMarketable(1)
            }
            if (command.type == 'handleDisMarketable') {
                this.handleMarketable(0)
            }
            if (command.type == 'marketable') {
                this.changeMarketable(1, command.row.goodsSn)
            }
            if (command.type == 'disMarketable') {
                this.changeMarketable(0, command.row.goodsSn)
            }
        },
        /**
         * 商品管理
         */
        // 新增
        turnToAddGoods() {
            this.$router.push('/goods/addGoods')
        },
        // 删除
         handleDelete() {
            if (!this.isDelAll) {
                this.deleteRow()
            } else {
                this.deleteAll()
            }
        },
        deleteRow() {
            let delGoodsIds = []
            delGoodsIds.push(this.delItem.goodsSn)
            this.request.delGoods({
                goodsSns: delGoodsIds
            }).then(res => {
                this.delVisible = false
                if (res.code == 200) {
                    this.$message.success("删除成功")
                    this.goodsList.splice(this.delIndex, 1)
                    this.delIndex = ''
                    this.delItem = ''
                } else {
                    this.$message.error("删除失败")
                }
                this.getGoodsList()
            })
        },
        deleteAll() {
            const length = this.multipleSelection.length
            // 调用删除全部, 成功后重新请求数据
            let delGoodsIds = this.multipleSelection.map(item => {
                return item.goodsSn
            })
            this.request.delGoods({
                 goodsSns: delGoodsIds
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success("删除成功")
                    this.delVisible = false
                    this.$refs.goodsListTable.clearSelection()
                    this.isDelAll = false
                    this.multipleSelection = []
                    this.getGoodsList()
                } else {
                    this.$message.error("删除失败")
                }
                this.getGoodsList()
            })
        },
        // 下架
        modifyGoodsStatus(value, id) {
            return this.request.modifyGoodsStatus({
                goodsSn: id,
                isMarketable: value
            })
        },
        changeMarketable(value, id) {
            let tips = value ? '上架' : '下架'
            this.modifyGoodsStatus(value,id).then(res => {
                if (res.code == 200) {
                    this.$message.success(tips + '成功')
                } else {
                    this.$message.error(tips + '失败')
                }
                this.loading = true
                this.getGoodsList()
            })
        },
        handleMarketable(value) {
            let tips = value ? '上架' : '下架'
            const length = this.multipleSelection.length
            let promiseList = []
            if (length > 0) {
                let goodsIds = this.multipleSelection.map(item => {
                    let promise = this.modifyGoodsStatus(value, item.goodsSn)
                    promiseList.push(promise)
                })
            }
            Promise.all(promiseList).then(() => {
                this.$refs.goodsListTable.clearSelection()
                this.multipleSelection = []
                this.$message.success('批量' + tips + '成功')
                this.getGoodsList()
            }, () => {
                this.$message.error('批量' + tips + '失败')
            })
        },
        /**
         * 分类
         */

        /**
         * 分页
         */
        handleSizeChange(size) {
            this.pageSize = size
            this.getGoodsList()
        },
        handleCurrentChange(page) {
            this.currentPage = page
            this.getGoodsList()
        },
    }
};
</script>

<style scoped>
.el-header {
  padding-left: 0;
  padding-right: 0;
}
.tool-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-title {
  display: flex;
  justify-content: space-between;
  width: 200px;
  padding: 15px 20px;
  background: #f0f0f0;
  box-sizing: border-box;
}
.btn-group {
  flex: 1;
  padding: 20px;
}
/* .btn-group button {
        margin-right: 8px;
    } */
/* 商品分类 */
.goods-category:not(.el-menu--collapse) {
  /*width: 180px;*/
  border-bottom: 1px solid #e6e6e6;
}
.goods-category.el-menu--collapse {
    width: 0;
    border-right: 0;
}

/* 商品列表 */
.goods-cover {
    display: inline-block;
    width: 60px;
    height: 60px;
}
.search-wrap {
    text-align: right;
}
/* 覆盖框架原生样式 */
.el-row {
  width: 100%;
}
</style>
<style>
.search-wrap .el-select .el-input {
    width: 100px;
}
.search-wrap .el-input-group__prepend {
    background-color: #fff;
}
.search-wrap .el-input-group {
    width: 25%;
}
</style>

