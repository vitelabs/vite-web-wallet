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

            <div v-show="keystore && account">
                <div class="totop">Balance: <br/>{{ balance ? JSON.stringify(balance.balance) : '--' }}</div>
                <div class="totop">Onroad: <br/>{{ balance ? JSON.stringify(balance.onroad) : '--' }}</div>

                <div v-show="!isActive && balance" class="totop __btn __btn_all_in __pointer" @click="activate">
                    Auto Receive Tx
                </div>

                <send-tx :balance="balance" :account="account"></send-tx>
            </div>
        </div>
    </layout>
</template>

<script>
import lock from './lock';
import importKeystore from './import';
import layout from '../start/layout';
import sendTx from './sendTx';
import { timer } from 'utils/asyncFlow';

let balanceTimer = null;

export default {
    components: { layout, importKeystore, lock, sendTx },
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
            isActive: false
        };
    },
    methods: {
        getKeystore(obj) {
            this.address = obj.addr;
            this.keystore = obj.keystore;
            this.name = obj.name || '';
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./common.scss";

.totop{
    margin-top: 20px;
}
</style>
