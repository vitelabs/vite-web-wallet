<template>
    <div class="tool-tips" v-html="content">
        <div class="trigle"></div>
    </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.tool-tips {
  position: absolute;
  display: flex;
  align-content: center;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  width: 314px;
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  .trigle {
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-right: 7px solid #fff;
    height: 0;
    width: 0;
  }
}
</style>
