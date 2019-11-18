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
            <div v-show="!isVip" class="btn __pointer" @click="openVIP">
                {{ $t('tradeVip.vipConfirm.openVip') }}
            </div>
            <div v-show="isVip" class="btn unuse">
                {{ $t('tradeVip.vipConfirm.openVip') }}
            </div>
            <div class="btn __pointer" @click="openSVIP">
                {{ $t('tradeVip.svipConfirm.openVip') }}
            </div>
        </div>

        <div class="__second-title">{{ $t('tradeVip.vipListTitle') }}</div>
        <vip-list :showVipConfirm="_showCancelVIP" :showSVipConfirm="showCancelSVIPConfirm"></vip-list>

        <vip-confirm ref="vipConfirm"></vip-confirm>
        <cancelVIPConfirm ref="cancelVIPConfirm"></cancelVIPConfirm>
        <cancelSVIPConfirm ref="cancelSVIPConfirm"></cancelSVIPConfirm>
    </div>
</template>

<script>
import statistics from 'utils/statistics';
import { execWithValid } from 'pcUtils/execWithValid';
import component2function from 'pcComponents/dialog/utils';
import { doUntill } from 'utils/asyncFlow';
import secTitle from 'pcComponents/secTitle';
import confirm from 'components/confirm/confirm.vue';
import svipComp from './svipConfirm';
import vipConfirm from './vipConfirm.vue';
import vipList from './vipList.vue';
import cancelSVIPConfirm from './cancelSVIPConfirm';
import cancelVIPConfirm from './cancelVIPConfirm';

export default {
    components: { secTitle, confirm, vipList, vipConfirm, cancelVIPConfirm, cancelSVIPConfirm },
    mounted() {
        this.$store.dispatch('startLoopHeight');
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return { isShowHelp: false };
    },
    computed: {
        isVip() {
            return this.$store.state.exchangeFee.isVip;
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

        openVIP(item) {
            statistics.event(this.$route.name, 'openVIP', this.address || '');
            this.showOpenVIPConfirm(item);
        },
        showOpenVIPConfirm: execWithValid(function (item) {
            this.$refs.vipConfirm.show(item);
        }),
        _showCancelVIP(item) {
            statistics.event(this.$route.name, 'cancelVIP', this.address || '');
            this.showCancelVIPConfirm(item);
        },
        showCancelVIPConfirm: execWithValid(function (item) {
            this.$refs.cancelVIPConfirm.show(item);
        }),

        openSVIP() {
            statistics.event(this.$route.name, 'switchSVIP-open', this.address || '');
            this.showSVipConfirm();
        },
        showSVipConfirm: execWithValid(function () {
            component2function(svipComp)().then(() => doUntill({ createPromise: () => this.$store.dispatch('exFetchSVip'), interval: 1000, times: 3 }));
        }),
        showCancelSVIPConfirm: execWithValid(function (cancelItem) {
            this.$refs.cancelSVIPConfirm.cancelItem = cancelItem;
            this.$refs.cancelSVIPConfirm.show();
        })
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.trade-vip-container {
    height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
}

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
    border-radius: 2px;
    font-size: 12px;
    &.unuse {
        color: rgba(94, 104, 117, 0.3);
        border: 1px solid rgba(198,203,212,0.3);
        cursor: not-allowed;
        background: none;
    }
}

.__second-title {
    margin: 14px 0;
}
</style>
