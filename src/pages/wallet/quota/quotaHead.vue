<template>
    <div>
        <sec-title :showHelp="showHelp"></sec-title>
        <confirm v-show="isShowHelp" :showMask="true" :singleBtn="true"
                 :title="$t('walletQuota.help.title')" :closeIcon="true"
                 :close="close" :leftBtnTxt="$t('btn.understand')"
                 :leftBtnClick="close">
            <div class="help-t">{{ $t('walletQuota.confirm.help.t1') }}</div>
            <div class="help-txt">{{ $t('walletQuota.confirm.help.txt1') }}</div>
            <div class="help-t">{{ $t('walletQuota.confirm.help.t2') }}</div>
            <div class="help-txt">{{ $t('walletQuota.confirm.help.txt2') }}</div>
            <div class="help-t">{{ $t('walletQuota.confirm.help.t3') }}</div>
            <div class="help-txt">{{ $t('walletQuota.confirm.help.txt3') }}</div>
        </confirm>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import confirm from 'components/confirm/confirm.vue';

export default {
    components: { secTitle, confirm },
    data() {
        return { isShowHelp: false };
    },
    methods: {
        close() {
            this.isShowHelp = false;
        },
        showHelp() {
            this.isShowHelp = true;
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
        @include font-family-bold();
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

.help-t {
    @include font-family-bold();
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
