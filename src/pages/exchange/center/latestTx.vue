<template>
    <div class="ex-latest-tx-wrapper">
        <div class="__center-title">{{ $t('exchange.latestTx.title') }}</div>
        <div class="__center-tb-title">
            <span class="__center-tb-item">
                {{ $t('exchange.latestTx.price', { 
                    price: activeTxPair && activeTxPair.tTokenShow ? activeTxPair.tTokenShow : '' 
                })}}
            </span>
            <span class="__center-tb-item">
                {{ $t('exchange.latestTx.amount', { 
                    amount: activeTxPair && activeTxPair.fTokenShow ? activeTxPair.fTokenShow : ''
                })}}
            </span>
            <span class="__center-tb-item tx-time">{{ $t('exchange.latestTx.time') }}</span>
        </div>

        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <div class="__center-tb-row __pointer" @click="clickRow(tx)" 
             v-for="(tx, i) in latestTxList" :key="i">
            <span class="__center-tb-item"  :class="{
                'buy': tx.txSide === 0,
                'sell': tx.txSide === 1
            }">{{ tx.price }}</span>
            <span class="__center-tb-item">{{ tx.quantity }}</span>
            <span class="__center-tb-item tx-time">{{ getDate(tx.txTime) }}</span>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
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
        }
    },
    methods: {
        getDate(timestamp) {
            return date(timestamp, 'zh');
        },
        clickRow(trans) {
            console.log(trans);
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

.ex-latest-tx-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.__center-tb-item.tx-time {
    flex-basis: 30px;
}
</style>
