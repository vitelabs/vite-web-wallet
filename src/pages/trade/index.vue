<template>
    <div class="trade-container">
        <page-layout>
            <div class="exchange-center-wrapper">
                <img src="../../assets/imgs/VX.png" />
                {{ $t('tradePreMainnet.text') }}
                <a class="vx-button" href="https://x-test.vite.net" target="_blank">{{ $t('tradePreMainnet.button') }}</a>
            </div>
            <!-- [TODO] Hide trade -->
            <!-- <div class="trade-wrapper">
                <router-view></router-view>
            </div> -->
        </page-layout>
    </div>
</template>

<script>
import pageLayout from 'components/pageLayout/index';

export default {
    components: { pageLayout },
    mounted() {
        // [TODO] Hide trade
        // this.$store.dispatch('startLoopExchangeRate');
        // this.$store.dispatch('startLoopExchangeBalance');
    }
};
</script>

<style lang="scss" scoped>
@import "./center/center.scss";

.trade-container {
    width: 100%;
    height: 100%;
}
.trade-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
.exchange-center-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    color: #24272B;
    font-size: 16px;
    line-height: 20px;
    align-items: center;
    justify-content: center;
    img {
        width: 340px;
        height: 340px;
    }
    .vx-button {
        background: #007AFF;
        color: #fff;
        border-radius: 2px;
        display: inline-block;
        min-width: 200px;
        text-align: center;
        padding: 10px;
        margin-top: 30px;
        line-height: 20px;
        font-family: $font-bold, arial, sans-serif;
    }
}
</style>
