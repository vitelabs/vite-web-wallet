/**  vite-wallet name-exchange-index */

<template>
    <div class="exchange-center-wrapper">
        <center v-if="active === 'exchange'"></center>
        <div
            class="order"
            v-if="active === 'exchange'&&$wallet.isLogin"
        >
            <div class="tap">
                <div
                    @click="tap='openOrder'"
                    :class="{active:tap==='openOrder'}"
                >{{$t('exchangeOpenOrders.title')}}</div>
                <div
                    @click="tap='historyOrder'"
                    :class="{active:tap==='historyOrder'}"
                >{{$t('exchangeOrderHistory.title')}}</div>
            </div>
            <openOrder v-if="tap==='openOrder'" class="item"></openOrder>
            <historyOrder v-if="tap==='historyOrder'" class="item"></historyOrder>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import center from "./center/center.vue";
import historyOrder from "./orderHistory";
import openOrder from "./openOrders";

export default {
    components: {
        center,
        openOrder,
        historyOrder
    },
    mounted() {
        this.$store.dispatch("startLoopExchangeRate");
        this.$router.afterEach(to => {
            this.active = to.name;
        });
    },
    destroyed() {
        this.$store.dispatch("stopLoopExchangeRate");
    },
    data() {
        return {
            tap: "openOrder",
            active: this.$route.name,
            tabList: [
                "exchange",
                "exchangeAssets",
                "exchangeOpenOrders",
                "exchangeOrderHistory"
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.exchange-center-wrapper {
    min-width: 1300px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .order {
        .tap {
            height: 34px;
            display: flex;
            border-bottom: 1px solid rgb(0, 122, 255);
            align-items: flex-end;
            > div {
                font-size: 14px;
                height: 24px;
                color: #24272b;
                cursor: pointer;
                margin: 0 10px;
                border-radius: 4px 4px 0 0;
                padding:4px 13px;
                &.active {
                    background: rgba(0, 122, 255, 1);
                    color: #fff;
                }
            }
        }
        .item{
            height: 411px;
        }
    }
    .router-wrapper {
        flex: 1;
        overflow: auto;
    }
}
</style>
