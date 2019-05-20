<template>
    <span @click="gotoNet" class="other-prod __pointer">{{ $t('btn.otherProd') }}</span>
</template>

<script>
export default {
    methods: {
        gotoNet() {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`https://vite.net/${ locale }`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.other-prod {
    display: inline-block;
    border-radius: 2px;
    border: 1px solid rgba(0, 122, 255, 0.7);
    padding: 6px 10px;
    font-family: $font-bold, arial, sans-serif;
    font-size: 14px;
    color: #007aff;
    line-height: 16px;
}
</style>
