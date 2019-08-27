<template>
    <div class="addr-wrapper">
        <address-title :address="address" :addressQrcode="addressQrcode">
            <span>{{ title }}</span>
        </address-title>
        <slot></slot>
    </div>
</template>

<script>
import addressTitle from './addressTitle';

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
    color: #283d4a;
    padding: 4px 8px;
    line-height: 24px;
    display: flex;
    align-items: center;
    margin: 5px auto;
}
</style>
