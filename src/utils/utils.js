class utils {
    constructor() {}
    /**
     * 请求类
     */
    //定义在类中的方法不需要添加function
    setCookie(cname, cvalue, exdays = 1) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 1000 * 24 * 60 * 60));
        var expires = "expires=" + d.toUTCString();
        // console.info(cname + "=" + '111' + "; " + expires);
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };
    //获取cookie
    getCookie(cname) {
        var arr, reg = new RegExp("(^| )" + cname + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;

    };
    // 删除cookie
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }

    /**
     * 弹窗类
     */

    // 成功
    showSuccess(model, str) {
        model.$notify({
            title: '成功',
            message: str,
            type: 'success'
        });
    }

    // 失败
    showError(model, str) {
        model.$notify.error({
            title: '错误',
            message: str
        });
    }

    // 确认
    confirm(model, str) {
        return model.$confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
    }

    /**
     * 工具类
     */
    //根据元素值删除数组某一项 其中，key代表唯一标识属性
    deleteItem(arr, item, key) {
        var index;
        if (key) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == item[key]) index = i;
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == item) index = i;
            }
        }
        return arr.splice(index, 1);
    }
    //获取随机字符传
    strConstructor(){
        let str = new Date().getTime();
        return str += "pss"
    }
    //根据元素值找出数组某一项，并返回序号 其中，key代表唯一标识属性
    findItem(arr, item, key) {
        var index = -1;
        if (key) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == item[key]) index = i;
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == item) index = i;
            }
        }
        return index;
    }
    //数组去重 返回数组为原地址 --- 不支持 1 “1”去重
    fliterItem(arr, key) {
        let obj = {}
        if (key) {
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i][key]]) {
                    obj[arr[i][key]] = true;
                } else {
                    arr.splice(i, 1);
                    i--
                }
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    obj[arr[i]] = true;
                } else {
                    arr.splice(i, 1);
                    i--
                }
            }
        }
    }
    listToTree(list) {
        let result = []
        if (!Array.isArray(list)) {
            console.log('数据处理: 参数错误');
            return;
        }
        list.map((item, index) => {
            if (item.parentId == 0) {
                result.push(item)
            }
        })
        result.map((item, index) => {
            if (!item.children || Array.isArray(item.children)) {
                item.children = []
            }
            list.map(i => {
                if (i.parentId != 0 && i.parentId == item.id) {
                    item.children.push(i)
                }
            })
        })
        return result
    }
    getStorage(key) {
        let data = localStorage.getItem(key);
        return data
    }
    setStorage(key, data) {
        localStorage.setItem(key, data);
    }
    removeStorageItem(key) {
        localStorage.removeItem(key);
    }
    parseTime(time, cFormat) {
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
            }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    }
    formatTime(time, option) {
        time = +time * 1000
        const d = new Date(time)
        const now = Date.now()

        const diff = (now - d) / 1000

        if (diff < 30) {
            return '刚刚'
        } else if (diff < 3600) {
            // less 1 hour
            return Math.ceil(diff / 60) + '分钟前'
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + '小时前'
        } else if (diff < 3600 * 24 * 2) {
            return '1天前'
        }
        if (option) {
            return parseTime(time, option)
        } else {
            return (
                d.getMonth() +
                1 +
                '月' +
                d.getDate() +
                '日' +
                d.getHours() +
                '时' +
                d.getMinutes() +
                '分'
            )
        }
    }
    formatDate(date, dateFormat = 'yyyy-MM-dd') {
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        const monthNamesShort = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        const dayNamesShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        date = new Date(date)
        const year = date.getFullYear()
        const month = date.getMonth()
        const month1 = month + 1
        const day = date.getDate()
        const weekDay = date.getDay()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        return dateFormat
            .replace(/yyyy/g, year)
            .replace(/yy/g, (year + '').substring(2))
            .replace(/MM/g, month1 < 10 ? '0' + month1 : month1)
            .replace(/M/g, month1)
            .replace(/NN/g, monthNames[month])
            .replace(/N/g, monthNamesShort[month])
            .replace(/dd/g, day < 10 ? '0' + day : day)
            .replace(/d/g, day)
            .replace(/DD/g, dayNames[weekDay])
            .replace(/D/g, dayNamesShort[weekDay])
            .replace(/HH/g, hour)
            .replace(/mm/g, minute)
            .replace(/ss/g, second)
    }
    // 计算 返回日期
    getDay( num){
        let date = +new Date();
        let newDate = new Date(date + (+num) * 24 * 3600 * 1000);
        return newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
    }

    // 计算 返回 几日后的日期 yyyy-MM-dd
    getDiffDate(num) {
        let t = new Date();
        t.setDate(t.getDate() + num);
        return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
    }

    //判断一个字符串是否未数字和字母的组合
    checkBarcode(nubmer) {
        var re = /^[0-9a-zA-Z]*$/; //判断字符串是否为数字和字母组合
        if (!re.test(nubmer)) {
            return false;
        } else {
            return true;
        }
    }
}

// request interceptor


export default utils
