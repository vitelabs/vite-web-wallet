<template>
  <div class="ex_tb">
    <div class="head-row">
      <div
        v-for="(h) in $t('exchangeAssets.table.heads')"
        :key="h"
      >{{h.replace("#tokenSymbol#","vite")}}
      </div>
      <div></div>
    </div>
    <div class="row-container">
      <div
        class="row"
        v-for="l in list"
        :key="l[0]"
      >
        <div
          v-for="c in l"
          :key="c"
        >{{c}}</div>
        <div
          @click="recharge(l[0])"
          class="click-able"
        >{{$t("exchangeAssets.table.rowMap.recharge")}}</div>
        <div
          @click="withdraw(l[0])"
          class="click-able"
        >{{$t("exchangeAssets.table.rowMap.withdraw")}}</div>
        <div
          @click="detail(l[0])"
          class="click-able"
        >{{$t("exchangeAssets.table.rowMap.detail")}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import confirm from "components/confirm";
export default {
  props: {
    list: {
      type: Array,
      default: () => [["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"],["vite", "1.2432222", "50.00000", "200", "1.22"]]
    }
  },
  data() {
    return {
      sortIndex: 0,
      sortType: 1
    };
  },
  methods: {
    withdraw(token) {},
    recharge(token) {},
    detail(token) {}
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb {
  height: 100%;
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
