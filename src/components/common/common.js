import eg from './eg.vue';
import backToTop from './backToTop.vue';
import drag from "./drag.vue";
import buyerCheck from "./buyer_check.vue";
import inputBox from "./input_box.vue";
import treeTable from "./tree_table/index";
import myPagination from "./my_pagination";
import buyerMerchantSelect from "./buyer_merchant_select.vue";
export default (Vue)=>{
    Vue.component( "Eg", eg);
    Vue.component( "backToTop", backToTop);
    Vue.component( "myDrag", drag);
    Vue.component( "buyerCheck", buyerCheck);
    Vue.component( "inputBox", inputBox);
    Vue.component( "treeTable", treeTable);
    Vue.component( "myPagination", myPagination);
    Vue.component( "buyerMerchantSelect", buyerMerchantSelect);
}
