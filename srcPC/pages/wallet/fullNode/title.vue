<template>
    <div>
        <sec-title :showHelp="showHelp"></sec-title>
        <confirm  class="small" v-show="isShowHelp" :showMask="true" :singleBtn="true"
                  :title="$t('walletFullNode.help.title')" :closeIcon="true"
                  :close="close" :leftBtnTxt="$t('btn.understand')"
                  :leftBtnClick="close">
            <div class="help-t">{{ $t('walletFullNode.help.t2') }}</div>
            <div class="help-t">{{ $t('walletFullNode.help.t3') }}</div>
            <div class="help-txt distance">{{ $t('walletFullNode.help.t1') }}</div>
            <div class="help-txt">{{ $t('walletFullNode.help.txt1') }}</div>
            <div class="help-txt">{{ $t('walletFullNode.help.txt2') }}</div>
            <div class="help-txt">{{ $t('walletFullNode.help.txt3') }}</div>
        </confirm>
    </div>
</template>

<script>
import secTitle from 'pcComponents/secTitle';
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

.help-t {
    @include font-family-normal();
    font-size: 13px;
    line-height: 22px;
    margin-bottom: 12px;
    word-break: break-all;
}

.help-txt {
    opacity: 0.66;
    font-size: 12px;
    color: #172c39;
    line-height: 22px;
    word-break: break-all;
    @include font-family-normal();
    &.distance {
        @include font-family-bold();
        margin-bottom: 4px;
        margin-left: 0;
    }
}
</style>
