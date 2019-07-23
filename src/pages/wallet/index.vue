<template>
    <page-layout>
        <div class="wallet-wrapper">
            <router-view></router-view>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';

export default { components: { pageLayout } };
</script>

<style lang="scss" scoped>
.wallet-wrapper {
    width: 100%;
    height: 100%;
}
</style>

