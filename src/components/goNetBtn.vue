<template>
    <span @click="gotoNet" class="other-prod __pointer">{{ $t('btn.otherProd') }}</span>    
</template>

<script>
export default {
    methods: {
        gotoNet() {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`https://vite.net/${locale}`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.other-prod {
    display: inline-block;
    background: #EDF1FF;
    border-radius: 2px;
    padding: 6px 10px;
    font-family: $font-bold, arial, sans-serif;
    font-size: 14px;
    color: #007AFF;
    line-height: 16px;
}
</style>
