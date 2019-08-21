<template>
    <div class="select-tab-wrapper">
        <span class="select-tab" :class="{'active': activeTab === tab}"
              v-for="(tab, i) in tabList" :key="i"
              @click="selectTab(tab)">{{ tab }}</span>
    </div>
</template>

<script>
export default {
    props: {
        tabList: {
            type: Array,
            default: () => []
        },
        defaultTab: {
            type: String,
            default: ''
        }
    },
    mounted() {
        if (!this.defaultTab) {
            this.selectTab(this.tabList[0]);
        }
    },
    data() {
        return { activeTab: '' };
    },
    methods: {
        selectTab(tab) {
            this.activeTab = tab;
            this.$emit('input', this.activeTab);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.select-tab-wrapper {
    display: inline-block;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
    font-size: 14px;
    @include font-bold();
    color: rgba(255,255,255,1);
    line-height: 18px;

    .select-tab {
        box-sizing: border-box;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 12px;
        color: $blue;
        border: 1px solid $blue;
        &.active {
            position: relative;
            top: -1px;
            border: none;
            background: $blue;
            color: #fff;
        }
    }
}
</style>
