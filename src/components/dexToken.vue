<template>
    <confirm v-show="isShow" class="dex-token" :btnUnuse="btnUnuse"
             :showMask="true" :singleBtn="true"
             :title="$t('trade.dexToken.title')" :closeIcon="true"
             :close="close" :leftBtnTxt="$t('trade.dexToken.btn')"
             :leftBtnClick="trans">

        <div v-click-outside="hideMarketList" @click="toggleMarketList" class="__row _r_m __pointer">
            <div class="__row-t">{{ $t('trade.dexToken.market') }}</div>
            <div class="market input-wrapper">{{ market ? market.name : '' }}
                <span class="down-icon" slot="after"></span>
            </div>
            <ul v-show="isShowMarketList" class="market-list">
                <li @click="setMarket(_market)" class="market input-wrapper border-bottom"
                    v-for="(_market, i) in marketList" :key="i"
                    v-show="market && _market.token !== market.token">{{ _market.name }} / {{ _market.token }}</li>
            </ul>
        </div>

        <div v-click-outside="hideTokenList" class="__row">
            <div class="__row-t">
                {{ $t('trade.dexToken.name') }}
                <!-- <span class="link __pointer" @click="goNet">{{ $t('trade.dexToken.link') }}</span> -->
            </div>
            <div @click="toggleTokenList" class="market input-wrapper __pointer">
                {{ token ? token.name : '' }}<div class="down-icon"></div>
            </div>
            <div v-show="isShowTokenList" class="market-list">
                <vite-input ref="searchInput" class="token-wrapper" v-model="tokenName"
                            :placeholder="$t('trade.dexToken.search')">
                    <img slot="before" class="icon" src="~assets/imgs/search.svg"/>
                </vite-input>
                <loading loadingType="dot" v-show="isLoading && !tokenName"
                         class="ex-center-loading token-loading"></loading>
                <ul class="token-list __pointer">
                    <li v-show="!list || !list.length" class="market input-wrapper no-data border-bottom">
                        {{ tokenName ? $t('trade.noData.search') : $t('hint.noData') }}</li>
                    <li @click="setToken(_token)" class="market input-wrapper border-bottom"
                        v-for="(_token, i) in list" :key="i">
                        {{ _token.name }} / {{ _token.token }}</li>
                </ul>
            </div>
        </div>

        <div class="__row">
            <div class="__row-t">
                {{ $t('trade.dexToken.fee') }}
                <span v-show="!isHaveBalance" class="__err __hint">{{ $t('hint.insufficientBalance') }}</span>
            </div>
            <div class="no-input">{{ spend }} VITE</div>
        </div>
        <div class="hint"><span>{{ $t('trade.dexToken.hint') }}</span></div>
    </confirm>
</template>

<script>
import loading from 'components/loading';
import confirm from 'components/confirm';
import viteInput from 'components/viteInput';
import getTokenIcon from 'utils/getTokenIcon';
import BigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';
import { newMarket, marketsReserve } from 'services/trade';

const spend = 10000;
const currentFetchMarket = null;

export default {
    components: { loading, confirm, viteInput },
    props: {
        close: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.market = this.marketList && this.marketList.length ? this.marketList[0] : null;
        this.token = this.tokenList && this.tokenList.length ? this.tokenList[0] : null;
        this.tokenName = this.token ? this.token.name : '';

        this.fetchTokenList();
    },
    data() {
        return {
            spend,
            market: null,
            token: null,
            tokenName: '',
            isShowMarketList: false,
            isShowTokenList: false,
            tokenList: [],
            searchList: [],
            isLoading: false,

            isShow: true,
            isMarketLoading: false
        };
    },
    computed: {
        marketList() {
            return this.$store.state.exchangeMarket.marketMap;
        },
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        btnUnuse() {
            return !this.market || !this.token || this.isMarketLoading || !this.isHaveBalance;
        },
        list() {
            if (this.tokenName) {
                return this.searchList;
            }
            return this.tokenList;
        },
        isHaveBalance() {
            if (!this.viteTokenInfo) {
                return false;
            }

            const viteBalance = this.$store.getters.tokenBalanceList
                && this.$store.getters.tokenBalanceList[this.viteTokenInfo.tokenId]
                ? this.$store.getters.tokenBalanceList[this.viteTokenInfo.tokenId].balance || 0
                : 0;
            const viteAmount = BigNumber.toMin(viteBalance, this.viteTokenInfo.decimals);
            const amount = BigNumber.toMin(this.spend, this.viteTokenInfo.decimals);

            return BigNumber.compared(viteAmount, amount) >= 0;
        }
    },
    watch: {
        market: function () {
            this.tokenList = [];
            this.token = null;
            this.fetchTokenList();
        },
        isShowTokenList: function () {
            if (this.isShowTokenList) {
                return;
            }
            this.tokenName = '';
        },
        tokenName: function () {
            const list = [];
            const tokenName = this.$trim(this.tokenName).toLowerCase();
            this.tokenList.forEach(token => {
                const name = token.name.toLowerCase();
                if (name.indexOf(tokenName) !== -1) {
                    list.push(token);
                }
            });
            this.searchList = list;
        }
    },
    methods: {
        hideMarketList() {
            this.isShowMarketList = false;
        },
        toggleMarketList() {
            this.isShowMarketList = !this.isShowMarketList;
        },
        hideTokenList(e) {
            if (!this.$refs.searchInput) {
                return;
            }
            const tContainer = this.$refs.searchInput.$el;
            if (!tContainer
                || e.target === tContainer
                || tContainer.contains(e.target)) {
                return;
            }
            this.isShowTokenList = false;
        },
        toggleTokenList() {
            this.isShowTokenList = !this.isShowTokenList;
        },
        goNet() {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }tokenList`);
        },
        setMarket(market) {
            this.market = market;
        },
        setToken(token) {
            this.token = token;
        },
        getTokenIcon(tokenId) {
            const defaultToken = this.$store.state.ledger.tokenInfoMaps[tokenId];
            if (defaultToken && defaultToken.icon) {
                return defaultToken.icon;
            }
            return getTokenIcon(tokenId);
        },

        fetchTokenList() {
            if (!this.market
                || (this.isLoading && currentFetchMarket
                && currentFetchMarket.token === this.market.token)) {
                return;
            }

            this.isLoading = true;
            const token = this.market.token;
            marketsReserve({ token }).then(data => {
                if (this.market.token !== token) {
                    return;
                }
                this.isLoading = false;
                this.tokenList = data || [];
            }).catch(err => {
                console.warn(err);
                if (this.market.token !== token) {
                    return;
                }
                this.isLoading = false;
            });
        },
        trans() {
            this.isMarketLoading = true;

            const newMarketFail = err => {
                console.warn(err);
                this.isMarketLoading = false;
                this.isShow = true;
                this.$toast(this.$t('trade.dexToken.reqError'), err);
            };

            const newMarketSuccess = () => {
                this.$toast(this.$t('trade.dexToken.reqSuccess'));
                this.close();
            };

            sendTx(newMarket, {
                amount: BigNumber.toMin(spend, this.viteTokenInfo.decimals),
                tradeToken: this.token.token,
                quoteToken: this.market.token
            }).then(() => {
                newMarketSuccess();
            }).powStarted(() => {
                this.isShow = false;
            })
                .catch(err => {
                    newMarketFail(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";

.link {
    float: right;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    color: rgba(0, 122, 255, 1);
}

._r_m {
    position: relative;
}

.ex-center-loading.token-loading {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid rgba(212, 222, 231, 1);
    border-top: none;
}

.market-list {
    position: absolute;
    width: 100%;
    z-index: 1;
    max-height: 140px;
    overflow: auto;
    border: 1px solid rgba(212, 222, 231, 1);
    border-top: none;
    box-sizing: border-box;
    background: #fff;

    .token-list {
        flex: 1;
        overflow: auto;
    }

    .market.input-wrapper {
        border-top: none;
    }
}

.market.input-wrapper {
    box-sizing: border-box;
    padding-left: 15px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 12px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    color: rgba(206, 209, 213, 1);

    &.no-data {
        padding: none;
        text-align: center;
    }

    &.border-bottom {
        border: none;
        border-bottom: 1px solid rgba(212, 222, 231, 1);

        &:last-child {
            border-bottom: none;
        }
    }

    .down-icon {
        float: right;
    }
}

.token-wrapper {
    box-sizing: border-box;
    border-top: none;
    border-left: none;
    border-right: none;
    min-height: 40px;

    .icon {
        margin-right: 0;
        margin-left: 15px;
        width: 16px;
        height: 16px;
        margin-top: 12px;
    }

    .market-list {
        left: 0;
        top: 39px;
    }
}
</style>

<style lang="scss">
.dex-token.confirm-container .confirm-wrapper {
    width: 515px;
    max-width: 515px;
}
</style>

