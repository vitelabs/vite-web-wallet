<template>
    <div class="bridge-container">
        <page-layout>
                <router-view></router-view>
        </page-layout>
    </div>
</template>

<script>
import pageLayout from 'pcComponents/pageLayout/index';

export default {
    components: { pageLayout },
    mounted() {},
    computed: {},
    watch: {}
};
</script>

<style lang="scss" scoped>
.bridge-container {
    width: 100%;
    height: 100%;
}
</style>
