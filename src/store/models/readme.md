# 说明

状态管理按模块划分,
每个模块包含state, mutations, action

state是初始化状态,
mutations是同步修改状态的方法, 其名称使用大写字母加下划线形式, 如: SET_TOKEN, SET_STATUS等, 可使用actions包装同步方法
action是异步修改状态的方法.

模块的示例代码:

```javascript

const modelName = {
    state: {

    },
    mutations: {

    },
    actions: {

    }
}

export default modelName
```
