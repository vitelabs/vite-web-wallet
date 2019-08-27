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
        this.$store.dispatch('exFetchVip');
        this.$store.dispatch('exFetchSVip');
        // this.$store.dispatch('exFetchActiveTxPair');
        this.$store.dispatch('startLoopDexFundeUnreceived');

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
        }
    },
    watch: {
        address() {
            this.$store.dispatch('exFetchVip');
            this.$store.dispatch('exFetchSVip');
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
