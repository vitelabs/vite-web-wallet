<template>
  <div class="ex_tb">
    <div class="head-row">
      <div
        v-for="(h) in $t('exchangeOpenOrders.table.heads')"
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
      <div @click="cancel" class="click-able">{{$t("exchangeOpenOrders.table.rowMap.cancel")}}</div>
    </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ],[
          Date.now().toString(),
          "ABC/VITE",
          "1",
          "1.2432222",
          "50.00000",
          "23.99%",
          "1.22"
        ]]
    }
  },
  data() {
    return {
      sortIndex: 0,
      sortType: 1
    };
  },
  methods: {
  },
  computed: {
  }
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb{
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
