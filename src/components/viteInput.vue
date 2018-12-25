<template>
    <div class="input-wrapper">
        <input v-model="value" @input.prevent="update" type="text"
               :placeholder="placeholder" autocomplete="off"
               @blur="_blur" @focus="_focus"/>
        <slot></slot>
    </div>
</template>

<script>

export default {
    props: {
        valid: {
            type: Function,
            default: () => {}
        },
        placeholder: {
            type: String,
            default: ''
        }
    },
    destroyed () {
        this.clear();
    },
    data() {
        return {
            valueTimeout: null,
            value: ''
        };
    },
    watch: {
        value: function() {
            this.clear();
            this.valueTimeout = setTimeout(()=> {
                this.clear();
                this.valid();
            }, 500);
        }
    },
    methods: {    
        update() {
            this.$emit('input', this.value);
        },
        _blur() {
            this.$emit('blur');
        },
        _focus() {
            this.$emit('focus');
        },
        clear() {
            this.valueTimeout && window.clearTimeout(this.valueTimeout);
            this.valueTimeout = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.input-wrapper {
    display: flex;
    width: 100%;
    border: 1px solid #D4DEE7;
    border-radius: 2px;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    input {
        flex: 1;
        width: 100%;
        font-size: 14px;
        text-indent: 15px;
    }
}
</style>
