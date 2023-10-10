<template>
    <div class="tx-pair-info">
        <div class="token-img" @click="_showDetail('token')">
            <img v-show="ftokenIcon" :src="ftokenIcon"/>
            <div v-show="activeTxPairIsClose" class="close"></div>
        </div>

        <div class="t-item">
            <span class="cmc-img" v-show="isCMC" @click="gotoCMC">
                <tooltips class="tips" :content="$t('tradeCenter.cmcHelp')"></tooltips>
            </span>
            <span class="symbol" @click="_showDetail('token')">
                {{ ftokenDetail ? ftokenDetail.symbol : '' }}
            </span> /
            <span class="symbol ttoken" @click="_showDetail('token')">
                {{ ttokenDetail ? ttokenDetail.symbol : '' }}
            </span>
            <span class="zero-fee-icon">
                <img v-show="isZeroFee" src="~assets/imgs/trade/zero_fee.svg">
                <tooltips class="tips" :content="$t('tradeCenter.zeroFee')"></tooltips>
            </span>
            <span class="mining" v-show="+isMining">
                <img v-show="isMining === 1" :src="tradeMiningIcon"/>
                <img v-show="isMining === 2" :src="orderMiningIcon"/>
                <img v-show="isMining === 3" :src="miningIcon"/>
                {{ orderMiningMultiples }}
                <tooltips class="tips" :content="supportMining"></tooltips>
            </span>
            <span class="gate" @click="_showDetail('operator')">
                <img class="gate-img" :src="operatorIcon" />
                {{ operatorInfo ? operatorInfo.name : $t('tradeCenter.operator.noName') }}
            </span>
        </div>
    </div>
</template>

<script>
import tooltips from 'components/tooltips';
import operatorIcon from 'assets/imgs/operator_icon.svg';
import theme1OperatorIcon from 'assets/theme1_imgs/operator_icon.svg';
import openUrl from 'utils/openUrl';

import tradeMiningSvg from 'assets/imgs/trade_mining.svg';
import orderMiningSvg from 'assets/imgs/order_mining.svg';
import miningSvg from 'assets/imgs/mining.svg';
import theme1TradeMiningSvg from 'assets/theme1_imgs/trade_mining.svg';
import theme1OrderMiningSvg from 'assets/theme1_imgs/order_mining.svg';
import theme1MiningSvg from 'assets/theme1_imgs/mining.svg';

export default {
    components: { tooltips },
    props: {
        showDetail: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        supportMining() {
            if (!this.isMining) {
                return '';
            }

            if (this.isMining === 1) {
                return this.$t('tradeCenter.supportTradeMining');
            } else if (this.isMining === 2) {
                return this.$t('tradeCenter.supportOrderMining');
            } else if (this.isMining === 3) {
                return this.$t('tradeCenter.supportMining');
            }
        },
        isCMC() {
            return this.$store.getters.activeTxPairIsCMC;
        },
        isMining() {
            return this.$store.getters.activeTxPairIsMining;
        },
        isZeroFee() {
            return this.$store.getters.activeTxPairIsZeroFee;
        },
        orderMiningMultiples() {
            return this.$store.getters.activeTxPairOrderMiningMultiples;
        },
        closeMarket() {
            return this.$store.state.exchangeMarket.marketClosed;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        activeTxPairIsClose() {
            if (!this.activeTxPair) {
                return false;
            }
            return this.closeMarket.find(v => v.symbol === this.activeTxPair.symbol);
        },
        defaultTokens() {
            return this.$store.state.ledger.tokenInfoMaps;
        },
        ttokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        ftokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        ftokenIcon() {
            if (!this.ftokenDetail) {
                return '';
            }

            if (this.ftokenDetail.urlIcon) {
                return this.ftokenDetail.urlIcon;
            }

            const tokenId = this.ftokenDetail.tokenId;
            const defaultToken = this.defaultTokens[tokenId];

            if (defaultToken && defaultToken.icon) {
                return defaultToken.icon;
            }
            return '';
        },
        operatorInfo() {
            return this.$store.state.exchangeTokens.operator;
        },
        theme() {
            return this.$store.state.env.theme;
        },
        operatorIcon() {
            if (this.operatorInfo) {
                return this.operatorInfo.icon || '';
            }
            if (+this.theme === 0) {
                return operatorIcon;
            }
            return theme1OperatorIcon;
        },
        tradeMiningIcon() {
            if (+this.theme === 0) {
                return tradeMiningSvg;
            }
            return theme1TradeMiningSvg;
        },
        orderMiningIcon() {
            if (+this.theme === 0) {
                return orderMiningSvg;
            }
            return theme1OrderMiningSvg;
        },
        miningIcon() {
            if (+this.theme === 0) {
                return miningSvg;
            }
            return theme1MiningSvg;
        }
    },
    methods: {
        _showDetail(tab = 'token') {
            this.showDetail && this.showDetail(tab);
        },
        gotoCMC() {
            openUrl('https://coinmarketcap.com/exchanges/vitex/');
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.tx-pair-info {
    position: relative;
}

.token-img {
    position: absolute;
    top: 6px;
    display: inline-block;
    img {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 28px;
        border: 1px solid rgba(212,222,231,1);
        box-sizing: border-box;
    }
    .close {
        position: absolute;
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 28px;
        background: rgba(0,0,0,0.5);
        z-index: 100;
        left: 0;
        &:after {
            position: absolute;
            top: 13px;
            right: -6px;
            content: ' ';
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 12px;
            background: url('~assets/imgs/tx-pair-close.svg');
            background-size: 100% 100%;
        }
    }
}

.t-item {
    display: inline-block;
    line-height: 14px;
    margin-left: 36px;
    font-size: 12px;
    @include font-family-bold();
    @include common_font_color();
    .cmc-img {
        position: relative;
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-bottom: -5px;
        @include background_common_img("cmc.svg");
        .tips {
            display: none;
            @include font-family-normal();
            z-index: 10;
        }
        &:hover {
            .tips {
                display: inline-block;
            }
        }
    }

    .symbol {
        position: relative;
        white-space: nowrap;
        line-height: 20px;
        &:first-child {
            font-size: 16px;
        }
        &.ttoken {
            [data-theme="0"] & {
                color: #5e6875;
            }
            [data-theme="1"] & {
                color: #545F75;
            }
        }
    }
    .mining {
        position: relative;
        // color: $blue-color-1;
        @include primary_color();
        .tips {
            display: none;
            @include font-family-normal();
        }
        &:hover {
            .tips {
                display: inline-block;
                @include font_color_1();
            }
        }
        img {
            margin-bottom: -2px;
            width: 14px;
            height: 14px;
        }
    }
    .zero-fee-icon {
        .tips {
            display: none;
            @include font-family-normal();
        }
        &:hover {
            .tips {
                display: inline-block;
                @include font_color_1();
            }
        }
        img {
            width: 18px;
            height: 10px;
            margin-bottom: 8px;
        }
    }
    .gate {
        @include font-family-normal();
        // color: $blue-color-1;
        @include primary_color();
        display: flex;
        margin-top: 2px;
        .gate-img {
            width: 14px;
            height: 14px;
            margin-bottom: -3px;
            margin-right: 4px;
            box-sizing: border-box;
            border-radius: 2px;
            [data-theme="0"] & {
                border: 1px solid rgba(212,222,231,1);
            }
        }
    }
}
</style>
