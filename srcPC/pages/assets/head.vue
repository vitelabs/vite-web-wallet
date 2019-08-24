<template>
    <div class="account-head-wrapper">
        <div class="head__item" v-if="!account.isBifrost">
            <img class="icon" src="~assets/imgs/head_acc.png" />
            <div class="head-right">
                <div class="head-title">
                    <span>{{ $t("accountName") }}</span>
                    <img
                        @click="startRename"
                        class="edit __pointer"
                        src="~assets/imgs/edit_default.svg"
                    />
                </div>
                <div v-if="!isShowNameInput" class="name" @click="startRename">
                    {{ account.isBifrost?$t('assets.vb.accountName'):account.name }}
                </div>
                <!-- <input fake_pass type="password" style="display:none"/> -->
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
            <img class="icon" src="~assets/imgs/head_addr.svg" />
            <div class="head-right">
                <SwitchAddr :isShowAddr="false"></SwitchAddr>
                <span class="address-content">
                    <copy ref="copyDom" class="copy-tips"></copy>
                    <span class="addr_item">{{ activeAddr }}</span>
                    <QrcodePopup :qrcodeString="addressQrcode"
                    ><img
                        class="address-content__operate click-able"
                        src="~assets/imgs/qrcode_default.svg"
                    /></QrcodePopup>
                    <img
                        class="address-content__operate click-able"
                        src="~assets/imgs/copy_default.svg"
                        @click="copy"
                    />
                </span>
            </div>
        </div>
        <div class="worth head__item">
            <img class="icon" src="~assets/imgs/head_asset.png" />
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
import Pie from 'components/pie';
import copy from 'components/copy';
import QrcodePopup from 'components/qrcodePopup';
import SwitchAddr from 'components/switchAddress';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getTokenSymbolString } from 'pcUtils/tokenParser';
import AssetSwitch from './assetSwitch';

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
    background: #fff;
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
        border-left: 1px solid rgba(227, 235, 245, 0.6);
        display: flex;
        align-items: center;
        padding: 0 30px;
        min-height: 85px;
        flex-grow: 1;
        box-sizing: border-box;
        &:first-child {
            border-left: none;
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
                color: #5e6875;
                .edit {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-left: 20px;
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
