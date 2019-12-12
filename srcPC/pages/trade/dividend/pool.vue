<template>
    <div class="pool-detail">
        <div class="pool-item">
            <img class="icon" src="~assets/imgs/smallAssets.svg" />
            <div class="token-wrapper">
                <div class="token-name">{{ $t('tradeDividend.allPrice') }}</div>
                <div class="token-amount">{{ allBtc }}</div>
                <div class="price">{{ allPrice }}</div>
            </div>
        </div>

        <template v-for="tokenType in typeList">
            <div class="pool-item" v-if="tokenType.name !== 'VITE'" :key="tokenType.name">
                <img class="icon" :src="tokenType.icon" />
                <div class="token-wrapper __pointer" v-click-outside="hideTokenList"  @click.stop="showTokenList(tokenType)">
                    <div class="token-name">{{ tokenType.name }}</div>
                    <div class="token-amount">
                        {{ pool[tokenType.name] ? formatNum(pool[tokenType.name].amount, tokenType.name) : '--' }}
                        <span class="down-icon"></span>
                    </div>

                    <div class="token-list" v-if="pool[tokenType.name] && isShowTokenList === tokenType.name">
                        <div class="row" v-for="(token, i) in pool[tokenType.name].tokens" :key="i">
                            <span class="symbol">{{ getSymbol(token.tokenInfo)  }}:</span>
                            <span class="amount">{{ formatNum(token.amount, tokenType.name) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { getTokenSymbolString } from 'utils/tokenParser';
import bigNumber from 'utils/bigNumber';
import { getCurrDividendPools } from 'services/viteServer';

export default {
    beforeMount() {
        this.fetchPool();
    },
    data() {
        return {
            rawData: {},
            pool: {},
            isShowTokenList: ''
        };
    },
    computed: {
        typeList() {
            return this.$store.state.exchangeMine.showTypeList;
        },
        allPrice() {
            const coin = this.$store.state.env.currency;
            const pre = coin === 'cny' ? '¥' : '$';

            let allPrice = this.getPrice(this.rawData, coin);
            if (+allPrice < 0) {
                return `≈${ pre } --`;
            }

            allPrice = this.formatNum(allPrice, 'USDT');
            return `≈${ pre }${ allPrice }`;
        },
        allBtc() {
            let allPrice = this.getPrice(this.rawData, 'btc');
            if (+allPrice < 0) {
                return '-- BTC';
            }

            allPrice = this.formatNum(allPrice, 'BTC');
            return `${ allPrice } BTC`;
        }
    },
    methods: {
        getPrice(data, coin) {
            let allPrice = 0;
            for (const tokenId in data) {
                const token = data[tokenId];
                if (!token.amount) {
                    continue;
                }

                const rate = this.getRate(tokenId, coin);
                if (!rate) {
                    return -1;
                }

                const price = bigNumber.multi(token.amount || 0, rate || 0);
                allPrice = bigNumber.plus(price, allPrice);
            }
            return allPrice;
        },
        getRate(tokenId, coin) {
            const rateList = this.$store.state.exchangeRate.rateMap || {};

            if (!tokenId || !rateList[tokenId]) {
                return null;
            }

            return rateList[tokenId][`${ coin }Rate`] || null;
        },
        showTokenList(tokenType) {
            this.isShowTokenList = tokenType.name;
        },
        hideTokenList() {
            this.isShowTokenList = '';
        },
        getSymbol(tokenInfo) {
            if (!tokenInfo) {
                return '';
            }
            return getTokenSymbolString(tokenInfo.tokenSymbol, tokenInfo.index);
        },
        fetchPool() {
            getCurrDividendPools().then(data => {
                this.rawData = data;
                if (!data) {
                    this.pool = {};
                    return;
                }

                this.pool = {};
                const tokenIds = [];
                const tokenList = [ 'VITE', 'ETH', 'BTC', 'USDT' ];

                for (const tokenId in data) {
                    const token = data[tokenId];
                    const tokenTypeName = tokenList[token.quoteTokenType - 1];

                    this.pool[tokenTypeName] = this.pool[tokenTypeName] || {
                        amount: '0',
                        decimals: 8,
                        tokens: []
                    };

                    const allAmount = this.pool[tokenTypeName].amount;

                    token.tokenType = tokenTypeName;
                    token.amount = bigNumber.toBasic(token.amount, token.tokenInfo.decimals);

                    this.pool[tokenTypeName].tokens.push(token);
                    this.pool[tokenTypeName].amount = bigNumber.plus(token.amount, allAmount);

                    tokenIds.push(token.tokenInfo.tokenId);
                }

                this.$store.dispatch('addRateTokens', tokenIds);
            }).catch(err => {
                console.warn(err);
            });
        },
        formatNum(amount, tokenSymbol) {
            const map = {
                BTC: 8,
                ETH: 8,
                VITE: 4,
                USDT: 2
            };
            return bigNumber.formatNum(amount, map[tokenSymbol]);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.pool-detail {
    @include box_shadow();
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
    background-size: 100% 100%;
}

.pool-item {
    flex: 1;
    padding: 14px 30px;
    box-sizing: border-box;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    font-size: 12px;
    font-family: $font-normal;
    line-height: 16px;
    border-right: 1px solid rgba(227,235,245,0.6);
    &:last-child {
        border-right: none;
    }

    .price {
        color: rgba(94,104,117,0.58);
        margin-top: 2px;
    }

    .icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        position: relative;
        top: 50%;
        margin-top: -12px;
    }

    .token-wrapper {
        position: relative;
        flex: 1;
        .token-name {
            color: rgba(94,104,117,1);
            margin-bottom: 2px;
        }
        .token-amount {
            font-size: 16px;
            font-family: $font-bold;
            color: rgba(29,32,36,1);
            line-height: 20px;
            .down-icon {
                display: inline-block;
                background: url('~assets/imgs/dividendInfo.svg');
                background-size: 100% 100%;
                width: 16px;
                height: 16px;
                margin-bottom: -4px;
            }
        }
    }

    .token-list {
        position: absolute;
        margin-top: 10px;
        width: 200px;
        padding: 8px 12px 0;
        background: #fff;
        box-shadow: 0px 5px 20px 0px rgba(176,192,237,0.4);
        border-radius: 2px;
        z-index: 1;
        .row {
            line-height: 15px;
            margin-bottom: 8px;
            font-size: 11px;
            .symbol {
                color: rgba(94,104,117,0.58);
            }
            .amount {
                color: rgba(29,32,36,1);
            }
        }
        &:before {
            top: -12px;
            position: absolute;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            border-bottom: 6px solid #fff;
        }
    }
}
</style>
