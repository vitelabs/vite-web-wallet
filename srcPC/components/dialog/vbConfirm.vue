<template lang="pug">
extends /components/dialog/base.pug
block head
    .head {{$t('assets.vb.confirm.tips')}}
block content
    span.block-ctx
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
    box-sizing: border-box;
    padding: 23px;
    display: flex;
    background: rgba(0, 122, 255, 0.05);
    font-size: 16px;
    @include common_font_color();
    @include common_border_one(bottom);
}
.block-ctx {
    display: inline-block;
    height: 138px;
    width: 140px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    @include background_common_img('vb_confirm.png');
}
</style>

