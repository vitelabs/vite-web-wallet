<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            <div class="tab-list">
                <span @click="clickTab('buy')" class="tab" :class="{'buy': tab === 'buy'}">
                    {{ $t('mobileTradeCenter.buyTitle') }}
                </span><span @click="clickTab('sell')" class="tab" :class="{'sell': tab === 'sell'}">
                    {{ $t('mobileTradeCenter.sellTitle') }}
                </span>
            </div>
            <div class="right-tab">
                <span class="vip" :class="{ 'active': isVip }"></span>
                <span class="vip-operate __pointer" @click="_showVipConfirm"
                      :class="{ 'active': !isVip }">
                    {{ isVip ? $t('trade.limitPrice.cancelVip') : $t('trade.limitPrice.openVip') }}
                </span>
            </div>
        </div>
        <order v-if="tab === 'buy'" orderType="buy"></order>
        <order v-if="tab === 'sell'" orderType="sell"></order>
        <vip-confirm v-if="isShowVipConfirm" :close="hideVipConfirm"></vip-confirm>
    </div>
</template>

<script>
import order from './order.vue';
import vipConfirm from './vipConfirm.vue';
import statistics from 'utils/statistics';

export default {
    components: { order, vipConfirm },
    data() {
        return {
            isShowVipConfirm: false,
            tab: 'buy'
        };
    },
    computed: {
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        clickTab(tab) {
            this.tab = tab;
        },
        hideVipConfirm() {
            this.isShowVipConfirm = false;
        },
        _showVipConfirm() {
            statistics.event(this.$route.name, `switchVIP-${ this.isVip ? 'cancel' : 'open' }`, this.address || '');
            this.showVipConfirm();
        },
        showVipConfirm() {
            this.isShowVipConfirm = true;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.limit-price-wrapper {
    font-size: 14px;
    @include font-normal();

    .__center-title {
        height: 30px;
        line-height: 30px;
        @include font-bold();
        border-bottom: 1px solid rgba(211,223,239,1);
        .tab-list {
            display: inline-block;
            color: rgba(62,74,89,0.7);
            .tab {
                display: inline-block;
                padding: 0 12px;
                border-radius: 2px 2px 0px 0px;
            }
            .buy {
                color: rgba(255,255,255,1);
                background: $green;
            }
            .sell {
                color: rgba(255,255,255,1);
                background: $red;
            }
        }
    }

    .right-tab {
        font-size: 12px;
        float: right;
        @include font-normal();
        color: rgba(94, 104, 117, 1);
    }

    .vip-operate {
        font-size: 14px;
        color: rgba(62,74,89,0.6);
        line-height: 18px;
        &.active {
            color: $blue;
        }
    }

    .vip {
        display: inline-block;
        margin-bottom: -3px;
        width: 36px;
        height: 16px;
        background: url('~assets/imgs/not_vip.svg');
        background-size: 100% 100%;
        margin-right: 10px;
        &.active {
            background: url('~assets/imgs/vip.svg');
            background-size: 100% 100%;
        }
    }
}
</style>
