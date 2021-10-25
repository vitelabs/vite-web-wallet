<template>
    <page-layout>
        <div class="bridge-wrapper">
            <router-view></router-view>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'pcComponents/pageLayout/index';

export default { components: { pageLayout } };
</script>

<style lang="scss" scoped>
@import "~pcPages/styles/~pcPages/styles/form.scss";
.bridge-wrapper {
    width: 100%;
    height: 100%;
    padding:20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
