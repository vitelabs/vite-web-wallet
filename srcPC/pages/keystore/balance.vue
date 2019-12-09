<template>
    <div>
        <div>Balance</div><br/>
        <wallet-table :headList="headList" :contentList="balanceList"></wallet-table>
        <br/><div>Unreceived</div><br/>
        <wallet-table :headList="headList" :contentList="onroadList"></wallet-table>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import { viteClient } from 'services/apiServer';
import walletTable from 'pcComponents/table/index.vue';

let balanceTimer = null;

export default {
    components: { walletTable },
    beforeMount() {
        this.startLoopBalance();
    },
    destroyed() {
        this.stopLoopBalance();
    },
    props: {
        address: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            headList: [ {
                text: 'Token Symbol',
                cell: 'tokenSymbol',
                class: 'keystore-table-item'
            }, {
                text: 'Balance',
                cell: 'balance',
                class: 'keystore-table-item'
            }, {
                text: 'Token Id',
                cell: 'tokenId',
                class: 'keystore-table-item'
            } ],
            balance: null
        };
    },
    computed: {
        balanceList() {
            if (!this.balance || !this.balance.balance) {
                return [];
            }
            return this.getList(this.balance.balance);
        },
        onroadList() {
            if (!this.balance || !this.balance.unreceived) {
                return [];
            }
            return this.getList(this.balance.unreceived);
        }
    },
    methods: {
        getList(balance) {
            if (!balance.balanceInfoMap) {
                return [];
            }

            const list = [];
            const tokenBalanceInfoMap = balance.balanceInfoMap;
            for (const tokenId in tokenBalanceInfoMap) {
                if (!tokenBalanceInfoMap[tokenId]) {
                    continue;
                }

                const tokenInfo = tokenBalanceInfoMap[tokenId].tokenInfo;
                const totalAmount = bigNumber.toBasic(tokenBalanceInfoMap[tokenId].balance, tokenInfo.decimals);

                if (!tokenInfo || !+totalAmount) {
                    continue;
                }

                list.push({
                    tokenId,
                    tokenSymbol: tokenInfo.tokenSymbol,
                    balance: totalAmount
                });
            }
            return list;
        },

        startLoopBalance() {
            this.stopLoopBalance();

            balanceTimer = new timer(() => {
                viteClient.getBalanceInfo(this.address).then(data => {
                    this.balance = data;
                    this.$emit('updateBalance', data);
                });
            }, 2000);

            balanceTimer.start();
        },
        stopLoopBalance() {
            balanceTimer && balanceTimer.stop();
            balanceTimer = null;
        }
    }
};
</script>
