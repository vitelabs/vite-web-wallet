<template>
    <div class="bridge-container">
        <page-layout>
            <div class="bridge-wrapper">
                <router-view></router-view>
            </div>
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
.bridge-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
