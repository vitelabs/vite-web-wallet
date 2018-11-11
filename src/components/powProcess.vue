<template>
    <div class="pow-process-wrapper">
        <div class="pow">{{ $t('pow') }}</div>
        <div class="loading-wrapper __pointer">
            <loading></loading>
            <div class="process-num">{{ processNum + '%' }}</div>
        </div>
        <div v-show="isShowCancel" @click="_cancel" class="btn __pointer">{{ $t('btn.cancel') }}</div>
    </div>
</template>

<script>
import loading from "components/loading";
let processTimeout;

export default {
  components: {
    loading
  },
  props: {
    cancel: {
      type: Function,
      default: () => {}
    },
    isShowCancel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      processNum: 0
    };
  },
  mounted() {
    let addProcessNum = () => {
      this.clearProcessTimeout();
      if (this.processNum >= 99) {
        return;
      }
      this.processNum++;

      processTimeout = window.setTimeout(() => {
        addProcessNum();
      }, 600);
    };
    addProcessNum();
  },
  destroyed() {
    this.clearProcessTimeout();
  },
  methods: {
    clearProcessTimeout() {
      window.clearTimeout(processTimeout);
      processTimeout = null;
    },
    gotoFinish() {
      this.clearProcessTimeout();
      this.processNum = 100;
    },
    _cancel() {
      this.clearProcessTimeout();
      this.cancel();
    },
    startPowTx({ toAddr, amount,difficulty }, type, cb) {
    //   this.showConfirm("pow"); ???

      this.activeAccount
        .getBlock(
          {
            tokenId: this.tokenInfo.tokenId,
            toAddr,
            amount,
            difficulty
          },
          type,
          true
        )
        .then(block => {
          this.stopPow(() => {
            this.activeAccount
              .sendRawTx(block)
              .then(() => {
                cb && cb(true);
              })
              .catch(() => {
                cb && cb(false);
              });
          });
        })
        .catch(() => {
        this.$emit("pow-finsish")
          cb && cb(false);
        });
    },
    stopPow(cb) {
      this.gotoFinish();
      setTimeout(() => {
        this.$emit('pow-finish')
        cb && cb();
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.pow-process-wrapper {
  font-family: $font-bold, arial, sans-serif;
  width: 90%;
  max-width: 460px;
  padding: 50px 0 40px;
  background-image: linear-gradient(148deg, #052ef5 0%, #0bb6eb 100%);
  box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
  border-radius: 2px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .pow {
    text-align: center;
    font-size: 24px;
    color: #ffffff;
    margin-bottom: 36px;
  }
  .btn {
    position: relative;
    width: 180px;
    height: 44px;
    line-height: 44px;
    border: 2px solid #ffffff;
    border-radius: 2px;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    margin-top: 36px;
    left: 50%;
    margin-left: -90px;
  }
}

.loading-wrapper {
  position: relative;
  left: 50%;
  width: 170px;
  height: 170px;
  margin-left: -85px;
  background: #ffffff;
  border: 1px solid #f6f5f5;
  box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
  border-radius: 68px;
  .process-num {
    font-size: 32px;
    color: #000a12;
    text-align: center;
    line-height: 170px;
  }
}
</style>
