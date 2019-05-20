<template>
    <div class="search" @click="$refs.i.focus()">
        <i class="icon"></i>
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
    height: 40px;
    width: 397px;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #d4dee7;
    display: flex;

    .icon {
        display: inline-block;
        background: url(~assets/imgs/search.svg);
        width: 16px;
        height: 16px;
    }

    input {
        flex: 1;
    }
}
</style>
