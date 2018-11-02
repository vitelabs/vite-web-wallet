<template>
    <div class="search">
        <i class="icon"></i><input type="text" @change="updateKey" v-model="v">
    </div>
</template>
<script>
import throttle from "lodash/throttle";
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入候选节点名称或者出块地址"
    }
  },
  methods: {
    updateKey: throttle(() => {
      this.$emit("updateKey", this.v);
    }, 500)
  },
  data() {
    return {
      v: ""
    };
  }
};
</script>
<style lang="scss" scoped>
.search {
  cursor: pointer;
  height: 40px;
  width: 397px;
  padding: 10px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #d4dee7;
  .icon {
    display: inline-block;
    background: url(~assets/imgs/search.svg);
    width: 16px;
    height: 16px;
  }
  input {
  }
}
</style>
