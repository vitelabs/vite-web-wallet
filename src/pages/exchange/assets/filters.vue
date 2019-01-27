/**  vite-wallet login */

<template>
  <div class="filter-root">
    <div class="filter"><input type="text"></div>
    <div class="filter"><input type="checkbox">隐藏0元代币</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fromDate: "",
      toDate: "",
      tradeType: 1
    };
  },
  methods: {
    submit() {
      this.$emit("submit");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "assets/scss/vars.scss";
.filter-root {
  display: flex;
  align-items: flex-end;
  margin: 28px 10px 0px;
  .filter {
    width: 140px;
    > * {
      width: 100%;
    }
    input,
    select {
      color: #5e6875;
      padding-left: 10px;
      font-size: 14px;
    }
    &:first-child,
    &:nth-child(3) {
      width: 180px;
    }
    &.end {
      margin-right: 18px;
    }
  }
  .filter_content {
    margin-top: 6px;
    height: 30px;
    background: #fff;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    box-sizing: border-box;
  }
}
</style>
