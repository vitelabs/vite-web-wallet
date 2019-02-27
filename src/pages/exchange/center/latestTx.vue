<template>
    <div class="ex-latest-tx-wrapper">
        <div class="__center-title">{{ $t('exchange.latestTx.title') }}</div>
        <div class="__center-tb-title">
            <span class="__center-tb-item">
                {{ $t('exchange.priceTitle', { 
                    price: activeTxPair && activeTxPair.ttokenShow ? activeTxPair.ttokenShow : '' 
                }) }}
            </span>
            <span class="__center-tb-item">
                {{ $t('exchange.amountTitle', { 
                    amount: activeTxPair && activeTxPair.ftokenShow ? activeTxPair.ftokenShow : ''
                })}}
            </span>
            <span class="__center-tb-item tx-time">{{ $t('exchange.latestTx.time') }}</span>
        </div>

        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <div class="tx-list-wrapper">
            <div class="__center-tb-row __pointer" @click="clickRow(tx)" 
                 v-for="(tx, i) in latestTxList" :key="i">
                <span class="__center-tb-item"  :class="{
                    'buy': tx.txSide === 0,
                    'sell': tx.txSide === 1
                }">{{ formatNum(tx.price, 'ttoken') }}</span>
                <span class="__center-tb-item">{{ formatNum(tx.quantity, 'ftoken') }}</span>
                <span class="__center-tb-item tx-time">{{ getDate(tx.txTime * 1000) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import BigNumber from 'utils/bigNumber';
import loading from 'components/loading';

export default {
    components: {
        loading
    },
    destroyed() {
        this.$store.dispatch('exStopLatestTimer');
    },
    computed: {
        latestTxList() {
            return this.$store.state.exchangeLatestTx.txList;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        isLoading() {
            return this.$store.state.exchangeLatestTx.isLoading;
        },
        ttoken() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        ftoken() {
            return this.$store.state.exchangeTokens.ftoken;
        }
    },
    methods: {
        formatNum(num, type) {
            if (!this[type]) {
                return BigNumber.formatNum(num);
            }
            return BigNumber.formatNum(num, this[type].tokenDigit); 
        },
        getDate(timestamp) {
            return date(timestamp, 'zh', true);
        },
        clickRow(tx) {
            this.$store.commit('exSetActiveTx', tx);
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

.ex-latest-tx-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}
.__center-tb-item.tx-time {
    flex-basis: 30px;
}
.tx-list-wrapper {
    flex: 1;
    overflow: auto;
}
</style>
