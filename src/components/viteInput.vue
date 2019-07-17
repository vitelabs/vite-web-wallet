<template>
    <div class="input-wrapper">
        <slot name="before"></slot>
        <!-- Safari autocomplete -->
        <input fake_pass type="password" style="display: none"/>
        <!-- type = number :  can not test 1.....  not a good idea-->
        <input v-model="value" @input.prevent="update" :type="type" :disabled="disabled"
               :placeholder="placeholder" autocomplete="false" step="0.00000001"
               @blur="_blur" @focus="_focus"/>
        <slot name="after"></slot>
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
        },
        type: {
            type: String,
            default: 'text'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        _value: {
            type: String,
            default: ''
        },
        _delay: {
            type: Number,
            default: 500
        }
    },
    destroyed() {
        this.clear();
    },
    data() {
        return {
            valueTimeout: null,
            value: this._value
        };
    },
    model: { prop: '_value' },
    watch: {
        _value: function () {
            this.value = this._value;
        },
        value: function () {
            this.clear();
            this.valueTimeout = setTimeout(() => {
                this.clear();
                this.valid();
            }, this._delay);
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
    border: 1px solid #d4dee7;
    border-radius: 2px;
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;

    input {
        flex: 1;
        width: 100%;
        font-size: 12px;
        text-indent: 15px;
    }
}
</style>
