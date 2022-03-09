<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="primary" icon="search" @click="dialogFormVisible1 = true" disabled >新增供应商</el-button>
        </div>
        <el-table v-loading="loading" :data="supplierList" border style="width: 100%" ref="multipleTable">
            <el-table-column prop="supplierName" label="供应商">
            </el-table-column>
            <el-table-column prop="shortName" label="简称" >
            </el-table-column>
            <el-table-column prop="contact" label="联系人">
            </el-table-column>
            <el-table-column prop="address" label="地址" >
            </el-table-column>
            <el-table-column prop="telephone" label="电话">
            </el-table-column>
            <el-table-column prop="order_info" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" icon="search" @click="clickEdit(scope.row)">编辑</el-button>
                    <el-button type="text" icon="search" @click="clickDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="还款记录" :visible.sync="dialogTableVisible" width="800px">
            <el-table :data="repayList" height="200">
                <el-table-column property="payAmount" label="金额" width="100"></el-table-column>
                <el-table-column property="name" label="操作人" width="100"></el-table-column>
                <el-table-column property="payTime" label="还款时间" width="200"></el-table-column>
                <el-table-column property="name" label="备注" width="200"></el-table-column>
                <el-table-column property="address" label="地址"></el-table-column>
            </el-table>
            <div>
                <div style="display:flex">
                    <div style="flex:1">
                        供应商：{{repayListFooter.supplierName}}
                    </div>
                    <div style="flex:1">
                        联系人：{{repayListFooter.contact}}
                    </div>
                </div>
                <div style="display:flex">
                    <div style="flex:1">
                        联系电话：{{repayListFooter.telephone}}
                    </div>
                    <div style="flex:1">
                        微信号：{{repayListFooter.wechatId}}
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 供应商修改的弹出框 -->
        <el-dialog title="修改供应商" width="600px" :visible.sync="dialogFormVisible">
            <el-form :model="waitEdit" :rules="editRules" ref="waitEdit">
                <el-form-item prop="supplierName" label="供应商" :label-width="'100px'">
                    <el-input v-model="waitEdit.supplierName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="shortName" label="简称" :label-width="'100px'">
                    <el-input v-model="waitEdit.shortName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-model="waitEdit.contact" prop="contact" label="联系人" :label-width="'100px'">
                    <el-input v-model="waitEdit.contact" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="telephone" label="联系电话" :label-width="'100px'">
                    <el-input v-model="waitEdit.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="wechatId" label="微信号" :label-width="'100px'">
                    <el-input v-model="waitEdit.wechatId" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="供应商地址" :label-width="'100px'">
                    <el-input v-model="waitEdit.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新增供应商" width="600px" :visible.sync="dialogFormVisible1">
            <el-form :model="newEdit" :rules="editRules" ref="newEdit">
                <el-form-item prop="supplierName" label="供应商" :label-width="'100px'">
                    <el-input v-model="newEdit.supplierName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="shortName" label="简称" :label-width="'100px'">
                    <el-input v-model="newEdit.shortName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="contact" label="联系人" :label-width="'100px'">
                    <el-input v-model="newEdit.contact" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="telephone" label="联系电话" :label-width="'100px'">
                    <el-input v-model="newEdit.telephone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="address" label="供应商地址" :label-width="'100px'">
                    <el-input v-model="newEdit.address" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitNew">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="供应商还款" width="600px" :visible.sync="dialogFormVisible2">
            <el-form>
                <el-form-item label="供应商" :label-width="'80px'">
                    <el-input  autocomplete="off" v-model="repay.supplierName" disabled></el-input>
                </el-form-item>
                <el-form-item label="应付欠款" :label-width="'80px'">
                    <el-input autocomplete="off" v-model="repay.contact" disabled></el-input>
                </el-form-item>
                <el-form-item label="还款金额" :label-width="'80px'">
                    <el-input v-model="repay.payAmount" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="submitRepay">确 定</el-button>
            </div>
        </el-dialog>
        <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="elPagination.pageNo" :page-sizes="[20, 30, 40]" :page-size="elPagination.pageSize"
                layout="sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import request from "../request.js";
    export default {
        name: 'tabs',
        data() {
            return {
                request: new request(),
                loading: false,
                supplierList: [],
                elPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                repayListPagination:{
                    pageNo: 1,
                    pageSize: 20
                },
                waitEdit:{},
                editRules:{
                    supplierName: [
                        { type: 'string', required: true, message: '请输入供应商全程', trigger: 'change' }
                    ],
                    shortName: [
                        { type: 'string', required: true, message: '请输入供应商简称', trigger: 'change' }
                    ],
                    contact: [
                        { type: 'string', required: true, message: '请输入联系人姓名', trigger: 'change' }
                    ],
                    telephone: [
                        { type: 'string', required: true, message: '请请输入联系人电话', trigger: 'change' }
                    ],
                    address: [
                        { type: 'string', required: true, message: '请输入地址', trigger: 'change' }
                    ]
                },
                newEdit:{},
                repay:{

                },
                repayList:[],
                repayListFooter: {

                },
                total: 0,
                dialogFormVisible: false,//修改供应商
                dialogFormVisible1: false, //新增供应商
                dialogFormVisible2: false, //供应商还款
                dialogTableVisible: false, //还款列表
            }
        },
        created(){
            this.fetchSupplier()
        },
        computed: {
            /**供应商列表查询 */
            listModel(){
                return {
                    ...this.elPagination
                }
            },
            /**还款参数 */
            repayModel(){
                return {
                    supplierId: this.repay.supplierId,
                    payAmount: this.repay.payAmount
                }
            },
            /**查询还款记录列表参数 */
            repayListModel(){
                return {
                    supplierId: this.repayListFooter.supplierId
                }
            }
        },
        methods: {
            /**
             * 网页操作
             */
            /**点击页面列表的删除按钮 */
            clickDelete(id){
                this.deleteSupplier(id);
                this.fetchSupplier();
            },
            /**用户点击列表中的编辑 */
            clickEdit(item){
                this.waitEdit = item;
                this.dialogFormVisible = true;
            },
            /**用户点击编辑供应商 */
            submitEdit(){
                this.$refs.waitEdit.validate((valid) => {
                    if (valid) {
                        this.editSupplier();
                        this.fetchSupplier();
                        this.dialogFormVisible = false;
                    } 
                });
            },
            /**用户点击新增 */
            submitNew(){
                this.$refs.newEdit.validate((valid) => {
                    if (valid) {
                        this.addSupplier();
                        this.dialogFormVisible1 = false;
                    } 
                });
            },
            /**用户点击table中的还款 */
            clickRepay(item){
                this.repay = item;
                this.dialogFormVisible2 = true;
            },
            /**用户点击弹窗中的还款 */
            submitRepay(item){
                this.repayment();
                this.fetchSupplier();
                this.dialogFormVisible2 = false;
            },
            /** 查看还款记录*/
            clickRepayList(item){
                this.repayListFooter = item;
                this.repaymentRecordList();
                this.dialogTableVisible = true;
            },
            handleSizeChange(e){
                this.elPagination.pageSize = e;
                this.fetchSupplier()
            },
            handleCurrentChange(e){
                this.elPagination.pageNo = e;
                this.fetchSupplier()
            },

            /**
             * 网络请求
             */
            /**查询供应商列表 */
            fetchSupplier(){
                this.request.fetchSupplier(this.listModel).then(res => {
                    if(res.code == 200){
                        this.supplierList = res.list;
                        this.total = res.totalRows
                    }
                })
            },
            /**删除供应商 */
            deleteSupplier(id){
                this.request.deleteSupplier({id: id}).then(res => {
                    if(res.code == 200){
                        this.$message.success("删除成功！")
                    }
                })
            },
            /**修改供应商 */
            editSupplier(){
                this.request.editSupplier(this.waitEdit).then(res => {
                    if(res.code == 200){
                        this.$message.success("修改成功！")
                    }
                })
            },
            /**新增供应商 */
            addSupplier(){
                this.request.addSupplier(this.newEdit).then(res => {
                    if(res.code == 200){
                        this.$message.success("添加成功！")
                        this.fetchSupplier();
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            },
            /**供应商还款 */
            repayment(){
                this.request.repayment(this.repayModel).then(res => {
                    if(res.code == 200){
                        this.$message.success("操作成功！")
                    }else{
                        this.$message.warning(res.msg)
                    }
                })
            },
            /**还款记录查看 */
            repaymentRecordList(){
                this.request.repaymentRecordList(this.repayListModel).then(res => {
                    if(res.code == 200){
                        this.repayList = res.list;
                    }
                })
            }

        }
    }

</script>

<style scoped>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
.item{
    display: flex;
}

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
.delivery-nav{
    width: 100%;
    display: flex;
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