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

        <div class="price-wrapper">
            <span class="price" :class="{
                'up': +upDown > 0,
                'down': +upDown < 0
            }">{{ activeTxPair && activeTxPair.price ? activeTxPair.price : '' }}</span>
            <span v-show="+upDown !== 0" class="p-icon" :class="{
                'up-icon': +upDown > 0,
                'down-icon': +upDown < 0
            }"></span>
            <span class="real-price">{{ realPrice }}</span>
        </div>
        
        <depth-table v-show="isShowSell" class="depth-table" dataType="sell" :depthData="depthSell"></depth-table>
    </div>
</template>

<script>
import depthTable from './depthTable';

export default {
    components: {
        depthTable
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
            return this.$store.getters.exActiveTxPair;
        },
        upDown() {
            return this.activeTxPair && this.activeTxPair.upDownPre ? this.activeTxPair.upDownPre : '0';
        },
        realPrice() {
            let pre = '$';
            if (this.$i18n.locale === 'zh') {
                pre = '￥';
            }
            if (!this.activeTxPair) {
                return pre + '0';
            }
            return pre + this.activeTxPair.price * this.rate;
        },
        rate() {
            let rateList = this.$store.state.exchangeRate.rateList || {};
            let tokenId = this.activeTxPair && this.activeTxPair.tToken ? this.activeTxPair.tToken : null;
            let coin = this.$store.state.exchangeRate.coins[this.$i18n.locale || 'zh'];
            if (!tokenId || !rateList[tokenId]) {
                return null;
            }
            return rateList[tokenId][coin] || null;
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
.price-wrapper {
    height: 30px;
    line-height: 30px;
    border-top: 1px solid rgba(229,237,243,1);
    border-bottom: 1px solid rgba(229,237,243,1);
    text-align: center;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;
    .price {
        font-size: 14px;
    }
    .p-icon {
        display: inline-block;
        width: 10px;
        height: 12px;
        margin-bottom: -1px;
        &.up-icon {
            background: url('~assets/imgs/ex-up-arrow.svg');
            background-size: 100% 100%;
        }
        &.down-icon {
            background: url('~assets/imgs/ex-down-arrow.svg');
            background-size: 100% 100%;
        }
    }
    .real-price {
        font-size: 12px;
        color: #24272B;
    }
}
.depth-table {
    flex: 1;
}
</style>
