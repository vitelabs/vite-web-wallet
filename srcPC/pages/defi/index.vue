<template>
    <page-layout>
        <div class="defi-wrapper">
            <router-view></router-view>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'pcComponents/pageLayout/index';

export default { components: { pageLayout } };
</script>

<style lang="scss" scoped>
.defi-wrapper {
    width: 100%;
    height: 100%;
}
</style>
