<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${inviteTotal}`"
                   :title="$t('mobileMining.inviteTotalIncome', {token: 'VX'})">
            <div class="operation">
                <div class="item">
                    <div class="item-title">
                        <img src="~h5Assets/imgs/invite.svg" />{{ $t("tradeMining.inviteCount") }}
                    </div>
                    <div class="bold">{{ inviter ? inviter.inviteCount || 0 : 0 }}</div>
                </div>
                <div class="item">
                    <div class="item-title">
                        <img src="~h5Assets/imgs/invite.svg" />{{ $t("tradeMining.inviteCount") }}
                    </div>
                    <div class="bold">{{ miningOrderTotal }}</div>
                </div>
                <div class="item">
                    <div class="item-title">
                        <img src="~h5Assets/imgs/invite.svg" />{{ $t("tradeMining.inviteCount") }}
                    </div>
                    <div class="bold">{{ miningTradeTotal }}</div>
                </div>
            </div>
        </my-income>
        <list-title></list-title>
        <mining-order-list @setMiningOrderTotal="setMiningOrderTotal"></mining-order-list>
        <!-- <mining-trade-list @setMiningOrderTotal="setMiningOrderTotal"></mining-trade-list> -->
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
            miningTradeTotal: 0
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

.operation {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    border-top: 1px dashed rgba(211,223,239,1);
}
.item {
    flex: 1;
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
    }
}
</style>
