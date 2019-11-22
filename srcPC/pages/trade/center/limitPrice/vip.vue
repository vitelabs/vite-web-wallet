<template>
    <div class="vip-container">
        <span class="vip svip" v-if="isSVip"></span>
        <span class="vip" :class="{ active: isVip }" v-else></span>
        <span class="vip-operate __pointer" @click="goTradeVip" v-if="isSVip && !isVip">
            {{ $t("trade.limitPrice.cancelVip") }}
        </span>
        <span class="vip-operate drop_menu __pointer" @click="goTradeVip">
            {{ isVip && isSVip ? $t('tradeVip.title') : $t('tradeVip.open') }}
        </span>
    </div>
</template>

<script>
export default {
    computed: {
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        }
    },
    methods: {
        goTradeVip() {
            this.$router.push({ name: 'tradeVip' });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.vip-container {
    display: flex;
    .vip-operate {
        padding-right: 6px;
        border-right: 1px solid rgba(205, 204, 204, 1);
        color: #9EA4AD;
        font-size: 12px;
        @include font-family-normal();
        &.drop_menu {
            border: none;
            margin-left: 10px;
        }
        &.active {
            color: #007aff;
        }
    }
    .vip {
        display: inline-block;
        margin-bottom: -3px;
        margin-right: 6px;
        color: rgba(255, 255, 255, 1);
        width: 36px;
        height: 16px;
        background-image: url("~assets/imgs/not_vip.svg");
        background-size: 100% 100%;
        &.svip {
            background-image: url("~assets/imgs/svip.png");
        }
        &.active {
            background: url("~assets/imgs/vip.svg");
            background-size: 100% 100%;
        }
    }
}
</style>
