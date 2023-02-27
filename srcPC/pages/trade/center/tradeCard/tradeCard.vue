<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            <div class="left-tab">
                <div
                    class="tab-item"
                    :class="{ active: priceType === 'limit' }"
                    @click="togglePriceType('limit')"
                >
                    {{ $t('trade.limitPrice.title') }}
                </div>
                <!-- hide market price -->
                <div
                    class="tab-item"
                    :class="{ active: priceType === 'market' }"
                    @click="togglePriceType('market')"
                >
                    Market
                </div>
            </div>

            <div class="right-tab">
                <Vip></Vip>
                <span
                >{{ $t('trade.limitPrice.fee') }}
                    <span class="fee"
                    >Taker({{ exTakerFee }}) / Maker({{ exMakerFee }})</span
                    >
                </span>
                <span
                    v-if="!isZeroFee"
                    class="help __pointer"
                    @mouseenter="showHelp"
                    @mouseleave="hideHelp"
                >
                    <span v-show="isShowHelp" class="help-tip">
                        <span v-if="isSVip">{{
                            $t('trade.limitPrice.svipFee')
                        }}</span>
                        <span v-else style="color: red;">{{
                            $t('trade.limitPrice.adviseToSVip')
                        }}</span>
                        <span>{{
                            $t('trade.limitPrice.dexFee', { fee: baseFee })
                        }}</span>
                        <span>{{
                            $t('trade.limitPrice.operatorFee', {
                                fee: operatorFee
                            })
                        }}</span>
                        <span v-if="!isSVip">{{
                            $t('trade.limitPrice.vipFee', { fee: vipFee })
                        }}</span>
                        <span>{{
                            $t('trade.limitPrice.inviteFeeDiscount', {
                                fee: inviteFeeDiscount
                            })
                        }}</span>
                        <span v-if="isSVip">{{
                            $t('trade.limitPrice.feeRuleWithSVip')
                        }}</span>
                        <span v-else>{{ $t('trade.limitPrice.feeRule') }}</span>
                    </span>
                </span>
            </div>
        </div>

        <div class="ex-center-login" v-if="priceType === 'limit'">
            <LimitPriceOrder orderType="buy"></LimitPriceOrder>
            <div class="order-border"></div>
            <LimitPriceOrder
                orderType="sell"
                class="order-wrapper"
            ></LimitPriceOrder>
        </div>
        <div class="ex-center-login" v-else>
            <MarketPriceOrder orderType="buy"></MarketPriceOrder>
            <div class="order-border"></div>
            <MarketPriceOrder
                orderType="sell"
                class="order-wrapper"
            ></MarketPriceOrder>
        </div>
    </div>
</template>

<script>
import LimitPriceOrder from '../limitPrice/order.vue';
import MarketPriceOrder from '../marketPrice/order.vue';

import BigNumber from 'utils/bigNumber';
import Vip from './vip.vue';

export default {
    components: { LimitPriceOrder, MarketPriceOrder, Vip },
    // priceType:market,limit
    data() {
        return { isShowHelp: false, priceType: 'limit' };
    },
    computed: {
        baseFee() {
            return `Taker(${ this.baseTakerFee }) / Maker(${ this.baseMakerFee })`;
        },
        baseMakerFee() {
            const baseMakerFee = this.toPercentFee(this.$store.getters.baseMakerFee);
            return `${ baseMakerFee }%`;
        },
        baseTakerFee() {
            const baseTakerFee = this.toPercentFee(this.$store.getters.baseTakerFee);
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
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        isZeroFee() {
            return this.$store.getters.activeTxPairIsZeroFee;
        }
    },
    methods: {
        togglePriceType(priceType) {
            this.priceType = priceType;
        },
        showHelp() {
            this.isShowHelp = true;
        },
        hideHelp() {
            this.isShowHelp = false;
        },
        toPercentFee(fee) {
            return BigNumber.multi(fee || 0, 100, 3);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.limit-price-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 14px;
    @include font-family-normal();
    font-weight: 400;
    .__center-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0;
    }
    .left-tab {
        display: flex;
        .tab-item {
            cursor: pointer;
            padding:3px 6px;
            &.active {
                // background-color: #fff;
                @include bg_color_2();
                @include font_color_to_white(#000);

            }
        }
    }
    .right-tab {
        font-size: 12px;
        float: right;
        @include font-family-normal();
        @include font_color_2();
        display: flex;
        > span {
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
        @include background_common_img('info.svg');
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
        transform: translateY(-100%);
        border-radius: 2px;
        font-family: $font-H;
        @include bg_color_4();
        [data-theme='0'] & {
            box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
        }
        &:after {
            right: 15px;
            position: absolute;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            [data-theme='0'] & {
                border-right: 6px solid $white-color;
            }
            [data-theme='1'] & {
                border-top: 6px solid $black-color-4;
            }
        }
        > span {
            display: block;
            margin-bottom: 10px;
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
        border: 1px dashed #d7e0e8;
        margin: 0 6px;
    }
}
</style>
