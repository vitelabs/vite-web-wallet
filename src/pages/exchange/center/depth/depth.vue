<template>
    <div class="depth-wrapper">
        <div class="ex-tab-list"> 
            <span class="ex-tab __pointer" 
                  :class="{'active': isShowSell && isShowBuy}" 
                  @click="showTable(true, true)">{{ $t('exchange.depth.all') }}</span>
            <span class="ex-tab __pointer" 
                  :class="{'active': isShowBuy && !isShowSell}" 
                  @click="showTable(true, false)">{{ $t('exchange.depth.buy') }}</span>
            <span class="ex-tab __pointer" 
                  :class="{'active': isShowSell && !isShowBuy}" 
                  @click="showTable(false, true)">{{ $t('exchange.depth.sell') }}</span>
        </div>

        <div class="__center-tb-title">
            <span class="__center-tb-item depth price">{{ $t('exchange.priceTitle', { 
                price: activeTxPair && activeTxPair.ttokenShow ? activeTxPair.ttokenShow : '' 
            }) }}</span>
            <span class="__center-tb-item depth quantity">{{ $t('exchange.amountTitle', { 
                amount: activeTxPair && activeTxPair.ftokenShow ? activeTxPair.ftokenShow : ''
            }) }}</span>
            <span class="__center-tb-item depth amount">{{ $t('exchange.quantityTitle', { 
                quantity: activeTxPair && activeTxPair.ttokenShow ? activeTxPair.ttokenShow : ''
            }) }}</span>
        </div>

        <div class="depth-content-wrapper" :class="{'one': (isShowBuy || isShowSell) && !(isShowBuy && isShowSell)}">
            <div class="depth-table" :class="{'show-all': isShowBuy && isShowSell}">
                <depth-table v-show="isShowSell" class="sell" dataType="sell" :depthData="depthSell"></depth-table>
            </div>
            <price></price>
            <depth-table v-show="isShowBuy" class="depth-table" :class="{
                'show-all': isShowBuy && isShowSell
            }" dataType="buy" :depthData="depthBuy"></depth-table>
        </div>
    </div>
</template>

<script>
import depthTable from './depthTable';
import price from './price';

export default {
    components: {
        depthTable, price
    },
    data() {
        return {
            isShowBuy: true,
            isShowSell: true
        };
    },
    computed: {
        depthBuy() {
            return this.$store.state.exchangeDepth.buy;
        },
        depthSell() {
            return this.$store.state.exchangeDepth.sell;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    methods: {
        showTable(isShowBuy, isShowSell) {
            this.isShowBuy = isShowBuy;
            this.isShowSell = isShowSell;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.depth-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .depth-content-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        &.one {
            flex: 1;
            overflow: auto;
        }
    }

    .depth-table {
        position: relative;
        width: 100%;
        &.show-all {
            flex: 1;
            overflow: hidden;
            .sell {
                position: absolute;
                bottom: 0;
            }
        }
        .sell {
            width: 100%;
        }
    }
}


</style>
