<template lang="pug">
extends /components/dialog/base.pug
block head
    .bri-trans__head {{ transInfo.amount+" VITE"}}
block content
    div
        .bri-trans
            .bri-trans__card
                .card__title from
                .card__text {{networkPair.from.name}}
                img.card__icon(:src="networkPair.from.icon")
            .bri-trans__icon
            .bri-trans__card
                .card__title TO
                .card__text {{networkPair.to.name}}
                img.card__icon(:src="networkPair.to.icon")
        .content-container
            .content-item
                .label Assets:
                .accets-container
                    img.icon(:src="tokenInfo.icon")
                    .text {{tokenInfo.token}}        
            .content-item
                .label Destination:
                div {{transInfo.toAddress}}
            .content-item
                .label NetWorkFee:
                div {{transInfo.fee}}
            .content-item
                .label You Will Receive:
                .accets-container
                  img.icon(:src="tokenInfo.icon")
                  .text {{transInfo.estimateAmount}}   
        .tips The network fees and execution price depend on the market condition, you may get a different rate when the transaction is complete.
        .term 
          checkbox(class='term-checkbox' v-model='accepted')
          div 
            | I have read and agree to the
            span.link Terms of Use
</template>
<script>
import checkbox from "uiKit/checkbox.vue";
export default {
  components: { checkbox },
  name: "confirmBriTx",
  props: ["networkPair", "tokenInfo", "transInfo"],
  data() {
    return { dTitle: "Confirm", dSTxt: "Confirm", accepted: false };
  },
  beforeMount() {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
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
