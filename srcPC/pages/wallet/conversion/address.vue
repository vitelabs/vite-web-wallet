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
