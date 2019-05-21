<template>
    <layout>
        <div class="keystore-wrapper">
            <div class="__title">{{ $t('keystore.title') }}</div>
            <import-keystore v-show="!keystore" :getKeystoreCB="getKeystore"></import-keystore>

            <div v-show="keystore" class="__btn_input_active">
                <div class="name">{{ name }}</div>
                <div class="address __ellipsis">{{ address }}</div>
            </div>

            <lock v-show="keystore && !account"
                  :keystore="keystore"
                  :unlockSuccess="unlockSuccess"></lock>

            <div v-show="keystore && account" class="unlock-wrapper">
                <br/>
                <div v-if="balance">
                    <div>{{ JSON.stringify(balance.balance) }}</div>
                    <div>{{ JSON.stringify(balance.onroad) }}</div>
                </div>
                <div v-show="!isActive && balance" class="unlock-btn __btn __btn_all_in __pointer" @click="activate">
                    Auto Receive Tx
                </div>
                <div class="bottom __btn __btn_input">
                    <input v-model="toAddress" />
                </div>
                <div @click="sendAllBalance" class="unlock-btn __btn __btn_all_in __pointer">Send Tx</div>
            </div>
        </div>
    </layout>
</template>

<script>
import lock from './lock';
import importKeystore from './import';
import layout from '../start/layout';
import { timer } from 'utils/asyncFlow';

let balanceTimer = null;

export default {
    components: { layout, importKeystore, lock },
    destroyed() {
        this.stopLoopBalance();
        this.account.freeze();
    },
    data() {
        return {
            address: '',
            name: '',
            keystore: null,
            account: null,
            balance: null,
            isActive: false,
            toAddress: ''
        };
    },
    methods: {
        getKeystore(obj, type) {
            this.address = obj.addr;
            this.keystore = obj.keystore;
            this.name = obj.name || '';
            console.log(obj, type);
        },
        activate() {
            this.account.activate(2000, true, true);
            this.isActive = true;
        },
        unlockSuccess(account) {
            this.account = account;
            this.startLoopBalance();
        },
        startLoopBalance() {
            this.stopLoopBalance();

            balanceTimer = new timer(() => {
                if (!this.isActive) {
                    this.balance = this.account.balance;
                    return;
                }

                return this.account.getBalance().then(data => {
                    this.balance = data;
                });
            }, 2000);

            balanceTimer.start();
        },
        stopLoopBalance() {
            balanceTimer && balanceTimer.stop();
            balanceTimer = null;
        },
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
                console.log(data);
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";

.unlock-btn {
    margin-top: 20px;
}
</style>
