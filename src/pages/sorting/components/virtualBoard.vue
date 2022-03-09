<template>
    <div class="virtual-board">
        <div>
            <div class="virtual-board-item" @click="tapBoard('7')">7</div>
            <div class="virtual-board-item" @click="tapBoard('8')">8</div>
            <div class="virtual-board-item" @click="tapBoard('9')">9</div>
            <div class="width2x virtual-board-item" @click="clickPlus('20')">20</div>
        </div>
        <div>
            <div class="virtual-board-item" @click="tapBoard('4')">4</div>
            <div class="virtual-board-item" @click="tapBoard('5')">5</div>
            <div class="virtual-board-item" @click="tapBoard('6')">6</div>
            <div class="width2x virtual-board-item" @click="clickPlus('50')">50</div>
        </div>
        <div>
            <div class="virtual-board-item" @click="tapBoard('1')">1</div>
            <div class="virtual-board-item" @click="tapBoard('2')">2</div>
            <div class="virtual-board-item" @click="tapBoard('3')">3</div>
            <div class="width2x virtual-board-item" @click="clickPlus('100')">100</div>
        </div>
        <div>
            <div class="virtual-board-item" @click="tapBoard('C')">C</div>
            <div class="virtual-board-item" @click="tapBoard('0')">0</div>
            <div class="virtual-board-item" @click="tapBoard('.')">.</div>
            <div class="width2x virtual-board-item" @click="tapBoard('back')">
                <i class="el-icon-hh-backdelete"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
            default: 0.00
        },
        disabled: Boolean,
    },
    data() {
        return {
            number: "",
        }
    },
    created() {
        this.number = this.value + ''
    },
    mounted() {

    },
    computed: {
        result: function() {
            let num = +this.number
            return num.toFixed(2)
        },
        float: function() {
            this.number = this.number + ''
            return this.number.indexOf('.') > 0
        },
    },
    methods: {
        tapBoard(char) {
            if (char == 'C') {
                this.number = ''
                this.changeResult()
                return;
            }
            if (char == 'back') {
                this.number = this.number.slice(0, -1)
                this.changeResult()
                return;
            }
            if (this.float) {
                let decimal = this.number.split('.')[1]
                if (decimal.length >= 2) return
            }
            if (char == '.') {
                if (this.float) return;
            }
            this.number += char
            this.changeResult()
        },
        clickPlus(num) {
            let a = +num
            let b = +this.number
            let result = a + b
            this.number = result.toString()
            this.changeResult()
        },
        changeResult() {
            this.$emit('change', this.number)
        },
        confirm() {
            if (this.disabled) return
            this.$emit('confirm')
        },
        reset() {
            this.number = ''
        }
    },
}
</script>

<style scoped>
.virtual-board {
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-radius: 5px;
    width: 100%;
}
.virtual-board>div {
    display: flex;
    justify-content: center;
}
.virtual-board-item {
    flex: 0 0 20%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid #999;
    font-size: 30px;
    margin: 1% 3%;
    border-radius: 10px;
    box-sizing: border-box;
}
.virtual-board-item:active {
    background: #e7e7e7;
}
.width2x {
    flex: 0 0 20%;
    border-radius: 10px;
}
.submit-btn-wrap {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.submit-btn {
    flex: 1;
    max-width: 370px;
    padding: 15px;
    border-radius: 50px;
    background: #409EFF;
    color: #fff;
    text-align: center;
    box-sizing: border-box;
}
.submit-btn:active {
    background: #3a8ee6;
    border-color: #3a8ee6;
    outline: none;
}
.submit-btn.disabled {
    background-color: #a0cfff;
    border-color: #a0cfff;
}
.submit-btn.disabled:active {
    background-color: #a0cfff;
    border-color: #a0cfff;
}
</style>
