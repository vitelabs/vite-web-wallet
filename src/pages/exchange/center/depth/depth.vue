<template>
    <div class="depth-wrapper">
        <div class="ex-tab-list"> 
            <span class="ex-tab __pointer" 
                  :class="{'active': isShowBuy && !isShowSell}" 
                  @click="showTable(true, false)">{{ $t('exchange.depth.buy') }}</span>
            <span class="ex-tab __pointer" 
                  :class="{'active': isShowSell && !isShowBuy}" 
                  @click="showTable(false, true)">{{ $t('exchange.depth.sell') }}</span>
            <span class="ex-tab __pointer" 
                  :class="{'active': isShowSell && isShowBuy}" 
                  @click="showTable(true, true)">{{ $t('exchange.depth.all') }}</span>
        </div>

        <div class="__center-tb-title">
            <span class="__center-tb-item">{{ $t('exchange.price') }}</span>
            <span class="__center-tb-item">{{ $t('exchange.num') }}</span>
            <span class="__center-tb-item">{{ $t('exchange.quantity') }}</span>
        </div>

        <depth-table v-show="isShowBuy" class="depth-table" dataType="buy" :depthData="depthBuy"></depth-table>
        <price></price>
        <depth-table v-show="isShowSell" class="depth-table" dataType="sell" :depthData="depthSell"></depth-table>
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
}

.depth-table {
    flex: 1;
}
</style>
