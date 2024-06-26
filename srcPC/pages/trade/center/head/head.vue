<template>
    <div class="txpair-head-wrapper">
        <div class="content">
            <token class="token-wrapper"></token>

            <div class="else-wrapper">
                <div class="latest-price">
                    <div class="token-title">{{ $t('trade.head.latestPrice') }}</div>
                    <div class="token-content">
                        <span :class="{
                            'up': +upDownPrev > 0,
                            'down': +upDownPrev < 0
                        }">
                            {{ activeTxPair && activeTxPair.closePrice ? formatNum(activeTxPair.closePrice, activeTxPair.pricePrecision) : '--' }}
                        </span>
                        {{ realPrice }}
                    </div>
                </div>
                <div class="updown item-left">
                    <div class="token-title">{{ $t('trade.head.updown') }}</div>
                    <div class="token-content" :class="{
                        'up': +upDown > 0,
                        'down': +upDown < 0
                    }">{{ upDownIcon + (!!activeTxPair ? formatNum(upDown, activeTxPair.pricePrecision) : upDown) }}
                        {{ activeTxPair && activeTxPair.upDownPercent ?  upDownIcon + activeTxPair.upDownPercent : '--' }}
                    </div>
                </div>
                <div class="high-price item-left">
                    <div class="token-title">{{ $t('trade.head.highPrice') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.highPrice ? activeTxPair.highPrice : '--' }}
                    </div>
                </div>
                <div class="low-price item-left">
                    <div class="token-title">{{ $t('trade.head.lowPrice') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.lowPrice ? activeTxPair.lowPrice : '--' }}
                    </div>
                </div>
                <div class="quantity item-left">
                    <div class="token-title">{{ $t('trade.head.quantity') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.amount ? formatNum(activeTxPair.amount, 3) + ' ' + activeTxPair.originQuoteTokenSymbol : '--' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="else-point __pointer" @click="showTxPair"></div>
        <tx-pair v-show="isShowTxPair" :close="hideTxPair"></tx-pair>
    </div>
</template>

<script>
import BigNumber from '@utils/bigNumber';
import token from './token.vue';
import txPair from './txPair.vue';

export default {
    components: { token, txPair },
    data() {
        return { isShowTxPair: false };
    },
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        upDownPrev() {
            return this.activeTxPair ? this.activeTxPair.upDownPrev : '0';
        },
        upDown() {
            return this.activeTxPair ? this.activeTxPair.upDown : 0;
        },
        upDownIcon() {
            if (this.upDown && +this.upDown > 0) {
                return '+';
            }
            return '';
        },
        realPrice() {
            return this.$store.getters.activeTxPairRealClosePrice;
        },
        ftokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        }
    },
    watch: {
        // Update meta-description and meta-keywords for better seo.
        ftokenDetail(val = {}) {
            const { originalSymbol, overview = {}, name, gateway } = val;
            let keywords = [ 'Vite', 'VX', 'ViteX', 'ViteX Exchange', originalSymbol, name, gateway && gateway.name ];
            let description = '';
            keywords = keywords.filter(item => item);

            if (overview) {
                if (overview[this.$i18n.locale]) {
                    description = overview[this.$i18n.locale];
                } else if (overview.en) {
                    description = overview.en;
                }
                document.querySelector('meta[name="description"]').setAttribute('content', description);
            }

            document.querySelector('meta[name="keywords"]').setAttribute('content', keywords.join(','));
        }
    },
    methods: {
        formatNum(num, fix) {
            return BigNumber.formatNum(num, fix, fix);
        },
        showTxPair() {
            this.isShowTxPair = true;
        },
        hideTxPair() {
            this.isShowTxPair = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use '../center.scss' as *;

.txpair-head-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0px 14px 5px;
    @include font-family-bold();
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    align-items: center;
    [data-theme="0"] & {
        background: rgba(247,249,251,1);
    }
    [data-theme="1"] & {
        background: $black-color-1;
    }
    .content {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        .token-wrapper {
            padding-top: 8px;
            min-width: 250px;
            margin-right: 20px;
        }
        .else-wrapper {
            padding-top: 8px;
            display: flex;
            flex-direction: row;
            flex: 1;
        }
        .token-title {
            white-space: nowrap;
            @include font-family-normal();
            [data-theme="0"] & {
                color: #5e6875;
            }
            [data-theme="1"] & {
                color: #545F75;
            }
        }
        .token-content {
            font-family: $font-H;
            margin-top: 4px;
            font-weight: 600;
            @include font_color_1();
            &.down {
                color: $down-font-color;
            }
            &.up {
                color: $up-font-color;
            }
            .price {
                color: $blue;
            }
        }
        .item-left {
            margin-left: 20px;
        }
    }

    .else-point {
        display: inline-block;
        height: 24px;
        padding: 2px 10px;
        [data-theme="0"] & {
            background: url("@assets/imgs/more-tx-detail.svg") right bottom no-repeat;
        }
        [data-theme="1"] & {
            background: url("@assets/theme1_imgs/more-tx-detail.svg") right bottom no-repeat;
        }
        background-size: 4px 24px;
    }
}
</style>
