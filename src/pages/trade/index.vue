<template>
    <div class="exchange-center-wrapper">
        <center v-if="active === 'trade'"></center>
        <div class="order" v-if="active === 'trade'">
            <div class="ex-tab-list">
                <div @click="tap='openOrder'"
                     class="ex-tab active-side __pointer"
                     :class="{'active': tap === 'openOrder'}">
                    {{$t('tradeOpenOrders.title')}}</div>
                <div @click="tap='historyOrder'"
                     class="ex-tab active-side __pointer"
                     :class="{'active': tap === 'historyOrder'}">
                    {{$t('tradeOrderHistory.title')}}</div>
            </div>
            <openOrder v-if="tap==='openOrder'" class="item"
                       :isEmbed="true"
                       :filterObj="{
                           ftoken: activeTxPair.ftoken,
                           ttoken: activeTxPair.ttoken,
                           pageSize: 10,
                           paging: 0 }">
            </openOrder>
            <historyOrder v-if="tap==='historyOrder'" class="item"
                          :isEmbed="true"
                          :filterObj="{
                              ftoken: activeTxPair.ftoken,
                              ttoken: activeTxPair.ttoken,
                              pageSize: 10,
                              paging: 0 }">
            </historyOrder>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import center from './center/center.vue';
import historyOrder from './orderHistory';
import openOrder from './openOrders';

export default {
    components: {
        center,
        openOrder,
        historyOrder
    },
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');

        this.$router.afterEach(to => {
            this.active = to.name;
        });

        this.isLogin = !!this.$wallet.isLogin;
        this.getBalance();
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
    },
    destroyed() {
        this.$store.dispatch('stopLoopExchangeBalance');
        this.$store.dispatch('stopLoopExchangeRate');
    },
    data() {
        return {
            tap: 'openOrder',
            active: this.$route.name,
            tabList: [
                'trade',
                'tradeAssets',
                'tradeOpenOrders',
                'tradeOrderHistory'
            ],
            isLogin: !!this.$wallet.isLogin
        };
    },
    computed: {
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair || {};
        }
    },
    watch: {
        isLogin: function () {
            this.getBalance();
        }
    },
    methods: {
        getBalance() {
            const activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                return;
            }
            const addr = activeAccount.getDefaultAddr();
            this.$store.dispatch('startLoopExchangeBalance', addr);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./center/center.scss";

.exchange-center-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .order {
        background: #fff;
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
        margin: 10px;
        margin-top: 0;
        border-radius: 2px;

        .tap {
            height: 34px;
            display: flex;
            border-bottom: 1px solid rgb(0, 122, 255);
            align-items: flex-end;

            > div {
                font-size: 14px;
                color: #24272b;
                cursor: pointer;
                margin: 0 10px;
                border-radius: 4px 4px 0 0;
                padding: 4px 13px;

                &.active {
                    background: rgba(0, 122, 255, 1);
                    color: #fff;
                }
            }
        }

        .item {
            flex: 1;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    }

    .router-wrapper {
        flex: 1;
        overflow: auto;
    }
}
</style>

<style lang="scss">
.exchange-center-wrapper .order {
    display: flex;
    flex-direction: column;
    min-height: 300px;

    .combine {
        box-shadow: none;
        flex: 1;
    }

    .ex_tb {
        box-shadow: none;
    }
}
</style>
