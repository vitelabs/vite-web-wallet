<template>
    <div class="search" @click="$refs.i.focus()">
        <slot name="before">
            <i class="icon"></i>
        </slot>
        <!-- Safari autocomplete -->
        <input fake_pass type="password" style="display:none;"/>
        <input readonly onfocus="this.removeAttribute('readonly');"
               :placeholder="placeholder" name="search"
               autocomplete="off" ref="i" type="text"
               v-model="v" @input.prevent="updateKey">
        <input fake_pass type="password" style="display:none;"/>
    </div>
</template>

<script>
import throttle from 'lodash/throttle';
export default {
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        }
    },
    methods: {
        updateKey: throttle(function () {
            this.$emit('input', this.v);
        }, 500)
    },
    data() {
        return { v: '' };
    }
};
</script>

<style lang="scss" scoped>
.search {
    cursor: pointer;
    width: 397px;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    height: 34px;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);

    .icon {
        display: inline-block;
        background: url(~assets/imgs/search.svg);
        width: 16px;
        height: 16px;
        margin-right: 8px;
    }

    input {
        flex: 1;
    }
}
</style>
