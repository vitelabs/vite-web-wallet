<template>
    <div>
        <div class="__center-title">{{ $t('exchange.latestTrans.title') }}</div>
        <div class="__center-tb-title">
            <span class="__center-tb-item">
                {{ $t('exchange.latestTx.price', { price: activeTxPair.tTokenShow })}}
            </span>
            <span class="__center-tb-item">
                {{ $t('exchange.latestTx.amount', { amount: activeTxPair.fTokenShow})}}
            </span>
            <span class="__center-tb-item tx-time">{{ $t('exchange.latestTx.time') }}</span>
        </div>
        <div class="__center-tb-row" @click="clickRow(tx)" 
             v-for="(tx, i) in latestTxList" :key="i">
            <span class="__center-tb-item">{{ tx.price }}</span>
            <span class="__center-tb-item">{{ tx.num }}</span>
            <span class="__center-tb-item tx-time">{{ getDate(tx.time) }}</span>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';

export default {
    computed: {
        latestTxList() {
            return this.$store.state.exchangeLatestTx.txList;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
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

.__center-tb-item.tx-time {
    flex-basis: 30px;
}
</style>
