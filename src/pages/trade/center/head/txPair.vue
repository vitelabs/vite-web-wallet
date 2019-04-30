<template>
    <div class="tx-pair-wrapper">
        <div class="center">
            <div @click="close">close</div>
            <div>{{ activeTxPair ? activeTxPair.priceBefore24h : '' }}</div>
            <div>{{ upDownIcon + percent }}</div>
            <div>{{ activeTxPair ? activeTxPair.quantity24h : '' }}</div>
            <div>{{ activeTxPair ? activeTxPair.amount24h : ''  }}</div>
            <div>{{ activeTxPair ? activeTxPair.price : ''  }}</div>
            <div>{{ buyOne }}</div>
            <div>{{ sellOne }}</div>
            <div>{{ sellOne }}</div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        close: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        percent() {
            return this.activeTxPair && this.activeTxPair.upDownPercent ? this.activeTxPair.upDownPercent : '--';
        },
        upDownIcon() {
            if (!this.upDown || +this.upDown === 0) {
                return '';
            }
            if (this.upDown > 0) {
                return '+';
            }
            return '-';
        },
        depthBuy() {
            return this.$store.state.exchangeDepth.buy;
        },
        depthSell() {
            return this.$store.state.exchangeDepth.sell;
        },
        buyOne() {
            return this.depthBuy && this.depthBuy.length ? this.depthBuy[0].price : '';
        },
        sellOne() {
            return this.depthSell && this.depthSell.length ? this.depthSell[0].price : '';
        },
        diff() {
            if (!this.sellOne) {
                return `-${ this.buyOne }`;
            }
            return this.sellOne - (this.buyOne || 0);
        }
    }
};
</script>

<style lang="scss" scoped>
.tx-pair-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .center {
        width: 50%;
        border: 1px solid #000;
        background: #fff;
    }
}
</style>
