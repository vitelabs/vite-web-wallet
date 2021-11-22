<template lang="pug">
extends /components/dialog/base.pug
block content
    .col
        .trans-icon
          img(:src="rightCircle")
          .line
          .circle
        .row
            .card
                img.net-icon(:src='networkPair.from.icon')
                .confirm-info
                    .trans-info
                        .amount {{amount+tokenInfo.token}} 
                        .tx-hash {{tx.fromHash?tx.fromHash:'pending'}}
                    .confirms Confirms({{(tx.confirms||0)+'/'+(tx.totalConfirms||0)}})
            .card
                img.net-icon(:src='networkPair.from.icon')
                .confirm-info
                    .trans-info
                        .amount {{amount+tokenInfo.token}} 
                        .tx-hash {{tx.toHash?tx.toHash:'pending'}}
                    .confirms To {{tx.toAddress}} 
</template>
<script>
// {
// 	id:string,
// 	idx:number,
// 	amount:string,
// 	toAddress:string,
// 	fromHash:string,
// 	fromHashConfirmationNums: number,
// 	toHash: string,
// 	toHashConfirmationNums: number
// }
import rightCircle from "assets/imgs/crossBridge/right.png";
export default {
  props: ["networkPair", "tokenInfo", "transInfo"],
  data() {
    return { dTitle: "Confirm",  tx: {}, rightCircle,ShowBottom:false };
  },
  beforeMount() {},
  computed: {},
  methods: {
    inspector() {
      return submitCb();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.col {
  display: flex;
  align-items: center;
  .trans-icon {
    height: 142px;
    width: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 30px;
    img {
      height: 20px;
      width: 20px;
    }
    .line {
      flex-grow: 1;
      width: 2px;
      background-color: rgba($blue-color-1, 0.45);
    }
    .circle {
      height: 18px;
      width: 18px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 3px solid rgba($blue-color-1, 0.45);
    }
  }
  .row {
    display: flex;
    flex-direction: column;

    .card {
      display: flex;
      padding: 15px;
      height: 100px;
      width: 408px;
      box-sizing: border-box;
      &:not(:first-child) {
        margin-top: 30px;
      }
      @include box_shadow();
      .net-icon {
        height: 40px;
        width: 40px;
        flex-shrink: 0;
        border-radius: 50%;
        margin-right: 15px;
      }

      .confirm-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        .trans-info {
          display: flex;
          flex-direction: column;
          .amount {
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
</style>
