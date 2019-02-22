/**  vite-wallet name-exchange-index */

<template>
    <div class="exchange-center-wrapper">
        <center v-if="active === 'exchange'"></center>
        <div
            class="order"
            v-if="active === 'exchange'"
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
            <openOrder v-if="tap==='openOrder'" class="item" :filterObj="{ftoken:activeTxPair.ftoken,ttoken:activeTxPair.ttoken}"></openOrder>
            <historyOrder v-if="tap==='historyOrder'" class="item" :isBuiltIn="true"></historyOrder>
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
    },
    destroyed() {
        this.$store.dispatch('stopLoopExchangeRate');
    },
    computed:{
        activeTxPair(){
            return this.$store.state.exchangeActiveTxPair.activeTxPair||{};
        }
    },
    data() {
        return {
            tap: 'openOrder',
            active: this.$route.name,
            tabList: [
                'exchange',
                'exchangeAssets',
                'exchangeOpenOrders',
                'exchangeOrderHistory'
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.exchange-center-wrapper {
    min-width: 1400px;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .order {
        background:#fff;
        box-shadow:0px 2px 48px 1px rgba(176,192,237,0.42);
        margin: 10px;
        margin-top:0;
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
                padding:4px 13px;
                &.active {
                    background: rgba(0, 122, 255, 1);
                    color: #fff;
                }
            }
        }
        .item{
            height: 411px;
            margin: 0;
            padding:0;
        }
    }
    .router-wrapper {
        flex: 1;
        overflow: auto;
    }
}
</style>
