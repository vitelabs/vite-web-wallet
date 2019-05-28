<template>
    <div class="account-head-wrapper">
        <div class="head__item">
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
                <div
                    v-show="!isShowNameInput"
                    class="name"
                    @click="startRename"
                >
                    {{ account.name }}
                </div>
                <!-- <input fake_pass type="password" style="display:none"/> -->
                <form autocomplete="off">
                    <input
                        ref="nameInput"
                        v-show="isShowNameInput"
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
            <img class="icon" src="~assets/imgs/head_addr.png" />
            <div class="head-right">
                <SwitchAddr :isShowAddr="false"></SwitchAddr>
                <span class="address-content">
                    <Tips ref="tips"></Tips>{{ activeAddr }}
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
            <div class="head-right">
                <Pie
                    class="pie-chart"
                    :pieData="pieData.data"
                    :labelGen="labelGen"
                    :title="$t('tokenCard.assetSpread')"
                ></Pie>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import QrcodePopup from 'components/qrcodePopup';
import SwitchAddr from 'components/switchAddress';
import Pie from 'components/pie';
import bigNumber from 'utils/bigNumber';
import { utils } from '@vite/vitejs';
import copy from 'utils/copy';
import Tips from 'uiKit/tips';
import AssetSwitch from './assetSwitch';

const assetsType = {
    TOTAL: 'TOTAL',
    EX: 'EX',
    WALLET: 'WALLET'
};
export default {
    components: { QrcodePopup, Tips, SwitchAddr, Pie, AssetSwitch },
    data() {
        return {
            isShowNameInput: false,
            editName: '',
            copySuccess: false,
            qrcode: null,
            qrcodeShow: false,
            assetsType: assetsType.TOTAL
        };
    },
    computed: {
        pieData() {
            const data = JSON.parse(JSON.stringify(this.assetMap));
            let polyData = data;
            if (data.length > 5) {
                polyData = data.slice(0, 4);
                polyData.push({
                    asset: data
                        .slice(4)
                        .reduce((pre, cur) => bigNumber.plus(pre, cur.asset),
                            0),
                    tokenSymbol: this.$t('tokenCard.others')
                });
            }
            return {
                data: polyData.map(t => t.asset),
                lable: polyData.map(t => t.tokenSymbol)
            };
        },
        account() {
            return {
                name: this.$store.state.wallet.name,
                addr: this.activeAddr
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
            ];
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
                            tokenSymbol: t.tokenSymbol
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
                            tokenSymbol: t.tokenSymbol
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
                            tokenSymbol: t.tokenSymbol
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
            copy(this.activeAddr);
            this.$refs.tips.tip(this.$t('hint.copy'));
        },

        clearEditName() {
            this.isShowNameInput = false;
            this.editName = '';
            this.$offKeyDown();
        },
        startRename() {
            if (this.isShowNameInput) {
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
                this.$toast(this.$t('startCreate.hint.name'));
                this.clearEditName();
                return;
            }

            const long = 32;
            if (this.editName.length > long) {
                this.$toast(this.$t('startCreate.hint.nameLong', { long }));
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
    flex-wrap: nowrap;
    justify-content: space-between;
    height: 124px;
    align-items: center;
    .head__item {
        border-right: 1px solid rgba(227, 235, 245, 0.6);
        display: flex;
        align-items: center;
        padding: 0 30px;
        min-height: 84px;
        .icon {
            height: 34px;
            width: 34px;
            margin-right: 20px;
        }
        .address-content {
            max-width: 300px;
            font-size: 14px;
            word-break: break-all;
            box-sizing: border-box;
            background: #f3f6f9;
            color: #5e6875;
            padding: 9px;
            display: flex;
            align-items: center;
            margin: 5px auto;
            display: flex;
            position: relative;
            &__operate {
                width: 16px;
                height: 16px;
                margin-left: 10px;
            }
        }
        .head-right {
            font-size: 20px;
            color: #1d2024;
            text-align: left;
            font-family: $font-bold, arial, sans-serif;
            word-break: break-all;
            .head-title {
                display: flex;
                align-items: center;
                position: relative;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                letter-spacing: 0.35px;
                padding-bottom: 10px;
                font-family: $font-bold, arial, sans-serif;
                color: #5e6875;
                font-family: $font-bold;

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
        .pie-chart {
            margin-left: 30px;
            padding: 5px 0;
        }
        &.worth {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            .assets {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                height: 88px;
                justify-content: space-between;
                .asset__btc {
                }
                .asset__cash {
                    color: #5e687594;
                    margin-top: 4px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
