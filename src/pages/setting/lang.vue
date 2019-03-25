<template>
    <div class="change-lang-wrapper">
        <div class="title">{{ $t('setting.lang') }}</div>
        <change-lang class="setting"></change-lang>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';

export default { components: { changeLang } };
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.title {
    font-size: 14px;
    color: #1d2024;
    letter-spacing: 0.35px;
    font-family: $font-bold, arial, sans-serif;
    margin-bottom: 16px;
}
</style>
