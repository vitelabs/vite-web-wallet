<template>
    <div class="account-head-wrapper">
        <div class="head__item">
            <img
                class="icon"
                src="~assets/imgs/head_acc.png"
            />
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
            <img
                class="icon"
                src="~assets/imgs/head_addr.png"
            />
            <div class="head-right">
                <SwitchAddr></SwitchAddr>
                <span class="address-content">
                    <Tips ref="tips"></Tips>{{ activeAddr }}
                    <QrcodePopup :qrcodeString="addressQrcode"><img
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
            <img
                class="icon"
                src="~assets/imgs/head_asset.png"
            />
            <div class="assets">
                <AssetSwitch
                    v-model="assetsType"
                    class="asset-switch"
                />
                <div class="asset__btc">{{ totalAsset }}</div>
                <div class="asset__cash">{{ totalAsset }}</div>
            </div>
            <div class="head-right">
                <Pie class="pie-chart"></Pie>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import QrcodePopup from 'components/qrcodePopup';
import SwitchAddr from 'components/switchAddress';
import Pie from 'components/pie';
import $ViteJS from 'utils/viteClient';
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
            getTestTokenAble: true,
            assetsType: assetsType.TOTAL
        };
    },
    computed: {
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
        totalAsset() {
            const currency = this.$store.state.env.currency;
            const rateMap = this.$store.state.exchangeRate.rateMap;
            const balanceInfo = this.$store.getters.balanceInfo;
            const total = Object.keys(balanceInfo).reduce((pre, cur) => {
                if (!rateMap[cur]) return pre;
                return bigNumber.plus(bigNumber.multi(balanceInfo[cur].balance,
                    rateMap[cur][currency]),
                pre);
            }, 0);
            return `${ currency === 'en' ? '$' : '¥' }${ total }`;
        },
        assetMap() {
            return  JSON.parse(JSON.stringify([ ...this.defaultTokenList, ...this.userStorageTokenList, ...this.otherWhithBalance, ...this.officalGateTokenList ])).forEach(t => {
                t.asset = bigNumber.plus(t.totalAsset, t.totalExAsset);
            });
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        copy() {
            copy(this.activeAddr);
            this.$refs.tips.tip(this.$t('hint.copy'));
        },

        getTestToken() {
            if (!this.getTestTokenAble) {
                return;
            }
            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            if (!this.activeAddr) {
                this.$toast(this.$t('wallet.hint.tErr'));
            }

            this.getTestTokenAble = false;
            $ViteJS.testapi
                .getTestToken(this.activeAddr)
                .then(() => {
                    this.$toast(this.$t('wallet.hint.token'));
                    setTimeout(() => {
                        this.getTestTokenAble = true;
                    }, 3000);
                })
                .catch(err => {
                    console.warn(err);
                    this.$toast(this.$t('wallet.hint.tErr'), err);
                });
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
  min-width: 1300px;
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
