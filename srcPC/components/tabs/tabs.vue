<template>
    <div class="tabs">
        <div class="tabs__header">
            <div class="tabs__header-item" v-for="tab in tabs" :class="{ 'tabs__header-item--active': tab.isActive }" :key="tab.name">
                <a href="javascript:void(0);" @click="selectTab(tab)">{{ tab.name }}</a>
            </div>
        </div>

        <div class="tabs__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { tabs: [] };
    },
    created() {
        this.tabs = this.$children;
    },
    methods: {
        selectTab(selectedTab) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.name === selectedTab.name);
            });
            this.$emit('change', selectedTab);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./sbp.scss";
</style>
