<template>
    <page-layout>
        <div class="not-found">Not Found</div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';

export default { components: { pageLayout } };
</script>

<style lang="scss" scoped>
.not-found {
    width: 100%;
    text-align: center;
    font-size: 40px;
    margin-top: 200px;
}
</style>
