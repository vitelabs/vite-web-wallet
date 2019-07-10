<template>
    <div class="register-wrapper">
        <div class="row">
            <div class="item">
                <div class="title">
                    {{ $t('walletSBP.section1.nodeName') }}
                    <span v-show="nodeNameErr" class="err">{{ nodeNameErr }}</span>
                </div>
                <span class="tips" :class="{'active': tipsType === 'name'}">
                    {{  tipsType === 'name' ? $t('walletSBP.section1.nameHint') : '' }}
                </span>
                <vite-input v-model="nodeName" :valid="testName"
                            :placeholder="$t('walletSBP.section1.namePlaceholder')"
                            @blur="hideTips" @focus="showTips('name')"></vite-input>
            </div>
            <div class="item">
                <div class="title">
                    {{ $t('walletSBP.section1.producerAddr') }}
                    <span v-show="producerAddrErr" class="err">{{ producerAddrErr }}</span>
                </div>
                <span class="tips" :class="{'active': tipsType === 'addr'}">
                    {{ tipsType === 'addr' ? $t('walletSBP.section1.addrHint') : '' }}
                </span>
                <vite-input v-model="producerAddr" :valid="testAddr"
                            :placeholder="$t('walletSBP.section1.addrPlaceholder')"
                            @blur="hideTips" @focus="showTips('addr')"></vite-input>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">{{ $t('walletSBP.section1.quotaAddr') }}</div>
                <div class="input-item all unuse __ellipsis">{{ quotaAddr }}</div>
            </div>
            <div class="item">
                <div class="title">{{ $t('walletSBP.section1.quotaTime') }}</div>
                <div class="input-item all unuse __ellipsis">{{ $t('walletSBP.section1.time') }}</div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">
                    {{ $t('stakingAmount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <div class="input-item all unuse __ellipsis">500,000 VITE</div>
            </div>
            <div class="item">
                <div v-show="!btnUnuse" class="btn all __pointer" :class="{
                    'unuse': btnUnuse
                }" @click="validTx">{{ $t('walletSBP.section1.confirmBtn') }}</div>
                <div v-show="btnUnuse" class="btn all __pointer"  :class="{
                    'unuse': btnUnuse
                }">{{ $t('walletSBP.section1.confirmBtn') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { hdAddr } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import { initPwd } from 'components/password/index.js';
import BigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';
import { execWithValid } from 'utils/execWithValid';

const amount = 500000;

export default {
    components: { viteInput },
    props: {
        tokenInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        getParams: {
            type: Function,
            default: () => {}
        },
        canUseAddr: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            nodeName: '',
            nodeNameErr: '',
            producerAddr: '',
            producerAddrErr: '',
            tipsType: '',
            loading: false
        };
    },
    destroyed() {
        this.$store.dispatch('stopLoopRegList');
    },
    computed: {
        quotaAddr() {
            return this.$store.getters.activeAddr;
        },
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
            const balance = this.tokenBalList[this.tokenInfo.tokenId] ? this.tokenBalList[this.tokenInfo.tokenId].totalAmount : 0;
            const minAmount = BigNumber.toMin(amount, this.tokenInfo.decimals);
            if (BigNumber.compared(balance, minAmount) < 0) {
                return this.$t('hint.insufficientBalance');
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
        producerAddr: function () {
            this.hideTips();
        },
        nodeName: function () {
            this.hideTips();
        }
    },
    methods: {
        testName() {
            const nodeName = this.nodeName.trim();
            if (!nodeName) {
                return;
            }

            if (!nodeName
                || !/^[a-zA-Z0-9_\.]+$/g.test(nodeName)
                || nodeName.length > 40) {
                this.nodeNameErr = this.$t('walletSBP.section1.nameErr');

                return;
            }

            if (this.regNameList.indexOf(nodeName) !== -1) {
                this.nodeNameErr = this.$t('walletSBP.section1.nameUsed');
                return;
            }

            this.producerAddr && this.testAddr();
            this.nodeNameErr = '';
        },
        testAddr() {
            if (!this.producerAddr) {
                return;
            }

            if (!hdAddr.isValidHexAddr(this.producerAddr)) {
                this.producerAddrErr = this.$t('walletSBP.section1.addrErr');

                return;
            }

            const nodeName = this.nodeName.trim();
            if (!this.canUseAddr(nodeName, this.producerAddr)) {
                this.producerAddrErr = this.$t('walletSBP.section1.addrUsed');

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
            this.producerAddr = '';
            this.nodeName = '';
            this.nodeNameErr = '';
            this.producerAddrErr = '';
        },

        validTx: execWithValid(function () {
            if (this.loading) {
                return;
            }

            this.testName();
            this.testAddr();
            if (this.btnUnuse) {
                return;
            }

            initPwd({
                title: this.$t('walletSBP.confirm.title'),
                submitTxt: this.$t('walletSBP.confirm.rightBtn'),
                cancelTxt: this.$t('walletSBP.confirm.leftBtn'),
                content: this.$t('walletSBP.confirm.describe', { amount }),
                submit: () => {
                    this.sendRegisterTx();
                }
            }, true);
        }),
        sendRegisterTx() {
            this.loading = true;
            const nodeName = this.nodeName.trim();
            const producerAddr = this.producerAddr;

            sendTx({methodName:'SBPreg',data: this.getParams({ producerAddr, amount, nodeName }), config:{
                pow: false,
                confirm: {
                    showMask: true,
                    operate: this.$t('walletSBP.register')
                }
            }}).then(() => {
                this.loading = false;
                this.$toast(this.$t('walletSBP.section1.registerSuccess'));
                this.clearAll();

                this.$store.dispatch('loopRegList', {
                    nodeName,
                    operate: 1,
                    producer: producerAddr
                });
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                this.$toast(this.$t('walletSBP.section1.registerFail'), err);
            });
        }
    }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.register-wrapper {
    position: relative;
    padding: 0 30px 30px 30px;

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
            @include font-family-bold();
            font-size: 14px;
            color: #1d2024;
            letter-spacing: 0.35px;
            line-height: 16px;
            margin-bottom: 16px;

            .err {
                float: right;
                font-size: 12px;
                color: #ff2929;
                line-height: 16px;
            }
        }

        .btn {
            position: relative;
            bottom: -31px;
            border-radius: 2px;
            background: #007aff;
            color: #fff;
            height: 40px;
            line-height: 40px;
            text-align: center;
            @include font-family-bold();
            font-size: 14px;
            color: #fbfbfb;

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
        background: #fff;
        border: 1px solid #d4dee7;
        border-radius: 2px;
        font-size: 14px;
        color: #5e6875;
        padding: 0 15px;

        &.all {
            width: 100%;
        }

        &.unuse {
            background: #f3f6f9;
        }

        input {
            width: 100%;
            background: transparent;
            font-size: 14px;
        }
    }
}

.tips {
    position: absolute;
    left: 50%;
    bottom: 52px;
    transform: translate(-50%, 0);
    background: #fff;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 14px;
    color: #3e4a59;
    box-sizing: border-box;
    @include font-family-normal();
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    width: 0;
    height: 0;

    &.active {
        min-width: 300px;
        height: auto;
        opacity: 1;
        padding: 13px 10px;
    }

    &::after {
        content: ' ';
        display: inline-block;
        border: 6px solid transparent;
        border-top: 6px solid #fff;
        position: absolute;
        bottom: -12px;
        left: 50%;
        margin-left: -6px;
    }
}
</style>

