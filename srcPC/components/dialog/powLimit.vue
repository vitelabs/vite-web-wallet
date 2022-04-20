<template lang="pug">
extends /components/dialog/base.pug
block content
    div {{ this.powTimesLeft > 0 ? $t('pow.insuffQuotaMsg',{powTimesLeft:this.powTimesLeft}) : $t('pow.insuffQuotaMsg2')}}
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import router from 'pcRouter/index.js';
import { execWithRecaptcha } from 'pcUtils/execWithRecaptcha';

export default {
    computed: {
        ...mapState(['env']),
        ...mapGetters(['powTimesLeft']),
        address() {
            return this.$store.getters.activeAddr;
        },
        dTitle() {
            return this.$t('pow.insuffQuota');
        },
        dLTxt() {
            return this.powTimesLeft > 0
                ? this.$t('pow.skip')
                : this.$t('pow.cancel');
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
        startPow() {
            this.promise.resolve({ status: 'CONFIRMED', data: 'skip' });
            this.$store.dispatch('updatePowLimit', { address: this.address });
        },
        lClick() {
            if (this.powTimesLeft > 0) {
                execWithRecaptcha(this.startPow.bind(this));
            } else {
                this.promise.reject({ status: 'CLOSE' });
            }
            this.__close();
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
</style>
