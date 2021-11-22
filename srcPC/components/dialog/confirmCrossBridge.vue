<template lang="pug">
extends /components/dialog/base.pug
block head
    .bri-trans__head 
        div Transer {{tokenInfo.token}} form {{networkPair.from.desc}} to {{networkPair.to.desc}}，Submit a transation to the {{networkPair.from.desc}} via Vite Wallet
            .assets-container
                img.icon(:src="tokenInfo.icon")
                .text
                    .label Amount
                    .content {{`${transInfo.amount}  ${tokenInfo.token}`}}   
block originContent
      .custom-content 
        .bri-trans__label  You need to tranfer to the address provoded below：
        .bri-trans__content
            .title Address
            .address {{transInfo.toAddress}}
</template>
<script>
import checkbox from "uiKit/checkbox.vue";
export default {
  components: { checkbox },
  name: "ConfirmSubmitTx",
  props: ["networkPair", "tokenInfo", "transInfo"],
  data() {
    return {
      dTitle: "Confirm Submit transation",
      dSTxt: "Submit transation",
      accepted: false,
    };
  },
  beforeMount() {},
  computed: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.bri-trans {
  &__head {
    @include bg_color_custom(#d4dee7, $black-color-4);
    display: flex;
    justify-content: center;
    padding: 30px;
    font-size: 14px;
    line-height: 30px;
    .assets-container {
      display: flex;
      align-items: center;
      margin-top: 10px;
      line-height: 14px;
      height: 40px;
      img {
        height: 40px;
        width: 40px;
        margin-right: 10px;
      }
      .text {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        .label {
          @include font_color_2();
          font-size: 12px;
        }
      }
    }
  }
}
.custom-content {
  margin: 20px 30px;
  .bri-trans__label {
    font-size: 12px;
  }
  .bri-trans__content {
    font-size: 14px;
    box-sizing: border-box;
    height: 105px;
    width: 450px;
    margin-top: 20px;
    position: relative;
    @include bg_color_2();
    box-sizing: border-box;
    @include common_font_color();
    border-radius: 2px;
    // box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @include box_shadow();
    .title {
      @include font-family-bold();
    }
  }
}
</style>
