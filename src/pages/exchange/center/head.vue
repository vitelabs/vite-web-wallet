<template>
    <div class="txpair-head-wrapper">
        <div class="token">
            <div class="t-item">
                <div class="t-icon"><img :src="fTokenIcon"/>{{ activeTxPair.fTokenShow }}</div>
                <div class="id">{{ activeTxPair.fToken }}</div>
            </div>
            <div class="t-item">
                <div class="line">/</div>
                <div class="id">/</div>
            </div>
            <div class="t-item">
                <div class="t-icon"><img :src="tTokenIcon"/>{{ activeTxPair.tTokenShow }}</div>
                <div class="id">{{ activeTxPair.tToken }}</div>
            </div>
        </div>
        <div class="latest-price">
            <div class="token-title">{{ $t('exchange.head.latestPrice') }}</div>
            <div class="token-content">
                <span class="price">{{ activeTxPair.price }}</span>
                ${{ realPrice }}
            </div>
        </div>
        <div class="updown">
            <div class="token-title">{{ $t('exchange.head.updown') }}</div>
            <div class="token-content" :class="{
                'up': +upDown > 0,
                'down': +upDown < 0
            }">{{ upDown }} {{ upDownPercent }}</div>
        </div>
        <div class="high-price">
            <div class="token-title">{{ $t('exchange.head.highPrice') }}</div>
            <div class="token-content">{{ activeTxPair.price24hHigh }}</div>
        </div>
        <div class="low-price">
            <div class="token-title">{{ $t('exchange.head.lowPrice') }}</div>
            <div class="token-content">{{ activeTxPair.price24hLow }}</div>
        </div>
        <div class="quantity">
            <div class="token-title">{{ $t('exchange.head.quantity') }}</div>
            <div class="token-content">{{ activeTxPair.quantity24h + ' ' + activeTxPair.fTokenShow }}</div>
        </div>
    </div>
</template>

<script>
import Identicon from 'identicon.js';
import { encoder } from 'utils/tools';
import BigNumber from 'utils/bigNumber';

const iconConfig = {
    size: 100,
    format: 'svg'
};

export default {
    computed: {
        fTokenIcon() {
            return this.getTokenIcon(this.activeTxPair.fToken);
        },
        tTokenIcon() {
            return this.getTokenIcon(this.activeTxPair.tToken);
        },
        activePairCode() {
            return this.activeTxPair ? this.activeTxPair.pairCode || null : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        upDown() {
            return BigNumber.minus(this.activeTxPair.price, this.activeTxPair.priceBefore24h).toString();
        },
        upDownPercent() {
            let upDown = BigNumber.dividedToNumber(this.upDown, this.activeTxPair.priceBefore24h * 100, 2).toString();
            return upDown + '%';
        },
        realPrice() {
            return this.activeTxPair.price;
        }
    },
    methods: {
        getTokenIcon(tokenId) {
            let defaultToken = viteWallet.Ledger.tokenInfoMaps[tokenId];
            if (defaultToken && defaultToken.icon) {
                return defaultToken.icon;
            }

            let tokenHash = encoder.blake2b(tokenId);
            let hexStr = encoder._Buffer(tokenHash).toString('hex');
            return 'data:image/svg+xml;base64,' + new Identicon(hexStr, iconConfig).toString(); 
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

.txpair-head-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px 14px;
    font-family: $font-normal, arial, sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    .token {
        flex-basis: 180px;
        white-space: nowrap;
        .t-item {
            max-width: 85px;
            overflow: hidden;
            display: inline-block;
            font-size: 14px;
            font-family: $font-bold, arial, sans-serif;
            font-weight: 600;
            color: rgba(29,32,36,1);
            // &:first-child {
            //     .id {
            //         text-align: right;
            //     }
            // }
            .t-icon {
                white-space: nowrap;
                font-size: 20px;
                img {
                    width: 12px;
                    height: 12px;
                    border-radius: 12px;
                    margin-bottom: 1px;
                    margin-right: 4px;
                }
            }
            .line {
                margin-bottom: 4px;
            }
            .id {
                font-family: $font-normal, arial, sans-serif;
                font-size: 12px;
                font-weight: 400;
                color: rgba(0,122,255,1);
                line-height: 14px;
                margin-top: 10px;
            }
        }
    }

    .token-title {
        color: rgba(94,104,117,1);
    }
    .token-content {
        margin-top: 8px;
        font-weight: 600;
        color: rgba(36,39,43,1);
        &.down {
            color: $down-font-color;
        }
        &.up {
            color: $up-font-color
        }
        .price {
            color: rgba(0,122,255,1);
        }
    }
}
</style>
