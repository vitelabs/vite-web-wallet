<template>
    <span @click="gotoNet" class="other-prod __pointer">{{ $t('goViteX') }}</span>    
</template>

<script>
export default {
    methods: {
        gotoNet() {
            window.open('https://x-test.vite.net/');
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
    padding: 10px 20px;
    font-family: $font-bold, arial, sans-serif;
    font-size: 14px;
    color: #007AFF;
    line-height: 20px;
}
</style>


