<template>
    <div class="tx-pair-info">
        <div class="token-img" @click="_showDetail('token')">
            <img v-show="ftokenIcon" :src="ftokenIcon"/>
            <div v-show="activeTxPairIsClose" class="close"></div>
        </div>

        <div class="t-item">
            <span class="symbol" @click="_showDetail('token')">
                {{ ftokenDetail ? ftokenDetail.symbol : '' }}
            </span> /
            <span class="symbol ttoken" @click="_showDetail('token')">
                {{ ttokenDetail ? ttokenDetail.symbol : '' }}
            </span>
            <span class="mining" v-show="isMinging">
                <img src="~assets/imgs/mining.svg"/>
                <tooltips class="tips" :content="$t('tradeCenter.supportMining')"></tooltips>
            </span>
            <span class="gate" @click="_showDetail('operator')">
                <img class="gate-img" src="~assets/imgs/operator_icon.svg" />
                {{ operatorInfo ? operatorInfo.name : '--' }}
            </span>
        </div>
    </div>
</template>

<script>
import tooltips from 'components/tooltips';

export default {
    components: { tooltips },
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
        }
    },
    methods: {
        _showDetail(tab = 'token') {
            if (tab === 'operator' && !this.operatorInfo) {
                tab = 'token';
            }
            this.showDetail(tab);
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
    font-size: 12px;
    @include font-family-bold();
    font-weight: 600;
    color: rgba(29, 32, 36, 1);
    line-height: 14px;
    margin-left: 36px;

    .symbol {
        position: relative;
        white-space: nowrap;
        line-height: 20px;
        &:first-child {
            font-size: 16px;
        }
        &.ttoken {
            color: #5E6875;
        }
    }
    .mining {
        position: relative;
        .tips {
            display: none;
            @include font-family-normal();
        }
        &:hover {
            .tips {
                display: inline-block;
            }
        }
        img {
            margin-bottom: -1px;
        }
    }
    .gate {
        @include font-family-normal();
        color: #007AFF;
        display: flex;
        margin-top: 2px;
        .gate-img {
            width: 14px;
            height: 14px;
            margin-bottom: -3px;
        }
    }
}
</style>
