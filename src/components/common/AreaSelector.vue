<template>
    <el-cascader clearable :placeholder="placeholder" v-bind="$attrs"
        :options="provinceList" v-model="codeList" :props="props"
        @active-item-change="getAreas"
        @change="updateData"
    ></el-cascader>
</template>

<script>
    import request from "../../http/httpPublic.js"
    export default {
        props:{
            placeholder: {
                type: String,
                default: '请选择地址'
            },
            area: {
                // 区域code的数组
                type: Array,
                default: null
            }
        },
        data() {
            return {
                request: new request(),
                codeList: [],
                props: {
                    label: 'label',
                    value: 'value',
                    children: 'children'
                },
                provinceList: [],
            }
        },
        created(){
            this.getProvence().then(list => {
                this.provinceList = list
            })
            if (this.area.length > 0) {
                this.initData(this.area)
            }
        },
        methods:{
            // 初始化数据
            initData(area) {
                let province, city;
                let provinceCode = area[0]
                let cityCode = area[1]

                this.getProvence().then(list => {
                    this.provinceList = list
                    province = this.findAreaItem(this.provinceList, provinceCode)
                    this.getCities(province.value).then(list => {
                        this.$set(province, 'children', list)
                        city = this.findAreaItem(province.children, cityCode)
                        this.getRegions(city.value).then(list => {
                            this.$set(city, 'children', list)
                            this.codeList = this.area
                        })
                    })
                })
            },
            //获取省份列表
            getProvence(){
                return this.request.fetchAddress().then(res=>{
                    if(res.code == 200){
                        if (res.ext.length < 1) {
                            console.log('省份为空');
                            return;
                        }
                        let list = res.ext.map((item, index) => {
                            return {
                                label: item.name,
                                value: item.code,
                                children: []
                            }
                        })
                        return list
                    }
                })
            },
            //获取城市列表
            getAreas(areas){
                // console.log('areas', areas, areas.length);
                let province, city;

                if (areas.length == 1) {
                    province = this.findAreaItem(this.provinceList, areas[0])
                    this.getCities(province.value).then(list => {
                        this.$set(province, 'children', list)
                    })
                }

                if (areas.length == 2) {
                    province = this.findAreaItem(this.provinceList, areas[0])
                    city = this.findAreaItem(province.children, areas[1])
                    this.getRegions(city.value).then(list => {
                        this.$set(city, 'children', list)
                    })
                }
            },
            findAreaItem(list, code) {
                let result = list.find(item => {
                    return item.value == code
                })
                return result
            },
            //获取市区列表
            getCities(provinceCode){
                let params = {}
                params.provinceCode = provinceCode
                return this.request.fetchAddress(params).then(res=>{
                    if(res.code == 200){
                        if (res.ext.length < 1) {
                           console.log('市区为空');
                            return;
                        }
                        let list = res.ext.map((item, index) => {
                            return {
                                label: item.name,
                                value: item.code,
                                children: [],
                            }
                        })
                        return list
                    }
                })
            },
            //获取区县列表
            getRegions(cityCode){

                let params = {}
                params.cityCode = cityCode
                return this.request.fetchAddress(params).then(res=>{
                    if(res.code == 200){
                        if (res.ext.length < 1) {
                           console.log('区县为空');
                            return;
                        }
                        let list = res.ext.map((item, index) => {
                            return {
                                label: item.name,
                                value: item.code
                            }
                        })
                        return list
                    }
                })
            },
            updateData() {
                this.$emit('update:area', this.codeList)
                this.$emit('change')
            }
        }
    }

</script>
