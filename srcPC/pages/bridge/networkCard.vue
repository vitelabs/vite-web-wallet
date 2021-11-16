<template>
  <div class="bri__network__card">
    <div class="network__title">
      <div class="content">{{ type }}</div>
      <div class="status">{{ status }}</div>
    </div>
    <div class="network__content">
      <vite-select
        @input="oninput"
        :options="['VITE', 'ETH']"
        :searchable="false"
        :clearable="false"
        :class="'net-selector'"
        :value="value"
      ></vite-select>
    </div>
    <img class="network__icon" :src="icon" />
  </div>
</template>
<script>
import downCircle from "assets/imgs/downCircle.svg.vue";
import viteSelect from "src/uiKit/viteSelect.vue";

export default {
  props: ["type", "status", "value", "icon"],
  components: { downCircle, viteSelect },
  methods: {
    oninput(val) {
      if (val === this.value) return;
      this.$emit("input", val);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcComponents/confirm/confirmRow.scss";
@import "~pc/styles/form.scss";
.bri__network__card {
  display: flex;
  flex-direction: column;
  width: 244px;
  height: 136px;
  @include common_border();
  border-radius: 2px;
  padding: 20px 12px;
  box-sizing: border-box;
  @include box_shadow();
  .network__title {
    display: flex;
    justify-content: space-between;
  }
  .network__content {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .network__icon {
    margin-top: 20px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
  }
  .net-selector {
    width: 100%;
    border: none;
    background: none;
    height: 16px;
    padding:0;
    *{
        padding: 0 !important;
    }
  }
}
</style>
