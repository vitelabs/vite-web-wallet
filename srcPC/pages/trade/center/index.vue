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
        <confirm
            v-show="isComplianceDialogVisible"
            :size="'small'"
            :type="'generalTips'"
            :showMask="true"
            :title="$t('compliance.title')"
            :close="closeTrans"
            :singleBtn="true"
            :leftBtnTxt="$t('btn.understand')"
            :leftBtnClick="setComplianceShowed"
        >
            <div>
                <span>{{ $t('compliance.text') }}</span>
                <a href="https://x.vite.net/privacy.html" target="__blank">{{
                    $t('compliance.textLink')
                }}</a>
            </div>
        </confirm>
    </div>
</template>

<script>
import confirm from 'pcComponents/confirm/confirm.vue';
import layout from './layout';
import depth from './depth/depth.vue';
import market from './market/market.vue';
import latestTx from './latestTx';
import limitPrice from './limitPrice/limitPrice.vue';
import centerHead from './head/head.vue';
import centerView from './view/view.vue';
import orderTab from './orderTab';

export default {
    components: {
        layout,
        depth,
        market,
        latestTx,
        limitPrice,
        centerHead,
        centerView,
        orderTab,
        confirm
    },
    methods: {
        setComplianceShowed() {
            this.$store.commit('setComplianceShow');
        }
    },
    mounted() {
        this.$store.dispatch('exFetchActiveTxPair');
        this.$store.dispatch('startLoopDexFundeUnreceived');
        this.$store.dispatch('getMiningSettingInfo');

        // !this.$store.state.env.isShowCompliance
        //     && confirm({
        //         size: 'small',
        //         type: 'generalTips',
        //         title: this.$t('compliance.title'),
        //         content: this.$t('compliance.text'),
        //         singleBtn: true,
        //         leftBtn: {
        //             text: this.$t('btn.understand'),
        //             click: this.$store.commit('setComplianceShow')
        //         }
        //     });
    },
    destroyed() {
        this.$store.dispatch('stopLoopDexFundUnreceived');
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        isComplianceDialogVisible() {
            return !this.$store.state.env.isShowCompliance;
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
