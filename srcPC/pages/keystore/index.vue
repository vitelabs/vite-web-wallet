<template>
    <div class="keystore-wrapper">
        <div class="__title">{{ $t('keystore.title') }}</div>

        <div class="__wrapper">
            <import-keystore v-show="!keystore" :getKeystoreCB="getKeystore"></import-keystore>

            <div v-show="keystore" class="__btn_input_active __pointer" @click="goNet">
                <div class="name">{{ name }}</div>
                <div class="address __ellipsis">{{ address }}</div>
            </div>

            <lock v-show="keystore && !privateKey"
                  :keystore="keystore"
                  :unlockSuccess="unlockSuccess"></lock>
        </div>

        <balance v-show="keystore && privateKey" class="detail-wrapper" :balance="balance"></balance>

        <div v-show="keystore && privateKey" class="__wrapper">
            <div v-show="balance" class="totop __btn __btn_all_in __pointer" @click="activate">
                {{ !isActive ? 'Auto Receive Tx' : 'Auto Receiving....' }}
            </div>
            <send-tx :balance="balance" :privateKey="privateKey"></send-tx>
        </div>
    </div>
</template>

<script>
import { getExplorerLink } from 'utils/getLink';
import lock from './lock';
import importKeystore from './import';
import sendTx from './sendTx';
import balance from './balance';
import { timer } from 'utils/asyncFlow';
import openUrl from 'utils/openUrl';
import { viteClient } from 'services/apiServer';

let balanceTimer = null;

export default {
    components: { importKeystore, lock, sendTx, balance },
    destroyed() {
        this.stopLoopBalance();
        // this.account.freeze();
    },
    data() {
        return {
            address: '',
            name: '',
            keystore: null,

            privateKey: null,
            balance: null,
            isActive: false
        };
    },
    methods: {
        goNet() {
            openUrl(`${ getExplorerLink(this.$i18n.locale) }account/${ this.address }`);
        },
        getKeystore(obj) {
            this.address = obj.addr;
            this.keystore = obj.keystore;
            this.name = obj.name || '';
        },
        activate() {
            if (this.isActive) {
                return;
            }
            // this.account.activate(2000, true, true);
            this.isActive = true;
        },
        unlockSuccess(privateKey) {
            this.privateKey = privateKey;
            this.startLoopBalance();
        },
        startLoopBalance() {
            this.stopLoopBalance();

            balanceTimer = new timer(() => {
                viteClient.getBalanceInfo(this.address).then(data => {
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
.keystore-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding: 20px;
}
.detail-wrapper {
    margin-top: 100px;
}

.totop{
    margin-top: 20px;
}
</style>
