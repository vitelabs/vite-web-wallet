<template>
    <sec-title :showHelp="showHelp"></sec-title>
</template>

<script>
import secTitle from 'components/secTitle';

export default {
    components: { secTitle },
    methods: {
        showHelp() {
            this.$confirm({
                title: this.$t('walletQuota.help.title'),
                singleBtn: true,
                closeBtn: { show: false },
                leftBtn: { text: this.$t('btn.understand') },
                content: `<div class="help-t">${ this.$t('walletQuota.confirm.help.t1') }</div>
                        <div class="help-txt">${ this.$t('walletQuota.confirm.help.txt1') }</div>
                        <div class="help-t">${ this.$t('walletQuota.confirm.help.t2') }</div>
                        <div class="help-txt">${ this.$t('walletQuota.confirm.help.txt2') }</div>
                        <div class="help-t">${ this.$t('walletQuota.confirm.help.t3') }</div>
                        <div class="help-txt">${ this.$t('walletQuota.confirm.help.txt3') }</div>`
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.quota-head-wrapper {
    font-size: 24px;
    color: #1d2024;

    .title {
        font-family: $font-bold, arial, sans-serif;
    }
}

.qa {
    float: right;
    font-size: 14px;
    color: #007aff;
    letter-spacing: 0.35px;
    line-height: 32px;

    img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-bottom: -4px;
    }
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";

.help-t {
    font-family: $font-bold, arial, sans-serif;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 16px;
    word-break: break-all;
}

.help-txt {
    opacity: 0.66;
    font-size: 14px;
    color: #172c39;
    line-height: 22px;
    margin-bottom: 10px;
    word-break: break-all;
}
</style>
