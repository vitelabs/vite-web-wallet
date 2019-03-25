<template>
    <div class="addr-wrapper">
        <address-title :title="title" :address="address" :addressQrcode="addressQrcode"></address-title>
        <div v-if="showAddrContent" class="addr-content">{{ address }}</div>
        <slot></slot>
    </div>
</template>

<script>
import addressTitle from 'components/addressTitle';

export default {
    components: { addressTitle },
    props: {
        title: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        addressQrcode: {
            type: String,
            default: ''
        },
        showAddrContent: {
            type: Boolean,
            default: true
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
    line-height: 20px;
    box-sizing: border-box;
    background: #f3f6f9;
    border: 1px solid #d4dee7;
    border-radius: 2px;
    padding: 10px;
    color: #283d4a;
}
</style>
