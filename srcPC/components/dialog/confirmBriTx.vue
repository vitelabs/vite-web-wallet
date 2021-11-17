<template lang="pug">
extends /components/dialog/base.pug
block head
    .bri-trans__head {{ amount+" VITE"}}
block content
    div
        .bri-trans
            .bri-trans__card
                .card__title from
                .card__text {{networkPair.from.name}}
                img.card__icon(:src="networkPair.to.icon")
            .bri-trans__icon
            .bri-trans__card
                .card__title TO
                .card__text {{networkPair.to.name}}
                img.card__icon(:src="networkPair.to.icon")
        .content-container
            .content__item
                .label Assets:
                div
                    img.icon(:src="tokenIcon")
                    .text {{tokenSymbol}}        
            .content__item
                .label Destination:
                div {{toAddress}}
            .content__item
                .label NetWorkFee:
                div {{fee}}
            .content__item
                .label You Will Receive:
                div {{estimateAmount}}
</template>
<script>
export default {
    props:[
        'networkPair','tokenSymbol','tokenIcon','toAddress','fee','amount','estimateAmount'
    ],
    data() {
        return { dTitle: 'Confirm', dSTxt: 'Confirm' };
    },
    beforeMount() {},
    computed: {},
    methods: {
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
    &__head {
        @include bg_color_custom(#d4dee7, $black-color-4);
        display: flex;
        justify-content: center;
        font-size: 40px;
        padding: 30px 0;
    }
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
    .content-container{
        .content-item{
            height:40px;
            display:flex;
            align-items:center;
            .label{
            @include font_color_2();
            margin-right:10px;
            }

        }
    }
}
</style>
