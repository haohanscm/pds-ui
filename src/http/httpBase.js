import axios from 'axios';
var qs = require("qs");
import utils from "../utils/utils.js"
import {
    Message
} from 'element-ui'
let $utils = new utils()
// create an axios instance


//添加响应拦截器
axios.interceptors.response.use(function (response) {
    //对响应数据做些事
    if (response.status === 200) {
        // console.log("响应拦截器", response.data);
        if(response.data.code === 999){
            Message({
                message: "用户未登录!请前往登录!",
                type: 'error',
                duration: 5 * 1000
            })
            return {
                code:400,
                msg:"用户未登录"
            };
        }
        return response.data;
    } else {
        Message({
            message: "网络连接有误!请重新登录!",
            type: 'error',
            duration: 5 * 1000
        })
    }
}, function (error) {
    return Promise.reject(error);
});

//添加请求拦截器
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

//设置请求主体
class httpBase {
    constructor() {
        this.baseUrl = $constant.baseUrl
        this.header = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.handleParams = function (params, indices, header) {
            // 用于一般系统
            params.shopId = $utils.getCookie("shopId");
            params.pmId = $utils.getCookie("pmId");
            // 用于君磊农产品

            if (header['Content-Type'] == 'application/x-www-form-urlencoded') {
                return qs.stringify(params, {
                    indices
                })
            } else {
                return params;
            }

        }
    }
    //定义在类中的方法不需要添加function
    post(url, params, header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }, indices = true, baseUrl = '') {
        var paramsData = this.handleParams(params, indices, header)
        return axios({
            url: (baseUrl || this.baseUrl) + url,
            data: paramsData,
            method: "POST",
            headers: header
        })
    }
    json(url, params) {
        return this.post(url, params, {
            'Content-Type': 'application/json'
        })
    }
    get(url, header = {
        'Content-Type': 'text/html'
    }) {
        return axios({
            url: url,
            method: "GET",
            headers: header
        })
    }
}

export default httpBase
