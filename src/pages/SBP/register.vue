<template>
    <div class="register-wrapper">
        <div class="row">
            <div class="item">
                <div class="title">
                    {{ $t('SBP.section1.nodeName') }}
                    <span v-show="nodeNameErr" class="err">{{ nodeNameErr }}</span>
                </div>
                <span class="tips" :class="{
                    'active': tipsType === 'name'
                }">{{ $t('SBP.section1.nameHint') }}</span>
                <div class="input-item all __ellipsis">
                    <input v-model="nodeName" type="text"
                           @blur="hideTips" @focus="showTips('name')"
                           :placeholder="$t('SBP.section1.namePlaceholder')" />
                </div>
            </div>
            <div class="item">
                <div class="title">
                    {{ $t('SBP.section1.producerAddr') }}
                    <span v-show="producerAddrErr" class="err">{{ producerAddrErr }}</span>
                </div>
                <span class="tips" :class="{
                    'active': tipsType === 'addr'
                }">{{ $t('SBP.section1.addrHint') }}</span>
                <div class="input-item all __ellipsis">
                    <input v-model="producerAddr" type="text"
                           @blur="hideTips" @focus="showTips('addr')"
                           :placeholder="$t('SBP.section1.addrPlaceholder')" />
                </div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">{{ $t('SBP.section1.quotaAddr') }}</div>
                <div class="input-item all unuse __ellipsis">{{ quotaAddr }}</div>
            </div>
            <div class="item">
                <div class="title">{{ $t('SBP.section1.quotaTime') }}</div>
                <div class="input-item all unuse __ellipsis">{{ $t('SBP.section1.time') }}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">
                    {{ $t('SBP.section1.quotaAmount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <div class="input-item all unuse __ellipsis">500,000 VITE</div>
            </div>
            <div class="item">
                <div class="btn all __pointer" :class="{
                    'unuse': btnUnuse
                }" @click="validTx">{{ $t('SBP.section1.confirmBtn') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { quotaConfirm } from 'components/quota/index';

const amount = 500000;
let nameTimeout = null;
let addrTimeout = null;

export default {
    props: {
        tokenInfo: {
            type: Object,
            default: ()=>{
                return {};
            }
        },
        sendTx: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();

        return {
            nodeName: '',
            nodeNameErr: '',
            producerAddr: '',
            producerAddrErr: '',
            tipsType: '',

            activeAccount,
            quotaAddr: activeAccount.getDefaultAddr(),

            stopWatch: false,
            loading: false,
        };
    },
    computed: {
        regNameList() {
            return this.$store.getters.regNameList;
        },
        regAddrList() {
            return this.$store.getters.regAddrList;
        },
        amountErr() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return '';
            }
            let balance = this.tokenBalList[this.tokenInfo.tokenId] ? this.tokenBalList[this.tokenInfo.tokenId].totalAmount : 0;
            let minAmount = viteWallet.BigNumber.toMin(amount, this.tokenInfo.decimals);
            if (viteWallet.BigNumber.compared(balance, minAmount) < 0) {
                return this.$t('transList.valid.bal');
            }
            return '';
        },
        btnUnuse() {
            if (!this.tokenInfo || !this.tokenInfo.tokenId) {
                return true;
            }
            return this.amountErr || this.loading || !this.nodeName || !this.producerAddr || this.nodeNameErr || this.producerAddrErr;
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        }
    },
    watch: {
        producerAddr: function() {
            clearTimeout(addrTimeout);
            addrTimeout = null;
            this.hideTips();

            if (this.stopWatch) {
                return;
            }

            addrTimeout = setTimeout(()=> {
                addrTimeout = null;
                this.testAddr();
            }, 500);
        },
        nodeName: function() {
            clearTimeout(nameTimeout);
            nameTimeout = null;
            this.hideTips();

            if (this.stopWatch) {
                return;
            }

            nameTimeout = setTimeout(()=> {
                nameTimeout = null;
                this.testName();
            }, 500);
        },
    },
    methods: {
        testName() {
            let nodeName = this.nodeName.trim();

            if (!nodeName || 
                !/^[a-zA-Z0-9_\.]+$/g.test(nodeName) ||
                nodeName.length > 40) {
                this.nodeNameErr = this.$t('SBP.section1.nameErr');
                return;
            }

            if (this.regNameList.indexOf(nodeName) !== -1) {
                this.nodeNameErr = this.$t('SBP.section1.nameUsed');
                return;
            }

            this.nodeNameErr = '';
        },
        testAddr() {
            if (!this.producerAddr || 
                !viteWallet.Types.isValidHexAddr(this.producerAddr)) {
                this.producerAddrErr = this.$t('SBP.section1.addrErr');
                return;
            }

            if (this.regAddrList.indexOf(this.producerAddr) !== -1) {
                this.producerAddrErr = this.$t('SBP.section1.addrUsed');
                return;
            }

            this.producerAddrErr = '';
        },

        hideTips() {
            this.tipsType = '';
        },
        showTips(type) {
            this.tipsType = type;
        },

        clearAll() {
            this.stopWatch = true;
            clearTimeout(nameTimeout);
            clearTimeout(addrTimeout);
            this.producerAddr = '';
            this.nodeName = '';
            this.nodeNameErr = '';
            this.producerAddrErr = '';
        },

        validTx() {
            if (this.loading) {
                return;
            }

            this.testName();
            this.testAddr();
            if (this.btnUnuse) {
                return;
            }

            this.activeAccount.initPwd({
                title: this.$t('SBP.confirm.title'),
                submitTxt: this.$t('SBP.confirm.rightBtn'),
                cancelTxt: this.$t('SBP.confirm.leftBtn'),
                content: this.$t('SBP.confirm.describe', { amount }),
                submit: () => {
                    this.sendRegisterTx();
                }
            }, true);
        },
        sendRegisterTx() {
            this.loading = true;

            this.sendTx({
                producerAddr: this.producerAddr,
                amount,
                nodeName: this.nodeName
            }, 'registerBlock').then(() => {
                this.loading = false;
                this.$toast(this.$t('SBP.section1.registerSuccess'));
                this.clearAll();
                Vue.nextTick(() => {
                    this.stopWatch = false;
                });
            }).catch((err) => {
                console.log(err);
                this.loading = false;

                if (err && err.error && err.error.code && err.error.code === -35002) {
                    quotaConfirm({
                        operate: this.$t('SBP.register')
                    });
                    return;
                }
                this.$toast(this.$t('SBP.section1.registerFail'));
            });
        }
    }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.register-wrapper {
    position: relative;
    padding: 0px 30px 30px 30px;
    .row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            position: relative;
            display: inline-block;
            width: 49%;
            min-width: 470px;
            margin-top: 30px;
            &:first-child {
                margin-right: 10px;
            } 
        }
        .title {
            font-family: $font-bold;
            font-size: 14px;
            color: #1D2024;
            letter-spacing: 0.35px;
            line-height: 16px;
            margin-bottom: 16px;
            .err {
                float: right;
                font-size: 12px;
                color: #FF2929;
                line-height: 16px;
            }
        }
        .btn {
            position: relative;
            bottom: -31px;
            border-radius: 2px;
            background: #007AFF;
            color: #fff;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-family: $font-bold;
            font-size: 14px;
            color: #FBFBFB;
            &.unuse {
                background: #efefef;
                color: #666;
                cursor: not-allowed;
            }
        }
    }
    .input-item {
        position: relative;
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
        color: #5E6875;
        padding: 0 15px;
        &.all {
            width: 100%;
        }
        &.unuse {
            background: #F3F6F9;
        }
        input {
            width: 100%;
            background: transparent;
            font-size: 14px;
        }
    }
}

@media only screen and (max-width: 1419px) {
    .register-wrapper .row .item {
        margin-top: 20px;
    }
}

@media only screen and (max-width: 1209px) {
    .register-wrapper .row .btn {
        bottom: -11px;
    }
}

@media only screen and (max-width: 750px) {
    .register-wrapper {
        margin-top: 20px;
    }
    .register-wrapper .row .item {
        width: 100%;
        min-width: 0;
        &:first-child {
            margin-right: 0px;
        }
    }
}

@media only screen and (max-width: 550px) {
    .register-wrapper {
        padding: 0px 20px 30px 20px;
    }
}
</style>
           