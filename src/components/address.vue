<template>
    <div class="addr-wrapper">
        <address-title :address="defaultAddr" :addressQrcode="addressQrcode">
            <switch-addr :isShowAddr="false"></switch-addr>
        </address-title>
        <div class="addr-content">{{ defaultAddr }}</div>
        <slot></slot>
    </div>
</template>

<script>
import addressTitle from 'components/addressTitle';
import switchAddr from 'components/switchAddress';
import { utils } from '@vite/vitejs';

export default {
    components: { addressTitle, switchAddr },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        addressQrcode() {
            return utils.uriStringify({ target_address: this.defaultAddr });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.addr-wrapper .addr-content {
    font-size: 14px;
    word-break: break-all;
    width: 100%;
    line-height: 24px;
    box-sizing: border-box;
    background: #f3f6f9;
    border: 1px solid #d4dee7;
    border-radius: 2px;
    height: 24px;
    color: #5E6875;
    padding: 4px 8px;
    line-height: 24px;
    display: flex;
    align-items: center;
    margin: 5px auto;
}
</style>
