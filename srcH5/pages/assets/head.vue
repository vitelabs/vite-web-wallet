<template>
    <div class="account-head-wrapper">
        <div class="assets">
            <div class="asset__title">{{ $t('mobileAssets.allAssets', { token: 'BTC' }) }}</div>
            <div class="asset__btc">{{ assetBtc }}</div>
            <div class="asset__cash">≈{{ currencySymbol }} {{ asset || '--' }}</div>
        </div>
        <span class="address-content">
            <copy ref="copyDom" class="copy-tips"></copy>
            <span class="addr_item">{{ activeAddr }}</span>
            <img class="copy __pointer" src="~h5Assets/imgs/copy.svg" @click="copy"/>
        </span>
    </div>
</template>

<script>
import copy from 'components/copy';
import bigNumber from 'utils/bigNumber';

export default {
    components: { copy },
    computed: {
        asset() {
            return this.assetMap
                .map(t => t.asset)
                .reduce((pre, cur) => bigNumber.plus(pre || 0, cur || 0), 0);
        },
        assetBtc() {
            return this.assetMap
                .map(t => t.assetBtc)
                .reduce((pre, cur) => bigNumber.plus(pre || 0, cur || 0), 0);
        },

        allTokens() {
            return [
                ...this.$store.getters.defaultTokenList,
                ...this.$store.getters.otherWithBalance
            ];
        },
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        assetMap() {
            return this.allTokens
                .map(t => {
                    return {
                        assetBtc: t.totalAssetBtc,
                        asset: t.totalAsset,
                        tokenSymbol: t.tokenSymbol,
                        index: t.index
                    };
                })
                .sort((a, b) => bigNumber.compared(b.asset, a.asset));
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        copy() {
            this.$refs.copyDom.copy(this.activeAddr);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.account-head-wrapper {
    position: relative;
    background: url('~h5Assets/imgs/assets.svg') no-repeat;
    background-size: 100% 100%;
    border-radius: 2px;
    font-size: 12px;
    box-sizing: border-box;
    padding: 14px;
    margin-bottom: 12px;

    .assets {
        padding: 14px;
        border-bottom: 1px dashed rgba(211,223,239,1);
        @include font-normal();
        color: rgba(36,39,43,1);
        .asset__title {
            color: rgba(62,74,89,0.6);
            line-height: 16px;
        }
        .asset__btc {
            font-size: 24px;
            @include font-bold();
            line-height: 30px;
            margin-top: 6px;
        }
        .asset__cash {
            font-size: 14px;
            line-height: 18px;
            margin-top: 6px;
        }
    }
    .address-content {
        margin-top: 14px;
        font-size: 12px;
        word-break: break-word;
        padding: 8px 14px;
        box-sizing: border-box;
        background: rgba(255,255,255,0.7);
        color: rgba(62,74,89,0.45);
        line-height: 18px;
        @include font-bold();
        display: flex;
        align-items: center;
        position: relative;
        .addr_item {
            padding-right: 10px;
            border-right: 1px solid rgba(168, 173, 180, 0.24);
        }

        .copy-tips{
            position: absolute;
            top: -50%;
        }
        .copy {
            margin-left: 10px;
            width: 16px;
            height: 18px;
        }
    }
}
</style>
