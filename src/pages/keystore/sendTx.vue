<template>
    <div>
        <div class="totop __btn __btn_input">
            <input :placeholder="toAddress" v-model="toAddress" />
        </div>

        <div @click="sendAllBalance" class="totop __btn __btn_all_in __pointer">Send Tx (All balance)</div>
    </div>
</template>

<script>
export default {
    props: {
        balance: {
            type: Object,
            default: () => {
                return {};
            }
        },
        account: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return { toAddress: '' };
    },
    methods: {
        sendAllBalance() {
            if (!this.balance || !this.balance.balance) {
                this.$toast('No Balance!');
                return;
            }

            const reqList = [];
            const balanceInfos = this.balance.balance.tokenBalanceInfoMap ? this.balance.balance.tokenBalanceInfoMap : {};
            for (const tokenId in balanceInfos) {
                const item = balanceInfos[tokenId];

                const amount = item.totalAmount;
                if (+amount === 0) {
                    continue;
                }
                reqList.push(this.account.sendTx({
                    toAddress: this.toAddress,
                    amount,
                    tokenId
                }, true, true));
            }

            Promise.all(reqList).then(data => {
                this.$toast('Success. Check please.');
                console.log(data);
            }).catch(err => {
                this.$toast('Error. Retry please.');
                console.warn(err);
            });
        }
    }
};
</script>
