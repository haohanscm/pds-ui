<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 区域修改/新增</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 选择框 -->
        <!-- 编辑弹出框 -->
        <div class="container marginTop">
            <div class="item">
                片区名称：<el-input style="flex:1" placeholder="请输入内容" v-model="areaData.name">
                    {{data}}
                </el-input>
            </div>
            <div class="item" style="margin:0 auto"><regional-choice :provence-list="provenceList" :city-list="cityList" :region-list="regionList" v-model="addressObj"></regional-choice></div>
            <div class="item">
                <el-collapse style="width:100%;" @change="fetchCommunityList">
                    <el-collapse-item title="包含小区：" name="1">
                        <el-table :data="communityList" border ref="multipleTable">
                            <el-table-column label="序号" width="140" >
                                <template slot-scope="scope">
                                    {{scope.$index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="小区名称" >
                            </el-table-column>
                            <!-- <el-table-column prop="detailAddress" label="详细地址" >
                            </el-table-column> -->
                            <el-table-column prop="createDate" label="创建时间" >
                            </el-table-column>
                            <el-table-column label="操作"  width="200">
                                <template slot-scope="scope">
                                    <div style="display:flex">
                                        <el-button @click="openDialogModify( scope.$index, scope.row.name, scope.row.id)">修改小区名</el-button>
                                        <el-button
                                        size="mini"
                                        type="danger"
                                        @click="delCommunity(scope.$index,scope.row.id)">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin:30px 0 30px 0; border-top:1px solid #eaeaea"></div>
                        
                        <el-table v-show="addCommunityModel.communityNames[0]" :data="addCommunityModel.communityNames" border ref="multipleTable">
                            <el-table-column label="序号" width="140" >
                                <template slot-scope="scope">
                                    {{scope.$index + 1}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="小区名称" >
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="createDate" label="创建时间" >
                            </el-table-column>
                            <el-table-column label="操作"  width="200">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="delCommunityName(scope.$index)">移除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="item" style="width:100%;">
                                <div class="handle-box" style="display:flex">    
                                    新增小区：<el-input style="flex:1" v-model="addCommunityName" @change="getCommunityName" placeholder="输入完后按回车"></el-input>
                                    <el-button size="small" plain @click="getCommunityName">添加小区</el-button>
                                   
                                </div>
                                <!-- <el-tag
                                :key="tag"
                                v-for="tag in addCommunityModel.communityNames"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)">
                                {{tag}}
                                </el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="medium"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新小区</el-button> -->
                                
                                
                            
                        </div>
                        <el-button @click="addCommunity">确认添加</el-button>
                    </el-collapse-item>
                </el-collapse>
                <el-dialog title="小区名输入" width="30%" :visible.sync="dialogModify">
                    <el-input placeholder="请输入新的小区名称" autocomplete="off" v-model="editCommunityModel.communityName"></el-input>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogModify = false">取 消</el-button>
                        <el-button type="primary" @click="editCommunity">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <div class="item">
                <el-button type="primary" plain size="medium" v-if="isEdit" @click="editDistrictArea">修改片区</el-button>
                <el-button type="primary" plain size="medium" v-if="!isEdit" @click="addDistrictArea">新增片区</el-button>
            </div>
        </div>
        <!-- 修改小区名模态框 -->
        
    </div>
</template>

<script>
    import dic from "../../utils/dictionary.js";
    import request from "./index.js";
    import bus from "../../components/common/bus.js";
    import regionalChoice from "../../components/page/regionalChoice.vue"
    export default {
        name: 'basetable',
        components:{
            regionalChoice
        },
        data() {
            return {
                payStatusOpt: dic.payStatus,
                //地区对象
                addressObj:{
                    provinceCode: "",
                    cityCode: "",
                    regionCode: ""
                },
                //获取区域信息
                model:{
                    id: ""
                },
                //新增、修改区域信息
                editDistrictAreaModel:{
                    id: "",
                    name: "",
                    province: "",
                    city: "",
                    region: ""
                },
                //添加区域信息
                addDistrictAreaModel:{
                    name: "",
                    province: "",
                    city: "",
                    region: "",
                    communityIds: ""
                },
                //获取小区列表
                getCommunityModel:{
                    districtId: ""
                },
                //删除小区
                delCommunityModel:{
                    districtId: "",
                    communityId: ""
                },
                //修改小区名
                editCommunityModel:{
                    districtId: "",
                    communityName: "",
                    communityId: ""
                },
                //添加小区
                addCommunityModel:{
                    districtId: "",
                    communityNames: []
                },
                communityList:[],
                request: new request(),
                areaData: {}, //当前片区数据
                dialogModify: false, //控制弹出框
                choosedIndex: "",
                inputVisible: false,
                inputValue: '',
                //输入框输入的小区名
                addCommunityName: "",
                isEdit: true //标识当前页面是否为编辑状态
            }
        },
        //生命周期，页面创建完成
        created() {
            this.renderArea();
        },
        mounted(){
            
        },
        computed:{
            data(){
                return this.areaData;
            }
        },
        methods:{
            /**
             * 默认执行类
             * **/ 
            // 渲染片区数据
            renderArea(){
                let params = this.$route.query.item;
                this.isEdit = this.$route.query.isEdit;
                if(!this.isEdit) return; //页面为新增片区时，后续不执行
                //设置传参对象参数
                this.areaData = params;
                this.model.id = params.id;
                this.delCommunityModel.districtId = params.id;
                this.editCommunityModel.districtId = params.id;
                this.addCommunityModel.districtId = params.id;
                this.editDistrictAreaModel.id = params.id;
                this.getCommunityModel.districtId = params.id;
                //组件传入当前页面值
                this.provenceList = [{code:params.province,name:params.provinceName}];
                this.cityList = [{code:params.city,name:params.cityName}];
                this.regionList = [{code:params.region,name:params.regionName}];
                this.addressObj.provinceCode = params.province;
                this.addressObj.cityCode = params.city;
                this.addressObj.regionCode = params.region;
            },
            /**
             * 操作类
             * **/ 
            //获取省市区
            getAddress(e){
                console.log(e)
            },
            //获取小区名
            getCommunityName(){
                this.addCommunityModel.communityNames.push(this.addCommunityName);
                this.addCommunityName = ""
            },
            //移除待添加的小区
            delCommunityName(index){
                this.addCommunityModel.communityNames.splice(index,1)
            },
            //打开模态框
            openDialogModify( index, name, id){
                this.dialogModify = true;
                this.editCommunityModel.communityId = id;
                this.editCommunityModel.communityName = name;
                this.choosedIndex = index;
            },
            //点击新增标签
            handleClose(tag) {
                this.addCommunityModel.communityNames.splice(this.addCommunityModel.communityNames.indexOf(tag), 1);
            },
            //展示输入框
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //处理输入
            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.addCommunityModel.communityNames.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            /**
             * 请求类
             * **/ 
            //编辑片区
            editDistrictArea(){
                this.editDistrictAreaModel.name = this.areaData.name;
                this.editDistrictAreaModel.province = this.addressObj.provinceCode;
                this.editDistrictAreaModel.city = this.addressObj.cityCode;
                this.editDistrictAreaModel.region = this.addressObj.regionCode;
                this.request.editDistrictArea( this.editDistrictAreaModel).then(res=>{
                    if(res.code == 200){
                        this.$utils.showSuccess( this, "添加成功！")
                        this.$router.push('/delivery/community')
                    }
                })
            },
            //新增片区
            addDistrictArea(){
                let communityIds = ""
                this.communityList.forEach((ele, index)=>{
                    if(index == 0){
                        communityIds += ele.id
                    }
                    communityIds += "," + ele.id
                })
                this.addDistrictAreaModel.name = this.areaData.name;
                this.addDistrictAreaModel.province = this.addressObj.provinceCode;
                this.addDistrictAreaModel.city = this.addressObj.cityCode;
                this.addDistrictAreaModel.region = this.addressObj.regionCode;
                this.addDistrictAreaModel.communityIds = communityIds;
                this.request.addDistrictArea( this.addDistrictAreaModel).then(res=>{
                    if(res.code == 200){
                        this.$router.go(-1)
                        this.$utils.showSuccess(this, "添加成功！")
                    }else{
                        this.$utils.showError(this, res.msg)
                    }
                })
            },
            //编辑小区
            editCommunity(){
                this.request.editCommunity(this.editCommunityModel).then(res=>{
                    if(res.code == 200){
                        this.communityList[this.choosedIndex].name = this.editCommunityModel.communityName;
                        this.dialogModify = false;
                    }else{
                        this.$utils.showError( this, res.msg);
                    }
                })
            },
            //渲染小区列表
            fetchCommunityList(){
                this.getCommunityModel.queryUnSelected = !this.isEdit
                this.request.fetchCommunityList(this.getCommunityModel).then(res=>{
                    if(res.code == 200){
                        this.communityList = res.ext;
                    }else{
                        this.$utils.showError( this, res.msg)
                    }
                })
            },
            //删除小区
            delCommunity(index, id){
                this.$utils.confirm( this, '你确认要删除该小区吗？').then(()=>{
                    this.delCommunityModel.communityId = id;
                    this.request.delCommunity(this.delCommunityModel).then(res => {
                        if(res.code == 200){
                            this.communityList.splice( index, 1)
                            this.$utils.showSuccess(this, "删除成功")
                        }else{
                            this.$utils.showError(this, res.msg)
                        }
                    })
                })
            },
            //添加小区
            addCommunity(){
                this.request.addCommunity(this.addCommunityModel).then(res=>{
                    if(res.code == 200){
                        this.$utils.showSuccess(this, "添加成功");
                        this.addCommunityModel.communityNames = [];
                        this.fetchCommunityList()
                    }else{
                        this.$utils.showError(this, res.msg)
                    }
                })
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
    .item{
        width: 60%;
        margin: 20px auto 0 auto;
        display: flex;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
    .item > .el-button{
        width:96%;
        margin: 0 auto;
    }
</style>
