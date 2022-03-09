<template>
    <transition name="move" mode="out-in">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>

<script>
    export default {
        data(){
            return {
            }
        }
    }
</script>
<style scoped>
.content {
    position: absolute;
    top: 70px;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f7f7f7;
    padding: 10px;
}
</style>
