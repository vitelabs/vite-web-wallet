<template>
    <div class="account-head-wrapper">
        <div class="head__item">
            <div class="head-right">
                <span class="address-content">
                    <copy ref="copyDom" class="copy-tips"></copy>
                    <span class="addr_item">{{ activeAddr }}</span>
                    <img class="address-content__operate __pointer"
                         src="~assets/imgs/copy_default.svg"
                         @click="copy"/>
                </span>
            </div>
        </div>
        <div class="worth head__item">
            <div class="assets">
                <div class="asset__btc">{{ assetBtc }} BTC</div>
                <div class="asset__cash">{{ currencySymbol }} {{ asset }}</div>
            </div>
        </div>
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
                ...this.$store.getters.otherWhithBalance
            ].filter(t => t.tokenName);
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
@import "~assets/scss/vars.scss";

.account-head-wrapper {
    position: relative;
    text-align: center;
    background: #fff;
    border-radius: 2px;
    display: flex;
    min-height: 124px;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 10px 0;
    box-sizing: border-box;

    .head__item {
        border-left: 1px solid rgba(227, 235, 245, 0.6);
        display: flex;
        align-items: center;
        padding: 0 30px;
        min-height: 85px;
        flex-grow: 1;
        box-sizing: border-box;
        &:first-child {
            border-left: none;
            min-width: 350px;
        }
        &:nth-child(2) {
            min-width: 330px;
        }
        .address-content {
            max-width: 300px;
            font-size: 14px;
            word-break: break-word;
            box-sizing: border-box;
            background: #f3f6f9;
            color: #bdc1d1;
            padding: 5px 9px;
            display: flex;
            align-items: center;
            margin: 10px 0 5px;
            display: flex;
            position: relative;
            font-family: $font-normal;
            .copy-tips{
                top: -50%;
            }
            .addr_item{
                max-width: 220px;
            }
            &__operate {
                width: 16px;
                height: 16px;
                margin-left: 10px;
            }
            .copy-wrapper {
                top: -30px;
            }
        }
        .head-right {
            font-size: 20px;
            color: #1d2024;
            text-align: left;
            font-family: $font-bold;
            word-break: break-word;
            display: flex;
            flex-direction: column;
            align-self: stretch;
            flex-grow: 1;
        }

        &.worth {
            display: flex;
            .assets {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                height: 88px;
                .asset__btc {
                    margin-bottom: 10px;
                    font-size: 18px;
                    line-height: 26px;
                    font-family: $font-bold;
                    white-space: nowrap;
                }
                .asset__cash {
                    color: #5e687594;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
