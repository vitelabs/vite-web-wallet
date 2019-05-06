<template>
    <div @click="goNet" class="sync-block-wrapper __pointer">
        <span class="status-text" v-show="!netStatus">
            {{ $t(`hint.noNet`) }}
        </span>
        <span v-show="netStatus">
            {{ $t(`blockHeight`) + ': ' + (blockHeight || '----') }}
        </span>
    </div>
</template>

<script>
export default {
    computed: {
        blockHeight() {
            return this.$store.state.ledger.currentHeight;
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        }
    },
    methods: {
        goNet() {
            // const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            // window.open(`${ process.env.viteNet }${ locale }`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.sync-block-wrapper {
    font-family: $font-bold, arial, sans-serif;
    font-size: 16px;
    color: #1d2024;
    line-height: 20px;

    .status-text {
        margin-right: 10px;
    }
}
</style>
