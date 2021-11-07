<template lang="pug">
extends /components/dialog/base.pug
block head
    .head {{ "ZHEHSI HEADER"}}
block content
    div
        .bri-trans
            .bri-trans__card
                .card__title from
                .card__text {{'vite'}}
                .card__icon
            .bri-trans__icon
            .bri-trans__card
                .card__title TO
                .card__text {{'ETH'}}
                .card__icon
        .tab-content
            .content__item
                .label sdfsdfa:
                div.click-able sdf
            .content__item
                .label sdfasdf:
                div.click-able sdfa
            </template>
<script>
export default {
    data() {
        return { dTitle: 'Confirm', dSTxt: 'Confirm' };
    },
    beforeMount() {},
    computed: {},
    methods: {
        inspector() {
            return Promise.resolve();
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
.bri-trans {
    width: 460px;
    height: 130px;
    position: relative;
    @include bg_color_2();
    box-sizing: border-box;
    @include common_font_color();
    border-radius: 2px;
    box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
    padding: 20px 28px;
    @include common_border();
    display: flex;
    justify-content: space-between;
    .br-trans__card {
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
        @include box_shadow();
        .card__title {
            display: flex;
            justify-content: space-between;
        }
        .card__text {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .card__icon {
            margin-top: 20px;
            height: 35px;
        }
    }
}
</style>
