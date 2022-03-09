<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 店铺服务区域查看</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->

        <!-- 编辑弹出框 -->
        

        <div class="container marginTop">
            <el-table :data="shopList" border style="width: 100%" ref="multipleTable">
                <el-table-column prop="shopName" fit label="店铺名" >
                </el-table-column>
                <el-table-column prop="order_type" fit label="店铺负责人">
                </el-table-column>
                <el-table-column prop="shopTel" fit label="店铺电话" >
                </el-table-column>
                <el-table-column prop="shopAddress" fit label="店铺地址" >
                </el-table-column>
                <el-table-column prop="serviceDistricts" fit label="服务片区">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p style="display:block;max-width: 200px">{{ scope.row.serviceDistricts }}</p>
                            <div slot="reference" class="name-wrapper">
                                <div class="single-line cursor-pointer">{{scope.row.serviceDistricts}}</div>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="serviceCommunitys" fit label="服务小区" >
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p style="display:block;max-width: 200px">{{ scope.row.serviceCommunitys }}</p>
                            <div slot="reference" class="name-wrapper">
                                <div class="single-line cursor-pointer">{{scope.row.serviceCommunitys }}</div>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_channel" fit label="操作" >
                    <template slot-scope="scope">
                        <div style="display:flex">
                            <el-button type="danger" @click="openDialogModify( scope.$index, scope.row.id)">修改</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
        :title="shopName"
        :visible.sync="dialogVisible"
        width="60%"
        >
            <v-classification v-if="dialogVisible" :ctrl="ctrl" @checked="checkCommunity"></v-classification>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="showDetail">确 定</el-button>
            </span>
        </el-dialog>


        <el-dialog
        :title="shopName"
        :visible.sync="dialogListVisible"
        width="960px"
        >
            <div style="display:flex">
                <div class="show-item">
                    删除的小区
                    <el-table
                    :data="deleteItems"
                    style="width:100%">
                        <el-table-column
                            prop="name"
                            label="小区名"
                            width="240"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="操作"
                            width="120"
                           >
                        <template slot-scope="scope">
                            <div style="display:flex">
                                <el-button type="danger" size="mini" @click="deleteItems.splice(scope.$index, 1)">从列表中移除</el-button>
                            </div>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="show-item">
                    添加的小区
                    <el-table
                    :data="addItems"
                    style="width:100%">
                        <el-table-column
                            prop="name"
                            label="小区名"
                            width="240"
                            fit
                            >
                        </el-table-column>
                        <el-table-column
                            prop=""
                            label="操作"
                            fit
                            width="120"
                            >
                            <template slot-scope="scope">
                                <div style="display:flex">
                                    <el-button type="danger" size="mini" @click="addItems.splice(scope.$index, 1)">从列表中移除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogListVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import request from "./index.js";
    import vClassification from "../../components/page/classification.vue"
    export default {
        name: 'basetable',
        components:{ vClassification },
        data() {
            return {
                shopServiceAreaModel:{
                    shopId: "",
                    deleteItems: [],
                    addItems: []
                },//店铺编辑请求参数
                addItems: [],  //添加的小区列表
                deleteItems: [],  //删除的小区列表
                radio: 1,
                shopName: "",
                shopList: [],//店铺列表
                request: new request(),
                ctrl:{
                    data:[
                        {
                            name: "1",//列表展示项
                            params: {
                                id: 1223
                            }//列表展示项参数
                        }
                    ],
                    request:"fun" //组件内部请求函数
                },//组件控制器
                dialogVisible: false,
                dialogListVisible: false
            }
        },
        created(){
            this.renderList()
        },
        computed(){

        },
        methods:{
            /**执行类**/
            //渲染店铺列表
            renderList(){
                this.getList().then(res=>{
                    if(res.code == 200){
                        this.shopList = res.ext
                    }
                })
            },
            //弹出区域列表
            openDialogModify( index, id){
                this.shopServiceAreaModel.shopId = id;
                this.shopName = this.shopList[index].shopName;
                this.dialogVisible = true;
                this.fetchAreaList().then(res=>{
                    if(res.code == 200){
                        this.ctrl = this.setCtrl(res.list);
                        console.log( this.ctrl)
                    }
                })
            },
            //修改列表
            modifyList(){
                this.shopServiceAreaModel.addItems = []
                this.shopServiceAreaModel.deleteItems = []
                this.addItems.forEach(ele=>{
                    this.shopServiceAreaModel.addItems.push({communityId:ele.id, districtId: ele.pid})
                })
                this.deleteItems.forEach(ele=>{
                    this.shopServiceAreaModel.deleteItems.push({communityId:ele.id, districtId: ele.pid})
                })
                this.editServiceArea().then(res=>{
                    if(res.code == 200){
                        this.$utils.showSuccess(this, "添加成功");
                        this.addItems = [];
                        this.deleteItems = [];
                        this.dialogListVisible = false
                    }else{
                        this.$utils.showErr(this, res.msg);
                        this.dialogListVisible = false
                    }
                })
            },
            /**工具类**/
            //根据返回对象设置控制器的值
            setCtrl(list){
                let _this = this;
                let data = { data: [] };
                list.forEach( item =>{
                    data.data.push({ title: item.name, params:{ districtId:item.id, shopId: this.shopServiceAreaModel.shopId } })
                })
                data.request = (a)=>{
                    return _this.queryShopServiceCommunity(a)
                }
                return data;
            },
            //展示已选内容列表
            showDetail(){
                this.dialogVisible = false;
                this.dialogListVisible = true;
            },
            //设置接收已选择的管辖区域列表值
            checkCommunity(checkedList){
                this.deleteItems = [];
                this.addItems = [];
                checkedList.forEach(ele=>{
                    if(ele.type == "del"){
                        this.deleteItems.push(ele)
                    }else if(ele.type == "add"){
                        this.addItems.push(ele)
                    }
                })
                console.log(checkedList)
            },
            /**请求类**/ 
            //获取店铺列表
            getList(){
                return this.request.fetchShopList()
            },
            //获取店铺服务区域
            queryShopServiceArea(){
                return this.request.queryShopServiceArea(this.shopServiceAreaModel)
            },
            //获取片区的小区列表----供控制器使用
            queryShopServiceCommunity(model){
                return this.request.queryShopServiceCommunity(model)
            },
            //编辑店铺区域
            editServiceArea(){
                return this.request.editServiceArea(this.shopServiceAreaModel)
            },
            //查询片区列表
            fetchAreaList(){
                return this.request.fetchAreaList({ pageSize: 30,pageNo: 1})
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
    .show-item{
        width: 40%;
        overflow: hidden;
        flex: 1;
        margin: 50px;
    }
</style>
