<template>
    <div class="depth-wrapper">
        <div class="depth-head">
            <span @click="showTable(true, true)">all</span>
            <span @click="showTable(false, true)">sell</span>
            <span @click="showTable(true, false)">buy</span>
            <div>
                deep <span>8</span>
            </div>
        </div>

        <div class="__center-tb-row">
            <span class="__center-tb-item">all</span>
            <span class="__center-tb-item">all</span>
            <span class="__center-tb-item">all</span>
        </div>

        <depth-table v-show="isShowBuy" class="depth-table" :depthData="depthBuy" :clickRow="setBuy"></depth-table>

        <div class="price">
            <span>{{ activeTrans.upDown }}</span>
            <span>{{ activeTrans.price }}</span>
        </div>
        
        <depth-table v-show="isShowSell" class="depth-table" :depthData="depthSell" :clickRow="setSell"></depth-table>
    </div>
</template>

<script>
import depthTable from './depthTable';

export default {
    components: {
        depthTable
    },
    created() {

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
        activeTrans() {
            return this.$store.state.exchangeTransPairs.activeTrans;
        }
    },
    methods: {
        setBuy(data) {
            console.log(data);
        },
        setSell(data) {
            console.log(data);
        },
        showTable(isShowBuy, isShowSell) {
            this.isShowBuy = isShowBuy;
            this.isShowSell = isShowSell;
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

.depth-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.price {
    height: 50px;
}
.depth-table {
    flex: 1;
}
</style>
