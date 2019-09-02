<template>
    <div class="txpair-head-wrapper">
        <tx-pair-info :showDetail="showDetail"></tx-pair-info>

        <div class="else-wrapper">
            <div class="left">
                <div class="price" :class="{
                    'up': +upDownPrev > 0,
                    'down': +upDownPrev < 0
                }">
                    {{ activeTxPair && activeTxPair.closePrice ? formatNum(activeTxPair.closePrice, activeTxPair.pricePrecision) : '--' }}
                </div>
                <div>
                    <span>≈{{ realPrice }}</span>
                    <span class="updown" :class="{
                        'up': +upDown > 0,
                        'down': +upDown < 0
                    }">{{ activeTxPair && activeTxPair.upDownPercent ? upDownIcon + activeTxPair.upDownPercent : '--' }}</span>
                </div>
            </div>

            <div class="right">
                <div class="item">
                    <div>{{ $t('mobileTradeCenter.highPrice') }}</div>
                    <div>{{ $t('mobileTradeCenter.lowPrice') }}</div>
                    <div>{{ $t('mobileTradeCenter.quantity') }}</div>
                </div>
                <div class="item">
                    <div>{{ activeTxPair && activeTxPair.highPrice ? activeTxPair.highPrice : '--' }} {{ activeTxPair ? activeTxPair.originQuoteTokenSymbol : '' }}</div>
                    <div>{{ activeTxPair && activeTxPair.lowPrice ? activeTxPair.lowPrice : '--' }} {{ activeTxPair ? activeTxPair.originQuoteTokenSymbol : '' }}</div>
                    <div>{{ activeTxPair && activeTxPair.amount ? formatNum(activeTxPair.amount, 1) : '--' }} {{ activeTxPair ? activeTxPair.originQuoteTokenSymbol : '' }}</div>
                </div>
            </div>
        </div>

        <operator-detail ref="operatorDetailConfirm"></operator-detail>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import { getExplorerLink } from 'utils/getLink';
import txPairInfo from './txPairInfo';
import operatorDetail from './operatorDetail.vue';
import getDialog from 'h5Components/dialog/getDialog.js';
import tokenInfoComp from 'h5Components/tokenInfo';

export default {
    components: { txPairInfo, operatorDetail },
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
        },
        tokenDetail() {
            if (!this.ftokenDetail) {
                return {};
            }

            const tokenDetail = this.ftokenDetail;
            tokenDetail.tokenSymbol = tokenDetail.originalSymbol;
            if (this.ftokenDetail.links) {
                for (const key in this.ftokenDetail.links) {
                    tokenDetail[`${ key }Link`] = this.ftokenDetail.links[key] && this.ftokenDetail.links[key].length
                        ? this.ftokenDetail.links[key][0] : '';
                }
            }
            tokenDetail.ttype = typeof tokenDetail.gateway === 'undefined'
                ? '--' : tokenDetail.gateway
                    ? this.$t('tokenCard.tokenInfo.labels.crossType')
                    : this.$t('tokenCard.tokenInfo.labels.originType');
            tokenDetail.explorerLink = tokenDetail.explorerLink
                || (tokenDetail.gateway ? null : getExplorerLink(this.$i18n.locale));
            tokenDetail.showTotalSupply = BigNumber.toBasic(tokenDetail.totalSupply, tokenDetail.tokenDecimals);

            return tokenDetail;
        }
    },
    methods: {
        formatNum(num, fix) {
            return BigNumber.formatNum(num, fix);
        },
        showDetail(tab = 'token') {
            if (tab === 'token') {
                const tokenInfoDialog = getDialog(tokenInfoComp);
                tokenInfoDialog({ token: this.tokenDetail }).catch(e => {
                    console.error(e);
                });
                return;
            }
            this.$refs.operatorDetailConfirm.tab = tab;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Assets/scss/vars.scss';

.txpair-head-wrapper {
    background: linear-gradient(62deg,rgba(255,255,255,1) 0%,rgba(199,228,255,1) 100%);
    border-radius: 2px;
    padding: 24px 18px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 12px;

    .else-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .left {
        @include font-normal();
        color: rgba(62,74,89,0.6);
        font-size: 14px;
        line-height: 18px;
        .price {
            @include font-bold();
            font-size: 24px;
            line-height: 28px;
            color: #24272b;
            margin-bottom: 6px;
        }
        .updown {
            color: #24272b;
            &::before {
                display: inline-block;
                content: ' ';
                width: 10px;
                height: 10px;
                margin-right: 2px;
            }
            &.down:before {
                background: url('~assets/imgs/ex-down-arrow.svg');
                background-size: 100% 100%;
            }
            &.up:before {
                background: url('~assets/imgs/ex-up-arrow.svg');
                background-size: 100% 100%;
            }
        }
        .down {
            color: $down-color;
        }
        .up {
            color: $up-color;
        }
    }
    .right {
        display: flex;
        flex-direction: row;
        @include font-normal();
        .item {
            text-align: right;
            color: rgba(62,74,89,1);
            &:first-child {
                margin-right: 7px;
                color: rgba(62,74,89,0.6);
            }
            div {
                line-height: 16px;
                white-space: nowrap;
                margin-bottom: 5px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>
