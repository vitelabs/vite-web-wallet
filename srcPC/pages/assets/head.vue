<template>
    <div class="account-head-wrapper">
        <div class="head__item" v-if="!account.isBifrost">
            <img class="icon" :src="iconList.headAcc" />
            <div class="head-right">
                <div class="head-title">
                    <span>{{ $t("accountName") }}</span>
                    <span @click="startRename" class="edit __pointer"></span>
                </div>
                <div v-if="!isShowNameInput" class="name" @click="startRename">
                    {{ account.isBifrost?$t('assets.vb.accountName'):account.name }}
                </div>
                <form autocomplete="off" v-else>
                    <input
                        ref="nameInput"
                        type="text"
                        v-model="editName"
                        :placeholder="account.name"
                        @blur="rename"
                        autocomplete="off"
                    />
                </form>
            </div>
        </div>
        <div class="head__item">
            <img class="icon" :src="iconList.headAcc" />
            <div class="head-right">
                <SwitchAddr :isShowAddr="false"></SwitchAddr>
                <span class="address-content">
                    <copy ref="copyDom" class="copy-tips"></copy>
                    <span class="addr_item">{{ activeAddr }}</span>
                    <QrcodePopup :qrcodeString="addressQrcode">
                        <span class="address-content__operate qrcode click-able"></span>
                    </QrcodePopup>
                    <span class="address-content__operate copy click-able" @click="copy"></span>
                </span>
            </div>
        </div>
        <div class="worth head__item">
            <img class="icon" :src="iconList.headAsset" />
            <div class="assets">
                <AssetSwitch v-model="assetsType" class="asset-switch" />
                <div class="asset__btc">{{ assetBtc }} BTC</div>
                <div class="asset__cash">{{ currencySymbol }} {{ asset }}</div>
            </div>
        </div>
        <div class="head__item chart">
            <Pie
                class="pie-chart"
                :pieData="pieData.data"
                :labelGen="labelGen"
                :title="$t('tokenCard.assetSpread')"
            ></Pie>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { utils } from '@vite/vitejs';
import { getCurrHDAcc } from 'wallet';
import copy from 'components/copy';
import QrcodePopup from 'components/qrcodePopup';
import Pie from 'pcComponents/pie';
import SwitchAddr from 'pcComponents/switchAddress';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getTokenSymbolString } from 'utils/tokenParser';
import AssetSwitch from './assetSwitch';

import headAcc from 'assets/imgs/head_acc.png';
import headAddr from 'assets/imgs/head_addr.svg';
import headAsset from 'assets/imgs/head_asset.png';

import theme1headAcc from 'assets/theme1_imgs/head_acc.png';
import theme1headAddr from 'assets/theme1_imgs/head_addr.png';
import theme1headAsset from 'assets/theme1_imgs/head_asset.png';

const assetsType = {
    TOTAL: 'TOTAL',
    EX: 'EX',
    WALLET: 'WALLET'
};
export default {
    components: { QrcodePopup, copy, SwitchAddr, Pie, AssetSwitch },
    data() {
        return {
            isShowNameInput: false,
            editName: '',
            qrcode: null,
            qrcodeShow: false,
            assetsType: assetsType.TOTAL
        };
    },
    computed: {
        theme() {
            return +this.$store.state.env.theme;
        },
        iconList() {
            if (+this.theme === 0) {
                return {
                    headAcc,
                    headAddr,
                    headAsset
                };
            }
            return {
                headAcc: theme1headAcc,
                headAddr: theme1headAddr,
                headAsset: theme1headAsset
            };
        },
        pieData() {
            const data = JSON.parse(JSON.stringify(this.assetMap));
            data.forEach(t => (t.symbol = getTokenSymbolString(t.tokenSymbol, t.index)));
            let polyData = data;
            if (data.length > 5) {
                polyData = data.slice(0, 4);
                polyData.push({
                    asset: data
                        .slice(4)
                        .reduce((pre, cur) => bigNumber.plus(pre, cur.asset),
                            0),
                    symbol: this.$t('tokenCard.others')
                });
            }
            return {
                data: polyData.map(t => t.asset),
                lable: polyData.map(t => t.symbol)
            };
        },
        account() {
            return {
                name: this.$store.state.wallet.name,
                addr: this.activeAddr,
                isBifrost: getCurrHDAcc() && getCurrHDAcc().isBifrost
            };
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        addressQrcode() {
            return utils.uriStringify({ target_address: this.activeAddr });
        },
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
                ...this.$store.getters.userStorageTokenList,
                ...this.$store.getters.otherWhithBalance,
                ...this.$store.getters.officalGateTokenList
            ].filter(t => t.tokenName);
        },
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        assetMap() {
            if (this.assetsType === assetsType.TOTAL) {
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
            }
            if (this.assetsType === assetsType.EX) {
                return this.allTokens
                    .map(t => {
                        return {
                            assetBtc: t.totalExAssetBtc,
                            asset: t.totalExAsset,
                            tokenSymbol: t.tokenSymbol,
                            index: t.index
                        };
                    })
                    .sort((a, b) => bigNumber.compared(b.asset, a.asset));
            }
            if (this.assetsType === assetsType.WALLET) {
                return this.allTokens
                    .map(t => {
                        return {
                            assetBtc: t.walletAssetBtc,
                            asset: t.walletAsset,
                            tokenSymbol: t.tokenSymbol,
                            index: t.index
                        };
                    })
                    .sort((a, b) => bigNumber.compared(b.asset, a.asset));
            }
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        labelGen(v, i) {
            const symbol = this.pieData.lable[i];
            return `${ symbol } ${ (100 * v).toFixed(1) }%`;
        },
        copy() {
            this.$refs.copyDom.copy(this.activeAddr);
        },

        clearEditName() {
            this.isShowNameInput = false;
            this.editName = '';
            this.$offKeyDown();
        },
        startRename() {
            statistics.event(this.$route.name, 'changeName', this.activeAddr || '');

            if (this.isShowNameInput || getCurrHDAcc().isBifrost) {
                return;
            }
            this.isShowNameInput = true;
            Vue.nextTick(() => {
                this.$onKeyDown(13, () => {
                    this.rename();
                });
                this.$refs.nameInput.focus();
            });
        },
        rename() {
            if (!this.editName) {
                this.clearEditName();
                return;
            }

            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.editName)) {
                this.$toast(this.$t('create.hint.name'));
                this.clearEditName();
                return;
            }

            const long = 32;
            if (this.editName.length > long) {
                this.$toast(this.$t('create.hint.nameLong', { long }));
                this.clearEditName();
                return;
            }

            this.$store.commit('renameCurrHDAcc', this.editName);
            this.clearEditName();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.click-able {
    cursor: pointer;
}
.account-head-wrapper {
    position: relative;
    text-align: center;
    [data-theme="0"] & {
        background: #fff;
    }
    [data-theme="1"] & {
        background: url("~assets/theme1_imgs/mint_pledge_bg.png");
        background-size: 100% 100%;
    }
    border-radius: 2px;
    display: flex;
    min-height: 124px;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 10px 0;
    box-sizing: border-box;
    .head__group {
        display: flex;
        flex-grow: 1;
    }
    .head__item {
        [data-theme="0"] & {
            border-left: 1px solid rgba(227, 235, 245, 0.6);
        }
        [data-theme="1"] & {
            border-left: 1px solid $black-color-4;
        }
        display: flex;
        align-items: center;
        padding: 0 30px;
        min-height: 85px;
        flex-grow: 1;
        box-sizing: border-box;
        &:first-child {
            [data-theme="0"] & {
                border-left: none;
            }
            [data-theme="1"] & {
                border-left: none;
            }
            min-width: 220px;
        }
        &:nth-child(2) {
            min-width: 330px;
        }
        &:nth-child(3) {
            min-width: 350px;
        }
        &:nth-child(4) {
            min-width: 450px;
        }
        .icon {
            height: 34px;
            width: 34px;
            margin-right: 20px;
        }
        .address-content {
            max-width: 300px;
            font-size: 14px;
            word-break: break-word;
            box-sizing: border-box;
            padding: 5px 9px;
            display: flex;
            align-items: center;
            margin: 10px 0 5px;
            display: flex;
            position: relative;
            font-family: $font-normal;
            [data-theme="0"] & {
                color: #bdc1d1;
                background: #f3f6f9;
            }
            [data-theme="1"] & {
                color: $gray-color-1;
                background: $black-color-1;
            }
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
                &.qrcode {
                    @include background_common_img_suffix('qrcode_default', 'svg', 'png');
                }
                &.copy {
                    @include background_common_img_suffix('copy_default', 'svg', 'png');
                    width: 24px;
                }
            }
            .copy-wrapper {
                top: -30px;
            }
        }
        .head-right {
            font-size: 20px;
            @include font_color_1();
            text-align: left;
            font-family: $font-bold;
            word-break: break-word;
            display: flex;
            flex-direction: column;
            align-self: stretch;
            flex-grow: 1;
            .head-title {
                display: flex;
                align-items: center;
                position: relative;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                letter-spacing: 0.35px;
                margin-bottom: 10px;
                font-family: $font-bold;
                @include font_color_to_white(#5e6875);
                .edit {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-left: 20px;
                    [data-theme="1"] & {
                        width: 30px;
                    }
                    @include background_common_img_suffix('edit_default', 'svg', 'png');
                }
            }
            .name {
                font-size: 18px;
                line-height: 26px;
            }
            input {
                height: 32px;
                line-height: 32px;
                font-size: 20px;
                width: 100%;
            }
        }

        &.chart {
            border-left: none;
            .pie-chart {
                padding: 5px 0;
            }
        }
        &.worth {
            display: flex;
            .assets {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                height: 88px;
                .asset-switch {
                    min-width: 123px;
                    height: 24px;
                    line-height: 24px;
                    margin-bottom: 10px;
                    /deep/.list-title {
                        [data-theme="1"] & {
                            color: $white-color;
                        }
                        &:after {
                            position: absolute;
                            right: 6px;
                        }
                    }
                }
                .asset__btc {
                    margin-bottom: 10px;
                    font-size: 18px;
                    line-height: 26px;
                    font-family: $font-bold;
                    white-space: nowrap;
                    @include default_font_color();
                }
                .asset__cash {
                    [data-theme="0"] & {
                        color: #5e6875;
                    }
                    [data-theme="1"] & {
                        color: #C0C6D3;
                    }
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
