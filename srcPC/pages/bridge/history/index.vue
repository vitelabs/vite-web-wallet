<template>
    <wallet-table :headList="headList" :contentList="contentList"></wallet-table>
</template>

<script>
import walletTable from 'pcComponents/table/index.vue';
import { getTxs } from 'pcServices/conversion';
export default {
    props: [ 'fromAdr', 'to', 'fromAddress', 'toAddress', 'desc', 'tokenSymbol' ],
    components: { walletTable },
    mounted() {
        const { from, to, fromAddress, toAddress, desc } = this.$props;
        getTxs({ from, to, fromAddress, toAddress, desc }).then(data => {
            (data || []).forEach(item => {
                item['status'] = item.toHash ? 'success' : 'pending';
            });
            this.contentList = data;
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
