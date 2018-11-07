<template>
    <div class="sync-block-wrapper">
        <span class="status-text" v-show="statusText && statusText !== 'sync'">
            {{ statusText ? $t(`nav.${statusText}`) : '' }}
        </span>
        <span v-show="statusText === 'sync'">
            {{ $t(`nav.blockHeight`) + ': ' + (blockHeight || '----') }}
        </span>
    </div>
</template>

<script>
let netEvent = null;
let heightEvent = null;

export default {
    data() {
        return {
            statusText: '',
            netStatus: false,
            blockHeight: ''
        };
    },
    mounted() {
        heightEvent = webViteEventEmitter.on('currentHeight', (height) => {
            this.blockHeight = height;
        });
        netEvent = webViteEventEmitter.on('netStatus', (status) => {
            this.netStatus = status;
        });

        this.netStatus = viteWallet.Net.getNetStatus();
        this.blockHeight = viteWallet.Ledger.getHeight();
    },
    destroyed() {
        webViteEventEmitter.off(netEvent);
        webViteEventEmitter.off(heightEvent);
    },
    watch: {
        netStatus: function() {
            this.statusText = !this.netStatus ? 'noNet' : 'sync';
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.sync-block-wrapper {
    font-family: $font-bold, arial, sans-serif;
    font-size: 16px;
    color: #1D2024;
    line-height: 20px;
    .status-text {
        margin-right: 10px;
    }
}
</style>
