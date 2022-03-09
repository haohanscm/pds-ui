var goodsMixin = {
    data() {
        return {
            // currentStep: 0
        }
    },
    methods: {
        dispatchPrevStep() {
            this.$emit('prev', this.currentStep - 1 )
        },
        dispatchNextStep() {
            this.$emit('next', this.currentStep + 1)
        },
    }
}


export default goodsMixin
