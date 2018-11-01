<template>
    <div class="sec-title-container"><span>{{$(title)}}</span><span class="help"><i class="vote-icon"></i><span @click="showHelp">{{ $t(helpTitle) }}</span></span></div>
</template>
<script>
export default {
  props: {
    title: {
      default: ()=>`${this.router.name}.title`
    },
    helpTitle: {
      default: ()=>`${this.router.name}.help.title`
    },
    helpText: {
      default: ()=>`${this.router.name}.help.text`
    }
  },
  methods: {
    showHelp() {
      this.$alert(this.helpText);
    }
  }
};
</script>
<style lang="scss" scoped>
.sec-title-container {
  display: flex;
  justify-content: space-between;
  margin: 40px;
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #1d2024;
  line-height: 32px;
  .help {
    font-family: PingFang-SC-Regular;
    font-size: 14px;
    color: #007aff;
    letter-spacing: 0.35px;
    text-align: right;
    line-height: 20px;
  }
}
</style>
