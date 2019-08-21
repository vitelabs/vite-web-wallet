<template>
    <div class="trade-center-wrapper">
        <center-head></center-head>
        <div class="white-wrapper">
            <limit-price></limit-price>
            <depth></depth>
        </div>
        <div class="white-wrapper">
            <div class="order-tab">{{ $t('tradeOpenOrders.title') }}</div>
            <openOrder></openOrder>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import confirm from 'components/confirm/index.js';
import openOrder from 'h5Components/orderOpen.vue';
import depth from './depth/depth.vue';
import limitPrice from './limitPrice/limitPrice.vue';
import centerHead from './head/head.vue';

export default {
    components: { depth, limitPrice, centerHead, openOrder },
    mounted() {
        this.$store.dispatch('init');
        this.$store.dispatch('updateMarketMap');
        this.$store.dispatch('getMarketsClosed');
        this.$store.dispatch('exFetchLimitAmounts');
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

            const _price = BigNumber.multi(this.activeTxPair.closePrice || 0, this.rate || 0, 6);
            const _realPrice = BigNumber.normalFormatNum(_price, 6);
            const _realPrice2 = BigNumber.normalFormatNum(_realPrice, 2);

            if (+_realPrice2 !== 0) {
                return pre + BigNumber.onlyFormat(_realPrice2, 2);
            }
            return pre + BigNumber.onlyFormat(_realPrice, 2);
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
@import "~h5Assets/scss/vars.scss";

.trade-center-wrapper {
    font-size: 12px;
    background: rgba(243,245,249,1);
}
.white-wrapper {
    padding: 16px 24px;
    background: #fff;
    margin-bottom: 16px;
}
.order-tab {
    margin-bottom: 10px;
    line-height: 20px;
    font-size: 14px;
    @include font-bold();
    color: rgba(62,74,89,1);
}
</style>
