<template>
  <div class="ex_tb">
    <div class="head-row">
      <div
        v-for="(h,i) in $t('exchangeOrderHistory.table.heads')"
        :key="h"
      >{{h.replace("#tokenSymbol#","vite")}} <div
          class="sort-btn"
          @click="sortBy(i)"
        ></div>
      </div>

    </div>
    <div class="row-container">
    <div
      class="row"
      v-for="l in sortedList"
      :key="l[0]"
    >
      <div
        v-for="c in l"
        :key="c"
      >{{c}}</div>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [
        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ],        [
          Date.now(),
          "adsfsad",
          "adfds",
          "lkklklklk",
          "ikilljn",
          "xzvgfbd",
          "dsafc",
          "ikilljn",
          "xzvgfbd",
          "dsafc"
        ]
      ]
    }
  },
  data() {
    return {
      sortIndex: 0,
      sortType: 1
    };
  },
  methods: {
    sortBy(i) {
      if (i === this.sortIndex) {
        this.sortType *= -1;
        return;
      }
      this.sortIndex = i;
    }
  },
  computed: {
    sortedList() {
      return this.list.sort((a, b) => {
        return this.sortType * (a[this.sortIndex] - b[this.sortIndex]);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb{
    margin:20px 10px 10px;
    padding-bottom: 10px;
}
@include rowWith {
  width: 8%;
  &:first-child,
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    width: 15%;
  }
}
</style>
