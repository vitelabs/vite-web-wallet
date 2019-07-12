<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            {{ $t('trade.limitPrice.title') }}

            <div class="right-tab">
                <span class="vip" :class="{ 'active': isVip }">VIP</span>
                <span class="vip-operate __pointer" @click="showVipConfirm"
                      :class="{ 'active': !isVip }">
                    {{ isVip ? $t('trade.limitPrice.cancelVip') : $t('trade.limitPrice.openVip') }}
                </span>
                <span class="fee">{{ $t('trade.limitPrice.fee') }} Taker({{ taker }}) / Maker({{ maker }})</span>
                <span class="help __pointer" @mouseenter="showHelp" @mouseleave="hideHelp">
                    <span v-show="isShowHelp" class="help-tip">
                        <span>{{ $t('trade.limitPrice.dexFee', { fee: baseFee }) }}</span>
                        <span>{{ $t('trade.limitPrice.operatorFee', { fee: operatorFee }) }}</span>
                        <span>{{ $t('trade.limitPrice.vipFee', { fee: vipFee }) }}</span>
                    </span>
                </span>
            </div>
        </div>

        <logout-view v-if="!isLogin"></logout-view>

        <div v-if="isLogin" class="ex-center-login">
            <order orderType="buy"></order>
            <div class="order-border"></div>
            <order orderType="sell" class="order-wrapper"></order>
        </div>

        <vip-confirm v-show="isShowVipConfirm" :close="hideVipConfirm"></vip-confirm>
    </div>
</template>

<script>
import logoutView from './logout';
import order from './order.vue';
import vipConfirm from './vipConfirm.vue';
import { StatusMap } from 'wallet';
import { execWithValid } from 'utils/execWithValid';

export default {
    components: { logoutView, order, vipConfirm },
    data() {
        return {
            isShowHelp: false,
            isShowVipConfirm: false
        };
    },
    computed: {
        operatorFee() {
            return `${ this.taker } / ${ this.maker }`;
        },
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        markerInfo() {
            return this.$store.state.exchangeFee.markerInfo;
        },
        baseFee() {
            const baseFee = this.$store.state.exchangeFee.baseFee * 100;
            return `${ baseFee }%`;
        },
        vipFee() {
            const vipFee = this.$store.getters.vipFee * 100;
            return `${ vipFee }%`;
        },
        taker() {
            if (!this.markerInfo) {
                return '0%';
            }
            const takerBrokerFee = this.markerInfo.takerBrokerFee * 100;
            return `${ takerBrokerFee }%`;
        },
        maker() {
            if (!this.markerInfo) {
                return '0%';
            }
            const makerBrokerFeeRate = this.markerInfo.makerBrokerFeeRate * 100;
            return `${ makerBrokerFeeRate }%`;
        }
    },
    methods: {
        showHelp() {
            this.isShowHelp = true;
        },
        hideHelp() {
            this.isShowHelp = false;
        },

        hideVipConfirm() {
            this.isShowVipConfirm = false;
        },
        showVipConfirm() {
            const x = execWithValid(() => {
                this.isShowVipConfirm = true;
            });
            x();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";

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
        width: 180px;
        padding: 10px 10px 0;
        background: #fff;
        transform: translateY(-100%);
        box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
        border-radius: 2px;
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
        font-family: font-family-bold();
        font-weight: 600;
        color: rgba(255,255,255,1);
        padding: 2px 8px;
        background: rgba(189,193,209,1);
        border-radius: 4px;
        background: url('~assets/imgs/not_vip.svg');
        background-size: 100% 100%;

        &.active {
            background: url('~assets/imgs/vip.svg');
            background-size: 100% 100%;
        }
    }
}

.ex-center-login {
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 8px 0 10px;

    .order-border {
        height: 100%;
        opacity: 0.136;
        border: 1px dashed #D7E0E8;
        margin: 0 6px;
    }
}
</style>
