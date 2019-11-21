<template>
    <div class="trade-mining-wrapper">
        <div class="fee-title">
            {{ $t('tradeMining.todayTrade') }}
            <span class="link __pointer" @click="goView">{{ $t('tradeMining.view') }}</span>
        </div>

        <div class="tab_title">
            <div
                class="tab_title_item"
                @click="tabName = 'trade'"
                :class="{ active: tabName === 'trade' }"
            >
                <img src="~assets/imgs/exchange/mining/trade.png" />
                <div>
                    <div class="label">{{ $t("tradeMining.txTitle") }}
                        <span class="help __pointer" @mouseenter="showHelp" @mouseleave="hideHelp">
                            <span v-show="isShowHelp" class="help-text">{{ $t('tradeMining.help') }}</span>
                        </span>
                    </div>
                    <div class="amount">
                        {{ tradeMiningTotal | formatNum }} VX
                    </div>
                </div>
            </div>
            <div class="gap"></div>
            <div
                class="tab_title_item"
                @click="tabName = 'staking'"
                :class="{ active: tabName === 'staking' }"
            >
                <img src="~assets/imgs/exchange/mining/staking.png" />
                <div>
                    <div class="label">{{ $t("tradeMining.quotaTitle") }}</div>
                    <div class="amount">
                        {{ stakingMiningTotal | formatNum }} VX
                    </div>
                </div>
            </div>
            <div class="gap"></div>
            <div
                class="tab_title_item"
                @click="tabName = 'invite'"
                :class="{ active: tabName === 'invite' }"
            >
                <img src="~assets/imgs/exchange/mining/invite.png" />
                <div>
                    <div class="label">{{ $t("inviteMining.title") }}</div>
                    <div class="amount">
                        {{ inviteMiningTotal | formatNum }} VX
                    </div>
                </div>
            </div>
            <div class="gap"></div>
            <div
                class="tab_title_item"
                @click="tabName = 'order'"
                :class="{ active: tabName === 'order' }"
            >
                <img src="~assets/imgs/exchange/mining/order.png" />
                <div>
                    <div class="label">{{ $t("orderMining.title") }}</div>
                    <div class="amount">
                        {{ orderMiningTotal | formatNum }} VX
                    </div>
                </div>
            </div>
        </div>

        <tradeMinComp v-if="tabName === 'trade'"></tradeMinComp>
        <stakingMinComp v-if="tabName === 'staking'"></stakingMinComp>
        <inviteMinComp v-if="tabName === 'invite'"></inviteMinComp>
        <orderMinComp v-if="tabName === 'order'"></orderMinComp>
    </div>
</template>

<script>
import openUrl from 'utils/openUrl';
import { miningTrade, miningPledge, getInviteMiningDetail, getOrderMining } from 'services/trade';
import inviteMinComp from './invite/invite.vue';
import orderMinComp from './order.vue';
import tradeMinComp from './trade.vue';
import stakingMinComp from './staking/staking.vue';

export default {
    components: {
        inviteMinComp,
        orderMinComp,
        tradeMinComp,
        stakingMinComp
    },
    data() {
        return {
            tradeMiningTotal: 0,
            stakingMiningTotal: 0,
            inviteMiningTotal: 0,
            orderMiningTotal: 0,
            tabName: 'trade',
            isShowHelp: false
        };
    },
    beforeMount() {
        this.$store.dispatch('getCurrentVxMineInfo');
        this.$store.dispatch('getMinThresholdForTradeAndMining');
    },
    mounted() {
        this.init();
    },
    computed: {
        stakeContent() {
            return this.dealList(this.stakeList);
        },
        stakeTotalPage() {
            return Math.ceil(this.stakeListTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        address() {
            this.init();
        }
    },
    methods: {
        showHelp() {
            this.isShowHelp = true;
        },
        hideHelp() {
            this.isShowHelp = false;
        },
        init() {
            if (!this.address) return;
            const address = this.address;
            Promise.all([
                miningTrade({ address }).then(data => (this.tradeMiningTotal = data.miningTotal)),
                miningPledge({ address }).then(data => (this.stakingMiningTotal = data.miningTotal)),
                getInviteMiningDetail({ address }).then(data => (this.inviteMiningTotal = data.allMiningTotal)),
                getOrderMining({ address }).then(data => (this.orderMiningTotal = data.miningTotal))
            ]);
        },
        goLink() {
            if (this.$i18n.locale === 'zh') {
                openUrl('https://dex.vite.wiki/zh/dex/#%E6%8C%96%E7%9F%BF%E6%96%B9%E6%A1%88v');
            }
            openUrl('https://dex.vite.wiki/dex/#vx-mining');
        },
        goView() {
            openUrl('https://vitex.net/');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.help {
    position: relative;
    background: url('~assets/imgs/info.svg');
    background-size: 100% 100%;
    width: 16px;
    height: 16px;
    display: inline-block;
    margin-bottom: -3px;
    .help-text {
        position: absolute;
        top: 25px;
        right: 8px;
        width: 200px;
        padding: 10px;
        background: #fff;
        transform: translateX(50%);
        box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
        border-radius: 2px;
        font-family: $font-H;
        color: #5e6875;
        font-size: 12px;
        line-height: 16px;
        &:after {
            position: absolute;
            content: ' ';
            top: 0;
            left: 50%;
            transform: translate(-50%, -100%);
            display: inline-block;
            border: 6px solid transparent;
            border-bottom: 6px solid #fff;
        }
    }
}

.trade-mining-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.fee-title {
    font-size: 18px;
    line-height: 22px;
    padding: 10px 0 14px;
    display: flex;
    align-items: center;
    @include font-family-bold();
    color: rgba(36,39,43,1);
    .link {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #007aff;
        margin-left: 14px;
        &::before {
            display: inline-block;
            content: ' ';
            width: 16px;
            height: 16px;
            background: url('~assets/imgs/info_link.svg');
            background-size: 100% 100%;
            margin-right: 5px;
        }
    }
}

.tab_title {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    background-color: #ffffff;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    .gap{
        width: 0;
        border-left: 1px solid rgba(227, 235, 245, 0.6);
        height: 60px;

    }
    &_item {
        cursor: pointer;
        user-select: none;
        flex-grow: 1;
        padding: 20px 0 20px 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        @include font-family-bold();
        &.active {
            background: rgba(0, 122, 255, 0.04);
            border-bottom: 2px solid rgba(0, 122, 255, 1);
        }
        img {
            margin-right: 20px;
            height: 34px;
            width: 34px;
        }
        .label {
            font-size: 13px;
            color: #5e6875;
        }
        .amount {
            font-size: 16px;
            color: #1d2024;
            line-height: 18px;
        }
    }
}

/deep/ .trade-mining-section {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.shadow {
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
        border-radius: 2px;
    }
    .no-shadow {
        box-shadow: none;
        border-radius: none;
    }
    .mint-trade-table {
        flex: 1;
    }
}
</style>
