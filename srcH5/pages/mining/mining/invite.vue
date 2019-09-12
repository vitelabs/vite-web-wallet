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
            </div>
        </my-income>
        <list-title></list-title>
        <list-view v-show="content && content.length" class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="inviteHeadList" :contentList="content"></mining-table>
        </list-view>
        <no-data v-show="!content || !content.length"></no-data>
    </div>
</template>

<script>
import { getInviteMiningDetail, getInviteInfo } from 'services/trade';
import myIncome from './myIncome';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import miningTable from './table';
import listView from 'h5Components/listView.vue';
import listTitle from './listTitle.vue';
import noData from 'h5Components/noData';

export default {
    components: { noData, miningTable, myIncome, listView, listTitle },
    data() {
        return {
            inviter: null,
            isInit: false,
            inviteCurrentPage: 0,
            inviteTotal: 0,
            inviteListTotal: 0,
            inviteList: [],
            inviteHeadList: [
                {
                    text: this.$t('tradeMining.tbHead.fee'),
                    cell: 'fee'
                },
                { cell: 'amount' },
                { cell: 'date' }
            ]
        };
    },
    beforeMount() {
        this.fetchMiningInvite();
        this.getInviteInfo();
    },
    watch: {
        address() {
            this.inviteListTotal = 0;
            this.inviteCurrentPage = 0;
            this.inviteTotal = 0;
            this.inviteList = [];
            this.isInit = false;
            this.inviter = null;
            this.fetchMiningInvite();
            this.getInviteInfo();
        }
    },
    computed: {
        content() {
            return this.inviteList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, 8) } ${
                        item.miningToken
                    }`,
                    amount: {
                        amount: `${ bigNumber.formatNum(item.miningAmount || 0, 8) }`,
                        token: 'VX'
                    }
                };
            });
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        reachEnd() {
            this.fetchMiningInvite(this.inviteCurrentPage + 1);
        },
        fetchMiningInvite(pageNumber) {
            const offset = (pageNumber || 0) * 30;
            if (this.isInit && offset >= this.inviteListTotal) {
                return;
            }

            getInviteMiningDetail({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.inviteListTotal = data.total || 0;
                this.inviteTotal = data.miningTotal
                    ? bigNumber.formatNum(data.miningTotal, 8)
                    : 0;
                this.inviteCurrentPage = pageNumber || 0;
                const list = data.miningList || [];
                this.inviteList = [].concat(this.inviteList, list);
                this.isInit = true;
            }).catch(err => {
                console.warn(err);
            });
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

.list-wrapper-view {
    max-height: 450px;
}

.staking-income-wrapper {
    background: url('~h5Assets/imgs/big_bg.png') no-repeat;
    background-size: cover;
}
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
