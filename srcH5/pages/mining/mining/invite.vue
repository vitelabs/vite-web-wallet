<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${inviteTotal}`"
                   :title="$t('mobileMining.inviteTotalIncome', {token: 'VX'})">
        </my-income>

        <mining-table :headList="inviteHeadList" :contentList="content"></mining-table>
        <!-- <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="inviteCurrentPage + 1"
                :toPage="fetchMiningInvite"
                :totalPage="inviteTotalPage"
            ></pagination> -->
    </div>
</template>

<script>
import pagination from 'components/pagination.vue';
import { getInviteMiningDetail } from 'h5Services/tradeOperation';
import myIncome from './myIncome';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import miningTable from './table';

export default {
    components: { miningTable, pagination, myIncome },
    data() {
        return {
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
        inviteTotalPage() {
            return Math.ceil(this.inviteListTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        fetchMiningInvite(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            getInviteMiningDetail({
                address: this.address,
                offset
            })
                .then(data => {
                    if (!data) {
                        return;
                    }
                    this.inviteListTotal = data.total || 0;
                    this.inviteCurrentPage = pageNumber ? pageNumber - 1 : 0;
                    this.inviteTotal = data.miningTotal
                        ? bigNumber.formatNum(data.miningTotal, 8)
                        : 0;
                    this.inviteList = data.miningList || [];
                })
                .catch(err => {
                    console.warn(err);
                });
        }
    }
};
</script>
