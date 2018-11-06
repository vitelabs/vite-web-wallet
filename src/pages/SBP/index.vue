<template>
    <div class="SBP-wrapper">
        <sec-title></sec-title>

        <loading v-if="loadingToken" class="loading"></loading>

        <div v-if="!loadingToken" class="section">
            <div class="title">{{ $t('SBP.section1.title') }}</div>
            <register :tokenInfo="tokenInfo" :sendTx="sendTx" class="content"></register>
        </div>

        <div v-if="!loadingToken" class="section">
            <div class="title">{{ $t('SBP.section2.title') }}</div>
            <list class="content" :showConfirm="showConfirm"
                  :tokenInfo="tokenInfo" :sendTx="sendTx"></list>
        </div>

        <div v-if="showConfirmType" class="gray-wrapper">
            <confirm :title="$t(`SBP.confirm.${showConfirmType}.title`)" :singleBtn="true"
                     :closeIcon="true" :close="closeConfirm"
                     :leftBtnTxt="$t(`SBP.confirm.${showConfirmType}.btn`)" :leftBtnClick="validTx"
                     :btnUnuse="!!btnUnuse">
                <div v-if="showConfirmType === 'edit'">
                    <div class="input-err" v-show="addrErr">{{ addrErr }}</div>
                    <div class="confirm-input">
                        <input type="text" v-model="addr"
                               :placeholder="$t(`SBP.confirm.${showConfirmType}.placeholder`)" />
                    </div>
                </div>

                <div v-if="showConfirmType === 'reward'">
                    <div class="row">
                        <div class="row-t">{{ $t(`SBP.section2.allReward`) }}</div>
                        <div class="row-content unuse">{{ activeItem.showAvailableReward }}</div>
                    </div>

                    <div class="row">
                        <div class="row-t">{{ $t(`SBP.section2.nowReward`) }}</div>
                        <div class="row-content unuse">{{ activeItem.showAvailableRewardOneTx }}</div>
                    </div>

                    <div class="row">
                        <div class="row-t">
                            {{ $t(`SBP.section2.rewardAddr`)  }}
                            <span v-show="addrErr" class="err">{{ addrErr }}</span>
                        </div>
                        <div class="row-content">
                            <input v-model="addr" :placeholder="$t(`SBP.confirm.${showConfirmType}.placeholder`)" />
                        </div>
                    </div>
                </div>
            </confirm>
        </div>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import loading from 'components/loading';
import confirm from 'components/confirm';
import { quotaConfirm } from 'components/quota/index';
import register from './register';
import list from './list';

let addrTimeout;

export default {
    components: {
        secTitle, register, list, loading, confirm
    },
    created() {
        this.tokenInfo = viteWallet.Ledger.getTokenInfo();

        if (!this.tokenInfo) {
            this.loadingToken = true;
            viteWallet.Ledger.fetchTokenInfo().then((tokenInfo) => {
                this.loadingToken = false;
                this.tokenInfo = tokenInfo;
            }).catch((err) => {
                console.warn(err);
            });
        }
    },
    destroyed() {
        this.clearAll();
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();

        return {
            activeAccount,
            tokenInfo: {},
            loadingToken: false,
            showConfirmType: '',
            activeItem: {},

            loading: false,
            addr: '',
            addrErr: ''
        };
    },
    computed: {
        btnUnuse() {
            return !this.addr || this.loading || this.addrErr;
        },
        regAddrList() {
            return this.$store.getters.regAddrList;
        }
    },
    watch: {
        addr: function() {
            clearTimeout(addrTimeout);
            addrTimeout = null;

            if (this.stopWatch) {
                return;
            }

            addrTimeout = setTimeout(()=> {
                addrTimeout = null;
                this.testAddr();
            }, 500);
        },
    },
    methods: {
        testAddr() {
            if (!this.addr || 
                !viteWallet.Types.isValidHexAddr(this.addr)) {
                this.addrErr = this.$t('SBP.section1.addrErr');
                return;
            }

            if (this.regAddrList.indexOf(this.addr) !== -1) {
                this.addrErr = this.$t('SBP.section1.addrUsed');
                return;
            }

            this.addrErr = '';
        },

        showConfirm(type, activeItem) {
            this.showConfirmType = type;

            if (!this.tokenInfo || !activeItem) {
                return;
            }

            let decimals = this.tokenInfo.decimals;
            let symbol = this.tokenInfo.tokenSymbol;
            activeItem.showAvailableReward = viteWallet.BigNumber.toBasic(activeItem.availableReward , decimals) + ' ' +  symbol;
            activeItem.showAvailableRewardOneTx = viteWallet.BigNumber.toBasic(activeItem.availableRewardOneTx , decimals) + ' ' +  symbol;
            this.activeItem = activeItem;
        },
        closeConfirm() {
            this.showConfirmType = '';
            this.activeItem = null;
            this.clearAll();
        },
        clearAll() {
            this.stopWatch = true;
            clearTimeout(addrTimeout);
            this.addr = '';
            this.addrErr = '';
        },

        validTx() {
            quotaConfirm({
                // operate: this.$t('')
            });
            // this.testAddr();
            // if (this.btnUnuse) {
            //     return;
            // }

            // let showConfirmType = this.showConfirmType;
            // this.showConfirmType = '';
            // console.log(this.addr);
            // this.activeAccount.initPwd({
            //     cancel: () => {
            //         this.showConfirm(showConfirmType);
            //     },
            //     submit: () => {
            //         this.showConfirm(showConfirmType);
            //         if (showConfirmType === 'edit') {
            //             this.sendUpdateTx();
            //         } else {
            //             this.sendRewardTx();
            //         }
            //     }
            // });
        },
        sendUpdateTx() {
            this.loading = true;

            this.sendTx({
                producerAddr: this.addr
            }, 'updateRegisterBlock').then(() => {
                this.loading = false;
                this.$toast(this.$t('SBP.section2.updateSuccess'));
                this.closeConfirm();
            }).catch((err) => {
                console.log(err);

                this.loading = false;
                if (err && err.error && err.error.code && err.error.code === -35002) {
                    return;
                }
                this.$toast(this.$t('SBP.section2.updateFail'));
            });
        },
        sendRewardTx() {
            // this.loading = true;

            // this.sendTx({
            //     rewardAddress: this.addr
            // }, 'rewardBlock').then(() => {
            //     this.loading = false;
            //     this.$toast(this.$t('SBP.section2.rewardSuccess'));
            //     this.closeConfirm();
            // }).catch((err) => {
            //     console.log(err);
            //     this.loading = false;

            //     if (err && err.error && err.error.code && err.error.code === -35002) {
            quotaConfirm({
                operate: 'hjjhkhk'
            });
            //         return;
            //     }
            //     this.$toast(this.$t('SBP.section2.rewardFail'));
            // });
        },

        sendTx({
            producerAddr, rewardAddress
        }, type) {
            if (!viteWallet.Net.getNetStatus()) {
                this.$toast(this.$t('nav.noNet'));
                return Promise.reject(false);
            }
          
            return this.activeAccount.sendTx({
                tokenId: this.tokenInfo.tokenId,
                nodeName: this.activeItem.name,
                producerAddr, rewardAddress
            }, type);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/table.scss';

.SBP-wrapper {
    position: relative;
    padding: 40px;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    .loading {
        width: 60px;
        height: 60px;
        margin-top: -30px;
        margin-left: -30px;
    }
}

.gray-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
    .input-err {
        position: absolute;
        right: 30px;
        top: 2px;
        font-size: 12px;
        color: #FF2929;
        line-height: 26px;
    }
    .confirm-input {
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        height: 40px;
        line-height: 40px;
        input {
            width: 100%;
            text-indent: 15px;
            font-size: 14px;
        }
    }
}

.section {
    padding-top: 40px;
    .title {
        border-left: 2px solid rgba(0, 122, 255, 0.7);
        font-family: $font-bold;
        font-size: 18px;
        color: #1d2024;
        line-height: 18px;
        height: 18px;
        margin-bottom: 28px;
        padding-left: 10px;
        margin-bottom: 25px;
    }
    .content {
        background: #FFFFFF;
        border: 1px solid #F6F5F5;
        box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
        border-radius: 2px;
    }
}

.row {
    margin-top: 20px;
    &:first-child {
        margin-top: 0;
    }
    .row-t {
        position: relative;
        font-family: $font-bold;
        font-size: 14px;
        color: #1D2024;
        letter-spacing: 0.35px;
        line-height: 16px;
        padding-bottom: 15px;
    }
    .row-content {
        padding: 10px 15px;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
        box-sizing: border-box;
        &.unuse {
            background: #F3F6F9;
            font-size: 14px;
            color: #5E6875;
            font-family: $font-normal;
        }
        input {
            width: 100%;
        }
    }
    .err {
        position: absolute;
        left: 90px;
        right: 0;
        font-size: 12px;
        color: #FF2929;
        line-height: 16px;
        text-align: right;
    }
}
</style>
