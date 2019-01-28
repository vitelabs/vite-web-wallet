<template>
  <div class="assets-ct">
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
  },

};
</script>
<style lang="scss" scoped>
.assets-ct {
  height: 100%;
  overflow: hidden;
  padding: 20px 10px 10px;
}
</style>
