<template>
    <div class="tx-pair-info">
        <div class="token-img" @click="_showDetail('token')">
            <img v-show="ftokenIcon" :src="ftokenIcon"/>
            <div v-show="activeTxPairIsClose" class="close"></div>
        </div>

        <div class="info">
            <div class="symbol-wrapper">
                <span @click="_showDetail('token')">{{ ftokenDetail ? ftokenDetail.symbol : '' }}</span>
                <span @click="_showDetail('token')" class="ttoken">
                    /{{ ttokenDetail ? ttokenDetail.symbol : '' }}
                </span>
                <img class="mining" src="~h5Assets/imgs/mining.png"/>
                <img v-if="isSupportSwitch" @click="switchTxPair" class="mining" src="~h5Assets/imgs/down.svg"/>
            </div>
            <div class="gate" @click="_showDetail('operator')">
                <img class="gate-img" :src="operatorIcon" />
                {{ operatorInfo ? operatorInfo.name : $t('tradeCenter.operator.noName') }}
            </div>
        </div>

        <div v-show="canFavorite" class="favorite" @click="toggleFavorite" :class="{ 'active': isFavorite }"></div>
    </div>
</template>

<script>
import operatorIcon from 'h5Assets/imgs/operator_default.svg';
import { bridge } from 'h5Utils/bridge';
import { getTokenIcon } from 'utils/tokenParser';

export default {
    props: {
        showDetail: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        canFavorite() {
            return this.activeTxPair && this.$store.state.favoriteTxPair.canFavorite;
        },
        isFavorite() {
            if (!this.activeTxPair) {
                return false;
            }
            return this.$store.state.favoriteTxPair.favoriteList.indexOf(this.activeTxPair.symbol) > -1;
        },
        isMining() {
            return this.$store.getters.activeTxPairIsMining;
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
            return getTokenIcon(this.ftokenDetail ? this.ftokenDetail.tokenId : null);
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
        isSupportSwitch() {
            const bridgeUnsupportList = this.$store.getters.bridgeUnsupportList;
            return bridgeUnsupportList.indexOf('pri.switchPair') === -1;
        }
    },
    methods: {
        _showDetail(tab = 'token') {
            this.showDetail && this.showDetail(tab);
        },
        toggleFavorite() {
            const action = this.isFavorite ? 'exDeletetFavorite' : 'exSetFavorite';
            this.$store.dispatch(action, this.activeTxPair.symbol).catch(err => {
                this.$toast(this.$t('hint.operateFail'), err);
                console.warn(err);
            });
        },
        switchTxPair() {
            bridge['pri.switchPair']().then(data => {
                this.$store.commit('switchTradePair', data);
                this.$store.dispatch('dexFetchActiveTxPair');
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('hint.operateFail'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Assets/scss/vars.scss';

.tx-pair-info {
    padding-bottom: 16px;
    border-bottom: 1px dashed rgba(211,223,239,1);
}

.token-img {
    width: 44px;
    height: 44px;
    display: inline-block;
    margin-right: 10px;
    img {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 40px;
        border: 1px solid #d4dee7;
        box-sizing: border-box;
    }
    .close {
        position: absolute;
        display: inline-block;
        width: 100%;
        height: 100%;
        border-radius: 40px;
        background: rgba(0,0,0,0.5);
        z-index: 100;
        left: 0;
    }
}

.info {
    display: inline-block;
    .symbol-wrapper {
        display: flex;
        align-items: center;
        font-size: 16px;
        @include font-bold();
        color: rgba(36,39,43,1);
        margin-bottom: 11px;
        .ttoken {
            font-size: 12px;
            color: rgba(62,74,89,0.3);
            margin-left: 2px;
        }
        .mining {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 6px;
        }
    }
    .gate {
        font-size: 12px;
        @include font-normal();
        color: $blue;
        display: flex;
        align-items: center;
        img {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 2px;
            border: 1px solid rgba(212,222,231,1);
            margin-right: 4px;
            box-sizing: border-box;
        }
    }
}

.favorite {
    float: right;
    background: url('~h5Assets/imgs/favorite-default.svg');
    width: 28px;
    height: 28px;
    background-size: 100% 100%;
    margin-top: -5px;
    &.active {
        background: url('~h5Assets/imgs/favorite.svg');
    }
}
</style>
