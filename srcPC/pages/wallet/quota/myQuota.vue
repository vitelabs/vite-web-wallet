<template>
    <div class="my-quota-wrapper">
        <div class="row">
            <div class="title">{{ $t('walletQuota.myQuota') }}</div>
            <div class="text">{{ txNum || 0 }} UT</div>
        </div>
    </div>
</template>

<script>
import { timer } from '@utils/asyncFlow';

let quotaInst;

export default {
    mounted() {
        this.startLoopQuota();
    },
    beforeDestroy() {
        this.stopLoopQuota();
    },
    computed: {
        txNum() {
            return this.$store.state.pledge.pledgeTransNum;
        },
        addr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        addr() {
            this.startLoopQuota();
        }
    },
    methods: {
        startLoopQuota() {
            this.stopLoopQuota();
            quotaInst = new timer(() => this.$store.dispatch('fetchQuota'), 1000);
            quotaInst.start();
        },
        stopLoopQuota() {
            quotaInst && quotaInst.stop();
            quotaInst = null;
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
.my-quota-wrapper {
    padding: 35px 24px;
}

.row {
    @include font-family-bold();
    @include font_color_1();
    .title {
        font-size: 14px;
        letter-spacing: 0.35px;
        margin-bottom: 14px;
    }
    .text {
        font-size: 18px;
        line-height: 22px;
    }
}
</style>
