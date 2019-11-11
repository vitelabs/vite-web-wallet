<template>
    <div class="trade-vip-container">
        <sec-title :showHelp="showHelp"></sec-title>
        <confirm class="small" v-show="isShowHelp" :showMask="true" :singleBtn="true"
                 :title="$t('tradeVip.help.title')" :closeIcon="true"
                 :close="close" :leftBtnTxt="$t('btn.understand')"
                 :leftBtnClick="close">
            <div class="help-t">{{ $t('tradeVip.helpConfirm.t1') }}</div>
            <div class="help-txt">{{ $t('tradeVip.helpConfirm.txt1') }}</div>
            <div class="help-t">{{ $t('tradeVip.helpConfirm.t2') }}</div>
            <div class="help-txt">{{ $t('tradeVip.helpConfirm.txt2') }}</div>
            <div class="help-txt">{{ $t('tradeVip.helpConfirm.txt3') }}</div>
        </confirm>
        <div class="btn_group">
            <div class="btn btn__ok __pointer" @click="_showVipConfirm">
                {{ isVip ? $t('tradeVip.vipConfirm.cancelVip') : $t('tradeVip.vipConfirm.openVip') }}
            </div>
            <div class="btn btn__cancel __pointer" @click="_showSVipConfirm">
                {{ isSVip ? $t('tradeVip.svipConfirm.cancelVip') : $t('tradeVip.svipConfirm.openVip') }}
            </div>
        </div>
    </div>
</template>

<script>
import vipConfirm from './vipConfirm.vue';
import { insertTo } from 'pcUtils/insertTo';
import statistics from 'utils/statistics';
import { execWithValid } from 'pcUtils/execWithValid';
import component2function from 'pcComponents/dialog/utils';
import svipComp from './svipConfirm';
import { doUntill } from 'utils/asyncFlow';
import secTitle from 'pcComponents/secTitle';
import confirm from 'components/confirm/confirm.vue';

export default {
    components: { secTitle, confirm },
    data() {
        return { isShowHelp: false };
    },
    computed: {
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        showHelp() {
            this.isShowHelp = true;
        },
        close() {
            this.isShowHelp = false;
        },


        _showVipConfirm() {
            statistics.event(this.$route.name, `switchVIP-${ this.isVip ? 'cancel' : 'open' }`, this.address || '');
            this.showVipConfirm();
        },
        showVipConfirm: execWithValid(function () {
            this.vipConfirm = insertTo(vipConfirm, {
                close: () => {
                    this.hideVipConfirm();
                }
            });
        }),
        hideVipConfirm() {
            this.vipConfirm
                && this.vipConfirm.destroyInstance()
                && (this.vipConfirm = null);
        },
        _showSVipConfirm() {
            statistics.event(this.$route.name, `switchSVIP-${ this.isSVip ? 'cancel' : 'open' }`, this.address || '');
            this.showSVipConfirm();
        },
        showSVipConfirm: execWithValid(function () {
            component2function(svipComp)().then(() => doUntill({ createPromise: () => this.$store.dispatch('exFetchSVip'), interval: 1000, times: 3 }));
        })
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

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
    color: #172c39;
    line-height: 22px;
    margin-bottom: 10px;
    word-break: break-all;
    @include font-family-normal();
}

.btn {
    line-height: 30px;
    text-align: center;
    width: 125px;
    height: 30px;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 5px;
    margin-right: 11px;
    color: #fff;
    background-color: #007aff;
    box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    font-size: 12px;
}
</style>
