<template>
    <div class="trade-center-wrapper">
        <layout>
            <center-head slot="lt"></center-head>
            <depth slot="r"></depth>
            <market slot="lb1"></market>
            <center-view slot="lb2"></center-view>
            <latest-tx slot="lb3"></latest-tx>
            <limit-price slot="lb4"></limit-price>
        </layout>

        <order-tab class="order-tab"></order-tab>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import confirm from 'components/confirm/index.js';
import layout from './layout';
import depth from './depth/depth.vue';
import market from './market/market.vue';
import latestTx from './latestTx';
import limitPrice from './limitPrice/limitPrice.vue';
import centerHead from './head/head.vue';
import centerView from './view/view.vue';
import orderTab from './orderTab';

export default {
    components: { layout, depth, market, latestTx, limitPrice, centerHead, centerView, orderTab },
    mounted() {
        this.$store.dispatch('exFetchActiveTxPair');
        this.$store.dispatch('exFetchVip');
        this.$store.dispatch('startLoopDexFundeUnreceived');
        this.$store.commit('exSetRealClosePrice', this.realPrice);

        !this.$store.state.env.isShowCompliance && confirm({
            size: 'small',
            type: 'generalTips',
            title: this.$t('compliance.title'),
            content: this.$t('compliance.text'),
            singleBtn: true,
            leftBtn: {
                text: this.$t('btn.understand'),
                click: this.$store.commit('setComplianceShow')
            }
        });
    },
    destroyed() {
        this.$store.dispatch('stopLoopDexFundUnreceived');
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        quoteTokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        tradeTokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        currency() {
            return this.$store.state.env.currency;
        },
        rate() {
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const tokenId = this.activeTxPair && this.activeTxPair.quoteToken ? this.activeTxPair.quoteToken : null;
            const coin = this.currency;

            if (!tokenId || !rateList[tokenId]) {
                return null;
            }
            return rateList[tokenId][`${ coin }Rate`] || null;
        },
        realPrice() {
            const pre = this.currency === 'cny' ? '¥' : '$';

            if (!this.activeTxPair) {
                return `${ pre }0`;
            }

            const realPrice = BigNumber.multi(this.activeTxPair.closePrice || 0, this.rate || 0, 6);
            return pre + BigNumber.onlyFormat(realPrice, 2);
        }
    },
    watch: {
        realPrice() {
            this.$store.commit('exSetRealClosePrice', this.realPrice);
        },
        address() {
            this.$store.dispatch('exFetchVip');
        },
        quoteTokenDetail() {
            this.$store.dispatch('exSetQuoteTokenDecimals');
        },
        tradeTokenDetail() {
            this.$store.dispatch('exSetTradeTokenDecimals');
        },
        activeTxPair() {
            this.$store.dispatch('exSetTokenDecimals');
        }
    }
};
</script>

<style lang="scss" scoped>
.trade-center-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
.order-tab {
    margin-bottom: 10px;
    min-height: 300px;
}
</style>
