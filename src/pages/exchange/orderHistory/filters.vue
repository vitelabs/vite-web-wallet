/**  vite-wallet login */

<template>
    <div class="filter-root">
        <div class="filter">
            <div class="filter_label">起始日期</div>
            <FlatPickr
                v-model="fromDate"
                class="filter_content"
            ></FlatPickr>
        </div>
        <div class="separator">-</div>
        <div class="filter end">
            <div class="filter_label">终止日期</div>
            <FlatPickr
                v-model="toDate"
                class="filter_content"
            ></FlatPickr>
        </div>
        <div class="filter">
            <div class="filter_label">币种</div>
            <input class="filter_content" />
        </div>
        <div class="separator">-</div>
        <div class="filter end">
            <select class="filter_content">
                <option value="vite">vite</option>
                <option value="eth">eth</option>
                <option value="btc">btc</option>
            </select>
        </div>
        <div class="filter end">
            <div class="filter_label">方向</div>
            <select
                v-model="tradeType"
                class="filter_content"
            >
                <option value="1">买</option>
                <option value="-1">卖</option>
            </select>
        </div>
        <div @click="submit" class="search">搜索</div>
    </div>
</template>

<script>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    data() {
        return {
            fromDate: '',
            toDate: '',
            tradeType: 1
        };
    },
    components: {
        FlatPickr
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
  .separator {
    height: 30px;
    margin: 0 8px;
    display: flex;
  }
  .filter_label {
    color: #24272b;
    font: $font-bold;
  }
  .filter_content {
    margin-top: 6px;
    height: 30px;
    background: #fff;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    box-sizing: border-box;
  }
  .search {
    width: 60px;
    height: 30px;
    color: #007aff;
    border-radius: 2px;
    border:1px solid #007aff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    &:active {
      background: rgba(0, 122, 255, 1);
      color: #fff;
    }
  }
}
</style>
