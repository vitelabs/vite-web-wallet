<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            {{ $t('trade.limitPrice.title') }}

            <div class="right-tab">
                <span class="vip" :class="{ 'active': isVip }"></span>
                <span class="vip-operate __pointer" @click="_showVipConfirm"
                      :class="{ 'active': !isVip }">
                    {{ isVip ? $t('trade.limitPrice.cancelVip') : $t('trade.limitPrice.openVip') }}
                </span>
                <span>{{ $t('trade.limitPrice.fee') }}
                    <span class="fee">Taker({{ exTakerFee }}) / Maker({{ exMakerFee }})</span>
                </span>
                <span class="help __pointer" @mouseenter="showHelp" @mouseleave="hideHelp">
                    <span v-show="isShowHelp" class="help-tip">
                        <span>{{ $t('trade.limitPrice.dexFee', { fee: baseFee }) }}</span>
                        <span>{{ $t('trade.limitPrice.operatorFee', { fee: operatorFee }) }}</span>
                        <span>{{ $t('trade.limitPrice.vipFee', { fee: vipFee }) }}</span>
                        <span>{{ $t('trade.limitPrice.inviteFeeDiscount', { fee: inviteFeeDiscount }) }}</span>
                        <span>{{ $t('trade.limitPrice.feeRule') }}</span>
                    </span>
                </span>
            </div>
        </div>
        <order orderType="buy"></order>
        <order orderType="sell"></order>
        <vip-confirm v-if="isShowVipConfirm" :close="hideVipConfirm"></vip-confirm>
    </div>
</template>

<script>
import order from './order.vue';
import vipConfirm from './vipConfirm.vue';
import { execWithValid } from 'utils/execWithValid';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';

export default {
    components: { order, vipConfirm },
    data() {
        return {
            isShowHelp: false,
            isShowVipConfirm: false
        };
    },
    computed: {
        baseFee() {
            return `Taker(${ this.baseTakerFee }) / Maker(${ this.baseMakerFee })`;
        },
        baseMakerFee() {
            const baseMakerFee = this.toPercentFee(this.$store.state.exchangeFee.baseMakerFee);
            return `${ baseMakerFee }%`;
        },
        baseTakerFee() {
            const baseTakerFee = this.toPercentFee(this.$store.state.exchangeFee.baseTakerFee);
            return `${ baseTakerFee }%`;
        },
        operatorFee() {
            return `Taker(${ this.operatorTakerFee }) / Maker(${ this.operatorMakerFee })`;
        },
        operatorTakerFee() {
            const operatorTakerFee = this.toPercentFee(this.$store.getters.operatorTakerFee);
            return `${ operatorTakerFee }%`;
        },
        operatorMakerFee() {
            const operatorMakerFee = this.toPercentFee(this.$store.getters.operatorMakerFee);
            return `${ operatorMakerFee }%`;
        },
        vipFee() {
            const vipFee = this.toPercentFee(this.$store.getters.vipFee);
            return `${ parseFloat(vipFee) }%`;
        },
        exMakerFee() {
            const exMakerFee = this.toPercentFee(this.$store.getters.exMakerFee);
            return `${ exMakerFee }%`;
        },
        exTakerFee() {
            const exTakerFee = this.toPercentFee(this.$store.getters.exTakerFee);
            return `${ exTakerFee }%`;
        },
        inviteFeeDiscount() {
            const inviteFeeDiscount = this.toPercentFee(this.$store.getters.inviteFeeDiscount);
            return `${ parseInt(inviteFeeDiscount) }%`;
        },
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        markerInfo() {
            return this.$store.state.exchangeFee.marketInfo;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        showHelp() {
            this.isShowHelp = true;
        },
        hideHelp() {
            this.isShowHelp = false;
        },
        toPercentFee(fee) {
            return BigNumber.multi(fee || 0, 100, 3);
        },

        hideVipConfirm() {
            this.isShowVipConfirm = false;
        },
        _showVipConfirm() {
            statistics.event(this.$route.name, `switchVIP-${ this.isVip ? 'cancel' : 'open' }`, this.address || '');
            this.showVipConfirm();
        },
        showVipConfirm: execWithValid(function () {
            this.isShowVipConfirm = true;
        })
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/center.scss";

.limit-price-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 14px;
    @include font-family-normal();
    font-weight: 400;

    .right-tab {
        font-size: 12px;
        float: right;
        @include font-family-normal();
        color: rgba(94, 104, 117, 1);
        font-weight: 400;
        >span {
            position: relative;
            margin-right: 6px;
            &:last-child {
                margin-right: 0;
            }
        }
        .fee {
            font-family: $font-H;
        }
    }

    .help {
        background: url('~assets/imgs/info.svg');
        background-size: 100% 100%;
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-bottom: -3px;
    }

    .help-tip {
        position: absolute;
        top: -12px;
        right: -13px;
        min-width: 300px;
        padding: 10px 10px 0;
        background: #fff;
        transform: translateY(-100%);
        box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
        border-radius: 2px;
        font-family: $font-H;
        &:after {
            right: 15px;
            position: absolute;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            border-top: 6px solid #fff;
        }
        >span {
            display: block;
            margin-bottom: 10px;
        }
    }

    .vip-operate {
        padding-right: 6px;
        border-right: 1px solid rgba(205,204,204,1);
        &.active {
            color: #007AFF;
        }
    }

    .vip {
        display: inline-block;
        margin-bottom: -3px;
        color: rgba(255,255,255,1);
        width: 36px;
        height: 16px;
        background: url('~assets/imgs/not_vip.svg');
        background-size: 100% 100%;

        &.active {
            background: url('~assets/imgs/vip.svg');
            background-size: 100% 100%;
        }
    }
}
</style>
