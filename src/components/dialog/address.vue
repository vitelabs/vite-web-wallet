<template>
    <div class="address-title">
        <span>{{ title }}</span>
        <img
            src="../assets/imgs/copy_default.svg"
            @click="copy"
            class="title_icon copy __pointer"
        />
        <copy ref="copyDom" :copySuccess="copySuccess"></copy>
    </div>
</template>

<script>
import qrcode from 'components/qrcode';
import copy from 'components/copy';

export default {
    components: { qrcode, copy },
    props: {
        title: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        }
    },
    methods: {
        copy() {
            this.$refs.copyDom.copy(this.address);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.address-title {
    position: relative;
    display: block;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    letter-spacing: 0.35px;
    padding-bottom: 11px;
    font-family: $font-bold, arial, sans-serif;
}

.title_icon {
    float: right;
    &.copy {
        margin-right: 10px;
    }
}
</style>
