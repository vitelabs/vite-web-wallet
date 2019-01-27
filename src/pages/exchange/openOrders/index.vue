<template>
    <div class="open-order-ct">
        <Table></Table>
    </div>
</template>
<script>
import Table from "./table"
export default {
    components:{
        Table
    }
}
</script>
<style lang="scss" scoped>
.open-order-ct{
    height: 100%;
    overflow: hidden;
    padding:20px 10px 10px;
}
</style>
