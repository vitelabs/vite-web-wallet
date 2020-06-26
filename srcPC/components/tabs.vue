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
        }
    }
};
</script>

<style lang="scss" scoped>
.tabs {
    border-radius: 4px;
    @include box_shadow();
    &__header {
        width: 100%;
        height: 28px;
        background: rgba(243,245,249,1);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding-top: 4px;
    }
    &__header-item {
        border-radius: 4px 4px 0 0;
        &--active {
            background-color: white;
        }
        a {
            height: 100%;
            width: 100%;
            font-size: 13px;
            font-family: PingFangSC-Semibold,PingFang SC;
            font-weight: 600;
            color: rgba(29,32,36,0.6);
            line-height: 17px;
            padding-left: 6px;
            padding-right: 6px;
        }
    }
    &__content {

    }
}
</style>
