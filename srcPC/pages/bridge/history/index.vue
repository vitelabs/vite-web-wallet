<template>
    <wallet-table
        :headList="headList"
        :contentList="contentList"
    ></wallet-table>
</template>

<script>
import walletTable from 'pcComponents/table/index.vue';
import { getTxs } from 'pcServices/conversion';
export default {
    props: [],
    components: { walletTable },
    mounted() {
        const address = this.$store.state.wallet.currHDAcc?.activeAddr;
        getTxs({ fromAddress: address, fromNet: 'VITE' }).then(result => {
            if (result && result.code === 0) {
                const data = result.data;
                (data || []).forEach(item => {
                    item['status'] = item.toHash ? 'success' : 'pending';
                });
                this.contentList = data;
            } else {
                this.contentList = [];
            }
        });
    },
    data() {
        return {
            headList: [
                {
                    text: 'Token',
                    cell: 'token',
                    class: 'keystore-table-item'
                },
                {
                    text: 'Time',
                    cell: 'time',
                    class: 'keystore-table-item'
                },
                {
                    text: 'Amount',
                    cell: 'amount',
                    class: 'keystore-table-item'
                },
                {
                    text: 'Status',
                    cell: 'status',
                    class: 'keystore-table-item'
                },
                {
                    text: 'From',
                    cell: 'fromAddress',
                    class: 'keystore-table-item'
                },
                {
                    text: 'To',
                    cell: 'toAddress',
                    class: 'keystore-table-item'
                },
                {
                    text: 'Fee',
                    cell: 'fee',
                    class: 'keystore-table-item'
                }
            ],
            contentList: []
        };
    }
};
</script>
