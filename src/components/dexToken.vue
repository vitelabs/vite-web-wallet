<template>
    <confirm class="exchange" :btnUnuse="btnUnuse"
             :showMask="true" :singleBtn="true"
             :title="$t('exchange.dexToken.title')" :closeIcon="true"
             :close="close" :leftBtnTxt="$t('exchange.dexToken.btn')"
             :leftBtnClick="trans">

        <div v-click-outside="hideMarketList" @click="toggleMarketList" class="__row _r_m __pointer">
            <div class="__row-t">{{ $t('exchange.dexToken.market') }}</div>
            <div class="market input-wrapper">{{ market.name }}
                <span class="down-icon" slot="after"></span>
            </div>
            <ul v-show="isShowMarketList" class="market-list">
                <li @click="setMarket(_market)" class="market input-wrapper"
                    v-for="(_market, i) in marketList" :key="i"
                    v-show="_market.token !== market.token">{{ _market.name }} / {{ _market.token }}</li>
            </ul>
        </div>

        <div class="__row">
            <div class="__row-t">
                {{ $t('exchange.dexToken.name') }}
                <span class="link __pointer" @click="goNet">{{ $t('exchange.dexToken.link') }}</span>
            </div>
            <vite-input v-model="tokenName">
                <span class="down-icon" slot="after"></span>
            </vite-input>
        </div>

        <div class="__row">
            <div class="__row-t">{{ $t('exchange.dexToken.fee') }}</div>
            <div class="no-input">{{ spend }} VITE</div>
        </div>
        <div class="hint"><span>{{ $t('exchange.dexToken.hint') }}</span></div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm';
import viteInput from 'components/viteInput';

const spend = 1000;

export default {
    components: {
        confirm, viteInput
    },
    props: {
        close: {
            type: Function,
            default: () => {} 
        }
    },
    mounted() {
        this.market = this.marketList && this.marketList.length ? this.marketList[0] : '';
    },
    data() {
        return {
            spend,
            market: '',
            tokenId: '',
            tokenName: '',
            isShowMarketList: false
        };
    },
    computed: {
        marketList() {
            return this.$store.state.exchangeMarket.marketMap;
        },
        btnUnuse() {
            return !this.market || !this.tokenId;
        }
    },
    methods: {
        hideMarketList() {
            this.isShowMarketList = false;
        },
        toggleMarketList() {
            this.isShowMarketList = !this.isShowMarketList;
        },
        goNet() {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}tokenList`);
        },
        setMarket(market) {
            this.market = market;
        },
        trans() {

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
    color: rgba(0,122,255,1);
}
._r_m {
    position: relative;
}
.market-list {
    position: absolute;
    width: 100%;
    z-index: 1;
    .market.input-wrapper {
        border-top: none;
    }
}
.market.input-wrapper {
    box-sizing: border-box;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    background: rgba(255,255,255,1);
    border-radius: 2px;
    border: 1px solid rgba(212,222,231,1);
    font-size: 12px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    color: rgba(206,209,213,1);
    .down-icon {
        float: right;
    }
}
</style>

