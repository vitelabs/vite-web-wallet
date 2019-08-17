<template>
    <div class="trade-mining-wrapper">
        <div class="tab_title">
            <div class="tab_title_item" @click="tabName = 'trade'" :class="{active:tabName==='trade'}">
                <img src="~assets/imgs/exchange/mining/trade.png" />
                <div>
                    <div class="label">{{$t('tradeMining.txTitle')}}</div>
                    <div class="amount">{{tradeMiningTotal}} VX</div>
                </div>
            </div>
            <div class="tab_title_item" @click="tabName = 'staking'" :class="{active:tabName==='staking'}">
                <img src="~assets/imgs/exchange/mining/staking.png" />
                <div>
                    <div class="label">{{$t('tradeMining.quotaTitle')}}</div>
                    <div class="amount">{{stakingMiningTotal}} VX</div>
                </div>
            </div>
            <div class="tab_title_item" @click="tabName = 'invite'" :class="{active:tabName==='invite'}">
                <img src="~assets/imgs/exchange/mining/invite.png" />
                <div>
                    <div class="label">{{$t('inviteMining.title')}}</div>
                    <div class="amount">{{inviteMiningTotal}} VX</div>
                </div>
            </div>
            <div class="tab_title_item" @click="tabName = 'order'" :class="{active:tabName==='order'}">
                <img src="~assets/imgs/exchange/mining/order.png" />
                <div>
                    <div class="label">{{$t('orderMining.title')}}</div>
                    <div class="amount">{{orderMiningTotal}} VX</div>
                </div>
            </div>
        </div>
        <div class="tab_container">
            <tradeMinComp v-if="tabName === 'trade'"></tradeMinComp>
            <stakingMinComp v-if="tabName === 'staking'"></stakingMinComp>
            <inviteMinComp v-if="tabName === 'invite'"></inviteMinComp>
            <orderMinComp v-if="tabName === 'order'"></orderMinComp>
        </div>
    </div>
</template>
<script>
import confirm from 'components/confirm/index.js';
import { miningTrade, miningPledge } from 'services/trade';
import {
    getInviteMiningDetail,
    getOrderMiningDetail
} from 'services/tradeOperation';

import openUrl from 'utils/openUrl';
import inviteMinComp from './invite.vue';
import orderMinComp from './order.vue';
import tradeMinComp from './trade.vue';
import stakingMinComp from './staking.vue';

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
            tabName: 'trade'
        };
    },
    mounted() {
        // Temporary coming soon alert
        confirm({
            size: 'small',
            type: 'description',
            title: this.$t('tradeMining.hintTitle'),
            singleBtn: true,
            closeBtn: { show: true },
            leftBtn: {
                text: this.$t('tradeMining.more'),
                click: () => {
                    this.goLink();
                }
            },
            content: this.$t('tradeMining.comingHint')
        });
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
        init() {
            if (!this.address) return;
            const address = this.address;
            Promise.all([
                miningTrade({ address }).then(data => (this.tradeMiningTotal = data.miningTotal)),
                miningPledge({ address }).then(data => (this.stakingMiningTotal = data.miningTotal)),
                getInviteMiningDetail({ address }).then(data => (this.inviteMiningTotal = data.miningTotal)),
                getOrderMiningDetail({ address }).then(data => (this.orderMiningTotal = data.miningTotal))
            ]);
        },
        goLink() {
            if (this.$i18n.locale === 'zh') {
                openUrl('https://dex.vite.wiki/zh/dex/#%E6%8C%96%E7%9F%BF%E6%96%B9%E6%A1%88v');
            }
            openUrl('https://dex.vite.wiki/dex/#vx-mining');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.tab_title{
    display: flex;
    margin-bottom: 12px;
    padding: 22px 0;
    &_item{
        cursor: pointer;
        user-select: none;
        flex-grow: 1;
        padding: 20px 0 20px 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &.active{
            background: rgba(0,122,255,0.04);
            border-bottom: 2px solid rgba(0,122,255,1);;
        }
        img{
            margin-right: 20px;
            height: 34px;
            width: 34px;
        }
        @include font-family-bold();
        .label{
            font-size: 13px;
            color: #5E6875;
        }
        .amount{
            font-size: 16px;
            color:#1D2024;
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
.tab_container{
    flex-grow: 1;
}
/deep/ .trade-mining-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 350px;

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
        .quota-detail {
            border-bottom: 1px solid #d4dee7;
            box-sizing: border-box;
            .no-detail {
                box-sizing: border-box;
                padding: 16px 30px;
                width: 100%;
                line-height: 48px;
                text-align: center;
                font-size: 16px;
                @include font-family-bold();
                color: rgba(0, 122, 255, 1);
                font-weight: 600;
                &:before {
                    content: " ";
                    display: inline-block;
                    width: 13px;
                    height: 13px;
                    background: url("~assets/imgs/addStaking.svg");
                    background-size: 100% 100%;
                    margin-right: 6px;
                    margin-bottom: -1px;
                }
            }
        }
        .tb {
            flex: 1;
            box-shadow: none;
        }
    }
}
.link {
    color: #007aff;
    text-decoration: underline;
}
</style>
