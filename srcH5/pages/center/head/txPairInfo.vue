<template>
    <div class="tx-pair-info">
        <div class="left">
            <div class="token-img" @click="_showDetail('token')">
                <img v-show="ftokenIcon" :src="ftokenIcon"/>
                <div v-show="activeTxPairIsClose" class="close"></div>
            </div>

            <div class="t-item">
                <span class="symbol" @click="_showDetail('token')">
                    {{ ftokenDetail ? ftokenDetail.symbol : '' }}
                </span>
                <span class="symbol ttoken" @click="_showDetail('token')">
                    / {{ ttokenDetail ? ttokenDetail.symbol : '' }}
                </span>
                <div class="mining" v-show="isMinging">
                    <img src="~assets/imgs/mining.svg"/>
                </div>
            </div>
        </div>

        <span class="gate" @click="_showDetail('operator')">
            <img class="gate-img" :src="operatorIcon" />
            {{ operatorInfo ? operatorInfo.name : $t('tradeCenter.operator.noName') }}
        </span>
    </div>
</template>

<script>
import viteConfirm from 'h5Components/confirm/index.js';
import operatorIcon from 'h5Assets/imgs/operator_default.svg';
import defaultTokenIcon from 'assets/imgs/default_token_icon.png';

let lastSymbol = null;

export default {
    props: {
        showDetail: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        isMinging() {
            const marketInfo = this.$store.state.exchangeFee.marketInfo;
            return marketInfo && marketInfo.allowMine;
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
        ttokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        ftokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        ftokenIcon() {
            if (this.ftokenDetail && this.ftokenDetail.urlIcon) {
                return this.ftokenDetail.urlIcon;
            }
            return defaultTokenIcon;
        },
        operatorInfo() {
            return this.$store.state.exchangeTokens.operator;
        },
        operatorIcon() {
            if (this.operatorInfo) {
                return this.operatorInfo.icon || '';
            }
            return operatorIcon;
        },
        isOperatorTxPairLoading() {
            return this.$store.state.exchangeTokens.isLoading;
        }
    },
    watch: {
        isOperatorTxPairLoading() {
            this.initDanger();
        },
        activeTxPair() {
            this.initDanger();
        }
    },
    methods: {
        _showDetail(tab = 'token') {
            this.showDetail && this.showDetail(tab);
        },
        initDanger() {
            if (this.isOperatorTxPairLoading || !this.activeTxPair || lastSymbol === this.activeTxPair.symbol) {
                return;
            }

            lastSymbol = this.activeTxPair.symbol;

            if (this.operatorInfo
                && [ 'Vite Labs', 'VGATE' ].indexOf(this.operatorInfo.name) !== -1) {
                return;
            }

            const tradeTokenSymbol = this.activeTxPair.tradeTokenSymbol.split('-')[0];
            const quoteTokenSymbol = this.activeTxPair.quoteTokenSymbol.split('-')[0];

            viteConfirm({
                size: 'small',
                type: 'description',
                title: this.$t('tradeCenter.operator.confirmTitle'),
                singleBtn: true,
                closeBtn: { show: false },
                leftBtn: { text: this.$t('btn.understand') },
                content: this.$t('tradeCenter.operator.confirmText', { symbol: `${ tradeTokenSymbol }/${ quoteTokenSymbol }` })
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Assets/scss/vars.scss';

.confirm.tx-pair-info {
    position: relative;
    margin-bottom: 0;
    .mining {
        display: inline-block;
    }
    .gate {
        position: absolute;
        left: 50px;
        top: 26px;
        border: none;
        padding: 0;
        color: rgba(62,74,89,1);
    }
}

.tx-pair-info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    @include font-normal();
    margin-bottom: 10px;
}
.left {
    position: relative;
    display: flex;
    flex: 1;
}

.token-img {
    width: 40px;
    height: 40px;
    display: inline-block;
    margin-right: 10px;
    img {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 40px;
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
    font-size: 12px;
    @include font-bold();
    color: rgba(29, 32, 36, 1);
    line-height: 14px;

    .symbol {
        position: relative;
        white-space: nowrap;
        @include font-bold();
        &:first-child {
            font-size: 18px;
            color: rgba(36,39,43,1);
            line-height: 22px;
        }
        &.ttoken {
            font-size: 14px;
            color: rgba(62,74,89,0.3);
            line-height: 18px;
        }
    }
    .mining {
        position: relative;
        img {
            width: 16px;
            height: 16px;
        }
    }
}

.gate {
    border-radius: 2px;
    border: 1px solid rgba(0,122,255,1);
    @include font-normal();
    font-size: 12px;
    color: $blue;
    padding: 3px 6px;
    .gate-img {
        width: 14px;
        height: 14px;
        margin-bottom: -3px;
    }
}
</style>
