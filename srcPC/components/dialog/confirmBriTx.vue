<template lang="pug">
extends /components/dialog/base.pug
block head
  .bri-trans__head {{ transInfo.amount + ' ' + tokenInfo.token }}
block content
  div
    .bri-trans
      .bri-trans__card
        .card__title FROM
        .card__text {{ networkPair.from.desc }}
        img.card__icon(:src="networkPair.from.icon")
      .bri-trans__icon
      .bri-trans__card
        .card__title TO
        .card__text {{ networkPair.to.desc }}
        img.card__icon(:src="networkPair.to.icon")
    .content-container
      .content-item
        .label Assets:
        .accets-container
          img.icon(:src="tokenInfo.icon")
          .text {{ tokenInfo.token }}
      .content-item
        .label Destination:
        .toAddress(@click="addressClick") {{ transInfo.toAddress }}
      .content-item
        .label NetWork Fee:
        div {{ networkPair.from.fee.fixed }}
      .content-item
        .label You will receive:
        .accets-container
          img.icon(:src="tokenInfo.icon")
          .text {{ transInfo.estimateAmount }} {{ tokenInfo.token }}
    .tips The transaction fees are subject to network conditions and may change.
    .term
      checkbox.term-checkbox(v-model="accepted")
      div
        | I have read and agree to the&nbsp
        span.link Terms of Use.
</template>
<script>
import checkbox from 'uiKit/checkbox.vue';
import execCopy from 'utils/copy';
export default {
    components: { checkbox },
    name: 'confirmBriTx',
    props: [ 'networkPair', 'tokenInfo', 'transInfo' ],
    data() {
        return {
            dTitle: 'Transaction Confirm',
            dSTxt: 'Confirm',
            accepted: false
        };
    },
    beforeMount() {},
    computed: {
        btnUnuse() {
            return !this.accepted;
        }
    },
    methods: {
        addressClick() {
            execCopy(this.transInfo.toAddress);
            this.$toast(this.$t('hint.copy'));
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
    &__head {
        @include common_font_color();
        @include bg_color_custom(#d4dee7, $black-color-4);
        display: flex;
        justify-content: center;
        font-size: 40px;
        padding: 30px 0;
    }
    @include box_shadow();
    .bri-trans__card {
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;

        .card__title {
            display: flex;
            justify-content: space-between;
            @include font-family-bold();
        }
        .card__text {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            @include font_color_2();
            margin-top: 10px;
        }
        .card__icon {
            margin-top: 20px;
            height: 30px;
            width: 30px;
            margin-top: 12px;
        }
    }
}
.content-container {
    margin-top: 10px;
    .content-item {
        height: 40px;
        display: flex;
        align-items: center;
        .toAddress {
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
        .accets-container {
            display: flex;
            align-items: center;
            img {
                height: 24px;
                width: 24px;
                margin-right: 10px;
            }
        }

        .label {
            @include font_color_2();
            margin-right: 10px;
        }
    }
}
.tips {
    @include bg_color_tips();
    padding: 13px 15px;
    margin: 20px 0;
}
.term {
    display: flex;
    align-items: center;
    &-checkbox {
        margin-right: 6px;
    }
    .link {
        cursor: pointer;
        color: $blue-color-1;
    }
}
</style>
