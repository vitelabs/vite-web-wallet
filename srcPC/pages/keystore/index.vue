<template>
    <div class="keystore-wrapper">
        <div class="__title">{{ $t('keystore.title') }}</div>

        <div class="__wrapper">
            <import-keystore v-show="!keystore" @getKeystore="getKeystore"></import-keystore>

            <div v-show="keystore" class="__btn_input_active __pointer" @click="goNet">
                <div class="name">{{ name }}</div>
                <div class="address __ellipsis">{{ address }}</div>
            </div>

            <unlock v-show="keystore && !privateKey" :keystore="keystore"
                    @unlockSuccess="unlockSuccess"></unlock>
        </div>

        <balance v-if="keystore && privateKey" class="detail-wrapper"
                 :address="address" @updateBalance="updateBalance"></balance>

        <div v-if="keystore && privateKey" class="__wrapper">
            <receive-tx v-show="balance" :address="address" :privateKey="privateKey"></receive-tx>
            <send-tx :balance="balance" :address="address" :privateKey="privateKey"></send-tx>
        </div>
    </div>
</template>

<script>
import { getExplorerLink } from 'utils/getLink';
import unlock from './unlock';
import importKeystore from './import';
import sendTx from './sendTx';
import balance from './balance';
import receiveTx from './receiveTx';
import openUrl from 'utils/openUrl';

export default {
    components: { importKeystore, unlock, balance, sendTx, receiveTx },
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
        unlockSuccess(privateKey) {
            this.privateKey = privateKey;
        },
        updateBalance(balance) {
            this.balance = balance;
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
