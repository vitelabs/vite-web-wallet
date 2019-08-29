<template>
    <div class="tb">
        <slot v-show="list && list.length"></slot>
        <no-data v-show="!list || !list.length"></no-data>
    </div>
</template>

<script>
import noData from 'h5Components/noData';

export default {
    components: { noData },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
