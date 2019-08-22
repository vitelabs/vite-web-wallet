<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${inviteTotal}`"
                   :title="$t('mobileMining.inviteTotalIncome', {token: 'VX'})">
        </my-income>
        <list-title></list-title>
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="inviteHeadList" :contentList="content"></mining-table>
        </list-view>
    </div>
</template>

<script>
import { getInviteMiningDetail } from 'h5Services/tradeOperation';
import myIncome from './myIncome';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import miningTable from './table';
import listView from 'h5Components/listView.vue';
import listTitle from './listTitle.vue';

export default {
    components: { miningTable, myIncome, listView, listTitle },
    data() {
        return {
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
    },
    watch: {
        address() {
            this.inviteListTotal = 0;
            this.inviteCurrentPage = 0;
            this.inviteTotal = 0;
            this.inviteList = [];
            this.isInit = false;
            this.fetchMiningInvite();
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
        }
    }
};
</script>

<style lang="scss" scoped>
.list-wrapper-view {
    max-height: 450px;
}
</style>
