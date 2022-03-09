<template>
    <div class="block" @dragover="allowDrop($event)">
        
        <div class="content" :draggable="true"  @dragstart="drag($event)" :style="{  top: value.y + 'px',left:value.x + 'px' }">
            <slot name="main"></slot>
        </div>
        </div>
</template>

<script>
    export default {
        data: function(){
            return {
                beginX: 0,
                beginY: 0,
                moveX: 0,
                moveY: 0,
                posiX: 500,
                posiY: 600
            }
        },
        props:{
            value:Object
        },
        watch:{
        watch:{
            value:{
                handler(newVal,oldVal){
                    this.fetchOfferList(newVal.id)
                },
                immediate: true
            }
        },
        },
        methods:{
            aa(){
            },
            allowDrop(e) {
                this.moveX = e.clientX - this.moveX;
                this.moveY = e.clientY - this.moveY;
                this.value.x += this.moveX;
                this.value.y += this.moveY;
                this.moveX = e.clientX;
                this.moveY = e.clientY;
            },
            drag(e) {
                this.moveX = e.clientX;
                this.moveY = e.clientY;
            },
            drop(){
            }
        }
    }
</script>

<style scoped lang="scss">
    .block{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 100;
        pointer-events: none;
        left: 0;
        top: 0;
        >.content{
            position: absolute;
            background-color: white;
            pointer-events: auto;
            border: 1px solid rgb(193, 193, 193)
        }
    }
</style>