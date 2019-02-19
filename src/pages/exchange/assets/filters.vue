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
            fromDate: '',
            toDate: '',
            tradeType: 1
        };
    },
    methods: {
        submit() {
            this.$emit('submit');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "assets/scss/vars.scss";
.filter-root {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  .filter {
    height: 40px;
    &:first-child {
      width: 400px;
      input {
        width: 100%;
        height: 100%;
      }
    }
    &:last-child {
      margin-left: 18px;
      input{
          margin-right: 10px;
      }
      width: 140px;
      display: flex;
      align-items: center;
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
