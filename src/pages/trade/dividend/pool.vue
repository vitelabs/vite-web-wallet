<template>
    <div class="pool-detail">
        <div class="pool-item" v-for="tokenType in typeList" :key="tokenType.name">
            <div class="item-title">
                <img :src="tokenType.icon" />{{ tokenType.name }}
            </div>
            <div class="token-wrapper">
                <div class="token" v-for="(token, i) in pool[tokenType.name]" :key="i">
                    <div class="title">{{ getSymbol(token.tokenInfo)  }}</div>
                    <div class="amount">{{ formatNum(token.amount, tokenType.name) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ViteJS from 'utils/viteClient';
import viteIcon from 'assets/imgs/vite-dividend.svg';
import ethIcon from 'assets/imgs/eth.svg';
import usdIcon from 'assets/imgs/usd.svg';
import btcIcon from 'assets/imgs/BTC.svg';
import bigNumber from 'utils/bigNumber';

const typeList = [ {
    name: 'VITE',
    icon: viteIcon
}, {
    name: 'ETH',
    icon: ethIcon
}, {
    name: 'BTC',
    icon: btcIcon
}, {
    name: 'USD',
    icon: usdIcon
} ];

export default {
    beforeMount() {
        this.fetchPool();
    },
    data() {
        return {
            typeList,
            pool: {}
        };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        }
    },
    methods: {
        getSymbol(tokenInfo) {
            if (!tokenInfo) {
                return '';
            }
            const index = tokenInfo.index;
            const symbol = tokenInfo.tokenSymbol;
            const pre = +index >= 100 ? ''
                : +index >= 10 ? '0'
                    : '00';
            return `${ symbol }-${ pre }${ index }`;
        },
        fetchPool() {
            $ViteJS.request('dexfund_getCurrentDividendPools').then(data => {
                if (!data) {
                    return;
                }

                this.pool = {};
                const tokenIds = [];
                for (const tokenId in data) {
                    const token = data[tokenId];
                    const tokenType = typeList[token.quoteTokenType - 1];
                    this.pool[tokenType.name] = this.pool[tokenType.name] || [];
                    token.tokenType = tokenType.name;
                    token.amount = bigNumber.toBasic(token.amount, token.tokenInfo.decimals);
                    this.pool[tokenType.name].push(token);
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
                USD: 2
            };
            return bigNumber.formatNum(amount, map[tokenSymbol]);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.pool-detail {
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    display: flex;
    flex-direction: row;
    background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
    background-size: 100% 100%;
}
.pool-item {
    max-width: 449px;
    min-width: 225px;
    padding: 14px 30px;
    box-sizing: border-box;
    border-right: 1px solid rgba(227,235,245,0.6);
    font-size: 12px;
    width: 25%;

    &:last-child {
        border-right: none;
    }

    .token-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .item-title {
        width: 100%;
        box-sizing: border-box;
        line-height: 24px;
        font-family: $font-bold;
        font-weight: 600;
        color: rgba(29,32,36,1);
        img {
            width: 24px;
            height: 24px;
            margin-bottom: -7px;
            margin-right: 6px;
        }
    }

    .token {
        flex: 1;
        padding-top: 14px;
        min-width: 120px;
        max-width: 178px;
        .title {
            line-height: 18px;
            font-family: $font-normal;
            font-weight: 400;
            color: rgba(94,104,117,1);
        }
        .amount {
            font-family: $font-bold;
            font-weight: 600;
            color: rgba(29,32,36,1);
            line-height: 16px;
        }
    }
}
</style>

