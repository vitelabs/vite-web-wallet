<template lang="pug">
extends /components/dialog/base.pug
block content
    div {{ this.powTimesLeft > 0 ? $t('pow.insuffQuotaMsg') : $t('pow.insuffQuotaMsg2', {powMaxTimes: env.powMaxTimes})}}
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import router from 'pcRouter/index.js';


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
            return this.powTimesLeft > 0 ? this.$t('pow.skip') : this.$t('pow.cancel');
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
            if (this.powTimesLeft > 0) {
                this.promise.resolve({ status: 'CONFIRMED', data: 'skip' });
                this.$store.dispatch('updatePowLimit', { address: this.address });
            } else {
                this.promise.reject({ status: 'CLOSE' });
            }
            this.__close();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

</style>

