<template>
    <div class="change-lang-wrapper">
        <div class="small-title bold">{{ $t('setting.lang') }}</div>
        <change-lang class="setting"></change-lang>
    </div>
</template>

<script>
import changeLang from '@pc/components/changeLang.vue';

export default { components: { changeLang } };
</script>

<style lang="scss" scoped>
@use "./setting.scss";
</style>
