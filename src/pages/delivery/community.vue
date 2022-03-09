<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 小区-区域统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->

        <!-- 编辑弹出框 -->
        

        <div class="container marginTop">
            <div class="handle-box">
                <router-link 
                    :to="{
                        path: '/delivery/community_edit',
                        query: {
                            isEdit: false
                        }
                    }">
                    <el-button type="primary">+ 新增片区</el-button>
                </router-link>
                
            </div>
            <el-table :data="areaList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="name" label="片区名称"  width="200">
                </el-table-column>
                <el-table-column prop="provinceName" label="省/直辖市" width="100">
                </el-table-column>
                <el-table-column prop="cityName" label="市"  width="100">
                </el-table-column>
                <el-table-column prop="regionName" label="区"  width="100">
                </el-table-column>
                <el-table-column prop="merchantName" label="所属店铺">
                </el-table-column>
                <el-table-column prop="communityNames" label="包含小区">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="right">
                            <p style="display:block;max-width: 200px">{{ scope.row.communityNames }}</p>
                            <div slot="reference" class="name-wrapper">
                                <div class="single-line cursor-pointer">{{scope.row.communityNames}}</div>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="delDistrictArea(scope.row.$index,scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import dic from "../../utils/dictionary.js";
    import communityEdit from "./community_edit.vue"
    import request from "./index.js";
    import bus from "../../components/common/bus.js";
    export default {
        name: 'basetable',
        components:{
            communityEdit
        },
        data() {
            return {
                payStatusOpt:dic.payStatus,
                model:{
                    payStatus: "",
                    orderTime:""
                },
                request: new request(),
                total:0,
                areaList:[] //片区列表
            }
        },
        //生命周期，页面创建完成
        created() {
            this.getAreasList();
        },
        methods:{
            //获取片区列表
            getAreasList(){
                this.request.fetchAreaList({pageNo:1,pageSize:10}).then(res=>{
                    if(res.code==200){
                        this.areaList = res.list;
                        this.total = res.totalRows
                    }
                })
            },
            //删除片区
            delDistrictArea(index, id){
                this.$utils.confirm(this, '你确认要删除该片区吗？').then(()=>{
                    this.request.delDistrictArea({ id }).then(res=>{
                        if(res.code == 200){
                            this.areaList.splice( index, 1)
                            this.$utils.showSuccess(this, "删除成功")
                        }else{
                            this.$utils.showError(this, res.msg)
                        }
                    })
                })
            },
            // 跳转编辑页面
            handleEdit(item){
                this.$router.push({path:'/delivery/community_edit',query:{item,isEdit:true}})
            },
            //翻页
            handleCurrentChange(){

            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin: 15px;
        float: left;
    }
    .marginTop{
        margin-top: 20px;
    }
    .handle-select {
        width: 120px;
    }
    .handle-input {
        width: 300px;
        display: inline-block;
        color: black;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
</style>
