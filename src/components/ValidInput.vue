<template>
    <div class="input-wrapper">
        <!-- Safari autocomplete -->
        <div class="errTips" v-show="errTips">{{errTips}}</div>
        <input fake_pass type="password" style="display:none;"/>
        <input v-model="value" @input.prevent="update" type="text"
               :placeholder="placeholder" autocomplete="false"
               @blur="_blur" @focus="_focus"/>

    </div>
</template>

<script>
import { debounce } from 'lodash';
export default {
    props: {
        valid: {
            type: Function,
            default: () => null
        },
        placeholder: {
            type: String,
            default: ''
        },
        _value: {
            type: String,
            default: ''
        }
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
        value: debounce(function (v) {
            this.errTips = this.valid(v);
        }, 500)
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
