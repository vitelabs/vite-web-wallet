<template>
    <div>
        <sec-title :showHelp="showHelp"></sec-title>
        <confirm
            class="small"
            v-show="isShowHelp"
            :showMask="true"
            :singleBtn="true"
            :title="$t('walletQuota.help.title')"
            :closeIcon="true"
            :close="close"
            :leftBtnTxt="$t('btn.understand')"
            :leftBtnClick="close"
        >
            <div class="help-t">{{ $t('walletQuota.confirm.help.t1') }}</div>
            <div class="help-txt">
                {{ $t('walletQuota.confirm.help.txt1') }}
            </div>
            <div class="help-t">{{ $t('walletQuota.confirm.help.t2') }}</div>
            <div class="help-txt">
                {{ $t('walletQuota.confirm.help.txt2') }}
            </div>
            <div class="help-t">{{ $t('walletQuota.confirm.help.t3') }}</div>
            <div class="help-txt">
                {{ $t('walletQuota.confirm.help.txt3') }}
            </div>
        </confirm>
    </div>
</template>

<script>
import secTitle from '@pc/components/secTitle.vue';
import confirm from '@pc/components/confirm/confirm.vue';

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
            // open dialog
            this.isShowHelp = true;
            // open quota page here @TODO url
            // window.open(url);
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;

.help-t {
    @include font-family-normal();
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 12px;
    word-break: break-all;
}

.help-txt {
    opacity: 0.66;
    font-size: 12px;
    line-height: 22px;
    margin-bottom: 10px;
    word-break: break-all;
    @include font-family-normal();
}
</style>
