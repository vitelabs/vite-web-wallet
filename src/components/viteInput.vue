<template>
    <div class="input-wrapper">
        <slot name="before"></slot>
        <!-- Safari autocomplete -->
        <input fake_pass type="password" style="display:none;"/>
        <input v-model="value" @input.prevent="update" type="text"
               :placeholder="placeholder" autocomplete="false"
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
