<template lang="pug">
extends /components/dialog/base.pug
block content
    div {{$t('pow.insuffQuotaMsg')}}
</template>

<script>
import { getCurrHDAcc } from 'wallet';
import router from 'pcRouter/index.js';


export default {
    data() {
        return {};
    },
    computed: {
        dTitle() {
            return this.$t('pow.insuffQuota');
        },
        dLTxt() {
            return this.$t('pow.skip');
        },
        dRTxt() {
            return this.$t('pow.getQuota');
        }
    },
    methods: {
        rClick() {
            this.promise.resolve({ status: 'CONFIRMED', data: 'getQuota' });
            this.__close();
            router.push({ name: 'walletQuota' });
        },
        lClick() {
            this.promise.resolve({ status: 'CONFIRMED', data: 'skip' });
            this.__close();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.head {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    font-size: 14px;
    font-family: $font-bold;
    @include font_color_to_white(#333);
}
.code_container {
    margin: 0 auto;
    justify-content: center;
}
</style>

