<template>
    <div>
        <list-view v-show="content && content.length" class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="inviteHeadList" :contentList="content"></mining-table>
        </list-view>
        <no-data v-show="!content || !content.length"></no-data>
    </div>
</template>

<script>
import { getInviteMiningDetail } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import listView from 'h5Components/listView.vue';
import noData from 'h5Components/noData';
import miningTable from '../table';

export default {
    components: { noData, miningTable, listView },
    data() {
        return {
            inviter: null,
            isInit: false,
            inviteCurrentPage: 0,
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
    computed: {
        content() {
            return this.inviteList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, 8) } ${ item.miningToken }`,
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

                this.$emit('setMiningOrderTotal', data.miningTotal
                    ? bigNumber.formatNum(data.miningTotal, 8)
                    : 0);

                this.inviteListTotal = data.total || 0;
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
// @import "~h5Assets/scss/vars.scss";

.list-wrapper-view {
    max-height: 450px;
}
</style>
