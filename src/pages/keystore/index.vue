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
                <div class="unlock-btn __btn __btn_all_in __pointer">
                    GetBalance
                </div>
                <div class="unlock-btn __btn __btn_all_in __pointer">
                    AutoReceiveTx
                </div>
            </div>
        </div>
    </layout>
</template>

<script>
import lock from './lock';
import importKeystore from './import';
import layout from '../start/layout';

export default {
    components: { layout, importKeystore, lock },
    data() {
        return {
            address: '',
            name: '',
            keystore: null,
            account: null
        };
    },
    methods: {
        getKeystore(obj, type) {
            this.address = obj.addr;
            this.keystore = obj.keystore;
            this.name = obj.name || '';
            console.log(obj, type);
        },
        unlockSuccess(account) {
            this.account = account;
            this.account.activate(2000, true, true);

            console.log(this.account.balance);
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
