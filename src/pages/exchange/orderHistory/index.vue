<template>
  <div class="order-history-ct">
    <Filters></Filters>
    <Table></Table>
  </div>
</template>
<script>
import Filters from "./filters";
import Table from "./table";
export default {
  components: {
    Filters,
    Table
  }
};
</script>
<style lang="scss" scoped>
.order-history-ct {
  height: 100%;
  overflow: hidden;
  padding: 20px 10px 10px;
}
</style>
