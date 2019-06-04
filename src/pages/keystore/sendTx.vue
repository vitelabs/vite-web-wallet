<template>
    <div>
        <div class="__btn __btn_input">
            <input :placeholder="'toAddress'" v-model="toAddress" />
        </div>

        <div @click="sendAllBalance" class="totop __btn __btn_all_in __pointer">Send Tx (All balance)</div>
    </div>
</template>

<script>
import { hdAddr } from '@vite/vitejs';

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
            if (!this.toAddress || !hdAddr.isValidHexAddr(this.toAddress.trim())) {
                this.$toast('Invailid toAddress!');
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
                    toAddress: this.toAddress.trim(),
                    amount,
                    tokenId
                }, true, true));
            }

            // this.account.sendTx().then(() => {

            // }).catch((err) => {
            //     this.$toast('Error. Retry please.', err);
            //     console.warn(err);
            // })

            Promise.all(reqList).then(data => {
                this.$toast('Success. Check please.');
                console.log(data);
            }).catch(err => {
                this.$toast('Error. Retry please.', err);
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
</style>
