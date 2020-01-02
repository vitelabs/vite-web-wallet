<template>
    <div>
        <div class="__btn_input">
            <input :placeholder="'toAddress'" v-model="toAddress" />
        </div>

        <div @click="sendAllBalance" v-show="!isLoading" class="totop __btn __btn_all_in __pointer">Send Tx (All balance)</div>
        <div v-show="isLoading" class="totop __btn __btn_all_in __pointer">Sending...</div>
    </div>
</template>

<script>
import { wallet, accountBlock as accountBlockUtils } from '@vite/vitejs';
import { viteClient } from 'services/apiServer';

export default {
    props: {
        balance: {
            type: Object,
            default: () => {
                return {};
            }
        },
        address: {
            type: String,
            default: ''
        },
        privateKey: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            toAddress: '',
            isLoading: false
        };
    },
    methods: {
        sendAllBalance() {
            if (!this.balance || !this.balance.balance) {
                this.$toast('No Balance!');
                return;
            }

            if (!this.toAddress || !wallet.isValidAddress(this.toAddress.trim())) {
                this.$toast('Invailid toAddress!');
                return;
            }

            const reqList = [];
            const balanceInfos = this.balance.balance.balanceInfoMap ? this.balance.balance.balanceInfoMap : {};

            for (const tokenId in balanceInfos) {
                const item = balanceInfos[tokenId];

                const amount = item.balance;
                if (+amount === 0) {
                    continue;
                }

                reqList.push(this.sendTx(tokenId, amount));
            }

            this.isLoading = true;
            Promise.all(reqList).then(() => {
                this.$toast('Success. Check please.');
                this.isLoading = false;
            }).catch(err => {
                console.warn(err);
                this.$toast('Error. Retry please.', err);
                this.isLoading = false;
            });
        },

        async sendTx(tokenId, amount) {
            const accountBlock = accountBlockUtils.createAccountBlock('send', {
                amount,
                tokenId,
                address: this.address,
                toAddress: this.toAddress,
                data: accountBlockUtils.utils.messageToData('keystore send to')
            }).setProvider(viteClient).setPrivateKey(this.privateKey);

            await accountBlock.autoSetPreviousAccountBlock();
            return accountBlock.sendByPoW();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";
.__btn_input {
    margin-top: 20px;
}
</style>
