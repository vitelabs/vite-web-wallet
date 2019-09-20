<template lang="pug">
extends /components/dialog/base.pug
block head
    .head {{$t('assets.vb.confirm.tips')}}
block content
    img.block-ctx(src="~assets/imgs/vb_confirm.png")
</template>

<script>
export default {
    data() {
        return { dShowClose: false, dTitle: this.$t('assets.vb.title'), dSTxt: this.$t('assets.vb.closeAlert') };
    },
    methods: {
        inspector() {
            return Promise.resolve();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.head {
    border-bottom: 1px solid #d4dee7;
    box-sizing: border-box;
    padding: 23px;
    display: flex;
    background: rgba(0, 122, 255, 0.05);
    color: #1D2024;
    font-size: 16px;
}
.block-ctx {
    height: 138px;
    width: 140px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
}
</style>

