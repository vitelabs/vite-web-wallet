<template>
    <div>
        <div>Balance</div><br/>
        <wallet-table :headList="headList" :contentList="balanceList"></wallet-table>
        <br/><div>Onroad</div><br/>
        <wallet-table :headList="headList" :contentList="onroadList"></wallet-table>
    </div>
</template>

<script>
import walletTable from 'components/table/index.vue';

export default {
    components: { walletTable },
    props: {
        balance: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            headList: [ {
                text: 'Token Symbol',
                cell: 'tokenSymbol',
                class: 'keystore-table-item'
            }, {
                text: 'Decimals',
                cell: 'decimals',
                class: 'keystore-table-item'
            }, {
                text: 'Balance',
                cell: 'balance',
                class: 'keystore-table-item'
            }, {
                text: 'Token Id',
                cell: 'tokenId',
                class: 'keystore-table-item'
            } ]
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
            console.log(balance);
            if (!balance.tokenBalanceInfoMap) {
                return [];
            }

            const list = [];
            const tokenBalanceInfoMap = balance.tokenBalanceInfoMap;
            for (const tokenId in tokenBalanceInfoMap) {
                if (!tokenBalanceInfoMap[tokenId]) {
                    continue;
                }

                const tokenInfo = tokenBalanceInfoMap[tokenId].tokenInfo;
                const totalAmount = tokenBalanceInfoMap[tokenId].totalAmount;

                if (!tokenInfo || !+totalAmount) {
                    continue;
                }

                list.push({
                    tokenId,
                    tokenSymbol: tokenInfo.tokenSymbol,
                    decimals: tokenInfo.decimals,
                    balance: totalAmount
                });
            }

            return list;
        }
    }
};
</script>
