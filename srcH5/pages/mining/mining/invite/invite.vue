<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${inviteTotal}`"
                   :title="$t('mobileMining.inviteTotalIncome', {token: 'VX'})">
            <div class="operation border_t">
                <div class="item">
                    <div class="item-title">
                        <img src="~h5Assets/imgs/invite.svg" />{{ $t("tradeMining.inviteCount") }}
                    </div>
                    <div class="bold">{{ inviter ? inviter.inviteCount || 0 : 0 }}</div>
                </div>
                <div class="item">
                    <div class="item-title">
                        <img src="~h5Assets/imgs/invite.svg" />{{ $t("inviteMining.inviteTradeIncome") }}
                    </div>
                    <div class="bold">{{ miningTradeTotal }}</div>
                </div>
            </div>
            <div class="operation">
                <div class="item">
                    <div class="item-title">
                        <img src="~h5Assets/imgs/invite.svg" />{{ $t("inviteMining.inviteOrderIncome") }}
                    </div>
                    <div class="bold">{{ miningOrderTotal }}</div>
                </div>
            </div>
        </my-income>
        <list-title :title="isShowMiningOrder ? $t('mobileMining.inviteOrderIncome') : $t('mobileMining.inviteTradeIncome')">
            <div class="more" @click="toggleMore">
                <div v-show="isShowMore" class="more-wrapper">
                    <div @click="showMiningTrade" class="more-item">{{ $t('mobileMining.inviteTradeIncome') }}</div>
                    <div @click="showMiningOrder" class="more-item">{{ $t('mobileMining.inviteOrderIncome') }}</div>
                </div>
            </div>
        </list-title>
        <mining-trade-list v-show="!isShowMiningOrder" @setMiningTotal="setMiningTotal" @setMiningTradeTotal="setMiningTradeTotal"></mining-trade-list>
        <mining-order-list v-show="isShowMiningOrder" @setMiningOrderTotal="setMiningOrderTotal"></mining-order-list>
    </div>
</template>

<script>
import { getInviteInfo } from 'services/trade';
import listView from 'h5Components/listView.vue';
import noData from 'h5Components/noData';
import myIncome from '../myIncome';
import miningTable from '../table';
import listTitle from '../listTitle.vue';
import miningOrderList from './miningOrderList.vue';
import miningTradeList from './miningTradeList.vue';

export default {
    components: { noData, miningTable, myIncome, listView, listTitle, miningTradeList, miningOrderList },
    data() {
        return {
            inviter: null,
            inviteTotal: 0,
            miningOrderTotal: 0,
            miningTradeTotal: 0,
            isShowMiningOrder: false,
            isShowMore: false
        };
    },
    beforeMount() {
        this.getInviteInfo();
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        showMiningOrder() {
            this.isShowMiningOrder = true;
        },
        showMiningTrade() {
            this.isShowMiningOrder = false;
        },
        toggleMore() {
            this.isShowMore = !this.isShowMore;
        },
        setMiningTotal(miningTotal) {
            this.inviteTotal = miningTotal;
        },
        setMiningTradeTotal(miningTradeTotal) {
            this.miningTradeTotal = miningTradeTotal;
        },
        setMiningOrderTotal(miningOrderTotal) {
            this.miningOrderTotal = miningOrderTotal;
        },
        getInviteInfo() {
            getInviteInfo(this.address).then(data => {
                this.inviter = data || null;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.border_t {
    border-top: 1px dashed rgba(211,223,239,1);
    padding-top: 14px;
}
.operation {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    .item {
        flex: 1;
        padding-top: 0;
        &:first-child {
            margin-right: 23px;
        }
        .item-title {
            margin-bottom: 5px;
            img {
                width: 16px;
                height: 16px;
                margin-bottom: -4px;
                margin-right: 2px;
            }
        }
        .bold {
            @include font-bold();
            color: rgba(62,74,89,0.6);
        }
    }
}

.more {
    position: relative;
    display: block;
    width: 16px;
    height: 16px;
    padding: 2px 0 2px 20px;
    background: url('~h5Assets/imgs/mining-more.png') center right no-repeat;
    background-size: 16px 16px;
    float: right;
    margin-bottom: -2px;
    .more-wrapper {
        font-size: 12px;
        position: absolute;
        color: rgba(62,74,89,0.6);
        line-height: 16px;
        top: 23px;
        right: 0;
        z-index: 1;
        padding: 20px 12px;
        background: #fff;
        box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
        border-radius: 2px;
        .more-item {
            white-space: nowrap;
        }
        .more-item:first-child {
            margin-bottom: 20px;
        }
    }
}
</style>
